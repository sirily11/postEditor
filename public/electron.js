"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var isDev = require("electron-is-dev");
var mainWindow;
var uploadWindow;
var menu = electron_1.Menu.buildFromTemplate([
    {
        label: 'Menu'
    }, {
        label: "File",
        submenu: [
            {
                label: 'Upload Video', click: function () {
                    var _a;
                    (_a = uploadWindow) === null || _a === void 0 ? void 0 : _a.show();
                }
            },
            {
                label: 'Log out', click: function () {
                    if (mainWindow) {
                        mainWindow.webContents.send('logout');
                    }
                }
            }, {
                label: "Reload", click: function () {
                    if (mainWindow) {
                        mainWindow.reload();
                    }
                }
            }, {
                label: "Debug", click: function () {
                    if (mainWindow) {
                        mainWindow.webContents.openDevTools();
                    }
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
            { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectAll" }
        ]
    }
]);
electron_1.Menu.setApplicationMenu(menu);
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1080,
        height: 900,
        titleBarStyle: "hidden",
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });
    uploadWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 600,
        titleBarStyle: "hidden",
        show: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });
    mainWindow.loadURL(isDev
        ? "http://localhost:3000#/"
        : "file://" + path.join(__dirname, "../build/index.html"));
    mainWindow.once("ready-to-show", function () {
        if (mainWindow) {
            mainWindow.show();
        }
    });
    uploadWindow.loadURL(isDev
        ? "http://localhost:3000#/upload-video"
        : "file://" + path.join(__dirname, "../build/index.html#/upload-video"));
    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
        uploadWindow.webContents.openDevTools();
    }
    mainWindow.on("closed", function () {
        mainWindow = undefined;
    });
    uploadWindow.on("close", function (e) {
        var _a;
        e.preventDefault();
        (_a = uploadWindow) === null || _a === void 0 ? void 0 : _a.hide();
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
// ipcMain.on("get-image", (imagePath: string) => {
//   let data = fs.readFileSync(imagePath, { encoding: "base64" })
//   console.log("Got the image", imagePath)
//   if (mainWindow) {
//     mainWindow.webContents.send("preview-image", data)
//   }
// })
electron_1.ipcMain.on("hello", function () {
    if (mainWindow) {
        mainWindow.webContents.send("helloback", "hello");
    }
});
