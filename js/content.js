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

let pageLanguage, userLanguage

async function handleMessage(message, sender, sendResponse) {
  let k_progress = document.getElementById("k_progress")
  let k_status = document.getElementById("k_status")
  let k_time = document.getElementById("k_time")
  let k_OCRText = document.getElementById("k_OCRText")
  let k_language = document.getElementById("k_language")
  let image, data, language
  
  // TODO: LOAD OPTIONS IN THE BACKGROUND
  //await restoreOptions("CONTENT")
  
  switch (message.method) {
    /*
      BACKGROUND COMMUNICATION
    */
    case "CP_extractTextLoadedImage":
      image = getImageElement(message.data)
      if ( image ) {
        language = k_defaults.language
        data = image.toDataURL()
        let element = {
          alt: image.alt,
          title: image.title,
          width: image.width,
          height: image.height,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        }
        if ( k_defaults.autodetect ) {
          if ( !pageLanguage ) {
            pageLanguage = await getPageLanguage()
            language = pageLanguage ? pageLanguage : language
          } else {
            language = pageLanguage
          }
        }
        if ( userLanguage ) {
          language = userLanguage
        }
        
        // update language in CONTENT PAGE options selector
        k_language.selectedIndex = tesseract_langs.code3.indexOf( language )
        
        browser.runtime.sendMessage({method: "BG_extractTextLoadedImage",
          data: {image: data, element: element,
            language: language, quality: k_defaults.quality, psm: k_defaults.psm }
        })
      }
      break
    /*case "CP_tesseractLanguage":
      let showlanguage = ISO_langs.name[ISO_langs.code3.indexOf( message.data )]
      //k_language.innerText = showlanguage
      break*/
    case "CP_korporizeLogger":
      //k_status.innerText = message.data.status
      let progress = Math.round(message.data.progress*100)
      k_progress.style.width = progress + "%"
      k_progress.innerText = progress + "%"
      break
    case "CP_showOCRResult":
      let result = message.data.result.data
      //k_OCRText.innerText = result.text
      k_OCRText.innerHTML = result.hocr      
      conformHOCR( result )
      
      k_status.innerText = "Confidence: " + result.confidence + "%"
      k_progress.innerText = ""
      k_time.innerText = message.data.time + "s"
      if ( k_defaults.autocopy ) {
        navigator.clipboard.writeText( result.text )
      }
      break
  }
}
browser.runtime.onMessage.addListener( handleMessage )

function conformHOCR( result ) {
  let ocr = document.querySelector("#k_OCRText")
  
  let page = document.querySelector("#k_OCRText #page_1")
  page.style.position = "relative"
  page.contentEditable = "true"  
  
  let img = document.createElement("img")
  img.src = result.image
  img.width = result.element.width
  img.height = result.element.height
  img.style.position = "relative"
  img.style.userSelect = "none"
  img.style.opacity = "25%"
  
  // Prevent dragging image to interfere with contenteditable
  img.ondragstart = function() { return false }
  
  let factor = result.element.width / result.element.naturalWidth
  
  page.insertBefore( img, page.childNodes[0] )
  
  let nodes = document.querySelectorAll("#k_OCRText span.ocrx_word")
  for ( n in nodes ) {
    let node = nodes[n]
    if ( node.title ) {
      let props = node.title.split("; ")
      let attribs = {}
      for ( p in props ) {
        let prop = props[p].split(" ")
        attribs[prop[0]] = prop.slice(1).map(function(v){return parseInt(v)})
      }
      
      let left = attribs.bbox[0]
      let top = attribs.bbox[1]
      let width = attribs.bbox[2] - left
      let height = attribs.bbox[3] - top
      
      let confidence = attribs.x_wconf[0] / 100
      
      let line = node.parentElement
      let ltop = parseFloat( line.title.split("; ")[0].split(" ")[2] )
      let lbottom = parseFloat( line.title.split("; ")[0].split(" ")[4] )
      let lheight = parseFloat( line.title.split("; ")[2].split(" ")[1] )
      
      let baseline = parseFloat( line.title.split("; ")[1].split(" ")[2] )
      
      // aligns <span>s to image (border 1px)
      /*let fromBottom = (lbottom - height) - (lheight - height) - (ltop - top)
      node.style.top = fromBottom * factor + "px"
      node.style.width = width * factor + "px"
      node.style.height = height * factor + "px"*/
      
      node.style.position = "absolute"
      node.style.left = left * factor + "px"
      node.style.top = (ltop + baseline) * factor + "px"
      //node.style.top = ( (ltop - lheight - baseline) ) * factor + "px"
      node.style.fontSize = lheight * factor + "px"
      node.style.color = "rgba(0,0,0," + confidence + ")"
      node.style.backgroundColor = "rgba(255,0,0," + (1 - confidence) + ")"
      
      //node.style.letterSpacing = getNewLetterSpacing( node )
    }
  }  
}
