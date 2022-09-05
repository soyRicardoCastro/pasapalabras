import { Experience, game, user, Role, Notification, firebaseApp, NUMBER_CARDS, startGame, pauseGame, renderUI, Render, onStartGameEvent, onStateGameEvent, onEndGameEvent, Status, TIME } from "../game-mode.js";
import { session, findGame, newGame, words, oNewGameEvent } from "../game-instance.js";

// Recomendación: Solo debe ser accedida desde la propiedad WebControl.enabled
let __enabled = true;

const DISABLE_CARD = 'disable-card', mainHTML = document.getElementById("main");

// Enumeración de tipo de giro
export const RotateFlipType = {
    // No especifica ninguna rotación
    RotateNoneFlipX: 0,
    // Especifica una rotación de 180 grados en un giro horizontal de derecha a izquierda.}
    Rotate180FlipX: 1
};

// Funcion principal de este modulo
export function Load(role = Role.Player, experience = Experience.Words) {
    // guid = system.createGuid();
    game.role = role;
    game.experience = experience;
    onStartGameEvent.fn = onStartGame;
    onStateGameEvent.fn = onStateGame;
    oNewGameEvent.fn = onNewGame;
    onEndGameEvent.fn = onEndGame;
    Bind();

    // loadWords().then(words => {
    // Habilitamos el botón de nueva partida
    const element = document.getElementById('btn_game');
    if (element !== undefined)
        element.disabled = false;

    // find.fn: Es una función anonima, que se ejecuta si se encuetra una sesion en linea
    const find = {
        fn: function () {
            loadCards();
            // WebControl.enabled = true;

            if (game.movements == 0 && user.time > 0)
                uncoverAll();

            loadHistoryCard();
        }
    };

    // task.fn: Es una función anonima, que se pasa como parameto y solo se ejecuta luego de que firebase devuelva una respuesta
    const task = {
        fn: function () {
            // Si se cumple esta condición, entonces no existe una partida en linea, creamos una nueva partida
            if (session == null) { // (session === null || session === undefined) {
                newGame();

                // Si se cumple esta condición, entonces hubo un problema
                // De momento solo existen dos problemas conocidos, los cuales son, que ocurra un problema con firebase o de conexion a internet
                if (session == null) {
                    console.error('Ha ocurrido un error, revise su conexión de internet');
                    return;
                }
            }
            else {
                find.fn();
            }

            console.log('Los datos se cargaron correctamente');

            // Este bloque de codigo firebaseApp.database() ... se queda en escucha en tiempo real
            firebaseApp.database().ref('/game_instance/notification').on('value', function (snapshot) {
                // if (!session.enabled) return;
                let notification = snapshot.val();

                if (notification != null) {
                    if (notification.owner !== game.role) {
                        console.log('Nueva notificación entrante: ' + notification.owner);

                        switch (notification.name) {
                            case Notification.InputAction:
                                if (game.status == null) {
                                    game.status = Status.Start;
                                }
                                break;
                            case Notification.New:
                                game.movements = 0;
                                game.score = 0;
                                user.time = TIME;
                                Swal.close();
                                renderUI(Render.Game);
                                findGame(find.fn);
                                break;
                        }

                        firebase.database().ref('/game_instance/notification').remove();
                    }
                }
            });

            firebaseApp.database().ref('/game_instance/movements').on('value', function (snapshot) {
                // if (!session.enabled) return;
                let movements = snapshot.val();

                if (movements != null) {
                    let length = movements.length - 1;

                    // console.log(session.movements)
                    // console.log(movements)
                    session.movements = movements;

                    if (movements[length]['lastPlayer'] !== game.role) {
                        console.log('Se registro un movimiento de: ' + (movements[length]['lastPlayer'] === 0 ? "Moderador" : "Player"))

                        if (movements[length][0] === undefined || movements[length][1] === undefined || game.status === Status.Pause) return;
                    }

                    if (movements[length][0] !== undefined && movements[length][1] !== undefined)
                        equals(movements[length][0], movements[length][1]);
                }
            });
        }
    };

    // Buscamos la instancia actual
    findGame(task.fn);
    // });
};

function equals(a, b) {
    let value = true;
    // Cada par de tarjeta, es decir, una del usuario y otra del moderador, se cuenta como un movimiento, sean iguales o distintas
    if (a === b) {
        console.log('Las tarjetas son iguales')
        // console.log(session.movements)
        // console.log(session)
        if (session.movements != null) {
            let __score = session.movements.filter(movement => movement[0] === movement[1] && movement[0] !== undefined);
            let __movements = session.movements.filter(movement => movement[0] !== undefined && movement[1] !== undefined);

            game.score = __score.length;
            game.movements = __movements.length;
        }
        renderUI(Render.Game);

        if (game.score === NUMBER_CARDS) {
            onEndGame(true);
        }
    } // De lo contrario, si se equivoco,
    else {
        console.log('Lo siento, las tarjetas NO son iguales')
        value = false;

        setTimeout(() => {
            session.movements = null;
            game.movements = 0;
            game.score = 0;
            renderUI(Render.Game);
            hideCards()
        }, 800);

        firebase.database().ref('/game_instance/movements').remove();
    }

    WebControl.enabled = true;
    return value;
}

// Obtiene o establece un valor que indica si el juego puede responder a la interacción del usuario.
const WebControl = {
    get enabled() { return __enabled; },
    set enabled(value) {
        if ((__enabled = value)) // && user.time > 0) // Establecemos el nuevo valor y evaluamos la expresión en un solo paso
            mainHTML.classList.remove(DISABLE_CARD);
        else {
            const exists = mainHTML.classList.contains(DISABLE_CARD);
            if (!exists) mainHTML.classList.add(DISABLE_CARD);
        }
    }
}

function Bind() {
    let element = document.getElementById('btn_game');
    element.addEventListener("click", () => newGame());

    for (let i = 0; i < NUMBER_CARDS; i++) {
        if (game.role === Role.Player) {
            let element = document.getElementById('card_' + i);
            if (element == null) continue;

            element.addEventListener("click", () => uncover(i));


            let children = element.children[0].children[0].children[0];
            if (children != null)
                children.innerHTML = i + 1;
        }
        else {
            let element = document.getElementById(i);
            if (element !== null)
                element.addEventListener("click", () => uncover(i));
        }
    }
}

function onNewGame() {
    loadCards();
    uncoverAll();
}

function loadHistoryCard() {
    if (session.movements == null) return;
    // let movement = null;
    let element = null, card0 = null, card1 = null, i = 0;
    session.movements.forEach(movement => {
        card0 = session.cards.indexOf(movement[0]);
        card1 = session.cards.indexOf(movement[1]);
        i++;

        if (card0 === card1) {
            element = document.getElementById(card0);
            if (element == null) return;

            element.disabled = true;
            rotateFlip(card0);
        } else if (card0 === -1 ^ card1 === -1) {
            if (i < session.movements.length - 1) return;

            if (game.role === Role.Moderator) {
                if (card0 !== -1) {
                    element = document.getElementById(card0);
                    if (element == null) return;
                    element.disabled = true;
                    rotateFlip(card0);
                }
            } else {
                if (card1 !== -1) {
                    element = document.getElementById(card1);
                    if (element == null) return;
                    element.disabled = true;
                    rotateFlip(card1);
                }
            }
        }
    });

    if ((card0 === -1 && game.role === Role.Moderator) || (card1 === -1 && game.role === Role.Player) || card0 === card1) WebControl.enabled = true;
}

export function uncoverAll() {
    console.log('Mostrar todas las cartas')
    WebControl.enabled = false;

    for (var i = 0; i < NUMBER_CARDS; i++) {
        let element = document.getElementById(i);
        if (element != null)
            element.disabled = false;
        console.log(i);
        rotateFlip(i);
    }

    setTimeout(() => {
        if (game.role === Role.Player)
            hideCards()

        if (user.time > 0)
            WebControl.enabled = true;
    }, 2000);
}

function hideCards() {
    if (session == null) return;

    for (var i = 0; i < session?.cards.length; i++) {
        let card = session.cards[i];

        let OpenCard = session.movements != null ? session.movements.find(movement => movement[0] === movement[1] && movement[0] == card) : [];
        let isOpenCard = session.movements != null ? OpenCard.length > 0 : false;

        let element = document.getElementById(i);

        if (isOpenCard) {
            if (game.role === Role.Moderator) element.disabled = true;
            continue;
        } else
            element.disabled = false;

        rotateFlip(i, RotateFlipType.RotateNoneFlipX);
    }
}

export function rotateFlip(cardId, rotateFlipType = RotateFlipType.Rotate180FlipX) {
    if (game.role === Role.Moderator) return;

    let element = document.getElementById('card_' + cardId);

    if (rotateFlipType === RotateFlipType.Rotate180FlipX) {
        let exists = element.classList.contains('spin');
        if (!exists) {
            element.classList.add('spin');

            setTimeout(() => {
                // card box (element) > card (0) > back (1) > button.disabled = true;
                element.children[0].children[1].children[0].disabled = true;
            }, 300);
        }
    } else {
        element.classList.remove('spin');
        element.children[0].children[1].children[0].disabled = false;
    }
}

export function uncover(cardId, isRegister = true) {
    if (!WebControl.enabled) return;

    let element = document.getElementById(cardId);
    if (element != null)
        element.disabled = true;

    // Ejecutamos la función que aplica el efecto de rotar la carta, sin embargo, si el rol actual es (Role.Player), quedara sin efecto.
    rotateFlip(cardId);

    WebControl.enabled = false;

    startGame();

    if (isRegister) {
        // let index = game.role === Role.Moderator ? 0 : 1;
        let value = session.cards[cardId];

        firebase.database().ref(`/game_instance/movements/${game.movements}/lastPlayer`).set(game.role);
        firebase.database().ref(`/game_instance/movements/${game.movements}/${game.role}`).set(value);
        // firebase.database().ref('/game_instance/movements/last-player').set(game.role);
        firebaseApp.database().ref('/game_instance/notification').set({
            name: Notification.InputAction,
            value: null,
            owner: game.role,
            creation: Date.now()
        });
    }
}

function loadCards() {
    // Cargamos las palabras o las imagenes en las tarjetas
    for (let i = 0; i < NUMBER_CARDS; i++) {
        // Si el tipo de juego es con imagenes, es decir, experience === Experience.Image; el indice almacenado en numeros[i] se corresponde con los nombres de cada imagen (1.png, 2.png, ..., 9.png)
        // De lo contrario, al mismo indice le restamos 1, ya que las palabras estan en un array de base cero (0)
        let card = session.cards[i]; // experience === Experience.Image ? numeros[i] : numeros[i] - 1;

        let temp = document.getElementById(game.role === Role.Moderator ? i : `back_${i}`);

        if (temp !== null) {
            temp.innerHTML = game.experience === Experience.Image ? `<img src="./images/${card}.png" alt=""/>` : words[card];
            temp.disabled = false;
        }
    }
}

function onStartGame(timestamp) {
    firebaseApp.database().ref('/game_instance/timestamp').set(timestamp);

    firebaseApp.database().ref('/game_instance/notification').set({
        name: Notification.InputAction,
        value: timestamp,
        owner: game.role,
        creation: Date.now()
    });
}

function onStateGame(newValue) {
    WebControl.enabled = (user.time > 0);
}

// Evento que se desencadena al finalizar el juego por aciertos o falta de tiempo
function onEndGame(isSuccessful = false) {
console.log(isSuccessful)
    WebControl.enabled = false;
    pauseGame();
    // Si necesitas el tiempo restante, es user.time

    let score = game.score * 3;

    window.localStorage.removeItem('memory')
    window.localStorage.clear()

    const sessionScore = window.sessionStorage.getItem('score');
    sessionScore
        ? window.sessionStorage.setItem('score', parseInt(sessionScore) + score)
        : window.sessionStorage.setItem('score', score)

    Swal.fire({
        icon: isSuccessful ? 'success' : 'info',
        title: '¡Termino el juego!',
        text: isSuccessful? `Felicidades, tu puntuacion es de ${game.score * 3}`:  `Has perdido, tu puntuacion es de ${game.score * 3}`,
        // showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Proximo juego',
        cancelButtonText: `Repetir`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            window.location.assign('/src/rosco.html')
            console.log('Proximo juego')
        } else {
            console.log('Repetir')
            newGame();
        }
    })
}
