import fs from 'fs';
import http from 'http';
import nodeStatic from 'node-static';
import path from 'path';
import puppeteer from 'puppeteer';

import { Repository } from '../models/repository';

const BUILD_PATH = 'public';

const PREVIEW_WIDTH = 800;
const PREVIEW_HEIGHT = 446;

export const PREVIEW_PORT = 8080;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;

/**
 * From each repository, generate a preview image by navigating to the preview page and taking a screenshot. Store that image in the build to be used by each repository page.
 *
 * @param {Object[]} repositories - The repositories we need a preview for
 */
async function generatePreviewImages(repositories: Repository[]) {
  if (process.env.GATSBY_ENABLE_GENERATE_PREVIEW_IMAGES !== 'true') {
    return;
  }

  const build = new nodeStatic.Server('public');

  http
    .createServer((req, res) => {
      build.serve(req, res);
    })
    .listen(PREVIEW_PORT);

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--window-size=${PREVIEW_WIDTH},${PREVIEW_HEIGHT}`,
    ],
  });

  const promises = repositories.map(async repository => {
    const page = await browser.newPage();
    await page.goto(`${PREVIEW_URL}${repository.previewRoute}`);

    const previewPath = BUILD_PATH + repository.previewImageRoute;
    const previewDirectory = path.dirname(previewPath);

    if (!fs.existsSync(previewDirectory)) {
      fs.mkdirSync(previewDirectory, { recursive: true });
    }

    return page.screenshot({
      path: previewPath,
      clip: {
        x: 0,
        y: 0,
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
      },
    });
  });

  await Promise.all(promises);

  await browser.close();
}

export default generatePreviewImages;
