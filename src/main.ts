// Modules to control application life and create native browser window
import electron, { app, BrowserWindow, Menu, shell, screen, systemPreferences, Tray } from 'electron'
import * as path from 'path'
import constants from '../util/constants'

let mainWindow: BrowserWindow;
let tray: Tray;

function createWindow() {
  let color = systemPreferences.getAccentColor();
  let primaryDisplay = screen.getPrimaryDisplay();
  let { width, height } = primaryDisplay.workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: constants.appName,
    icon: constants.getIcon(),
    width,
    height,
    backgroundColor: `#${color.slice(2)}`,
    transparent: false,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      zoomFactor: 0.9
    }
  })

  mainWindow.maximize();
  mainWindow.loadURL(constants.appURL)

  mainWindow.on('close', (e) => {
    if (!mainWindow) {
      return app.quit();
    }

    mainWindow.hide();
    e.preventDefault();
  })
  mainWindow.webContents.setWindowOpenHandler((opener) => {
    shell.openExternal(opener.url);
    return { action: 'deny' }
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  app.setAboutPanelOptions({
    applicationName: constants.appName,
    applicationVersion: constants.appVersion,
  })

  createWindow()

  // Tray
  tray = new Tray(constants.getIcon())
  tray.setToolTip(constants.appName)

  let menu = Menu.buildFromTemplate([
    { label: 'Quit', role: 'quit' }
  ])
  tray.setContextMenu(menu)

  tray.on('click', () => {
    mainWindow.maximize();
    app.focus();
  })

  // App stuff
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  app.on('before-quit', function () {
    mainWindow = null;
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
})