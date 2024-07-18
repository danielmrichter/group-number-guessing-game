const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;
app.use(express.json())
let correctNumber = getRandomArbitrary(1, 25)
let guessesArray = [
  // Know what their guess was
  // know who guessed it
  // know if it was too high or too low
]
function checkGuesses(guess){
  // check the guesses
  if (guess.number === correctNumber) {
    guess.result = 'Correct'
  } else if (guess.number > correctNumber) {
    guess.result = 'Too high'
  } else if (guess.number < correctNumber) {
    guess.result = 'Too low'
  }
  // add it to guessesArray
  guessesArray.push(guess)
}
// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({extended:true}))

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static('server/public'));

// GET & POST Routes go here

// req = [{
//  guesser: player#
//  number: #},
// {}]


app.post(`/guesses`, (req, res) => {
  for(let guess of req.body){
    checkGuesses(guess)
    // check the return i guess or something
  }
  res.status(201).send(guessesArray)
})
app.post(`/reset`, (req, res) => {
  guessesArray = []
  console.log(`guessesArray is now:`, guessesArray)
  res.sendStatus(201)
})
// app.get('/guesses', (req, res) => {
//   res.send(guessesArray)
// })


app.listen(PORT, () => {
  console.log ('Server is running on port', PORT)
})


// from the MDN Wiki 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

console.log(correctNumber)