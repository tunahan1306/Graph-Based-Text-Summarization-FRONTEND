const { app, BrowserWindow } = require('electron')

app.on('ready', createWindow)

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
// and load the index.html of the app.
  win.loadFile('dist/yazlab2-project3-cli/index.html')
}