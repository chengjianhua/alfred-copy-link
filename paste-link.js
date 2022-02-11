#!/usr/bin/env osascript -l JavaScript

function run(argv) {
  let query = argv[0];
  if (query === "@@__FAILED__@@") {
    return;
  }

  pasteFromClipboard();
}

function pasteFromClipboard() {
  const se = Application("System Events");
  se.keystroke("v", { using: "command down" });
}
