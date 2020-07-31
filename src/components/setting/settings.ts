export function getURL(path?: string): string {
  let base = "http://0.0.0.0:8000";
  let production = "https://api.sirileepage.com";
  if (path !== undefined) {
    return `${production}/${path}`;
  } else {
    return base;
  }
}
