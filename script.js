const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const currentRoundText = document.getElementById("current-round");
const currentRoundRollsText = document.getElementById("current-round-rolls");
const totalScoreText = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");
let isModalShowing = false;
let diceValuesArr = [];
let rolls = 0;
let score = 0;
let totalScore = 0;
let round = 1;

const rollDice = () => {
  diceValuesArr = [];
  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    diceValuesArr.push(randomDice);
  }

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

const updateStats = () => {
  currentRoundRollsText.textContent = rolls;
  currentRoundText.textContent = round;
};

const updateRadioOption = (optionNode, score) => {
  scoreInputs[optionNode].disabled = false;
  scoreInputs[optionNode].value = score;
  scoreSpans[optionNode].textContent = `, score = ${score}`;
};

const updateScore = (selectedValue, achieved) => {
  totalScore += parseInt(selectedValue)

  totalScoreText.textContent = totalScore
  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`
};

const getHighestDuplicates = (arr) => {
  const counts = {};
  for (const num of arr) {
    if (counts[num]) {
      counts[num]++;
    } else {
      counts[num] = 1;
    }
  }
  let highestCount = 0;
  for (const num of arr) {
    const count = counts[num];
    if (count >= 3 && count > highestCount) {
      highestCount = count;
    }
    if (count >= 4 && count > highestCount) {
      highestCount = count;
    }
  }

  const sumOfAllDice = diceValuesArr.reduce((a, b) => {
    return a + b;
  }, 0);

  if (highestCount >= 4) {
    updateRadioOption(1, sumOfAllDice);
  }

  if (highestCount >= 3) {
    updateRadioOption(0, sumOfAllDice);
  }

  updateRadioOption(5, 0);
};

const detectFullHouse = (arr) => {
  const counts = {}

  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  const hasThreeOfAKind = Object.values(counts).includes(3)
  const hasPair = Object.values(counts).includes(2)

  if (hasThreeOfAKind && hasPair) {
    updateRadioOption(2,25)
  }

  updateRadioOption(5, 0)

}

const checkForStraights = (arr) => {
  const sortedNumbersArr = arr.sort((a,b) => a - b)
  const uniqueNumbersArr = [...new Set(sortedNumbersArr)]
  const uniqueNumbersStr = uniqueNumbersArr.join('')
  const smallStraightsArr = ["1234", "2345", "3456"];
  const largeStraightsArr = ["12345", "23456"]

  if (smallStraightsArr.includes(uniqueNumbersStr)) {
    updateRadioOption(3, 30)
  }

  if (largeStraightsArr.includes(uniqueNumbersStr)) {
    updateRadioOption(4, 40)
  }
  updateRadioOption(5,0)
}

const resetRadioOption = () => {
  scoreInputs.forEach((input) => {
    input.disabled = true
    input.checked = false
  })

  scoreSpans.forEach((span) => {
    span.textContent = ''
  })
}

const resetGame = () => {
  diceValuesArr = [0, 0, 0, 0, 0]
  score = 0
  totalScore = 0
  rolls = 0
  round = 1
  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index]
  })
  totalScoreText.textContent = totalScore
  scoreHistory.innerHTML = ''
  currentRoundRollsText.textContent = rolls
  currentRoundText.textContent = round
  resetRadioOption()
}

rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert(
      "Has hecho tres tiradas en esta ronda. Por favor seleccione una puntuación."
    );
  } else {
    rolls++;
    resetRadioOption()
    rollDice();
    updateStats();
    // updateRadioOption(0,10)
    getHighestDuplicates(diceValuesArr)
    detectFullHouse(diceValuesArr)
    checkForStraights(diceValuesArr)
  }
});

rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;

  if (isModalShowing) {
    rulesBtn.textContent = "Ocultar Reglas";
    rulesContainer.style.display = "block";
  } else {
    rulesBtn.textContent = "Mostrar Reglas";
    rulesContainer.style.display = "none";
  }
});

keepScoreBtn.addEventListener('click', () => {
  let selectedValue
  let achieved

  for (const radioButton of scoreInputs) {
    if (radioButton.checked) {
      selectedValue = radioButton.value
      achieved = radioButton.id
      break
    }
  }

  if (selectedValue) {
    rolls = 0
    round++
    updateStats()
    resetRadioOption()
    updateScore(selectedValue, achieved)
    if (round > 6) {
      setTimeout(() => {
        alert(`¡Juego terminado! Tu puntuación total es ${totalScore}`);
        resetGame()
      },500)
    }
  } else {
    alert("Por favor selecciona una opción o tira los dados");
  }

})




