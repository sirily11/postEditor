import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { readFile } from "./readfile";
import fs from 'fs';

const isDev = require("electron-is-dev");

let mainWindow: Electron.BrowserWindow | undefined;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 900,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });
  console.log("Starting the webserver")
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000#home"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.once("ready-to-show", () => {
    if (mainWindow) {
      mainWindow.show()
    }
  })
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on("closed", () => {
    if (mainWindow) {
      mainWindow.webContents.send("close")
      mainWindow = undefined
    }
  });
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

ipcMain.on("get-image", (imagePath: string) => {
  let data = fs.readFileSync(imagePath, { encoding: "base64" })
  console.log("Got the image", imagePath)
  if (mainWindow) {
    mainWindow.webContents.send("preview-image", data)
  }
})

ipcMain.on("hello", () => {
  if (mainWindow) {
    mainWindow.webContents.send("helloback", "hello")
  }
})

