async function init(){
  String.prototype.toDOM = function(){
    let d = document
    let a = d.createElement("div")
    let b = d.createDocumentFragment()
    a.innerHTML = this
    let i
    while(i=a.firstChild)b.appendChild(i)
    return b
  }
  
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

  function korporize_options_switch() {
    if (korporize_options_panel.style.display === 'none') {
      korporize_options_panel.style.display = 'block'
    } else {
      korporize_options_panel.style.display = 'none'
    }
  }

  function korporize_drag(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
    if (document.getElementById(element.id + "_header")) {
      document.getElementById(element.id + "_header").onmousedown = dragMouseDown
    } else {
      element.onmousedown = dragMouseDown
    }
    function dragMouseDown(e) {
      e = e || window.event
      e.preventDefault()
      pos3 = e.clientX
      pos4 = e.clientY
      document.onmouseup = closeDragElement
      document.onmousemove = elementDrag
    }
    function elementDrag(e) {
      e = e || window.event
      e.preventDefault()
      e.stopPropagation()
      pos1 = pos3 - e.clientX
      pos2 = pos4 - e.clientY
      pos3 = e.clientX
      pos4 = e.clientY
      element.style.top = (element.offsetTop - pos2) + "px"
      element.style.left = (element.offsetLeft - pos1) + "px"
    }
    function closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
    }
  }

  let doc = document.body
  
  
  let urlFetch = await fetch( browser.runtime.getURL("js/content-inject.html") )
  let korpusOCR_html = await urlFetch.text()

  document.body.appendChild(korpusOCR_html.toDOM())
  
  document.getElementById("korporize_logo").src = browser.runtime.getURL("./img/korporize.svg")
  
  let korporize = document.getElementById('korporize')
  korporize_drag(korporize)

  let korporize_options_panel = document.getElementById("korporize_options_panel")

  let korporize_options = document.getElementById("korporize_options")
  korporize_options.addEventListener("click", korporize_options_switch)

  //return html
}
init()




