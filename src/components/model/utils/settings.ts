export function getURL(path?: string): string {
  let base = "http://0.0.0.0";
  let production = "https://api.sirileepage.com";
  if (path !== undefined) {
    return `${base}/${path}`;
  } else {
    return base;
  }
}
