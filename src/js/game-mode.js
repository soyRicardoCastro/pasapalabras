export const NAME = "Pasapalabras - Memoria", NUMBER_CARDS = 9, TIME = 120;

// export let score = 0;
export let user = { time: TIME }

let __role = null,
    __experience = null,
    __status = null, __score = 0, __movements = 0;

const scoreHTML = document.getElementById("aciertos");
const movementsHTML = document.getElementById("movimientos");
const timeHTML = document.getElementById("t-restante");

// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWViRvMYAHoM3TIgPqFQLQae_UMd7avuA",
    authDomain: "pasapalabras-26062.firebaseapp.com",
    projectId: "pasapalabras-26062",
    storageBucket: "pasapalabras-26062.appspot.com",
    messagingSenderId: "330339766290",
    appId: "1:330339766290:web:4823e8697def2fc28508cb"
};

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);

// En este caso tenemos dos tipos de experiencia con imagenes y con palabras
export const Experience = {
    Image: "image",
    Words: "words"
}

export const Status = {
    Start: 0,
    Pause: 1
}

export const Role = {
    Moderator: 0,
    Player: 1,
}

export const Notification = {
    New: "New",
    End: "End",
    InputAction: "Input-Action"
};

export const Render = {
    Game: 0, Time: 1, Score: 2, Movements: 3
};

export let game = {
    get status() { return __status; },
    set status(value) {
        __status = value
        onStateGameEvent.fn(__status);
    },
    // Rol de usaurio, se utiliza para saber si tiene autoridad
    get role() { return __role; }, set role(value) { __role = value; },
    // Tipo de experiencia jugable
    get experience() { return __experience; }, set experience(value) { __experience = value; },
    // get time() { return __time; }, set time(value) { __time = value; },
    get score() { return __score; }, set score(value) { __score = value; },
    get movements() { return __movements; }, set movements(value) { __movements = value; },
}

export const startGame = () => {

    if (__status === null) // && onStartGameEvent !== undefined)
        onStartGameEvent.fn(Date.now());

    __status = Status.Start;
}

export const pauseGame = () => (__status = Status.Pause);

export function renderUI(element = Render.Game) {
    switch (element) {
        case Render.Game:
        case Render.Score:
            scoreHTML.innerText = `Aciertos: ${game.score}`;
        case Render.Movements:
            movementsHTML.innerText = `Movimientos: ${game.movements}`;
        case Render.Time:
            timeHTML.innerText = `Tiempo: ${user.time} segundos`;
    }
}

// Se utiliza para medir con precisión el tiempo transcurrido.
export const stopwatch = () => {
    const countdown = setInterval(() => {
        if (game.status === Status.Start) {
            user.time--;
            // time = timestamp1.subtract(timestamp2);
            if (user.time <= 0) {
                user.time = 0;
                pauseGame();
                onEndGameEvent.fn(false);
                clearInterval(countdown);
            }

            renderUI(Render.Time);
        }
    }, 1000);
};

stopwatch();

export let onStartGameEvent = {
    fn: function (newValue = null) {
        console.log('Este evento aún no está implementado...')
    }
}

export let onStateGameEvent = {
    fn: function (newValue) {
        console.log('Este evento aún no está implementado...')
    }
}

export let onEndGameEvent = {
    fn: function (newValue) {
        console.log('Este evento aún no está implementado...')
    }
}