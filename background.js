// console.log("hello from background.js")
//shows up in
//   about:debugging#/runtime/this-firefox

browser.menus.create({
  id: "lock-tab",
  title: "Lock this tab",
  type: "checkbox",
  checked: false,
  contexts: ["tab"]
},() => {
  if (browser.runtime.lastError) {
    console.error("Error creating menu item:", browser.runtime.lastError);
  } else {
    console.log("Menu item created successfully");
  }
});

let tabsThatAreLocked = new Set()

browser.menus.onClicked.addListener(async (info,tab) => {
  if (info.menuItemId === "lock-tab") {
    // Add your custom action here
    // console.log("Clicked on tab:", tab.id);
    browser.tabs.get(tab.id).then(it=>console.log("tab info: ", it))
    // Example: browser.tabs.remove(tab.id);

    let tabWasPreviouslyLocked = tabsThatAreLocked.has(tab.id);
    if (tabWasPreviouslyLocked) {
      tabsThatAreLocked.delete(tab.id);
    } else {
      tabsThatAreLocked.add(tab.id);
    }
    browser.tabs.sendMessage(tab.id,{action: "lockedStateChanged",
      locked: !tabWasPreviouslyLocked});
  }
})

browser.menus.onShown.addListener((info,tab)=>{
  browser.menus.update("lock-tab",{checked: tabsThatAreLocked.has(tab.id)});
  browser.menus.refresh();
})

browser.tabs.onRemoved.addListener((tabId) => {
  tabsThatAreLocked.delete(tabId);
});
