function onReady() {
  console.log("JavaScript is loaded!")
}
let roundTracker = 1
function submitGuesses(event){
  // bundle up data
  let player1Guess = document.getElementById(`player1Guess`).value
  let player2Guess = document.getElementById(`player2Guess`).value
// data we send from here: guess, who guessed it
  let guessesToSubmit = [
    { guesser: 1,
      number: Number(player1Guess)
    },
    {
      guesser: 2,
      number: Number(player2Guess)
    }
  ]
  console.log(`guesses to submit:`, guessesToSubmit)
  // make a post req
  axios({
    method: `POST`,
    url: `/guesses`,
    data: guessesToSubmit
}).then((response) =>{
    // then:      
  // start a get req
  getResults(response.data)
    // return the results for each player
})
  }

function getResults(guessesArray){
//   axios({
//     method: `GET`,
//     url: `/guesses`
// }).then((response) =>{
// make get req
// const guessesArray = response.data
// })
  let player1History = document.getElementById(`player1History`)
  let player2History = document.getElementById(`player2History`)
  let winnerText = document.getElementById('winnerText')
// return the results for each player
  let player1Correct = false
  let player2Correct = false
// if there's a winner, display that text
// otherwise create history
  player1History.innerHTML = ``
  player2History.innerHTML = ``
  for(let guess of guessesArray){
    if(guess.guesser === 1){
        player1History.innerHTML +=`
        <tr>
          <td>${guess.number}</td>
          <td>${guess.result}</td>
        </tr>
       `
       if(guess.result === `Correct`){
         player1Correct = true
       }
      } else{
       player2History.innerHTML +=
       `
        <tr>
          <td>${guess.number}</td>
          <td>${guess.result}</td>
       </tr>
       `
       if(guess.result === `Correct`){
          player2Correct = true
          }
      }
    }
    if(player1Correct === true && player2Correct === true){
      //declare a tie
      winnerText.innerHTML = `<p>We got a tie!</p>
      <button onClick="resetGame()">Play Again</button>
      `
      return 
    }
    else if(player1Correct === true){
      winnerText.innerHTML = `<p>Player 1 Wins!</p>
      <button onClick="resetGame()">Play Again</button>`
      return
    } else if(player2Correct === true){
      //player 2 wins
      winnerText.innerHTML = `<p>Player 2 Wins!</p>
      <button onClick="resetGame()">Play Again</button>`
      return
    }
// advance round tracker
roundTracker ++
document.getElementById(`roundTracker`).innerText = roundTracker
// clear submit fields
  document.getElementById(`player1Guess`).value = ``
  document.getElementById(`player2Guess`).value = ``
}

function resetGame(){
  console.log(`reset!`)
  axios({
    method: `POST`,
    url: `/reset`,
    data: ``
  }).then((response) =>{
    roundTracker = 1
    let player1History = document.getElementById(`player1History`)
    let player2History = document.getElementById(`player2History`)
    player1History.innerHTML = ``
    player2History.innerHTML = ``
    document.getElementById(`roundTracker`).innerText = roundTracker
  })
}


onReady()