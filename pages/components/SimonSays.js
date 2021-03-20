import React, { Fragment } from 'react';
import styles from '../../styles/SimonSays.module.css';

const SimonSays = () => {
    let startButton = document.querySelector('#start-button'),
        simonTiles = document.querySelectorAll('#simon-btn');
    let gameConfig = {
        round: 0,
        moves: {
            computer: [],
            human: [],
            copy: []
        },
        gameStarted: false,
        computerTurnLength: 1200
    };
    function startGame() {
        playSequence();
    }
    function playSequence() {
        if (gameConfig.round === 0) {
            addToSequence();
        }
        setTimeout(() => {
            computerClick();
        }, gameConfig.computerTurnLength);
    }
    function addToSequence() {
        if (gameConfig.round > 999) {
        }
        gameConfig.moves.computer.push(randomTile());
        gameConfig.round++;
    }
    function humanClick(e) {
        const clickedTile = e.target;
        buzz(clickedTile);
        // push the human move into the human array
        gameConfig.moves.human.push(clickedTile);
        compareClicks();
    }

    function computerClick() {
        let computerSequence = gameConfig.moves.computer;
        let maxRounds = computerSequence.length;

        const delay = amount => {
            return new Promise(resolve => {
                setTimeout(resolve, amount);
            });
        };

        async function loop() {
            for (let i = 0; i < maxRounds; i++) {
                buzz(computerSequence[i]);
                console.log('length', gameConfig.round);
                await delay(1000);
            }
            setMessage('message-box', "It's your turn!");
            simonTiles.forEach(tile => (tile.style.pointerEvents = 'auto'));
        }

        loop();
    }

    function compareClicks() {
        let computerSequence = gameConfig.moves.computer,
            humanSequence = gameConfig.moves.human;

        const comparison = computerSequence.every((tile, index) => {
            return tile === humanSequence[index];
        });

        if (humanSequence.length === computerSequence.length) {
            if (comparison) {
                addToSequence();
                playSequence();
                gameConfig.moves.human = [];
            } else {
                alert('mismatch, you lose');
                restartGame();
            }
        }
    }

    /* 
       * Utility Functions 
       ----------------------*/
    function randomTile(tiles = simonTiles) {
        const index = Math.floor(Math.random() * tiles.length);
        const tile = tiles[index];
        return tile;
    }

    function getGameMode(e) {
        // the offsetParent is because when the button is clicked,
        // it adds a span to create the effects (mui library default)
        return e.target.offsetParent.id === 'normal-mode'
            ? (gameConfig.mode = 'normal')
            : (gameConfig.mode = 'strict');
    }

    function buzz(tile) {
        const audio = tile.children[0];
        // reset audio play on each click
        audio.currentTime = 0;
        audio.play();
        // add and remove the color change
        tile.classList.add('js-click');
        setTimeout(() => {
            tile.classList.remove('js-click');
        }, 500);
    }

    /* 
       * DOM Manipulations
       ----------------------*/
    function setMessage(el, msg) {
        let messageBox = document.getElementById(el);
        messageBox.textContent = msg;
    }

    function disable(element) {
        return element.forEach(el => (el.disabled = true));
    }
    const StartGame = () => {
        startGame();
    };

    // function enable(element) {
    //     return element.forEach(el => (el.disabled = false));
    // }

    // /*
    //    * Event Listeners
    //    ----------------------*/
    // startButton.addEventListener('click', startGame);

    // gameModes.forEach(modeButton =>
    //     modeButton.addEventListener('click', getGameMode)
    // );
    // simonTiles.forEach(tile => tile.addEventListener('click', humanClick));

    return (
        <Fragment>
            <div className={styles.title}>SIMON SAYS</div>
            <div className={styles.container}>
                <div className={styles.green} id='simon-btn'></div>
                <div className={styles.red} id='simon-btn'></div>
                <div className={styles.yellow} id='simon-btn'></div>
                <div className={styles.blue} id='simon-btn'></div>
            </div>
            <button id='start-button' onClick={() => StartGame}>
                Start
            </button>
        </Fragment>
    );
};
export default SimonSays;
