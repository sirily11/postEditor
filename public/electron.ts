import {app, BrowserWindow, ipcMain, Menu, remote} from "electron";
import * as path from "path";
import * as fs from 'fs';
import * as  contextMenu from "electron-context-menu"

const isDev = require("electron-is-dev");

let mainWindow: Electron.BrowserWindow | undefined;
let uploadWindow: Electron.BrowserWindow | undefined;

let menu = Menu.buildFromTemplate([
    {
        label: 'Menu',
    }, {
        label: "File",
        submenu: [
            {
                label: 'Upload Video', click: () => {
                    uploadWindow?.show();
                }
            },
            {
                label: 'Log out', click: () => {
                    if (mainWindow) {
                        mainWindow.webContents.send('logout')
                    }
                }
            }, {
                label: "Reload", click: () => {
                    if (mainWindow) {
                        mainWindow.reload()
                    }
                },
            }, {
                label: "Debug", click: () => {
                    if (mainWindow) {
                        mainWindow.webContents.openDevTools()
                    }
                },
            }
        ]
    }
]);
Menu.setApplicationMenu(menu);

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

    uploadWindow = new BrowserWindow({
        width: 400,
        height: 600,
        titleBarStyle: "hidden",
        show: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });
    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000#/"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

    mainWindow.once("ready-to-show", () => {
        if (mainWindow) {
            mainWindow.show()
        }
    });

    uploadWindow.loadURL(
        isDev
            ? "http://localhost:3000#/upload-video"
            : `file://${path.join(__dirname, "../build/index.html#/upload-video")}`
    );

    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
        uploadWindow.webContents.openDevTools();
    }
    mainWindow.on("closed", () => {
        mainWindow = undefined;
    });

    uploadWindow.on("close", () => {
        uploadWindow?.hide()
    })
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

// ipcMain.on("get-image", (imagePath: string) => {
//   let data = fs.readFileSync(imagePath, { encoding: "base64" })
//   console.log("Got the image", imagePath)
//   if (mainWindow) {
//     mainWindow.webContents.send("preview-image", data)
//   }
// })

ipcMain.on("hello", () => {
    if (mainWindow) {
        mainWindow.webContents.send("helloback", "hello")
    }
});

