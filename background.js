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

async function injectCPScript( tabId ) {
  let insertingCSS = browser.tabs.insertCSS( tabId, {file: "/js/content.css?" + Date.now()} )
  
  // CRITICAL:  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript#Return_value
  // ALL scripts but the last require some return value as a workaround: ie. <string> "name.js"
  // last script is executing an async with return value itself
  // we would be splitting execution... or smtg (this is uncomfortable)
  let executingScript
  executingScript = await browser.tabs.executeScript( tabId, {file: "/js/utils.js"} )
  executingScript = await browser.tabs.executeScript( tabId, {file: "/js/common.js"} )
  executingScript = await browser.tabs.executeScript( tabId, {file: "/js/languages.js"} )
  executingScript = await browser.tabs.executeScript( tabId, {file: "/js/content.js"} )
  executingScript = await browser.tabs.executeScript( tabId, {file: "/js/content-ui.js"} )
}

function handleMessage(message, sender, sendResponse) {
  switch (message.method) {
    /*
      CONTENT PAGE COMMUNICATION
    */
    case "BG_extractTextLoadedImage":
      let config = message.data
      config.tabId = sender.tab.id
      config.logger = korporizeLogger
      OCRLoadedImage( config )
      break
    case "BG_kOptions":
      browser.runtime.openOptionsPage()
      break
  }
}
browser.runtime.onMessage.addListener( handleMessage )

function korporizeLogger(tabId, msg) {
  browser.tabs.sendMessage(tabId, {method: "CP_korporizeLogger", data: msg} )
}

function OCRLoadedImage(config) {
  //browser.tabs.sendMessage(tabId, {method: "CP_tesseractLanguage", data: language} )
  if ( config.tabId && config.image && config.language ) {
    cron( extractTextImage, [ config ] )
      .then( (resolve, reject) => {        
        if ( resolve ) {
          browser.tabs.sendMessage( config.tabId, {
            method: "CP_showOCRResult", data: resolve } )
        } else {
          browser.tabs.sendMessage( config.tabId, {
            method: "CP_showOCRResult", data: reject } )
        }
      } )
  } else {
    console.warn("OCRLoadedImage", config)
  }
}

async function extractTextImage( config ) {
  /*config.tabId, config.logger,
    config.element, config.image,
    config.language, config.quality, config.psm*/
    
  //https://github.com/naptha/tesseract.js/blob/master/docs/api.md
  const createWorker = Tesseract.createWorker
  
  //https://github.com/naptha/tessdata
  let language = config.language ? config.language : 'eng'
  // 'lib/lang-data/' | 'https://tessdata.projectnaptha.com/'
  //let datapath = 'lib/lang-data/'
  let datapath = 'https://tessdata.projectnaptha.com/'
  // 4.0.0 | 4.0.0_best | 4.0.0_fast
  let traindata = config.quality ? config.quality : "4.0.0_fast"
  // write | readOnly | refresh | none
  let cachedata = 'write'
  // OEM_TESSERACT_ONLY | OEM_LSTM_ONLY | OEM_DEFAULT
  //let OEM = oem ? Tesseract.PSM[oem] : Tesseract.OSM.OEM_DEFAULT
  // AUTO | AUTO_OSD | SINGLE_BLOCK
  let PSM = config.psm ? Tesseract.PSM[config.psm] : Tesseract.PSM.SINGLE_BLOCK
  
  let options = {
    workerPath: 'lib/worker.min.js',
    corePath: 'lib/tesseract-core.wasm.js', // .asm.js = SLOWER
    langPath: datapath + traindata,
    cachePath: traindata,
    cacheMethod: cachedata,
    // CRITICAL (Content Security Policy): workerBlobURL must be set to false
    // The page's settings blocked the loading of a resource at blob:moz-extension:// .../... ("script-src").
    // Check: spawnWorker.js
    // https://github.com/naptha/tesseract.js/issues/219
    //  > https://github.com/naptha/tesseract.js/pull/322
    workerBlobURL: false,
    logger: m => config.logger( config.tabId, m ), // Add logger here
    errorHandler: e => config.logger( config.tabId, e )
  }
  let parameters = {
    //tessedit_ocr_engine_mode:   OEM,
    tessedit_pageseg_mode:      PSM,
    /*tessedit_char_whitelist:    '',
    preserve_interword_spaces:  '0',
    user_defined_dpi:           '',
    tessedit_create_hocr:       '1',
    tessedit_create_tsv:        '1',
    tessedit_create_box:        '0',
    tessedit_create_unlv:       '0',
    tessedit_create_osd:        '0',*/
  }
  if ( DEBUG ) console.log( language, options, parameters )
  
  let worker = createWorker( options )
  
  let result
  try {  
    await worker.load()
    await worker.loadLanguage( language )
    await worker.initialize( language )
    await worker.setParameters( parameters )
    result = await worker.recognize( config.image )
    result.data.image = config.image
    result.data.element = config.element
    result.data.language = config.language
    await worker.terminate()
  } catch (e) {
    console.warn(e)
    result = {data: { language: language, text: "Error", confidence: 0 }}
  }
  return result
}