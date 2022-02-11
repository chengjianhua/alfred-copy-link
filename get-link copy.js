ObjC.import("AppKit");

function run(argv) {
	console.log("argv!!!!",argv)
	let res = {};
	getWebLink(res);

	if (res.hasOwnProperty("title") && res.hasOwnProperty("url")) {
		copyToClipboard(res);
		// pasteFromClipboard();

		return res.title + " - " + res.url;
	}

	return "Failed!";
}

let SUPPORTED_BROWSERS = [
	{
		name: "Microsoft Edge",
		kernel: "chromium",
	},
	{
		name: "Google Chrome",
		kernel: "chromium",
	},
	{
		name: "Safari",
		kernel: "webkit",
	},
];

function getWebLink(res) {
	let frontmostBrowser = SUPPORTED_BROWSERS.find((browser) => {
		if (Application(browser.name).running()) {
			return true;
		}

		return false;
	});

	if (!frontmostBrowser) {
		return false;
	}

	if (frontmostBrowser.name === "Safari") {
		let tab = Application(frontmostBrowser.name).windows[0].currentTab;
		res.url = tab.url();
		res.title = tab.name();
	} else if (frontmostBrowser.kernel === "chromium") {
		const browserName = frontmostBrowser.name
		res.title = applyJsCode(function () {
			return document.title;
		}, browserName);
		res.url = applyJsCode(function () {
			return document.URL;
		}, browserName);
	} else {
		return false;
	}

	return true;
}

function applyJsCode(fn, strBrowser) {
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", strBrowser);
	let browser = Application(strBrowser);
	browser.includeStandardAdditions = true
	let jsCode = "(" + fn.toString() + ").apply(null);";
	let res = "";
	if (strBrowser === "Safari") {
		res = browser.doJavaScript(jsCode, {
			in: browser.windows[0].tabs[0],
		});
	} else {
		console.log('123123123123123131231231', browser.windows?.map(() => 1111));
		browser.windows().forEach((window, winIdx) => {
			window.tabs().forEach((tab, tabIdx) => {
					console.log(tab.title(), tab.url())
			})
	})
		console.log('44444444444444444444444444444');
		console.log('000000000000000000000000000', JSON.stringify(browser))
		console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", browser.windows[0].activeTab.url)
		console.log("-----------------", browser.windows[0].activeTab.url)
		res = browser.windows[0].activeTab.execute({
			javascript: jsCode,
		});
		console.log('555555555555555555555555555555');
	}

	console.log("33333333333333333333333333333333333333333333", res);

	return res;
}

function copyToClipboard(res) {
	let pb = $.NSPasteboard.generalPasteboard;
	let str1 = $.NSString.alloc.initWithUTF8String(
		'<a href="' + res.url + '">' + res.title + "</a>"
	);
	let str2 = $.NSString.alloc.initWithUTF8String(
		"[" + res.title + "](" + res.url + ")"
	);
	let str3 = $.NSString.alloc.initWithUTF8String(
		'{\\rtf1\\ansideff0{\\field{\\*\\fldinst{HYPERLINK "' +
			res.url +
			'"}}{\\fldrslt ' +
			res.title +
			"}}}"
	);

	pb.clearContents;
	pb.setStringForType(str1, $.NSPasteboardTypeHTML);
	pb.setStringForType(str2, $.NSPasteboardTypeString);
	pb.setStringForType(str3, $.NSPasteboardTypeRTF);
}

function pasteFromClipboard() {
	let se = Application("System Events");
	se.keystroke("v", { using: "command down" });
}
