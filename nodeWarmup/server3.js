console.log(1);



// best to use oldschool funcitons since they are loaded and ready for the getgot but fat arrow funcitons are asigned to variables and can only be called after the deceleration for the variable of the fat arrow
// test()
 
// function test() {
//   console.log('test');
// }

// var test = () => {
//   console.log('test');
// }

// callbacks are not async the do not speed up servers they become syncronious when your are calling back from externa api's or files
// IOIOIO 
var test = fCallback => {
  let total = 0
  let start = process.hrtime() //nanosecs
  
  for (let i = 0; i <50000000; i++) {
    
      total += i
  }
  let end = process.hrtime() //nanosecs
  var seconds = start[0] - end[0]
  var milliseconds = start[1] - end[1]
  console.log(milliseconds); 
  fCallback()
}

test(function () {
  console.log('test'); 
})
console.log(2);
