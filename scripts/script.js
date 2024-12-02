let correctCount = 0;
let incorrectCount = 0;
let exercisesCompleted = 0;
const totalExercises = 10;
let timeLimit = 10;  // Límite de tiempo en segundos

// Elementos del DOM
const exerciseElement = document.getElementById('exercise');
const optionsContainer = document.getElementById('options-container');
const resultMessage = document.getElementById('result-message');
const timerBar = document.getElementById('timer-bar');  // Barra de progreso

// Función para iniciar el cuestionario
function startQuiz() {
    document.getElementById('welcome-screen').style.display = 'none'; // Ocultar pantalla de bienvenida
    document.getElementById('exercise-screen').style.display = 'block'; // Mostrar pantalla de ejercicios
    loadExercise(); // Cargar el primer ejercicio
}

// Función para cargar ejercicios desde JSON
let database = [];
function loadDatabase() {
    fetch('/data/exercises.json')
        .then(response => response.json())
        .then(data => {
            database = data;
            loadExercise();
        })
        .catch(error => console.error('Error cargando el archivo JSON:', error));
}

// Función para cargar un ejercicio
function loadExercise() {
    if (exercisesCompleted >= totalExercises) {
        showResults(); // Mostrar resultados si se completaron todos los ejercicios
        return;
    }

    const randomIndex = Math.floor(Math.random() * database.length);
    const exercise = database[randomIndex];

    // Mostrar la pregunta
    exerciseElement.textContent = exercise.question;

    // Mostrar las opciones
    optionsContainer.innerHTML = ''; // Limpiar opciones previas
    exercise.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option, exercise.correctAnswer);
        optionsContainer.appendChild(button);
    });

    // Limpiar el mensaje de resultado
    resultMessage.textContent = '';

    // Iniciar el temporizador
    startTimer(exercise); 
}

// Función para iniciar el temporizador
let timerInterval;
let progressInterval;
function startTimer(exercise) {
    let timeLeft = timeLimit;  // Tiempo restante en segundos

    // Asegurarnos de que el temporizador se reinicie correctamente
    if (timerInterval) {
        clearInterval(timerInterval);  // Limpiar cualquier temporizador previo
    }
    if (progressInterval) {
        clearInterval(progressInterval);  // Limpiar el intervalo de la barra de progreso
    }

    timerBar.style.width = '0%'; // Reiniciar el ancho de la barra de progreso

    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);  // Detener el temporizador
            resultMessage.textContent = 'Tiempo agotado, intenta el siguiente ejercicio.';
            resultMessage.style.color = 'red';
            incorrectCount++;  // Incrementar incorrecto por tiempo agotado
            exercisesCompleted++;
            setTimeout(loadExercise, 1000);  // Avanzar al siguiente ejercicio después de 1 segundo
        }
    }, 1000);

    // Intervalo para llenar la barra de progreso
    let width = 0;
    progressInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(progressInterval);  // Detener la barra de progreso
        } else {
            width++;
            timerBar.style.width = `${width}%`;  // Actualizar el ancho de la barra de progreso
        }
    }, 100);  // Actualización de la barra cada 100 ms
}

// Función para verificar la respuesta y cargar el siguiente ejercicio automáticamente
function checkAnswer(selectedOption, correctAnswer) {
    clearInterval(timerInterval);  // Detener el temporizador
    clearInterval(progressInterval);  // Detener la barra de progreso

    exercisesCompleted++;  // Incrementar contador de ejercicios completados

    if (selectedOption === correctAnswer) {
        correctCount++;
        resultMessage.textContent = '¡Correcto!';
        resultMessage.style.color = 'green';
    } else {
        incorrectCount++;
        resultMessage.textContent = 'Incorrecto.';
        resultMessage.style.color = 'red';
    }

    // Esperar unos segundos antes de cargar el siguiente ejercicio
    setTimeout(() => {
        if (exercisesCompleted < totalExercises) {
            loadExercise();
        } else {
            showResults(); // Mostrar resultados si se completaron todos los ejercicios
        }
    }, 1000); // Espera de 1 segundo para mostrar el mensaje antes de cargar el siguiente ejercicio
}

// Función para mostrar resultados finales
function showResults() {
    document.getElementById('exercise-screen').style.display = 'none'; // Ocultar pantalla de ejercicios
    document.getElementById('results-screen').style.display = 'block'; // Mostrar pantalla de resultados
    document.getElementById('correct-count').textContent = `Total de ejercicios correctos: ${correctCount}`;
    document.getElementById('incorrect-count').textContent = `Total de ejercicios incorrectos: ${incorrectCount}`;
}

// Función para reiniciar el cuestionario
function restartQuiz() {
    correctCount = 0;
    incorrectCount = 0;
    exercisesCompleted = 0;
    document.getElementById('results-screen').style.display = 'none'; // Ocultar pantalla de resultados
    document.getElementById('welcome-screen').style.display = 'block'; // Mostrar pantalla de bienvenida
}

// Cargar la base de datos al inicio
loadDatabase();







