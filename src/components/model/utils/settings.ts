export function getURL(path?: string): string {
  const base = process.env.REACT_APP_URL!;
  if (path !== undefined) {
    return `${base}/${path}`;
  } else {
    return base;
  }
}
