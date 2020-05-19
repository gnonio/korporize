/*
   korporize for korpora (Apache 2.0) by https://github.com/gnonio
   Copyright 2020 Pedro SOARES
   
*/

browser.contextMenus.create({
  id: "extractTextLoadedImage",
  title: "Extract Text from Image",
  contexts: ["image"]
})
/*browser.contextMenus.create({
  id: "extractTextLink",
  title: "Extract Text from Link",
  contexts: ["link"]
})
browser.contextMenus.create({
  id: "extractTextPage",
  title: "Extract Text from Page",
  contexts: ["page"]
})*/

async function handleUI(info, tab) {
  if ( needsInject( tab.id, info.pageUrl ) ) {
    await injectCPScript( tab.id )
    getInjected()[tab.id] = info.pageUrl
  }
  switch ( info.menuItemId ) {
    /*
      CONTENT PAGE COMMUNICATION
    */
    case "extractTextLoadedImage":
      browser.tabs.sendMessage( tab.id, {
        method: "CP_extractTextLoadedImage", data: info.srcUrl} )
      break
    /*
      OTHER COMMUNICATION
    */
    /*case "extractTextLink":
      console.log( "extractTextLink", info, tab )
      break
    case "extractTextPage":
      console.log( "extractTextPage", info, tab )
      break*/
  }
}

browser.contextMenus.onClicked.addListener( handleUI )