const APP_NAME = 'vimcolorschemes';

export default function getAppMetaTitle(title?: string): string {
  if (!title) {
    return APP_NAME;
  }

  if (title === APP_NAME || title.endsWith(`| ${APP_NAME}`)) {
    return title;
  }

  return `${title} | ${APP_NAME}`;
}
