/*
   korporize for korpora (Apache 2.0) by https://github.com/gnonio
   Copyright 2020 Pedro SOARES
   
*/

browser.contextMenus.create({
  id: "extractTextLoadedImage",
  title: "Extract Text from Image",
  contexts: ["image"]
})
browser.contextMenus.create({
  id: "extractTextLink",
  title: "Extract Text from Link",
  contexts: ["link"]
})
browser.contextMenus.create({
  id: "extractTextPage",
  title: "Extract Text from Page",
  contexts: ["page"]
})

browser.contextMenus.onClicked.addListener( async function(info, tab) {
  if ( await notCPInject( tab.id ) ) {
    await injectCPScript( tab.id )
  }
  switch (info.menuItemId) {
    /*
      CONTENT PAGE COMMUNICATION
    */
    case "extractTextLoadedImage":
      browser.tabs.sendMessage(tab.id, {
            method: "CP_extractTextLoadedImage", data: info.srcUrl})
      break
    /*
      OTHER COMMUNICATION
    */
    case "extractTextLink":
      console.log( "extractTextLink", info, tab )
      /*browser.tabs.sendMessage(tab.id, {
            method: "CP_extractTextLink", data: info.srcUrl})*/
      break
    case "extractTextPage":
      console.log( "extractTextPage", info, tab )
      /*browser.tabs.sendMessage(tab.id, {
        method: "CP_extractTextPage", data: info.srcUrl})*/
      break
  }
})