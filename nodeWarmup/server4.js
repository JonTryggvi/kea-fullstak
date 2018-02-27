//  always return a callback

var test = (iNumber, fCallback) => {
  if (iNumber == 1) {
    console.log('Got ' + iNumber)
    return fCallback()  //always return the callback not just call it
  }
 console.log('end');
}

test(1,() => {
  console.log('x')
})