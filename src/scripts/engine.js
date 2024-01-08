const state = {
    view: {
        retry: document.querySelector("#retry"),
        enemy: document.querySelector(".enemy"),
        score: document.querySelector("#score"),
        life: document.querySelector("#hearts"),
        start: document.querySelector(".starGame"),
        squares: document.querySelectorAll(".square"),
        reset: document.querySelector("#retryButton"),
        hardCount: document.querySelector("#hardPlus"),
        timeLeft: document.querySelector("#time-left"),
        menuInit: document.querySelector("#menuStarter"),
        gameOverText: document.querySelector(".gameOver"),
        dificultView: document.querySelector(".dificultView"),
        gameOverscore: document.querySelector("#gameOverscore"),
    },
    values: {
        damage: 1,
        result: 0,
        gameOver: 0,
        startGame: 0,
        gameVel: 2000,
        timerId: 0,
        hitPosition: 0,
        currentTime: 60,
        hardDificultInc: 0,
        countDownTimerId: 0,
        dificultSelect: "easy",
        dificultModes: {
            easy: 2000,
            normal: 1000,
            hard: 600,
            hardPlus: 600,
        }
    },
    // action: {
    //     //timerId: setInterval(randomSquare, 1000),
    //     timerId: null,
    //     countDownTimerId: setInterval(countDown, 1000),
    // }
};

function resetValues() {

    clearInterval(state.values.countDownTimerId);
    clearInterval(state.values.timerId);
    state.values = {
        damage: 1,
        result: 0,
        gameOver: 0,
        startGame: 0,
        gameVel: 2000,
        timerId: 0,
        hitPosition: 0,
        currentTime: 60,
        hardDificultInc: 0,
        countDownTimerId: 0,
        dificultSelect: "easy",
        dificultModes: {
            easy: 2000,
            normal: 1000,
            hard: 600,
            hardPlus: 600,

        },
    }
    state.view.gameOverscore.textContent = 0;
    state.view.timeId = 0;
    state.view.score.textContent = 0
    state.view.hardCount.textContent = 0;
    state.view.timeLeft.textContent = 0
    state.view.dificultView.textContent = "Easy"
    state.view.gameOverscore.textContent = ""
    state.view.life.src = `./src/imagens/hearts/hearts1.png`;
    state.view.score.textContent = 0;
    //retyListener()
}

function countDown() {

    if (state.values.startGame == 1) {
        state.values.currentTime--;
        state.view.timeLeft.textContent = state.values.currentTime;

        if (state.values.currentTime < 0) {
            state.values.startGame = 0;
            retyListener()
        }
    }

}
function retyListener() {
    clearInterval(state.values.countDownTimerId);
    clearInterval(state.values.timerId);
    state.values.timerId = 0;
    state.values.currentTime = 0;
    state.view.timeLeft.textContent = 0;
    state.view.gameOverscore.textContent = state.values.result;

    if (state.values.gameOver != 0) {
        state.view.gameOverText.textContent = "Game Over!"
    } else {
        state.view.gameOverText.textContent = "Victory!"
    }
    state.view.retry.className = "retry"

    state.view.reset.addEventListener("mousedown", () => {
        resetValues()
        // state.values = stateReset.valuesReset;
        // state.view = stateReset.viewReset;
        state.view.retry.className = "hidder"
        menuInit()
    })
}

function randomSquare() {

    if (state.values.startGame == 1 && state.values.gameOver == 0) {
        state.view.squares.forEach((square) => {
            square.classList.remove("enemy");
        })

        let randomNumber = Math.floor(Math.random() * 9);
        let randomSquare = state.view.squares[randomNumber];
        randomSquare.classList.add("enemy");
        state.values.hitPosition = randomSquare.id
    }
}

function moveEnemy() {

    if (state.values.startGame == 1 && state.values.gameOver == 0) {
        state.view.timeId = setInterval(randomSquare, state.values.gameVel);
    }
}

function addListenerHitBox() {

    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit.m4a", 0.1)
            }
            else if (state.values.hitPosition != null) {
                state.values.damage++;
                if (state.values.damage < 10) {

                    state.view.life.src = `./src/imagens/hearts/hearts${state.values.damage}.png`;
                    state.values.hitPosition = null;
                } else {
                    state.view.life.src = `./src/imagens/hearts/hearts10.png`;
                    state.values.gameOver = 1;
                    state.values.startGame = 0;
                    retyListener();
                }
            }
        })
    })

}

function playSound(audioName, volumeAudio) {
    let audio = new Audio(`./src/audios/${audioName}`);
    audio.volume = volumeAudio;
    audio.play();
}

function dificultListenerChoice() {
    state.view.menuInit.addEventListener("mousedown", (select) => {
        if (select.target.className == "dificultMode") {

            state.view.dificultView.textContent = select.target.id
            state.values.dificultSelect = select.target.id
            state.values.gameVel = state.values.dificultModes[select.target.id]
            //state.values.dificultSelect = select.target.id
            state.values.hardDificultInc = 0
            state.view.hardCount.textContent = `+0`
        }
        else if (select.target.className == "hardPlus") {
            if (state.values.hardDificultInc < 5) {
                state.values.hardDificultInc++
                state.view.hardCount.textContent = `+${state.values.hardDificultInc}`
                state.view.dificultView.textContent = `hard +${state.values.hardDificultInc}`
                state.values.dificultSelect = select.target.id
                state.values.gameVel = state.values.dificultModes[select.target.id] - (100 * state.values.hardDificultInc)
            }
            else {
                alert("nivel maximo de dificuldade alcançado")
            }
        }
    })
}

function startListerner() {
    state.view.start.addEventListener("mousedown", (event) => {
        state.values.startGame = 1;
        moveEnemy();
        addListenerHitBox();

        state.view.menuInit.className = "hidder"

    })
}

function menuInit() {
    // .menuStarter
    // state.view.squares.forEach((square) => {
    //     square.addEventListener("mousedown", () => {
    state.view.menuInit.className = "menuStarter"
    state.values.countDownTimerId = setInterval(countDown, 800);
    dificultListenerChoice();
    startListerner()
}

function init() {
    menuInit()
}
init();