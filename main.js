'use strict';
const { app, BrowserWindow } = require('electron')
const path = require('path')
// require('electron-reload')(__dirname);

let win

function createWindow() {
    win = new BrowserWindow({
        width: 1281,
        height: 800,
        icon: path.join(__dirname, 'assets/icon/png/icon_64x64.png')
    })

    win.loadFile('index.html')

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

//Hello from Quang
//Hello from Phuc