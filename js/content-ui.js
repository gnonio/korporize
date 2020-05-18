/*
   korporize for korpora (Apache 2.0) by https://github.com/gnonio
   Copyright 2020 Pedro SOARES
   
*/

function clickAndDrag(element, grabber) {
  var X = 0, Y = 0, dX = 0, dY = 0
  if (grabber) {
    grabber.onmousedown = dragMouseDown
  } else {
    element.onmousedown = dragMouseDown
  }
  function dragMouseDown(e) {
    e = e || window.event
    e.preventDefault()
    dX = e.clientX
    dY = e.clientY
    grabber.style.cursor = "grabbing"
    document.onmouseup = closeDragElement
    document.onmousemove = elementDrag
  }
  function elementDrag(e) {
    e = e || window.event
    e.preventDefault()
    e.stopPropagation()
    X = dX - e.clientX
    Y = dY - e.clientY
    dX = e.clientX
    dY = e.clientY
    element.style.top = (element.offsetTop - Y) + "px"
    element.style.left = (element.offsetLeft - X) + "px"
  }
  function closeDragElement() {
    grabber.style.cursor = "grab"
    document.onmouseup = null
    document.onmousemove = null
  }
}

function k_retryOptions() {
  if ( DEBUG ) console.log("k_retryOptions", k_defaults)
}

function k_copytoclipboard() {
  let OCRtext = document.getElementById("k_OCRText").innerText
  navigator.clipboard.writeText( OCRtext )
}

async function init(){
  await restoreOptions()
  
  function k_OCRPanel_toggle() {
    if (k_OCRPanel.style.display === 'none') {
      k_OCRPanel.style.display = 'block'
      this.title = "Hide"
    } else {
      k_OCRPanel.style.display = 'none'
      this.title = "Show"
    }
  }
  
  function populate_languages() {
    for (let i = 0; i < tesseract_langs.name.length; i++) {
      let lang = document.createElement("option")
      lang.text = tesseract_langs.name[i] + " (" + tesseract_langs.code3[i] + ")"
      lang.value = tesseract_langs.code3[i]
      k_language.add(lang)
    }
    k_language.selectedIndex = tesseract_langs.code3.indexOf(k_defaults.language)
  }
  
  function languageChange() {
    //k_defaults.language = this.options[this.selectedIndex].value
    userLanguage = this.options[this.selectedIndex].value
  }
  
  // Load HTML
  let htmlUrl = browser.runtime.getURL("js/content.html")
  let urlFetch = await fetch( htmlUrl )
  let korpusOCR_html = await urlFetch.text()
  korpusOCR_html = korpusOCR_html.replace(/\.\.\//g, new URL( htmlUrl ).origin + "/" )

  document.body.appendChild( korpusOCR_html.toDOM() )
  
  // Actions
  // We must call browser.runtime.openOptionsPage() from Background script
  document.getElementById("k_options").addEventListener("click", function() {
      browser.runtime.sendMessage({ method: "BG_kOptions" })
  })
  
  let korporize = document.getElementById("korporize")
  let kgrabber = document.querySelector("#korporize .kgrabber")
  clickAndDrag(korporize, kgrabber)
  
  let k_language = document.getElementById("k_language")
  k_language.addEventListener("input", languageChange)
  populate_languages()
  
  /*let k_retry = document.getElementById("k_retry")
  k_retry.addEventListener("click", k_retryOptions)*/
  
  let k_copy = document.getElementById("k_copy")
  k_copy.addEventListener("click", k_copytoclipboard)

  let k_OCRPanel = document.getElementById("k_OCRPanel")
  let k_drawer = document.getElementById("k_drawer")
  k_drawer.addEventListener("click", k_OCRPanel_toggle)

}
init()