export function getURL(path?: string): string {
  const base = "http://0.0.0.0";
  const production = "https://api.sirileepage.com";
  if (path !== undefined) {
    return `${base}/${path}`;
  } else {
    return base;
  }
}
