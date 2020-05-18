/*
   korporize for korpora (Apache 2.0) by https://github.com/gnonio
   Copyright 2020 Pedro SOARES
   
*/

// COMMON

// OPTIONS

let k_pageOptions = {}
let k_defaults = {}

async function restoreOptions() {
  if ( !k_defaults.language ) {
    //var clearing = browser.storage.local.clear() // sync.clear()
    let defaults = await browser.storage.local.get("k_defaults")
    
    if ( defaults.k_defaults ) {      
      k_defaults = defaults.k_defaults
      if ( DEBUG ) console.log("Restoring defaults", k_defaults)
    } else {
      let options = {
        k_defaults: {
          language:   "eng",
          autodetect: true,
          quality:    "4.0.0_fast",
          psm:        "AUTO", //AUTO | AUTO_OSD | SINGLE_BLOCK
          autocopy:   true
        }
      }
      await browser.storage.local.set(options)
      k_defaults = options.k_defaults
      console.warn("Setting defaults", k_defaults)
    }
  }
}
"common.js"