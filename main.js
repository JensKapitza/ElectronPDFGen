// Simple KioskMode with boot 
//
//
const { app, BrowserWindow, ipcMain, shell  } = require('electron')
// app.py goes to ./resources/app/app.py

const fs = require('fs');
const Path = require('path')  
// Include process module
const process = require('process');

const { exec, execFile } = require('child_process');
  
var param1 = "";
var param2 = "";

console.log(app.commandLine);
console.log(process.argv);


//var pdfSource = process.argv[process.argv.length -2];
//var pdfTarget = process.argv[process.argv.length -1];
var pdfSource = app.commandLine.getSwitchValue("source");
var pdfTarget = app.commandLine.getSwitchValue("target");

var pageSize0 = app.commandLine.getSwitchValue("pagesize");
console.log("Source: ");
console.log(pdfSource);

console.log("pdfTarget: ");
console.log(pdfTarget);

console.log("pageSize0: ");
console.log(pageSize0);


function createWindow () {
	 const win = new BrowserWindow({
		  width: 800,
		  height: 600,
		  //kiosk: true,
		  devTools: true,
		  webPreferences: {
				nodeIntegration: true,
				preload: Path.join(__dirname, 'preload.js')
				 }
		  })

	win.menuBarVisible= false;
	win.loadURL(pdfSource);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	 if (process.platform !== 'darwin') {
		  app.quit();
		  }
});

app.on('activate', () => {
	 if (BrowserWindow.getAllWindows().length === 0) {
		  createWindow()
		  }
});


ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  	
	const win = BrowserWindow.fromWebContents(event.sender);

	win.webContents.printToPDF({
		"silent":true,
		"marginsType": 2,
        "printBackground": true,
		"pageSize": pageSize0
	}).then(data => {
			fs.writeFile(Path.join(__dirname, pdfTarget), data, err => {
			  if (err) return console.log(err.message);
				console.log('PDF success!')
				app.quit();
			})
		
  }).catch(error => {
      console.log(error)
    })
  
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})