'use strict';
const { app, BrowserWindow } = require('electron')
const path = require('path')

<<<<<<< HEAD
// require('electron-reload')(path.join(__dirname, 'index.html'),
//     { ignored: /^[^\/]+\/Clothes\/?(?:[^\/]+\/?)*$/gm, argv: [] }
// );
=======
require('electron-reload')(path.join(__dirname, 'index.html'),
    { ignored: /^[^\/]+\/Clothes\/?(?:[^\/]+\/?)*$/gm, argv: [] }
);
>>>>>>> 961641a96c63f86da2479943f0bed31b0abc8ee9
// require('electron-reload')(__dirname)

let win

function createWindow() {
    win = new BrowserWindow({
        width: 1281,
        height: 800,
        //FIX ME QUANG: add icons for mac/windows/Linux. This is just temporary
        icon: path.join(__dirname, 'assets/icons/png/icon_64x64.png')
    })

    win.loadFile('index.html')

    // win.webContents.openDevTools()

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