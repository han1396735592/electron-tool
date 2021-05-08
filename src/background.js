'use strict'

import {app, protocol, BrowserWindow, Menu, ipcMain, dialog, globalShortcut, MenuItem, Notification} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import {autoUpdater} from "electron-updater"
import {machineIdSync} from "node-machine-id";

const log = require('electron-log');
log.transports.file.level = false; //关闭文件日志,默认是开启的
// log.transports.console.level = false; //关闭控制台日志,默认是开启的
const Store = require('electron-store');
const vueDevToolPath = "D:\\myProgram\\dev\\vue-devtools\\packages\\shell-chrome"
Store.initRenderer()
const store = new Store({});
let path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

log.info("hello")
let win
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

process.on('unhandledRejection', (error) => {
    console.error(error)
})

let urlConfig = {}

if (isDevelopment) {
    urlConfig.home = process.env.WEBPACK_DEV_SERVER_URL
} else {
    urlConfig.home = 'app://./index.html'
}

function createWindow() {
    createProtocol('app')
    // Create the browser window.
    win = new BrowserWindow({
        width: 1400,
        height: 800,
        // frame:false,
        // fullscreen: false,
        allowRunningInsecureContent: true,
        experimentalCanvasFeatures: true,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            nodeIntegration: true,
            preload: path.join(__dirname, './preload.js')
        },
    })
    if (isDevelopment && !process.env.IS_TEST) {
        win.webContents.session.loadExtension(vueDevToolPath).then(res => () => {
            log.info('ok %s {}', res)
        }).catch(err => {
            log.error('err %s {}', err)
        }).finally((err) => {
            log.error('finally %s {}', err)
        })
    }
    if (!isDevelopment) {
        Menu.setApplicationMenu(null)
    }
    win.loadURL(urlConfig.home).then(res => {
        win.show = true
    })
    win.on('closed', () => {
        win = null
    })
    win.on('close', (e) => {
        e.preventDefault();
        let number = dialog.showMessageBoxSync({
            type: 'question',
            title: '是否退出',
            defaultId: 0,
            message: '确定要关闭吗？',
            buttons: ['最小化', '直接退出']
        })
        if (number === 0) {
            win.minimize();	//调用 最小化实例方法
        } else {
            win = null;
            app.exit();		//exit()直接关闭客户端，不会执行quit();
        }
    });
    win.webContents.on('dom-ready', () => {
        log.info('dom-ready', win.webContents.getURL())
    })
    win.webContents.on('will-navigate', (event, url) => {
        // win.webContents.openDevTools()
        log.info('will-navigate', url)
    })
    win.webContents.on('did-start-navigation', (event, url) => {
        // win.webContents.openDevTools()

        log.info("url = ", win.webContents.getURL())
        log.info('did-start-navigation', url)
    })
}

ipcMain.on("app-exit", (args) => {
    win = null;
    app.exit();		//exit()直接关闭客户端，不会执行quit();
})


ipcMain.on("open-debug", (event) => {
    for (const window of BrowserWindow.getAllWindows()) {
        window.webContents.openDevTools()
    }
})
app.allowRendererProcessReuse = false

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

function globalShortcutRegister() {
    globalShortcut.register('CommandOrControl+R', () => {
        win.reload()
    })
    //按esc退出全屏模式
    globalShortcut.register('ESC', () => {
        win.setFullScreen(false)
    })
    //按esc退出全屏模式
    globalShortcut.register('F11', () => {
        win.setFullScreen(!win.isFullScreen())
    })
}

app.on("browser-window-blur", () => {
    globalShortcut.unregisterAll()
    log.info("browser-window-blur")
})
app.on("browser-window-focus", () => {
    globalShortcutRegister()
    log.info("browser-window-focus")
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

app.on('ready', async () => {
    createWindow()
    app.whenReady().then(() => {
        globalShortcutRegister()
    })
})
