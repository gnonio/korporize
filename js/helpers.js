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

// Wraps an async function/promise in a timer
// logs the timer result and returns the promise
async function cron(func, args) {
  return await (async () => {
    let t0 = performance.now()
    let data = await func.apply(null, args)
    let t1 = ((performance.now() - t0)/1000).toFixed(2)
    console.log( func.name +" ("+ t1 +" s)" )
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