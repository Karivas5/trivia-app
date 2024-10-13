const startGameButton = document.getElementById('start-game');
const triviaDiv = document.getElementById('trivia');
const scoreDiv = document.getElementById('score');
const restartButton = document.getElementById('restart');

let score = 0;
let currentQuestionIndex = 0;
let questions = [];

// Función para obtener preguntas de la API
async function fetchQuestions(category, difficulty, type) {
    const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`);
    const data = await response.json();
    questions = data.results;
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

// Función para mostrar la pregunta actual
function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        const questionHTML = `
            <h2>${decodeHtml(question.question)}</h2>
            ${generateAnswers(question)}
        `;
        triviaDiv.innerHTML = questionHTML;
    } else {
        triviaDiv.innerHTML = `<h2>¡Juego terminado! Tu puntaje es: ${score}</h2>`;
        scoreDiv.innerHTML = '';
        restartButton.style.display = 'block';
    }
}

// Función para generar respuestas
function generateAnswers(question) {
    const answers = question.incorrect_answers.map(answer => `<button class="btn btn-light m-1" onclick="checkAnswer('${answer}', false)">${decodeHtml(answer)}</button>`);
    answers.push(`<button class="btn btn-light m-1" onclick="checkAnswer('${question.correct_answer}', true)">${decodeHtml(question.correct_answer)}</button>`);
    return answers.join('');
}

// Función para verificar la respuesta
function checkAnswer(selectedAnswer, isCorrect) {
    if (isCorrect) {
        score += 100;
    }
    currentQuestionIndex++;
    showQuestion();
}

// Función para reiniciar la trivia
function restartGame() {
    score = 0;
    currentQuestionIndex = 0;
    scoreDiv.innerHTML = '';
    restartButton.style.display = 'none';
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;
    fetchQuestions(category, difficulty, type);
}

// Función para decodificar HTML
function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

// Eventos
startGameButton.addEventListener('click', () => {
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;
    fetchQuestions(category, difficulty, type);
});

restartButton.addEventListener('click', restartGame);

