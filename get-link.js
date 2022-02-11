#!/usr/bin/env osascript -l JavaScript

ObjC.import("AppKit");

function run(argv) {
  const res = getWebLink();
  if (Array.isArray(argv) && typeof argv[0] === "string" && argv[0] != "") {
    res.title = argv[0];
  }

  if (res.hasOwnProperty("title") && res.hasOwnProperty("url")) {
    copyToClipboard(res);

    return res.title + " - " + res.url;
  }

  return "@@__FAILED__@@";
}

const SUPPORTED_BROWSERS = [
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

function getWebLink() {
  const res = {};

  const frontmostBrowser = SUPPORTED_BROWSERS.find((browser) => {
    return Application(browser.name).running();
  });
  if (!frontmostBrowser) {
    return false;
  }

  if (frontmostBrowser.name === "Safari") {
    const tab = Application(frontmostBrowser.name).windows[0].currentTab;
    res.url = tab.url();
    res.title = tab.name();
    return res;
  }

  if (frontmostBrowser.kernel === "chromium") {
    const browserName = frontmostBrowser.name;
    const browser = Application(browserName);

    const firstWindow = browser.windows()[0];
    const activeTab = firstWindow.activeTab();

    res.title = activeTab.title();
    res.url = activeTab.url();
  }

  return res;
}

function copyToClipboard(res) {
  const pb = $.NSPasteboard.generalPasteboard;
  const str1 = $.NSString.alloc.initWithUTF8String(
    '<a href="' + res.url + '">' + res.title + "</a>"
  );
  const str2 = $.NSString.alloc.initWithUTF8String(
    "[" + res.title + "](" + res.url + ")"
  );
  const str3 = $.NSString.alloc.initWithUTF8String(
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
