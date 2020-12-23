import { app, BrowserWindow, ipcMain, Menu, remote } from "electron";
import * as path from "path";
import * as fs from "fs";
import * as contextMenu from "electron-context-menu";

const isDev = require("electron-is-dev");

let mainWindow: Electron.BrowserWindow | undefined;
let imageWindow: Electron.BrowserWindow | undefined;

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

var menu = Menu.buildFromTemplate([
  {
    label: "Menu",
  },
  {
    label: "File",
    submenu: [
      {
        label: "Log out",
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send("logout");
          }
        },
      },
      {
        label: "Show Images Dialog",
        click: () => {

          imageWindow?.show();
        }
      }
    ],
  },
  {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectAll" },
    ],
  },
  {
    label: "Debug",
    submenu: [
      {
        label: "Reload",
        click: () => {
          if (mainWindow) {
            mainWindow.reload();
            imageWindow?.reload();
          }
        },
      },
      {
        label: "Debug",
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.openDevTools();
          }
        },
      },
    ]
  }
]);
Menu.setApplicationMenu(menu);

function createImageWindow() {
  imageWindow = new BrowserWindow({
    height: 600,
    width: 600,
    title: "Post Images",
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    show: false,
  });

  imageWindow.loadURL(isDev
    ? "http://localhost:3000#/images"
    : `file://${path.join(__dirname, "../build/index.html#/images")}`)

  imageWindow?.on('close', (e) => {
    e.preventDefault();
    imageWindow?.hide();
    return false;
  })

}

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1080,
    height: 900,
    titleBarStyle: "hidden",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });
  console.log("Starting the webserver");
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000#/"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );


  mainWindow.once("ready-to-show", () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
    imageWindow?.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = undefined;
  });

}

function createWindows() {
  createImageWindow();
  createWindow();
}

app.on("ready", createWindows);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null && imageWindow == null) {
    createWindow();
  }
});


ipcMain.on('update-images', (e, arg) => {
  imageWindow?.webContents.send('update-images', arg)
})

ipcMain.on('add-images', (e, arg) => {
  imageWindow?.webContents.send('add-images', arg)
})

ipcMain.on('delete-image', (e, arg) => {
  mainWindow?.webContents.send('delete-image', arg)
})


ipcMain.on('add-image-to-content', (e, arg) => {
  mainWindow?.webContents.send('add-image-to-content', arg)
})
