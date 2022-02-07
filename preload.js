const { ipcRenderer  } = require('electron')
// app.py goes to ./resources/app/app.py

  

window.addEventListener('DOMContentLoaded', () => {
	console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

	ipcRenderer.on('asynchronous-reply', (event, arg) => {
			console.log(arg) // prints "pong"
	})
	ipcRenderer.send('asynchronous-message', 'ping')
})