/*
   korporize for korpora (Apache 2.0) by https://github.com/gnonio
   Copyright 2020 Pedro SOARES
   
*/
//var clearing = browser.storage.local.clear() // sync.clear()

let k_defaults = {}

async function restoreOptions() {
  let defaults = await browser.storage.local.get("k_defaults")
  loadOptions( defaults )
  populate_langs()
}

async function loadOptions(result) {
  if ( result.k_defaults ) {      
    k_defaults = result.k_defaults
    console.log("Restoring defaults", k_defaults)
  } else {
    let options = {
      k_defaults: {
        language:   "eng",
        autodetect: true,
        quality:    "4.0.0_fast",
        autocopy:   true
      }
    }
    await browser.storage.local.set(options)
    k_defaults = options.k_defaults
    console.warn("Setting defaults", k_defaults)
  }
  languages.selectedIndex = tesseract_langs.code3.indexOf(k_defaults.language)
  autodetect.checked = k_defaults.autodetect
  
  let quality = document.querySelectorAll(".quality")
  for ( input in quality ) {
    if ( k_defaults.quality == quality[input].value ) {
      quality[input].checked = true
    } else {
      quality[input].checked = false
    }
  }
  
  autocopy.checked = k_defaults.autocopy
}

function populate_langs() {
  for (let i = 0; i < tesseract_langs.name.length; i++) {
    let lang = document.createElement("option")
    lang.text = tesseract_langs.name[i] + " (" + tesseract_langs.code3[i] + ")"
    lang.value = tesseract_langs.code3[i]
    languages.add(lang)
  }
  languages.selectedIndex = tesseract_langs.code3.indexOf(k_defaults.language)  
}

function languageChange() {
  k_defaults.language = this.options[this.selectedIndex].value
}

function autodetectChange() {
  k_defaults.autodetect = this.checked
}

function qualityChange() {
  k_defaults.quality = this.value
}

function autocopyChange() {
  k_defaults.autocopy = this.checked
}

function saveOptions(e) {
  e.preventDefault()
  browser.storage.local.set( {k_defaults: k_defaults} )
  console.log("Saving defaults", k_defaults)
}
  
document.addEventListener("DOMContentLoaded", restoreOptions)

let languages = document.getElementById("languages")
languages.addEventListener("input", languageChange)

let autodetect = document.getElementById("autodetect")
autodetect.addEventListener("input", autodetectChange)

let fast = document.getElementById("fast")
fast.addEventListener("input", qualityChange)

let normal = document.getElementById("normal")
normal.addEventListener("input", qualityChange)

let best = document.getElementById("best")
best.addEventListener("input", qualityChange)

let autocopy = document.getElementById("autocopy")
autocopy.addEventListener("input", autocopyChange)

let k_save = document.getElementById("k_save")
k_save.addEventListener("click", saveOptions)
