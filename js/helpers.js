// HELPERS
let DEBUG = false
/*let origConsole = {}
origConsole.log = console.log
//orgConsole.trace = console.trace
console.log = DEBUG ? function(msg) {
  let stack = new Error().stack.split("\n").reverse()
  let ss = []
  for ( i = 1; i < stack.length-1; i++ ) { ss.push( stack[i].split("@")[0] ) }
  origConsole.log( ss.join(" > "), msg )
} : function(msg) { origConsole.log(msg) }*/

String.prototype.toDOM = function(){
  let d = document;
  let a = d.createElement("div");
  let b = d.createDocumentFragment();
  a.innerHTML = this;
  let i;
  while(i=a.firstChild)b.appendChild(i);
  return b;
}

// Wraps an async function/promise in a timer
// logs the timer result and returns the promise
async function cron(func, args) {
  return await (async () => {
    let t0 = performance.now()
    let data = await func.apply(null, args)
    console.log( func.name +" ("+ ((performance.now() - t0)/1000).toFixed(2) +" s)" )
    return data
  })()
}

function updateClipboard(newClip) {
  navigator.clipboard.writeText(newClip).then(function() {
    /* clipboard successfully set */
  }, function() {
    /* clipboard write failed */
  })
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