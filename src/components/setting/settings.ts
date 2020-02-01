export function getURL(path?: string): string {
    let base = "http://0.0.0.0:8000";
    let production = "https://qbiv28lfa0.execute-api.us-east-1.amazonaws.com/dev";
    if (path !== undefined) {
        return `${base}/${path}`
    } else {
        return base
    }
}