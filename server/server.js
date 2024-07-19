const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;
app.use(express.json())
const randomNumberGenerator = module.require(`./randomnumber.js`)
let correctNumber
let robotCheck = false
let minNum
let maxNum
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

app.post(`/guesses`, (req, res) => {
  let guessesToCheck = req.body
  if(robotCheck === true){
    let robotGuess = randomNumberGenerator(minNum,maxNum)
    guessesToCheck.push({guesser: `robot`, number:robotGuess})
  }
  for(let guess of guessesToCheck){
    checkGuesses(guess)
  }
  res.status(201).send(guessesArray)
})
app.post(`/reset`, (req, res) => {
  guessesArray = []
  minNum = req.body.minNum
  maxNum = req.body.maxNum
  correctNumber = randomNumberGenerator(minNum,maxNum)
  console.log(correctNumber)
  res.sendStatus(201)
})

app.post(`/newgame`, (req, res) => {
  minNum = req.body.minNum
  maxNum = req.body.maxNum
  guessesArray = []
  correctNumber = randomNumberGenerator(minNum, maxNum)
  console.log(correctNumber)
  if(req.body.robot){
    robotCheck = true
  } else{
    robotCheck = false
  }
  console.log(`robotCheck is ${robotCheck}`)
  res.sendStatus(201)
})

app.listen(PORT, () => {
  console.log ('Server is running on port', PORT)
})