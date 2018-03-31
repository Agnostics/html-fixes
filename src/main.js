import { app, BrowserWindow, dialog } from "electron";
import { fs } from "file-system";

require("electron-reload")(__dirname);

if (require("electron-squirrel-startup")) {
	app.quit();
}

let mainWindow;

const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		maxWidth: 800,
		maxHeight: 600,
		minHeight: 400,
		minWidth: 400
	});

	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	setTimeout(showDialog, 2000);

	// Open the DevTools.
	mainWindow.webContents.openDevTools();

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
