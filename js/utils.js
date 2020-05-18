/*
   korporize for korpora (Apache 2.0) by https://github.com/gnonio
   Copyright 2020 Pedro SOARES
   
*/

// UTILS
let DEBUG = true
/*let origConsole = {}
origConsole.log = console.log
//orgConsole.trace = console.trace
console.log = DEBUG ? function(msg) {
  let stack = new Error().stack.split("\n").reverse()
  let ss = []
  for ( i = 1; i < stack.length-1; i++ ) { ss.push( stack[i].split("@")[0] ) }
  origConsole.log( ss.join(" > "), msg )
} : function(msg) { origConsole.log(msg) }*/

// Wraps an async function/promise in a timer
// logs the timer result and returns the promise
async function cron(func, args) {
  return await (async () => {
    let t0 = performance.now()
    let data = await func.apply(null, args)
    let t1 = ((performance.now() - t0)/1000).toFixed(1)
    if ( DEBUG ) console.log( func.name +" ("+ t1 +" s)" )
    return {time: t1, result: data}
  })()
}

function updateClipboard(newClip) {
  navigator.clipboard.writeText(newClip).then(function() {
    console.log("Copied to clipboard.")
  }, function() {
    console.warn("Copy to clipboard failed.")
  })
}

// Create HTML from string
String.prototype.toDOM = function(){
  let d = document
  let a = d.createElement("div")
  let b = d.createDocumentFragment()
  a.innerHTML = this
  let i
  while(i=a.firstChild)b.appendChild(i)
  return b
}

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

function getImageElement(imgSrc) {
  let images = document.body.getElementsByTagName("img")
  let image
  for ( img in images ) {
    if ( images[img].src ) {
      let hrefA = new URL(images[img].src).href
      let hrefB = new URL(imgSrc).href
      if ( hrefA == hrefB ) {
        image = images[img]
      }
    }
  }
  if ( !image ) { console.warn("Image source URL not found in page") }
  return image
}

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * 
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 * 
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
/*function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function getNewLetterSpacing( element ) {
  let fontStyle = getComputedStyle(element).fontStyle
  let fontSize = getComputedStyle(element).fontSize
  let fontFamily = getComputedStyle(element).fontFamily.split(", ")[0].replace(/\"/g, "")
  let font = fontStyle + " " + fontSize + " " + fontFamily
  
  let eWidth = parseFloat( getComputedStyle(element).width )
  let tWidth = getTextWidth(element.innerText, font)
  let tGaps = element.innerText.length - 1
  
  let newLetterSpacing = (( eWidth - tWidth) / tGaps) / 2

  return newLetterSpacing + "px"
}*/
"utils.js"