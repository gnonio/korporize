/*
   korporize for korpora (Apache 2.0) by https://github.com/gnonio
   Copyright 2020 Pedro SOARES
   
*/
// HELPERS
String.prototype.toDOM = function(){
  let d = document
  let a = d.createElement("div")
  let b = d.createDocumentFragment()
  a.innerHTML = this
  let i
  while(i=a.firstChild)b.appendChild(i)
  return b
}

function copyToClipboard(text) {
  if (!navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
  } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea")
    textarea.textContent = text
    textarea.style.position = "fixed"  // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea)

    textarea.select()
    try {
      return document.execCommand("copy");  // Security exception may be thrown by some browsers.
    }
    catch (ex) {
      console.warn("Copy to clipboard failed.", ex)
      return false
    }
    finally {
      document.body.removeChild(textarea)
    }
  }
}

// We may need this async because of checkLanguage()
async function init(){
  
  function pressAndDrag(element, grabber) {
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
  
  function k_copytoclipboard() {
    let OCRtext = document.getElementById("k_OCRText").innerText
    copyToClipboard( OCRtext )
  }
  
  function k_OCRPanel_toggle() {
    if (k_OCRPanel.style.display === 'none') {
      k_OCRPanel.style.display = 'block'
      this.title = "Hide"
    } else {
      k_OCRPanel.style.display = 'none'
      this.title = "Show"
    }
  }
  
  // Load HTML
  let htmlUrl = browser.runtime.getURL("js/content.html")
  let urlFetch = await fetch( htmlUrl )
  let korpusOCR_html = await urlFetch.text()
  korpusOCR_html = korpusOCR_html.replace(/\.\.\//g, new URL( htmlUrl ).origin + "/" )

  document.body.appendChild(korpusOCR_html.toDOM())
  
  // Actions
  // We must call browser.runtime.openOptionsPage() from Background script
  document.getElementById("k_options").addEventListener("click", function() {
      browser.runtime.sendMessage({ method: "BG_kOptions" })
  })
  
  let korporize = document.getElementById("korporize")
  let kgrabber = document.querySelector("#korporize .kgrabber")
  pressAndDrag(korporize, kgrabber)
  
  let k_copy = document.getElementById("k_copy")
  k_copy.addEventListener("click", k_copytoclipboard)

  let k_OCRPanel = document.getElementById("k_OCRPanel")
  let k_drawer = document.getElementById("k_drawer")
  k_drawer.addEventListener("click", k_OCRPanel_toggle)
  
  /*let korporize_lang
  async function populate_langs() {
    if ( !korporizeLanguage ) {
      korporizeLanguage = await checkLanguage()
      detectedLanguage = korporizeLanguage.languages[0].language
      detectedLanguage = ISO_langs.le3[ISO_langs.le2.indexOf( detectedLanguage )]
    }
    for (let i = 0; i < tesseract_langs.name.length; i++) {
      let lang = document.createElement("option")
      lang.text = "(" + tesseract_langs.le[i] + ") " + tesseract_langs.name[i]
      lang.value = tesseract_langs.le[i]
      korporize_langs.add(lang)
    }
    //let le3 = ISO_langs.le3[ISO_langs.le2.indexOf( korporizeLanguage )] 
    korporize_langs.selectedIndex = tesseract_langs.le.indexOf(detectedLanguage)
  }
  
  function korporize_lang_switch() {
    korporize_lang = korporize_langs.options[korporize_langs.selectedIndex].value;
    console.log( korporize_lang )
  }*/

}
init()



