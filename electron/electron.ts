import { app, BrowserWindow } from "electron";
import * as path from "path";

const isDev = require("electron-is-dev");

let mainWindow: Electron.BrowserWindow | undefined;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 900,
    titleBarStyle: "hidden"
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000#home"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on("closed", () => (mainWindow = undefined));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
