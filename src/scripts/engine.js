const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    playerSides: {
        player1: "player-cards",
        computer: "computer-cards"
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    cardSprites: {
        avatar: document.querySelector(".menu_avatar"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    actions: {
        button: document.getElementById("next-duel"),
        playerSeleted: "",
        computerSeleted: ""
    },
    values: {
        playerChoice: ""
    },
    musics: {
        bgm: document.getElementById("bgm"),
        win: new Audio(`src/assets/audios/win.wav`),
        lose: new Audio(`src/assets/audios/lose.wav`)
    },
    texts: {
        english : {
            textName: "",
            textType: "",
            textButton: ""
        },
        portuguese : {
            textName: "",
            textType: "",
            textButton: ""
        }
    },
    isPortuguese: true
};

async function getRandomNumber(numero) {
    return Math.floor(Math.random() * numero);
}

async function restart() {
    // Remove as cartas do jogador e do computador
    document.querySelectorAll("#player-cards > div.card").forEach(card => card.remove());
    document.querySelectorAll("#computer-cards > div.card").forEach(card => card.remove());

    // Esconde a tela de game over
    document.querySelector(".game-screen").style.display = "none";

    // Reativa o botão de configurações
    document.querySelector(".setting-button").setAttribute("onclick", "showSettings()");

    // Remove as cartas do campo, se existirem
    if (state.fieldCards.player.firstChild) {
        state.fieldCards.player.firstChild.remove();
    }

    if (state.fieldCards.computer.firstChild) {
        state.fieldCards.computer.firstChild.remove();
    }

    // Oculta o botão de "próximo duelo"
    state.actions.button.style.display = "none";

    // Zera os pontos
    state.score.computerScore = 0;
    state.score.playerScore = 0;

    // limpa o avatar
    state.cardSprites.avatar.innerHTML = "";

    // Reinicia o jogo
    await init();
}

async function nextDuel() {
    document.querySelectorAll("#player-cards > div.card:not(.card-selected)").forEach(card => {
        card.firstChild.setAttribute("onclick", "setCardsField(this)");
    });

    document.querySelector(".setting-button").setAttribute("onclick", "showSettings()");

    state.texts.english.textButton = "LET'S DUEL";
    state.texts.portuguese.textButton = "VAMOS DUELAR";

    if (state.fieldCards.player.firstChild) {
        state.fieldCards.player.firstChild.remove();
    }

    if (state.fieldCards.computer.firstChild) {
        state.fieldCards.computer.firstChild.remove();
    }

    state.actions.button.style.display = "none";
}

async function checkDuelResults(playerCardId, computerCardId) {
    let playerCard = cardData[playerCardId];
    state.texts.english.textButton = "Draw";
    state.texts.portuguese.textButton = "Empatou";

    if (playerCard.WinOf.includes(computerCardId)) {
        state.texts.english.textButton = "Win";
        state.texts.portuguese.textButton = "Ganhou";
        state.score.playerScore++;
        state.musics.win.play();
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        state.texts.english.textButton = "Lose";
        state.texts.portuguese.textButton = "Perdeu";
        state.score.computerScore++;
        state.musics.lose.play();
    }

}

async function setPlayerWinner() {
    document.querySelectorAll("#player-cards > .card").forEach(card => card.classList.remove("card-scale"));

    document.querySelectorAll("#player-cards > div.card:not(.card-selected)").forEach(card => card.firstChild.removeAttribute("onclick"));

    document.querySelector(".setting-button").removeAttribute("onclick");

    state.texts.english.textName = "Choice";
    state.texts.english.textType = "a card";
    state.texts.portuguese.textName = "Selecione";
    state.texts.portuguese.textType = "Uma carta";

    state.cardSprites.avatar.firstChild.remove();

    const computerCards = document.querySelectorAll("#computer-cards > .card");

    let computerCardNumber = await getRandomNumber(computerCards.length);
    let isSelected = computerCards[computerCardNumber].classList.contains("card-selected");
    
    while(isSelected) {
        computerCardNumber = await getRandomNumber(computerCards.length);
        isSelected = computerCards[computerCardNumber].classList.contains("card-selected");
    }

    let computerId = Number(computerCards[computerCardNumber].firstChild.getAttribute("data-id"));
    let playerId = Number(state.actions.playerSeleted.getAttribute("data-id"));

    state.fieldCards.computer.innerHTML = state.isPortuguese ? `<img src=${cardData[computerId].img} alt="card do computador">` : `<img src=${cardData[computerId].img} alt="computer card">`;

    await checkDuelResults(playerId, computerId);

    state.actions.playerSeleted.parentNode.classList.add("card-selected");
    state.actions.playerSeleted.src = cardData[playerId].img;
    state.actions.playerSeleted.removeAttribute("onclick");

    computerCards[computerCardNumber].classList.add("card-selected");
    computerCards[computerCardNumber].firstChild.src = cardData[computerId].img;

    state.actions.button.setAttribute("onclick", "nextDuel()");

    const computer = document.querySelectorAll("#computer-cards > .card.card-selected");

    if (computer.length === computerCards.length) {

        if (state.score.playerScore > state.score.computerScore) {
            setTimeout(() => {
                const gameOver = document.querySelector(".game-screen");
                gameOver.style.display = "flex";
                gameOver.querySelector("p").innerHTML = state.isPortuguese ? "Você venceu, Parabéns!🥳" : "You won, congratulations!🥳";
                gameOver.querySelector("button").innerHTML = state.isPortuguese ? "Novo Jogo" : "New Game";
            }, 800);
        }

        if (state.score.playerScore < state.score.computerScore) {
            setTimeout(() => {
                const gameOver = document.querySelector(".game-screen");
                gameOver.style.display = "flex";
                gameOver.querySelector("p").innerHTML = state.isPortuguese ? "Você Perdeu, mas não desista!😖" : "You lost, don't give up!😖";
                gameOver.querySelector("button").innerHTML = state.isPortuguese ? "Tente Novamente" : "Try Again";
            }, 800);
        }

        if (state.score.playerScore === state.score.computerScore) {
            setTimeout(() => {
                const gameOver = document.querySelector(".game-screen");
                gameOver.style.display = "flex";
                gameOver.querySelector("p").innerHTML = state.isPortuguese ? "Você empatou!😲" : "You drawn😲";
                gameOver.querySelector("button").innerHTML = state.isPortuguese ? "Tente Novamente" : "Try Again";
            }, 800);
        }

    }
    await changeHome();
}

async function setCardsField(card) {

    document.querySelectorAll("#player-cards > .card").forEach(card => card.classList.remove("card-scale"));

    const cardId = card.getAttribute("data-id");
    card.parentNode.classList.add("card-scale");
    state.actions.playerSeleted = card;

    state.cardSprites.avatar.innerHTML = state.isPortuguese ? `<img src=${cardData[cardId].img} alt="card selecionado">` : `<img src=${cardData[cardId].img} alt="selected card">`;
    
    state.texts.english.textName = cardData[cardId].nameEnUs;
    state.texts.english.textType = "Attribute : " + cardData[cardId].typeEnUs;
    state.texts.portuguese.textName = cardData[cardId].namePtBr
    state.texts.portuguese.textType = "Atributo : " + cardData[cardId].typePtBr

    state.fieldCards.player.innerHTML = `<img src=${cardData[cardId].img} alt="card do jogador">`;

    state.actions.button.style.display = "block";
    state.actions.button.setAttribute("onclick", "setPlayerWinner()");

    await changeHome();
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("src", "src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);

    const cardBox = document.createElement("div");
    cardBox.classList.add("card");

    if (fieldSide === state.playerSides.player1) {
        cardImage.setAttribute("onclick", "setCardsField(this)");
        cardImage.setAttribute("alt", state.isPortuguese ? "card do jogador" : "player card");
    } else {
        cardImage.setAttribute("alt", state.isPortuguese ? "card do computador" : "computer card");
    }

    cardBox.appendChild(cardImage);

    return cardBox;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        
        const randomIdCard = await getRandomNumber(cardData.length);
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
    
}

async function changeHome() {
    state.cardSprites.name.innerText = state.isPortuguese ? state.texts.portuguese.textName : state.texts.english.textName;
    state.cardSprites.type.innerText = state.isPortuguese ? state.texts.portuguese.textType : state.texts.english.textType;
    state.actions.button.innerText = state.isPortuguese ? state.texts.portuguese.textButton : state.texts.english.textButton;
    state.score.scoreBox.innerText = state.isPortuguese ? `Ganhou : ${state.score.playerScore} | Perdeu: ${state.score.computerScore}` : `Win : ${state.score.playerScore} | Lose: ${state.score.computerScore}`;

    document.querySelector(".setting-button").innerHTML = state.isPortuguese ? "Configurações <i class='fa-solid fa-gear'>" : "Settings <i class='fa-solid fa-gear'>";
}

async function init() {

    await drawCards(5, state.playerSides.player1);
    await drawCards(5, state.playerSides.computer);

    state.texts.english.textName = "Choice";
    state.texts.english.textType = "a card";
    state.texts.english.textButton = "LET'S DUEL";

    state.texts.portuguese.textName = "Selecione";
    state.texts.portuguese.textType = "Uma carta";
    state.texts.portuguese.textButton = "VAMOS DUELAR";

    await changeHome();

    state.musics.bgm.play();
}

init();