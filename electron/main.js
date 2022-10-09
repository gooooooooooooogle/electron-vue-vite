const { app, BrowserWindow, ipcMain, Menu, Notification } = require('electron');
const path = require('path')

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') require('electron-reloader')(module);

const URL = process.env.NODE_ENV === 'development'
    ? `http://localhost:5173`
    : `file://${path.join(__dirname, '../dist/index.html')}`

let mainForm = null;

function createWindow() {
    mainForm = new BrowserWindow({
        width: 800,
        height: 500,
        icon: path.join(__dirname, '../public/favicon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });

    mainForm.resizable = false;
    Menu.setApplicationMenu(null);
    mainForm.webContents.openDevTools();
    mainForm.loadURL(URL);
}

if (process.platform === 'win32') {
    app.setAppUserModelId(app.name);
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('closed', () => {
    mainForm = null;
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})