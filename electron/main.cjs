const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const startFile = path.join(__dirname, '..', 'index.html');
const startUrl = pathToFileURL(startFile).toString();

function openExternal(url) {
  if (url.startsWith('https://') || url.startsWith('http://')) {
    void shell.openExternal(url);
  }
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 900,
    minHeight: 650,
    autoHideMenuBar: true,
    backgroundColor: '#0b1020',
    icon: path.join(__dirname, '..', 'icons', 'icon-512.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    openExternal(url);
    return { action: 'deny' };
  });

  window.webContents.on('will-navigate', (event, url) => {
    if (url !== startUrl) {
      event.preventDefault();
      openExternal(url);
    }
  });

  void window.loadFile(startFile);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
