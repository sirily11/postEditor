"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var isDev = require("electron-is-dev");
var mainWindow;
electron_1.app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
var menu = electron_1.Menu.buildFromTemplate([
    {
        label: "Menu"
    },
    {
        label: "File",
        submenu: [
            {
                label: "Log out",
                click: function () {
                    if (mainWindow) {
                        mainWindow.webContents.send("logout");
                    }
                }
            },
            {
                label: "Reload",
                click: function () {
                    if (mainWindow) {
                        mainWindow.reload();
                    }
                }
            },
            {
                label: "Debug",
                click: function () {
                    if (mainWindow) {
                        mainWindow.webContents.openDevTools();
                    }
                }
            },
        ]
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
        ]
    },
]);
electron_1.Menu.setApplicationMenu(menu);
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1080,
        height: 900,
        titleBarStyle: "hidden",
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });
    console.log("Starting the webserver");
    mainWindow.loadURL(isDev
        ? "http://localhost:3000#/"
        : "file://" + path.join(__dirname, "../build/index.html"));
    mainWindow.once("ready-to-show", function () {
        if (mainWindow) {
            mainWindow.show();
        }
    });
    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on("closed", function () {
        mainWindow = undefined;
    });
}
electron_1.app.on("ready", createWindow);
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});
