// console.log("hello from content.js")
var thisTabIsLocked = false;
browser.runtime.onMessage.addListener((message,sender,sendResponse)=>{
	// console.log("got message: ",message);
	if (message.action === "lockedStateChanged") {
		thisTabIsLocked = message.locked;
	}
})

window.addEventListener("beforeunload", function (e) {
	// console.log("hello from window event listener");
	// console.log("islocked: ",thisTabIsLocked)
	if (!thisTabIsLocked) {
      return undefined;
    }
    var confirmationMessage = 'This tab is locked! But you can close it anyway if you want';

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});

