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

function saveSettings(e) {
  e.preventDefault()
  console.log(e, defaultLanguage)
  /*browser.storage.sync.set({
    defaultLanguage: supportedLanguages.options[supportedLanguages.selectedIndex].value
  });*/
}

let defaultLanguage = "eng"
let supportedLanguages = document.getElementById("supportedLanguages")

function restoreOptions() {
  function populate_langs() {
    for (let i = 0; i < tesseract_langs.name.length; i++) {
      let lang = document.createElement("option")
      lang.text = "(" + tesseract_langs.le[i] + ") " + tesseract_langs.name[i]
      lang.value = tesseract_langs.le[i]
      supportedLanguages.add(lang)
    }
    supportedLanguages.selectedIndex = tesseract_langs.le.indexOf(defaultLanguage)
  }
  populate_langs()
  
  function setCurrentChoice(result) {
    defaultLanguage = tesseract_langs.le.indexOf(result)
    supportedLanguages.selectedIndex = defaultLanguage || "eng"
    //document.querySelector("#color").value = result.color || "blue"
  }
  
  function onError(error) {
    console.log(`Error: ${error}`)
  }

  let getting = browser.storage.sync.get("defaultLanguage")
  getting.then(setCurrentChoice, onError)

  /*function setCurrentChoice(result) {
    document.querySelector("#color").value = result.color || "blue"
  }

  function onError(error) {
    console.log(`Error: ${error}`)
  }

  let getting = browser.storage.sync.get("color")
  getting.then(setCurrentChoice, onError)*/
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.querySelector("form").addEventListener("submit", saveSettings)

function languageSwitch() {
  defaultLanguage = supportedLanguages.options[supportedLanguages.selectedIndex].value;
  console.log( defaultLanguage )
}

supportedLanguages.addEventListener("input", languageSwitch)