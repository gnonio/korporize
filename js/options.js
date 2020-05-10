/*
   korporize for korpora (Apache 2.0) by https://github.com/gnonio
   Copyright 2020 Pedro SOARES
   
*/

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

//var clearing = browser.storage.sync.clear()
//var clearing = browser.storage.local.clear()

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
  languages.selectedIndex = tesseract_langs.le.indexOf(k_defaults.language)
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
    lang.text = tesseract_langs.name[i] + " (" + tesseract_langs.le[i] + ")"
    lang.value = tesseract_langs.le[i]
    languages.add(lang)
  }
  languages.selectedIndex = tesseract_langs.le.indexOf(k_defaults.language)  
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
