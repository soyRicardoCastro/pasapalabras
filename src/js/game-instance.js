import { game, user, firebaseApp, renderUI, Experience, Notification, Render, Status, NUMBER_CARDS, TIME } from "./game-mode.js";

import { createGuid, random } from "./system/utils.js";
// import { loadWords, uncoverAll } from "./system/UI.js";

export let session = null, words = []; //, movements = 0, sameCards = 0, lastCard = null;

// Recuperamos la partida en firebase. Esta función recibe una funcion denominada 'execute' como parámetro, esto es asi porque la lectura de firebase es asincronica
export function findGame(execute) {
    // Obtenemos la instancia actual
    // if (session === null) {
    console.log('Buscando partida en los servidores...');

    firebaseApp.database().ref('/').once('value').then(
        (snapshot) => {
            if (snapshot.exists()) {

                let Instance = snapshot.val();
                session = Instance.game_instance;
                // loadCards();

                let timestamp = session.timestamp;

                if (timestamp != null)
                    user.time = timestamp.subtract(Date.now());
                else
                    user.time = TIME;

                game.status = user.time === TIME ? null : Status.Start;
                if (session.movements != null) {
                    let __score = session.movements.filter(movement => movement[0] === movement[1] && movement[0] !== undefined);
                    let __movements = session.movements.filter(movement => movement[0] !== undefined && movement[1] !== undefined);


                    game.score = __score.length;
                    game.movements = __movements.length;
                }

                renderUI(Render.Game);

                let exists = Instance.hasOwnProperty('setting');
                if (exists) {
                    words = Instance.setting.words
                }
            }

            if (words.length > 0)
                execute();
            else {
                loadWordsDefault().then(result => {
                    console.log('Cargando palabras por defecto');
                    saveWords(result)
                    execute();
                });
            }
        });
    // }

    return session;
}

// Guardamos una cadena separada por comas en firebase
export function saveWordsToString(newWords = '') {
    if (newWords !== null) {
        let temp = newWords.split(',');
        saveWords(temp);
    }
}

function loadWordsFromLocalStorage () {
    const wordsFromLocalStorage = window.localStorage.getItem('memory')
    if (wordsFromLocalStorage) saveWordsToString(wordsFromLocalStorage)
}

loadWordsFromLocalStorage()

// Guardamos una array en firebase
export function saveWords(newWords = null) {
    words = newWords;
    if (newWords !== null)
        firebaseApp.database().ref('/setting/words').set(words);
}

export async function loadWordsDefault() {
    let palabras = [];

    await fetch('palabras.txt')
        .then(response => response.text())
        .then(value => {
            let tmp = value.replace(' ', '').split(',');

            for (let i = 0; i < tmp.length; i++) {
                let palabra = tmp[i].trim();
                palabras.push(palabra);
            }

            // console.log(palabras)
        });

    return palabras;
}

// Guardamos la partida en firebase
function saveGame() {

}

// Creamos una partida y la guardamos en firebase
export function newGame() {
    console.info('Creando nueva partida en linea...');

    let cards = [];
    if (game.experience === Experience.Image) {
        for (let i = 1; i <= NUMBER_CARDS; i++)
            cards.add(i);

        cards = cards.sort(() => {
            return Math.random() - 0.5;
        });
    } else {
        const max = (words.length - 1);

        do {
            const rnd = random(0, max);
            if (!cards.includes(rnd)) cards.push(rnd);
        } while (cards.length < NUMBER_CARDS)
    }

    let value = {
        guid: createGuid(),
        cards,
        experience: game.experience,
        enabled: true,
        movements: null,
        notification: {
            name: Notification.New,
            value: null,
            owner: game.role,
            creation: Date.now()
        },
        time: TIME,
        timestamp: null
    };

    firebaseApp.database().ref('/game_instance/').set(value);

    session = value;
    game.status = null;
    game.movements = 0;
    game.score = 0;
    user.time = TIME;
    renderUI(Render.Game);
    oNewGameEvent.fn();
    // loadCards();
    // uncoverAll();
    // instance.notification(Notification.newGame);
}

// Funciones por extension
Number.prototype.subtract = function subtract(value) {
    let t1 = this; // session.timestamp;
    // Si esta condición se cumple, entonces el juego no ha iniciado por consiguiente devolvemos el tiempo permitido
    if (typeof t1 !== 'number' || t1 == -1) return time;

    let t2 = typeof value === 'number' ? value : Date.now();

    // Tiempo transcurrido, se divide entre 1000 para convertir en segundos.
    let elapsed = (t2 - t1) / 1000;

    // Tiempo restante
    let result = user.time - Math.floor(elapsed);

    return (result < 0 ? 0 : result);
};

export let oNewGameEvent = {
    fn: function (newValue) {
        console.log('Este evento aún no está implementado...')
    }
}
