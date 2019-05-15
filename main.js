'use strict';
const { app, BrowserWindow } = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain

var colors = require('colors');

// require('electron-reload')(path.join(__dirname, 'index.html'),
//     { ignored: /^[^\/]+\/Clothes\/?(?:[^\/]+\/?)*$/gm, argv: [] }
// );
// require('electron-reload')(__dirname)

var RecognitionTool = require("./Tools/ImageCategorizer")
var DatabaseWrapper = require('./Tools/Database')

let win

function createWindow() {
    win = new BrowserWindow({
        width: 1281,
        height: 800,
        //FIX ME QUANG: add icons for mac/windows/Linux. This is just temporary
        icon: path.join(__dirname, 'assets/icons/png/icon_64x64.png'),
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            allowRunningInsecureContent: true,
        },
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

ipc.on('start-recognition-now', function (event) {
    DatabaseWrapper.getAllClothesAndParseItIntoObjects().then(function (database) {
        RecognitionTool.getTagsForAllClothes(database).then(() => {
            console.log("Successfully added tags for all clothes.".rainbow)
            win.webContents.send('reload-screen-now')
        })
    })
})