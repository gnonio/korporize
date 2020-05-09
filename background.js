async function notCPInject( tabID ) {
  try {
    await browser.tabs.sendMessage(tabID, {})
    return false
  } catch (e) {
    console.warn(e)
  }
  return true
}

async function injectCPScript(tabId){
  let urls = [
    browser.runtime.getURL("js/content-inject.js"),
    browser.runtime.getURL("js/content-inject-ui.js")
  ]
  let scripts = []
  
  for ( url in urls ) {
    let urlFetch = await fetch( urls[url] )
    scripts.push( await urlFetch.text() )
  }
  
  let script = scripts.join("\n\n")

  return await browser.tabs.executeScript( tabId, {code: script} )
}

function handleMessage(message, sender, sendResponse) {
  switch (message.method) {
    /*
      CONTENT PAGE COMMUNICATION
    */
    case "BG_extractTextLoadedImage":
      //console.log("BG_extractTextLoadedImage", message, sender, message.data.language)
      OCRLoadedImage( message.data.image, sender.tab.id, message.data.language )
      break
  }
}
browser.runtime.onMessage.addListener( handleMessage )

function OCRLoadedImage(imageData, tabId, language) {
  cron( extractTextImage, [imageData, language, "fast", "SINGLE_BLOCK"] )
    .then( (resolve, reject) => {
      console.log( resolve.data )
      browser.tabs.sendMessage( tabId, {
        method: "CP_showOCRResult", data: resolve.data } )
      copyToClipboard( resolve.data.text )
    } )
}

async function extractTextImage( imageUrl, language, quality, psm ) {
  //https://github.com/naptha/tesseract.js/blob/master/docs/api.md
  const createWorker = Tesseract.createWorker
  
  //https://github.com/naptha/tessdata
  let lang = language ? language : 'eng'
  // 'lib/lang-data/' | 'https://tessdata.projectnaptha.com/'
  let datapath = 'https://tessdata.projectnaptha.com/'
  //let datapath = 'lib/lang-data/'
  // 4.0.0 | 4.0.0_best | 4.0.0_fast
  //let traindata = "4.0.0_fast"
  let traindata = quality ? "4.0.0" + "_" + quality : "4.0.0_fast"
  // write | readOnly | refresh | none
  let cachedata = 'write'
  //AUTO | AUTO_OSD | SINGLE_BLOCK
  let PSM = psm ? Tesseract.PSM[psm] : Tesseract.PSM.SINGLE_BLOCK
  
  console.log(datapath + traindata + '/' + lang + '.traineddata.gz')
  console.log(psm,PSM)
  
  let options = {
    workerPath: 'lib/worker.min.js',
    corePath: 'lib/tesseract-core.wasm.js', // tesseract-core.asm.js SLOW
    langPath: datapath + traindata,
    cachePath: traindata,
    cacheMethod: cachedata,
    workerBlobURL: false,
    logger: m => console.log(m), // Add logger here
    //errorHandler: e => console.error(e)
  }
  let parameters = {
    tessedit_pageseg_mode: PSM,
    tessedit_create_box: '1',
    tessedit_create_unlv: '1',
    tessedit_create_osd: '1',
  }
  let worker = createWorker(options)
  
  await worker.load()
  await worker.loadLanguage(lang)
  await worker.initialize(lang)
  await worker.setParameters(parameters)
  //let { data: { text } } = await worker.recognize(imageUrl)
  let data = await worker.recognize(imageUrl) // , hocr, tsv, box, unlv
  data.data.language = language
  await worker.terminate()
  return data
}