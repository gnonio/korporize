/*
   korporize for korpora (Apache 2.0) by https://github.com/gnonio
   Copyright 2020 Pedro SOARES
   
*/


function populate_options() {
  for (let i = 0; i < tesseract_langs.name.length; i++) {
    let lang = document.createElement("option")
    lang.text = tesseract_langs.name[i] + " (" + tesseract_langs.code3[i] + ")"
    lang.value = tesseract_langs.code3[i]
    languages.add(lang)
  }
  languages.selectedIndex = tesseract_langs.code3.indexOf(k_defaults.language)
  
  autodetect.checked = k_defaults.autodetect
  autocopy.checked = k_defaults.autocopy
  
  let quality = document.querySelectorAll(".quality")
  for ( input in quality ) {
    if ( k_defaults.quality == quality[input].value ) {
      quality[input].checked = true
    } else {
      quality[input].checked = false
    }
  }
  
  let psm = document.querySelectorAll(".psm")
  for ( input in psm ) {
    if ( k_defaults.psm == psm[input].value ) {
      psm[input].checked = true
    } else {
      psm[input].checked = false
    }
  }
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

function psmChange() {
  k_defaults.psm = this.value
}

function autocopyChange() {
  k_defaults.autocopy = this.checked
}

function saveOptions(e) {
  e.preventDefault()
  browser.storage.local.set( {k_defaults: k_defaults} )
  if ( DEBUG ) console.log("Saving defaults", k_defaults)
}

async function init() {
  await restoreOptions()
  populate_options()
}
  
document.addEventListener("DOMContentLoaded", init)

let languages = document.getElementById("languages")
languages.addEventListener("input", languageChange)

let autodetect = document.getElementById("autodetect")
autodetect.addEventListener("input", autodetectChange)

let autocopy = document.getElementById("autocopy")
autocopy.addEventListener("input", autocopyChange)

let fast = document.getElementById("fast")
fast.addEventListener("input", qualityChange)

let normal = document.getElementById("normal")
normal.addEventListener("input", qualityChange)

let best = document.getElementById("best")
best.addEventListener("input", qualityChange)

let psm_auto = document.getElementById("psm_auto")
psm_auto.addEventListener("input", psmChange)

let psm_auto_osd = document.getElementById("psm_auto_osd")
psm_auto_osd.addEventListener("input", psmChange)

let psm_single_block = document.getElementById("psm_single_block")
psm_single_block.addEventListener("input", psmChange)

let k_save = document.getElementById("k_save")
k_save.addEventListener("click", saveOptions)
