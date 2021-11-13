import chromium from 'chrome-aws-lambda';
import fs from 'fs';
import http from 'http';
import nodeStatic from 'node-static';
import path from 'path';

import { Repository } from '../models/repository';

const buildPath = `${process.cwd()}/public`;

const PREVIEW_WIDTH = 1200;
const PREVIEW_HEIGHT = 627;

export const PREVIEW_PORT = 8080;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;

/**
 * From each repository, generate a preview image by navigating to the preview page and taking a screenshot. Store that image in the build to be used by each repository page.
 *
 * @param {Object[]} repositories - The repositories we need a preview for
 */
async function generatePreviewImages(
  repositories: Repository[],
): Promise<void> {
  if (!process.env.GATSBY_ENABLE_GENERATE_PREVIEW_IMAGES) {
    return;
  }

  await startServer();

  const browser = await chromium.puppeteer.launch({
    args: [
      ...chromium.args,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--window-size=${PREVIEW_WIDTH},${PREVIEW_HEIGHT}`,
    ],
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  for (let i = 0; i < repositories.length; i++) {
    const repository = repositories[i];

    const page = await browser.newPage();
    await page.setViewport({ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT });
    await page.goto(`${PREVIEW_URL}${repository.previewRoute}`);

    const previewPath = buildPath + repository.previewImageRoute;
    const previewDirectory = path.dirname(previewPath);

    if (!fs.existsSync(previewDirectory)) {
      fs.mkdirSync(previewDirectory, { recursive: true });
    }

    await page.waitForSelector('.preview-page.preview-page--loaded');

    await page.screenshot({
      path: previewPath,
      clip: {
        x: 0,
        y: 0,
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
      },
    });

    await page.close();
  }

  await browser.close();
}

async function startServer(): Promise<void> {
  const build = new nodeStatic.Server('public');

  http
    .createServer((req, res) => {
      build.serve(req, res);
    })
    .listen(PREVIEW_PORT);
}

export default generatePreviewImages;
