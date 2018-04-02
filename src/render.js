import { ipcRenderer as ipc, dialog, remote } from "electron";
const fs = require("fs");
const Mousetrap = require("mousetrap");
const CountUp = require("countup.js");

const getFileBTN = document.getElementById("getfile");
const getBackBTN = document.getElementById("back");
const closeWindow = document.getElementById("close");
const minWindow = document.getElementById("min");

let searchResults = [];
let replaceResults = [];
let filePath = "";
let isFixed = false;

let options = {
	useEasing: true,
	useGrouping: true,
	separator: ",",
	decimal: "."
};

let countAnim = new CountUp();

Mousetrap.bind("ctrl+`", () => {
	ipc.send("open-devtools");
});

closeWindow.addEventListener("click", event => {
	remote.BrowserWindow.getFocusedWindow().close();
});

minWindow.addEventListener("click", event => {
	remote.BrowserWindow.getFocusedWindow().minimize();
});

getFileBTN.addEventListener("click", event => {
	ipc.send("open-file-dialog");
});

getBackBTN.addEventListener("click", event => {
	updateView();
});

ipc.on("selected-file", (event, path) => {
	if (searchResults.length > 0) {
		searchResults = [];
		replaceResults = [];
		filePath = "";
	}
	filePath = path[0];
	parseFixes();
});

document.ondragover = document.ondrop = ev => {
	ev.preventDefault();
};

document.body.ondrop = ev => {
	if (searchResults.length > 0) {
		searchResults = [];
		replaceResults = [];
		filePath = "";
		countAnim.reset();
	}

	filePath = ev.dataTransfer.files[0].path;
	parseFixes();
	ev.preventDefault();
};

const parseFixes = path => {
	fs.readFile(filePath, "utf8", function read(err, data) {
		var regSearch = /Search:([\s\S]*?)Replace:/g;
		var resultSearch;
		while ((resultSearch = regSearch.exec(data)) !== null) {
			var newtext = RegExp.$1;
			searchResults.push(newtext.replace(/\r/g, "").trim());
		}

		var regReplace = /Replace:([\s\S]*?)Occurrences:/g;
		var resultReplace;
		while ((resultReplace = regReplace.exec(data)) !== null) {
			var newtext = RegExp.$1;
			replaceResults.push(newtext.replace(/\r/g, "").trim());
		}

		console.log("Parsing Search & Replace");
		countAnim = new CountUp("total-number", 0, searchResults.length, 0, 5, options);
	});

	updateView();

	setTimeout(() => {
		countAnim.start();
	}, 100);
};

const updateView = () => {
	const win1 = document.getElementById("window-1");
	const win2 = document.getElementById("window-2");

	if (win1.style.display != "none") {
		win1.style.display = "none";
		win2.style.display = "block";
	} else {
		win1.style.display = "block";
		win2.style.display = "none";
	}
};

const debugParse = () => {
	console.log(searchResults);
	console.log(replaceResults);
	console.log("filepath: " + filePath);
};
