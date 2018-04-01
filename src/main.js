import { app, BrowserWindow, dialog } from "electron";

const fs = require("fs");
const replaceStream = require("replacestream");

require("electron-reload")(__dirname);

if (require("electron-squirrel-startup")) {
	app.quit();
}

let mainWindow;

let searchResults = [];
let replaceResults = [];
let filePath = "";

const showDialog = () => {
	dialog.showOpenDialog(
		{ properties: ["openFile"], filters: [{ name: "Important Fixes", extensions: ["txt"] }] },
		openPath => {
			filePath = openPath;
			fs.readFile(openPath[0], "utf8", function read(err, data) {
				var regSearch = /Search:([\s\S]*?)Replace:/g;
				var resultSearch;
				while ((resultSearch = regSearch.exec(data)) !== null) {
					var newtext = RegExp.$1;
					searchResults.push(newtext.replace(/\r/g, "").trim());
				}

				var regReplace = /Replace:([\s\S]*?)Occurrences:/gi;
				var resultReplace;
				while ((resultReplace = regReplace.exec(data)) !== null) {
					var newtext = RegExp.$1;
					replaceResults.push(newtext.replace(/\r/g, "").trim());
				}

				console.log(searchResults);
				console.log(replaceResults);
			});
		}
	);
};

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
