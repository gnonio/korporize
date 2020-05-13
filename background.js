/*
   korporize for korpora (Apache 2.0) by https://github.com/gnonio
   Copyright 2020 Pedro SOARES

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   
*/

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
    browser.runtime.getURL("js/languages.js"),
    browser.runtime.getURL("js/content.js"),
    browser.runtime.getURL("js/content-ui.js")
  ]
  let scripts = []
  
  for ( url in urls ) {
    let urlFetch = await fetch( urls[url] )
    scripts.push( await urlFetch.text() )
  }
  
  let script = scripts.join("\n\n")
  var insertingCSS = browser.tabs.insertCSS( tabId, {file: "js/content.css"} )
  return await browser.tabs.executeScript( tabId, {code: script} )
}

function handleMessage(message, sender, sendResponse) {
  switch (message.method) {
    /*
      CONTENT PAGE COMMUNICATION
    */
    case "BG_extractTextLoadedImage":
      OCRLoadedImage( message.data.image, sender.tab.id, message.data.language, message.data.quality, message.data.psm )
      break
    case "BG_kOptions":
      browser.runtime.openOptionsPage()
      break
  }
}
browser.runtime.onMessage.addListener( handleMessage )

function tesseractLogger(tabId, msg) {
  browser.tabs.sendMessage(tabId, {method: "CP_tesseractLogger", data: msg} )
}

function OCRLoadedImage(imageData, tabId, language, quality, psm) {
  browser.tabs.sendMessage(tabId, {method: "CP_tesseractLanguage", data: language} )
  if ( imageData && tabId && language ) {
    cron( extractTextImage, [imageData, language, quality, psm, tesseractLogger, tabId] )
      .then( (resolve, reject) => {        
        if ( resolve ) {
          browser.tabs.sendMessage( tabId, {
            method: "CP_showOCRResult", data: resolve } )
        } else {
          browser.tabs.sendMessage( tabId, {
            method: "CP_showOCRResult", data: reject } )
        }
      } )
  } else {
    console.warn("OCRLoadedImage", imageData, tabId, language)
  }
}

async function extractTextImage( imageUrl, language, quality, psm, logger, tabId ) {
  //https://github.com/naptha/tesseract.js/blob/master/docs/api.md
  const createWorker = Tesseract.createWorker
  
  //https://github.com/naptha/tessdata
  let lang = language ? language : 'eng'
  // 'lib/lang-data/' | 'https://tessdata.projectnaptha.com/'
  //let datapath = 'lib/lang-data/'
  let datapath = 'https://tessdata.projectnaptha.com/'
  // 4.0.0 | 4.0.0_best | 4.0.0_fast
  let traindata = quality ? quality : "4.0.0_fast"
  // write | readOnly | refresh | none
  let cachedata = 'write'
  //AUTO | AUTO_OSD | SINGLE_BLOCK
  let PSM = psm ? Tesseract.PSM[psm] : Tesseract.PSM.SINGLE_BLOCK
  
  console.log(datapath + traindata + '/' + lang + '.traineddata.gz')
  console.log(psm,PSM)
  
  let options = {
    workerPath: 'lib/worker.min.js',
    corePath: 'lib/tesseract-core.wasm.js', // .asm.js = SLOW
    langPath: datapath + traindata,
    cachePath: traindata,
    cacheMethod: cachedata,
    workerBlobURL: false,
    logger: m => logger(tabId, m), // Add logger here
    errorHandler: e => logger(tabId, e)
  }
  let parameters = {
    tessedit_pageseg_mode: PSM,
    tessedit_create_box: '1',
    tessedit_create_unlv: '1',
    tessedit_create_osd: '1',
  }
  let worker = createWorker(options)
  
  let data
  try {  
    await worker.load()
    await worker.loadLanguage(lang)
    await worker.initialize(lang)
    await worker.setParameters(parameters)
    //let { data: { text } } = await worker.recognize(imageUrl)
    data = await worker.recognize(imageUrl) // , hocr, tsv, box, unlv
    data.data.language = language
    await worker.terminate()
  } catch (e) {
    console.warn(e)
    data = {data: { language: language, text: "Error", confidence: 0 }}
  }
  return data
}