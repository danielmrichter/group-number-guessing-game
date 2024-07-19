let roundTracker = 1
let minNum
let maxNum
let robotCheck = false
let player1Name
let player2Name
function submitGuesses(event) {
  // bundle up data
  let player1Guess = document.getElementById(`player1Guess`).value
  let player2Guess = document.getElementById(`player2Guess`).value
  let winnerText = document.getElementById(`winnerText`)
  winnerText.innerHTML = ``
  // data we send from here: guess, who guessed it
  if (player1Guess === player2Guess) {
    document.getElementById(`winnerText`).innerHTML = `
    <h2> Guesses can't be the same!</h2>`
    return
  }
  let guessesToSubmit = [
    {
      guesser: 1,
      number: Number(player1Guess),
    },
    {
      guesser: 2,
      number: Number(player2Guess)
    }
  ]
  // make a post req
  axios({
    method: `POST`,
    url: `/guesses`,
    data: guessesToSubmit
  }).then((response) => {
    // then:      
    // start a get req
    getResults(response.data)
    // return the results for each player
  })
}
function getResults(guessesArray) {
  let player1History = document.getElementById(`player1History`)
  let player2History = document.getElementById(`player2History`)
  let playerComputerHistory = document.getElementById(`playerComputerHistory`)
  let winnerText = document.getElementById('winnerText')
  // return the results for each player
  let player1Correct = false
  let player2Correct = false
  let computerCorrect = false
  player1History.innerHTML = ``
  player2History.innerHTML = ``
  if(robotCheck){
    document.getElementById(`playerComputerHistory`).innerHTML = ``
  }
  for (let guess of guessesArray) {
    if (guess.guesser === 1) {
      player1History.innerHTML += `
        <tr>
          <td>${guess.number}</td>
          <td>${guess.result}</td>
        </tr>
       `
      if (guess.result === `Correct`) {
        player1Correct = true
      }
    } else if(guess.guesser === 2) {
      player2History.innerHTML +=
        `
        <tr>
          <td>${guess.number}</td>
          <td>${guess.result}</td>
       </tr>
       `
      if (guess.result === `Correct`) {
        player2Correct = true
      }
    } else{
      playerComputerHistory.innerHTML +=
      `
      <tr>
        <td>${guess.number}</td>
        <td>${guess.result}</td>
     </tr>
     ` 
      if(guess.result === `Correct`){
        computerCorrect = true
     }
    }
  }
  if (computerCorrect === true &&(player1Correct === true || player2Correct === true)) {
    //declare a tie
    winnerText.innerHTML = `<div class="tieWithComputer"><p>We got a tie with the computer!</p>
      <button onClick="resetGame()">Play Again (Same Settings)</button>
      <button onClick="toNewGame()">New Game</button></div>
      `
        document.getElementById(`player1Guess`).value = ``
        document.getElementById(`player2Guess`).value = ``
    return
  }
  else if (player1Correct === true) {
    winnerText.innerHTML = `<div class="winner"><p>${player1Name} Wins!</p>
      <button onClick="resetGame()">Play Again (Same Settings)</button>
      <button onClick="toNewGame()">New Game</button></div>`
        document.getElementById(`player1Guess`).value = ``
        document.getElementById(`player2Guess`).value = ``
    return
  } else if (player2Correct === true) {
    //player 2 wins
    winnerText.innerHTML = `<div class="winner"><p>${player2Name} Wins!</p>
      <button onClick="resetGame()">Play Again(Same Settings)</button>
      <button onClick="toNewGame()">New Game</button></div>`
        document.getElementById(`player1Guess`).value = ``
        document.getElementById(`player2Guess`).value = ``
    return
  } else if (computerCorrect === true){
    winnerText.innerHTML = `<div class="computerWins"><p>You lost to the Computer! 🤖🤖🤖 </p>
    <p>Now that's just embarassing...</p>
      <button onClick="resetGame()">Play Again(Same Settings)</button>
      <button onClick="toNewGame()">New Game</button></div>`
        document.getElementById(`player1Guess`).value = ``
        document.getElementById(`player2Guess`).value = ``
      return
  }
  // advance round tracker
  roundTracker++
  document.getElementById(`roundTracker`).innerText = roundTracker
  // clear submit fields
  document.getElementById(`player1Guess`).value = ``
  document.getElementById(`player2Guess`).value = ``
}
function resetGame() {
  axios({
    method: `POST`,
    url: `/reset`,
    data: { minNum: minNum, maxNum: maxNum }
  }).then((response) => {
    roundTracker = 1
    let player1History = document.getElementById(`player1History`)
    let player2History = document.getElementById(`player2History`)
    player1History.innerHTML = ``
    player2History.innerHTML = ``
    if(robotCheck){
      document.getElementById(`playerComputerHistory`).innerHTML=``
    }
    document.getElementById(`winnerText`).innerHTML = ``
    document.getElementById(`roundTracker`).innerText = roundTracker
  })
}
function newGameSettings(event) {
  event.preventDefault()
  player1Name = document.getElementById(`player1Name`).value
  player2Name = document.getElementById(`player2Name`).value
  robotCheck = document.getElementById(`robotCheck`).checked
  minNum = Number(document.getElementById(`minimumNum`).value)
  maxNum = Number(document.getElementById(`maximumNum`).value)
  let postObj = { minNum: minNum, maxNum: maxNum, robot: robotCheck }
  axios({
    method: `POST`,
    url: `/newgame`,
    data: postObj
  }).then((response) => {
    let body = document.querySelector(`body`)
    if (robotCheck === false) {
      body.innerHTML = `
    <h1>THE ULTIMATE GAME OF GUESSING NUMBERS</h1>
     <span class="players">
    <div id="player1">
      <h3>${player1Name}</h3>
     <input type="number" id="player1Guess" placeholder="Guess Here!">
     <table>
    <tbody id="player1History">
    </tbody>
  </table>

</div>

<div id="player2">
  <h3>${player2Name}</h3>
  <input type="number" id="player2Guess" placeholder="Guess Here!">
  <table>
    <tbody id="player2History">
    </tbody>
  </table>

</div>
</span>

<div id="winnerText">

</div>
<span class="submitArea">
<button onClick="submitGuesses(event)">Submit Guesses!</button>
<p>Current Round:<span id="roundTracker">1</span></p>
</span>
      `}
    else if (robotCheck === true) {
      body.innerHTML = `
    <h1>THE ULTIMATE GAME OF GUESSING NUMBERS</h1>
     <span class="players">
    <div id="player1">
      <h3>${player1Name}</h3>
     <input type="number" id="player1Guess" placeholder="Guess Here!">
     <table>
    <tbody id="player1History">
    </tbody>
        </table>

    </div>

    <div id="player2">
  <h3>${player2Name}</h3>
  <input type="number" id="player2Guess" placeholder="Guess Here!">
  <table>
    <tbody id="player2History">
    </tbody>
  </table>
</div>
<div id="playerComputer">
      <h3>The Computer</h3>
     <table>
    <tbody id="playerComputerHistory">
    </tbody>
</span>

<div id="winnerText">
</div>
<span class="submitArea">
<button onClick="submitGuesses(event)">Submit Guesses!</button>
<p>Current Round:<span id="roundTracker">1</span></p>
</span>`
    }
  })
}
function toNewGame() {
  roundTracker = 1
  document.querySelector(`body`).innerHTML =
    `<h1>THE ULTIMATE GAME OF GUESSING NUMBERS</h1>
  <form class="newGameForm">
    <p>Player 1 Name</p>
    <input type="text" placeholder="Player 1 Name" id="player1Name">
    <p>Player 2 Name</p>
    <input type="text" placeholder="Player 2 Name" id="player2Name">
    <p>Minimum Number</p>
    <input type="number" placeholder="Min. #" id="minimumNum">
    <p>Maximum Number</p>
    <input type="number" placeholder="Max. #" id="maximumNum">
    <input type="checkbox" id="robotCheck">
      <label for="robotCheck">Have an AI Opponent?</label>
    <button onClick="newGameSettings(event)">Submit</button>
     </form>`
}