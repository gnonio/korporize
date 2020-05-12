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

let k_defaults, pageLanguage

/*
  Helper - get image data
  https://stackoverflow.com/questions/934012/get-image-data-url-in-javascript?noredirect=1&lq=1
*/
Object.defineProperty( HTMLImageElement.prototype,'toDataURL', {
  enumerable:false, configurable:false, writable:false,
  value: function(m,q) {
    let c=document.createElement('canvas')
    c.width=this.naturalWidth; c.height=this.naturalHeight
    c.getContext('2d').drawImage(this,0,0); return c.toDataURL(m,q)
  }
})

function getImageDataUrl(imgSrc) {
  let images = document.body.getElementsByTagName("img")
  let image
  let paths = new URL(imgSrc).pathname.split("/")
  paths = paths[paths.length-1]
  for ( img in images ) {
    let i = images[img]
    if (i.src && typeof i.src == "string") {
      i = i.src
      if ( i.indexOf(paths) >=0 ) image = images[img]
    }
  }
  return image
}

async function handleMessage(message, sender, sendResponse) {
  let k_progress = document.getElementById("k_progress")
  let k_status = document.getElementById("k_status")
  let k_OCRText = document.getElementById("k_OCRText")
  let k_language = document.getElementById("k_language")
  let image, data, language
  
  k_defaults = await browser.storage.local.get("k_defaults")
  k_defaults = k_defaults.k_defaults
  language = k_defaults.language
  
  switch (message.method) {
    /*
      BACKGROUND COMMUNICATION
    */
    case "CP_extractTextLoadedImage":
      image = getImageDataUrl(message.data)
      if ( image ) {
        data = image.toDataURL()
        if ( k_defaults.autodetect ) {
          if ( !pageLanguage ) {
            pageLanguage = await checkLanguage()
            pageLanguage = pageLanguage.languages[0].language
            pageLanguage = ISO_langs.code3[ISO_langs.code2.indexOf( pageLanguage )]
            if ( pageLanguage ) {
              language = pageLanguage
            } else {
              console.warn("Language not detected, using default: " + language)
            }
          }
        }        
        browser.runtime.sendMessage({method: "BG_extractTextLoadedImage",
          data: {image: data, alt: image.alt, title: image.title,
            width: image.naturalWidth, height: image.naturalHeight,
            language: language, quality: k_defaults.quality }
        })
      } else { console.warn("Image source URL not found in page") }
      break
    case "CP_tesseractLanguage":
      let showlanguage = ISO_langs.name[ISO_langs.code3.indexOf( message.data )]
      k_language.innerText = showlanguage
      break
    case "CP_tesseractLogger":
      if ( message.data.status == "recognizing text" ) {
        k_status.innerText = "."
      } else {
        k_status.innerText = message.data.status        
      }
      let progress = Math.round(message.data.progress*100)
      k_progress.style.width = progress + "%"
      k_progress.innerText = progress + "%"
      break
    case "CP_showOCRResult":
      let result = message.data.result.data
      k_OCRText.innerText = result.text
      k_status.innerText = "Confidence: " + result.confidence + "%"
      k_progress.innerText = "("+ message.data.time + " s) "
      if ( k_defaults.autocopy ) {
        navigator.clipboard.writeText( result.text )
      }
      break
  }
}
browser.runtime.onMessage.addListener( handleMessage )
