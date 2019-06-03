'use strict';
const { app, BrowserWindow } = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain
const { dialog } = require('electron')


var colors = require('colors');

// require('electron-reload')(__dirname)

var RecognitionTool = require("./Tools/ImageCategorizer")
var DatabaseWrapper = require('./Tools/Database')

let win

// Create the browser window.
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

    // Load index.html file of the app
    win.loadFile('index.html')

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        win = null
    })
}

// This method will be called when Electron has finished initialization and is ready to create browser windows. Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
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

// Recognize tags for images and display those tags
ipc.on('start-recognition-now', function (event) {
    DatabaseWrapper.getAllClothesAndParseItIntoObjects().then(function (database) {
        RecognitionTool.getTagsForAllClothes(database).then(() => {
            console.log("Successfully added tags for all clothes.".rainbow)
            win.webContents.send('reload-screen-now')
        })
    })
        .catch((err) => {
            dialog.showErrorBox("Unexpected error occurred.", "Failed on attempting to connect to IBM. Error code: 183.")
        })
})