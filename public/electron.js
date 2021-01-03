"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var isDev = require("electron-is-dev");
var mainWindow;
var imageWindow;
var postSettingsWindow;
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
                label: "Show Images Dialog",
                click: function () {
                    imageWindow === null || imageWindow === void 0 ? void 0 : imageWindow.show();
                }
            },
            {
                label: "Show Post Settings Dialog",
                click: function () {
                    postSettingsWindow === null || postSettingsWindow === void 0 ? void 0 : postSettingsWindow.show();
                }
            }
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
            {
                label: "Save", accelerator: "CmdOrCtrl+S",
                click: function () {
                    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send('save');
                }
            },
            { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectAll" },
        ]
    },
    {
        label: "Debug",
        submenu: [
            {
                label: "Reload",
                click: function () {
                    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.reload();
                    imageWindow === null || imageWindow === void 0 ? void 0 : imageWindow.reload();
                    postSettingsWindow === null || postSettingsWindow === void 0 ? void 0 : postSettingsWindow.reload();
                }
            },
            {
                label: "Debug",
                click: function () {
                    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.openDevTools();
                    imageWindow === null || imageWindow === void 0 ? void 0 : imageWindow.webContents.openDevTools();
                    postSettingsWindow === null || postSettingsWindow === void 0 ? void 0 : postSettingsWindow.webContents.openDevTools();
                }
            },
        ]
    }
]);
electron_1.Menu.setApplicationMenu(menu);
function createImageWindow() {
    imageWindow = new electron_1.BrowserWindow({
        height: 600,
        width: 600,
        title: "Post Images",
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            enableRemoteModule: true
        },
        show: false
    });
    imageWindow.loadURL(isDev
        ? "http://localhost:3000#/images"
        : "file://" + path.join(__dirname, "../build/index.html#/images"));
    imageWindow === null || imageWindow === void 0 ? void 0 : imageWindow.on('close', function (e) {
        e.preventDefault();
        imageWindow === null || imageWindow === void 0 ? void 0 : imageWindow.hide();
        return false;
    });
}
function createPostSettingsWindow() {
    postSettingsWindow = new electron_1.BrowserWindow({
        height: 800,
        width: 400,
        title: "Post Images",
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            enableRemoteModule: true
        },
        show: false
    });
    postSettingsWindow.loadURL(isDev
        ? "http://localhost:3000#/post-settings"
        : "file://" + path.join(__dirname, "../build/index.html#/post-settings"));
    postSettingsWindow === null || postSettingsWindow === void 0 ? void 0 : postSettingsWindow.on('close', function (e) {
        e.preventDefault();
        postSettingsWindow === null || postSettingsWindow === void 0 ? void 0 : postSettingsWindow.hide();
        return false;
    });
}
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1080,
        height: 900,
        titleBarStyle: "hidden",
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            enableRemoteModule: true
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
        imageWindow === null || imageWindow === void 0 ? void 0 : imageWindow.webContents.openDevTools();
    }
    mainWindow.on("closed", function () {
        console.log("close");
        electron_1.app.exit();
    });
}
function createWindows() {
    createImageWindow();
    createWindow();
    createPostSettingsWindow();
}
electron_1.app.on("ready", createWindows);
electron_1.app.on("window-all-closed", function () {
    electron_1.app.quit();
});
electron_1.app.on("activate", function () {
    if (mainWindow === null && imageWindow == null) {
        createWindow();
    }
});
electron_1.ipcMain.on('update-images', function (e, arg) {
    imageWindow === null || imageWindow === void 0 ? void 0 : imageWindow.webContents.send('update-images', arg);
});
electron_1.ipcMain.on('add-images', function (e, arg) {
    imageWindow === null || imageWindow === void 0 ? void 0 : imageWindow.webContents.send('add-images', arg);
});
electron_1.ipcMain.on('delete-image', function (e, arg) {
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send('delete-image', arg);
});
electron_1.ipcMain.on('add-image-to-content', function (e, arg) {
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send('add-image-to-content', arg);
});
electron_1.ipcMain.on("update-post-settings", function (e, arg) {
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("update-post-settings", arg);
});
electron_1.ipcMain.on('load-post', function (e, arg) {
    postSettingsWindow === null || postSettingsWindow === void 0 ? void 0 : postSettingsWindow.webContents.send('load-post', arg);
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send('load-post', arg);
});
electron_1.ipcMain.on('show-image', function (e, arg) {
    imageWindow === null || imageWindow === void 0 ? void 0 : imageWindow.show();
});
electron_1.ipcMain.on('show-post-settings', function (e, arg) {
    postSettingsWindow === null || postSettingsWindow === void 0 ? void 0 : postSettingsWindow.show();
});
electron_1.ipcMain.on("add-settings-block", function (e, arg) {
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("add-settings-block", arg);
});
electron_1.ipcMain.on('update-setting-block', function (e, arg) {
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send('update-setting-block', arg);
});
electron_1.ipcMain.on("update-image-description", function (e, arg) {
    mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.webContents.send("update-image-description", arg);
});
