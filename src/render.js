import { ipcRenderer as ipc, dialog } from "electron";
const fs = require("fs");

const getFileBTN = document.getElementById("getfile");
const getSaveBTN = document.getElementById("saved");
const getBackBTN = document.getElementById("back");

let searchResults = [];
let replaceResults = [];
let filePath = "";
let isFixed = false;

getFileBTN.addEventListener("click", event => {
	ipc.send("open-file-dialog");
});

getBackBTN.addEventListener("click", event => {
	updateView();
});

getSaveBTN.addEventListener("click", event => {
	console.log(searchResults);
	console.log(replaceResults);
	console.log("filepath: " + filePath);
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
	});

	updateView();
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
