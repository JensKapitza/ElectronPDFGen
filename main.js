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



// Printing process.platform property value
var platform = process.platform;
switch(platform) {
    case 'aix': 
        console.log("IBM AIX platform");
        break;
    case 'darwin': 
        console.log("Darwin platform(MacOS, IOS etc)");
		
		param1 = "sh";
		param2 = "macos.sh";
	
        break;
    case 'freebsd': 
        console.log("FreeBSD Platform");
		
		param1 = "sh";
		param2 = "freebsd.sh";
        break;
    case 'linux': 
        console.log("Linux Platform");
			
		param1 = "sh";
		param2 = "linux.sh";
	
	
		const pathFile = Path.join(__dirname, param2);
		exec('chmod +x ' + pathFile, (error, stdout, stderr) => {
		  if (error) {
			console.error(`error: ${error.message}`);
			return;
		  }

		  if (stderr) {
			console.error(`stderr: ${stderr}`);
			return;
		  }

		  console.log(`stdout:\n${stdout}`);
		});

        break;
    case 'openbsd': 
        console.log("OpenBSD platform");
		param1 = "sh";
		param2 = "openbsd.sh";
        break;
    case 'sunos': 
        console.log("SunOS platform");
        break;
    case 'win32':
        console.log("windows platform");
		param1 = "start";
		param2 = "windows.bat";
        break;    
    default: 
        console.log("unknown platform");
}


const path = Path.join(__dirname, param2);

console.log(path);
if (!fs.existsSync(path)) {
	fs.writeFile(path, '', function (err) {
	  if (err) return console.log(err);
	  console.log('create autostartup file');
	});
}

if (fs.existsSync(path)) {
	
	console.log(param1 + " " + path);
	execFile(path, (error, stdout, stderr) => {
	  if (error) {
		console.error(`error: ${error.message}`);
		return;
	  }

	  if (stderr) {
		console.error(`stderr: ${stderr}`);
		return;
	  }

	  console.log(`stdout:\n${stdout}`);
	});

}

const config = Path.join(__dirname, "config.json");
var myconfig = JSON.parse(fs.readFileSync(config, 'utf8'));
 

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
	// win.loadURL('http://127.0.0.1:8000/test');
	if (myconfig.url != "") {
			win.loadURL(myconfig.url);
	} else if (myconfig.file != "") {
			win.loadFile(myconfig.file)
	} else {
		win.loadFile("index.html")
	}	
	
	win.on("DOMContentLoaded", ()=>{
		console.log("balblalbalblal");
	});
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
  
	const pdfPath = Path.join(__dirname, 'some-ducking-pdf.pdf');
	console.log(pdfPath);
	const win = BrowserWindow.fromWebContents(event.sender);

	win.webContents.printToPDF({
		 pageSize: myconfig.pageSize
	}).then(data => {
		 
			fs.writeFile(pdfPath, data, err => {
			  if (err) return console.log(err.message);
				console.log('PDF success!')
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