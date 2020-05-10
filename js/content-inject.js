//https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
const ISO_langs = {  
  name: ["Afrikaans","Albanian","Amharic","Arabic","Assamese","Azerbaijani","Basque","Belarusian","Bengali","Bosnian","Bulgarian","Burmese","Catalan, Valencian","Croatian","Czech","Danish","Dutch, Flemish","Dzongkha","English","Esperanto","Estonian","Finnish","French","Galician","Georgian","German","Greek, Modern (1453–)","Gujarati","Haitian, Haitian Creole","Hebrew","Hindi","Hungarian","Indonesian","Irish","Icelandic","Italian","Inuktitut","Japanese","Javanese","Kannada","Kazakh","Central Khmer","Kirghiz, Kyrgyz","Korean","Kurdish","Latin","Lao","Lithuanian","Latvian","Macedonian","Malay","Malayalam","Maltese","Marathi","Nepali","Norwegian","Oriya","Punjabi, Panjabi","Persian","Polish","Pashto, Pushto","Portuguese","Romanian, Moldavian, Moldovan","Russian","Sanskrit","Serbian","Sinhala, Sinhalese","Slovak","Slovenian","Spanish, Castilian","Swahili","Swedish","Tamil","Telugu","Tajik","Thai","Tigrinya","Tibetan","Tagalog","Turkish","Uighur, Uyghur","Ukrainian","Urdu","Uzbek","Vietnamese","Welsh","Yiddish"],
  le2: ["af","sq","am","ar","as","az","eu","be","bn","bs","bg","my","ca","hr","cs","da","nl","dz","en","eo","et","fi","fr","gl","ka","de","el","gu","ht","he","hi","hu","id","ga","is","it","iu","ja","jv","kn","kk","km","ky","ko","ku","la","lo","lt","lv","mk","ms","ml","mt","mr","ne","no","or","pa","fa","pl","ps","pt","ro","ru","sa","sr","si","sk","sl","es","sw","sv","ta","te","tg","th","ti","bo","tl","tr","ug","uk","ur","uz","vi","cy","yi"],
  le3: ["afr","sqi","amh","ara","asm","aze","eus","bel","ben","bos","bul","mya","cat","hrv","ces","dan","nld","dzo","eng","epo","est","fin","fra","glg","kat","deu","ell","guj","hat","heb","hin","hun","ind","gle","isl","ita","iku","jpn","jav","kan","kaz","khm","kir","kor","kur","lat","lao","lit","lav","mkd","msa","mal","mlt","mar","nep","nor","ori","pan","fas","pol","pus","por","ron","rus","san","srp","sin","slk","slv","spa","swa","swe","tam","tel","tgk","tha","tir","bod","tgl","tur","uig","ukr","urd","uzb","vie","cym","yid"]
}

const tesseract_langs = {
  name: [
  "Afrikaans","Amharic","Arabic","Assamese","Azerbaijani","Azerbaijani - Cyrillic","Belarusian","Bengali","Tibetan","Bosnian","Bulgarian","Catalan; Valencian","Cebuano","Czech","Chinese - Simplified","Chinese - Traditional","Cherokee","Welsh","Danish","German","Dzongkha","Greek, Modern (1453-)","English","English, Middle (1100-1500)","Esperanto","Estonian","Basque","Persian","Finnish","French","German Fraktur","French, Middle (ca. 1400-1600)","Irish","Galician","Greek, Ancient (-1453)","Gujarati","Haitian; Haitian Creole","Hebrew","Hindi","Croatian","Hungarian","Inuktitut","Indonesian","Icelandic","Italian","Italian - Old","Javanese","Japanese","Kannada","Georgian","Georgian - Old","Kazakh","Central Khmer","Kirghiz; Kyrgyz","Korean","Kurdish","Lao","Latin","Latvian","Lithuanian","Malayalam","Marathi","Macedonian","Maltese","Malay","Burmese","Nepali","Dutch; Flemish","Norwegian","Oriya","Panjabi; Punjabi","Polish","Portuguese","Pushto; Pashto","Romanian; Moldavian; Moldovan","Russian","Sanskrit","Sinhala; Sinhalese","Slovak","Slovenian","Spanish; Castilian","Spanish; Castilian - Old","Albanian","Serbian","Serbian - Latin","Swahili","Swedish","Syriac","Tamil","Telugu","Tajik","Tagalog","Thai","Tigrinya","Turkish","Uighur; Uyghur","Ukrainian","Urdu","Uzbek","Uzbek - Cyrillic","Vietnamese","Yiddish"],
  le: ["afr","amh","ara","asm","aze","aze_cyrl","bel","ben","bod","bos","bul","cat","ceb","ces","chi_sim","chi_tra","chr","cym","dan","deu","dzo","ell","eng","enm","epo","est","eus","fas","fin","fra","frk","frm","gle","glg","grc","guj","hat","heb","hin","hrv","hun","iku","ind","isl","ita","ita_old","jav","jpn","kan","kat","kat_old","kaz","khm","kir","kor","kur","lao","lat","lav","lit","mal","mar","mkd","mlt","msa","mya","nep","nld","nor","ori","pan","pol","por","pus","ron","rus","san","sin","slk","slv","spa","spa_old","sqi","srp","srp_latn","swa","swe","syr","tam","tel","tgk","tgl","tha","tir","tur","uig","ukr","urd","uzb","uzb_cyrl","vie","yid"]
}

/*function getTableData() {
  let table = document.getElementsByTagName("table")[1]
  let iso = [];
  let le2 = [];
  let le3 = [];
  for (i = 0; i < table.rows.length; i++) {
    let cells = table.rows.item(i).cells
    if ( tesseract_langs.le.indexOf(cells.item(5).innerText) >= 0 ) {
      iso.push( cells.item(2).innerText ) // ISO Name    "English"
      le2.push( cells.item(4).innerText ) // 639-1       "en"
      le3.push( cells.item(5).innerText ) // 639-2/T     "eng"
    }
  }
  console.log( JSON.stringify(iso) )
  console.log( JSON.stringify(le2) )
  console.log( JSON.stringify(le3) )
}
getTableData()*/

let korporizeLanguage, detectedLanguage

const checkLanguage = (async () => {
  // Compact Language Detector (CLD)
  // https://github.com/CLD2Owners/cld2
  let lang = document.documentElement.lang.split("-")[0]
  if ( lang.length > 0 ) {
    return { isReliable: true, languages: [{ language: lang, percentage: 99}] }
  } else {
    return await browser.i18n.detectLanguage( document.documentElement.innerHTML )
  }
})
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
  //console.log( message, sender, sendResponse );
  let image, data
  switch (message.method) {
    /*
      BACKGROUND COMMUNICATION
    */
    case "CP_extractTextLoadedImage":
      image = getImageDataUrl(message.data)
      if ( image ) {
        data = image.toDataURL()
        //console.log(!korporizeLanguage)
        if ( !korporizeLanguage ) {
          korporizeLanguage = await checkLanguage()
          detectedLanguage = korporizeLanguage.languages[0].language
          detectedLanguage = ISO_langs.le3[ISO_langs.le2.indexOf( detectedLanguage )]
        }
        browser.runtime.sendMessage({method: "BG_extractTextLoadedImage",
          data: {image: data, alt: image.alt, title: image.title, width: image.naturalWidth, height: image.naturalHeight, language: detectedLanguage }
        })
      } else { console.warn("Image source URL not found in page") }
      break
    case "CP_showOCRResult":
      console.log( "CP_showOCRResult", message )
      let language = ISO_langs.name[ISO_langs.le3.indexOf( message.data.language )]
      document.getElementById("korporize_detLang").innerText = language
      document.getElementById("korporize_OCR").innerHTML = message.data.text      
      //showPanel()
      break
  }
}
browser.runtime.onMessage.addListener( handleMessage )
