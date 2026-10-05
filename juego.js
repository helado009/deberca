// Posiciones e inicialización
let posicionX = 220; 
let posicionY = 0;   
let puntaje = 1250;
let monedas = 8;
let vidas = 3;               
let puedeRecibirDano = true; 
let estaSaltando = false;

// Estado de las manzanas animadas (para que solo se agarren una vez)
let manzanaIzqActiva = true;
let manzanaDerActiva = true;

// Escuchar los eventos del teclado
document.addEventListener('keydown', function(evento) {
    const personaje = document.getElementById('caperucita');
    const txtScore = document.getElementById('val-score');
    const txtCoins = document.getElementById('val-coins');
    const txtLives = document.getElementById('val-lives'); 

    // 1. CAMINAR A LA DERECHA
    if (evento.key === 'ArrowRight') {
        posicionX += 15;
    } 
    // 2. CAMINAR A LA IZQUIERDA
    else if (evento.key === 'ArrowLeft') {
        posicionX -= 15;
    }

    // 3. MECÁNICA DE SALTO REFORZADA (Barra Espaciadora)
    if (evento.key === ' ' || evento.key === 'Spacebar') {
        if (!estaSaltando) {
            estaSaltando = true;
            posicionY = 140; // Altura que sube Caperucita para alcanzar los troncos
            personaje.style.bottom = posicionY + 'px';

            // Chequear si agarra una manzana JUSTO en el momento que sube
            chequearManzanas(txtScore, txtCoins);

            // Caída automática normal después de un momento si el jugador no baja antes
            setTimeout(function() {
                if (estaSaltando && posicionY > 0) {
                    posicionY = 0;
                    personaje.style.bottom = posicionY + 'px';
                    estaSaltando = false;
                }
            }, 800);
        }
    }

    // 4. BAJAR RÁPIDO DESDE EL AIRE (Flecha de abajo)
    if (evento.key === 'ArrowDown') {
        if (estaSaltando) {
            posicionY = 0;
            personaje.style.bottom = posicionY + 'px';
            estaSaltando = false;
        }
    }

    // Límites de la pantalla para Caperucita
    if (posicionX < 0) posicionX = 0;
    if (posicionX > 500) posicionX = 500; 

    // Mover visualmente al personaje en la pantalla
    personaje.style.left = posicionX + 'px';

    // --- DAÑO CON EL CUERPO ESPÍN (Solo si estás caminando en el suelo) ---
    // El erizo está en left: 300px. Colisión exacta cuando Y es 0.
    if (posicionY === 0 && posicionX >= 240 && posicionX <= 290) {
        if (puedeRecibirDano && vidas > 0) {
            vidas -= 1;               
            txtLives.innerText = vidas; 

            // Caperucita parpadea transparente por el golpe
            personaje.style.opacity = "0.5";
            puedeRecibirDano = false;

            // Inmunidad de 1.5 segundos para escapar
            setTimeout(function() {
                puedeRecibirDano = true;
                personaje.style.opacity = "1"; 
            }, 1500);
        }

        if (vidas === 0) {
            alert("¡Game Over! Te quedaste sin vidas. Reinicia la página para volver a intentar.");
        }
    }
});

// FUNCIÓN APARTE PARA AGARRAR MANZANAS (Evita que cualquier otra tecla sume puntos)
function chequearManzanas(txtScore, txtCoins) {
    // Si salta debajo del Tronco Izquierdo
    if (posicionX >= 10 && posicionX <= 110 && manzanaIzqActiva) {
        manzanaIzqActiva = false;
        document.getElementById('manzana-izq').style.display = 'none'; // Borra el GIF
        puntaje += 100; 
        monedas += 1;   
        txtScore.innerText = puntaje;
        txtCoins.innerText = monedas < 10 ? '0' + monedas : monedas;
    }

    // Si salta debajo del Tronco Derecho
    if (posicionX >= 310 && posicionX <= 410 && manzanaDerActiva) {
        manzanaDerActiva = false;
        document.getElementById('manzana-der').style.display = 'none'; // Borra el GIF
        puntaje += 100;
        monedas += 1;
        txtScore.innerText = puntaje;
        txtCoins.innerText = monedas < 10 ? '0' + monedas : monedas;
    }
}
