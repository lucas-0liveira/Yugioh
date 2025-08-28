const settingScreen = document.querySelector(".settings");
const buttonEnglish = document.querySelector(".en-us");
const buttonPortuguese = document.querySelector(".pt-br");

async function showSettings() {
    settingScreen.style.display = "flex";

    if (state.isPortuguese) {
        buttonPortuguese.classList.add("active");
        buttonEnglish.classList.remove("active");
    } else {
        buttonPortuguese.classList.remove("active");
        buttonEnglish.classList.add("active");
    }

    await changeSettings();
}

function hiddenSettings() {
    settingScreen.style.display = "none";
}

function ajustarVolume() {
    const volume = document.getElementById('volume').value;
    state.musics.bgm.volume = volume;
    state.musics.win.volume = volume;
    state.musics.lose.volume = volume;
}

async function changeSettings() {
    settingScreen.querySelector("h3").innerText = state.isPortuguese ? "Configurações:" : "Settings:";
    settingScreen.querySelector(".language > h4").innerText = state.isPortuguese ? "Idioma:" : "Language:";
    buttonEnglish.innerText = state.isPortuguese ? "Inglês" : "English";
    buttonPortuguese.innerText = state.isPortuguese ? "Português" : "Portuguese";
}

async function changeLanguage(language) {
    if (language === "english") {
        buttonEnglish.classList.add("active");
        buttonPortuguese.classList.remove("active");

        state.isPortuguese = false;
        await changeHome();
        await changeSettings();
    }

    if (language === "portuguese") {
        buttonPortuguese.classList.add("active");
        buttonEnglish.classList.remove("active");

        state.isPortuguese = true;
        await changeHome();
        await changeSettings();
    }
}