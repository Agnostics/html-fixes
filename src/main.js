import { app, BrowserWindow, dialog, ipcMain as ipc, globalShortcut } from "electron";

require("electron-reload")(__dirname);

if (require("electron-squirrel-startup")) {
	app.quit();
}

let mainWindow;

const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 400,
		height: 300,
		frame: false,
		resizable: false
	});

	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// Hide top menu
	mainWindow.setMenu(null);

	// Emitted when the window is closed.
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
};

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

ipc.on("open-file-dialog", function(event) {
	dialog.showOpenDialog(
		{ properties: ["openFile"], filters: [{ name: "Important Fixes", extensions: ["txt"] }] },
		openPath => {
			if (openPath) event.sender.send("selected-file", openPath);
		}
	);
});

ipc.on("open-devtools", () => {
	if (mainWindow != null) {
		mainWindow.webContents.openDevTools();
	}
});
