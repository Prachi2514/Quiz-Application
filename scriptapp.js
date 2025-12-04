// ==================== script.js ====================
const quizData = [
    {
        id: 1,
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
        correctAnswer: 0,
        category: 'Web Development'
    },
    {
        id: 2,
        question: 'Which CSS property is used to change text color?',
        options: ['text-color', 'font-color', 'color', 'text-style'],
        correctAnswer: 2,
        category: 'Web Development'
    },
    {
        id: 3,
        question: 'What is the correct syntax for referring to an external JavaScript file?',
        options: ['&lt;script href="app.js"&gt;','&lt;script name="app.js"&gt;','&lt;script src="app.js"&gt;','&lt;script file="app.js"&gt;'],
        correctAnswer: 2,
        category: 'Web Development'
    },
    {
        id: 4,
        question: 'Which method is used to add an element at the end of an array in JavaScript?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 0,
        category: 'JavaScript'
    },
    {
        id: 5,
        question: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 1,
        category: 'Web Development'
    },
    {
        id: 6,
        question: 'Which HTML tag is used to define an internal style sheet?',
        options: ['&lt;style&gt;','&lt;css&gt;','&lt;script&gt;','&lt;styles&gt;'],
        correctAnswer: 0,
        category: 'Web Development'
    },

    {
        id: 7,
        question: 'What is the purpose of the "alt" attribute in <img> tag?',
        options: ['Alternative text if image fails to load', 'Align the image', 'Add a link to image', 'Change image size'],
        correctAnswer: 0,
        category: 'Web Development'
    },
    {
        id: 8,
        question: 'Which operator is used to assign a value to a variable in JavaScript?',
        options: ['*', '=', '-', 'x'],
        correctAnswer: 1,
        category: 'JavaScript'
    },
    {
        id: 9,
        question: 'How do you create a function in JavaScript?',
        options: ['function:myFunction()', 'function = myFunction()', 'function myFunction()', 'create myFunction()'],
        correctAnswer: 2,
        category: 'JavaScript'
    },
    {
        id: 10,
        question: 'Which event occurs when the user clicks on an HTML element?',
        options: ['onchange', 'onmouseclick', 'onclick', 'onmouseover'],
        correctAnswer: 2,
        category: 'JavaScript'
    }
];

let currentQuestionIndex = 0;
let selectedAnswer = null;
let userAnswers = [];
let score = 0;
let timeLeft = 300; // 5 minutes
let timerInterval;

function startQuiz() {
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    currentQuestionIndex = 0;
    selectedAnswer = null;
    userAnswers = [];
    score = 0;
    timeLeft = 300;
    loadQuestion();
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function loadQuestion() {
    const question = quizData[currentQuestionIndex];
    document.getElementById('category').textContent = question.category;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = quizData.length;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (selectedAnswer === index) {
            optionDiv.classList.add('selected');
        }
        optionDiv.onclick = () => selectAnswer(index);
        optionDiv.innerHTML = `
            <div class="option-radio"></div>
            <div class="option-text">${option}</div>
        `;
        optionsContainer.appendChild(optionDiv);
    });

    updateProgress();
    updateButtons();
}

function selectAnswer(index) {
    selectedAnswer = index;
    const options = document.querySelectorAll('.option');
    options.forEach((opt, i) => {
        if (i === index) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    updateButtons();
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.disabled = currentQuestionIndex === 0;

    if (currentQuestionIndex === quizData.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        submitBtn.disabled = selectedAnswer === null;
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
        nextBtn.disabled = selectedAnswer === null;
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        saveAnswer();
        currentQuestionIndex--;
        selectedAnswer = userAnswers[currentQuestionIndex]?.selectedAnswer ?? null;
        loadQuestion();
    }
}

function nextQuestion() {
    if (selectedAnswer !== null) {
        saveAnswer();
        currentQuestionIndex++;
        selectedAnswer = userAnswers[currentQuestionIndex]?.selectedAnswer ?? null;
        loadQuestion();
    }
}

function saveAnswer() {
    const isCorrect = selectedAnswer === quizData[currentQuestionIndex].correctAnswer;
    userAnswers[currentQuestionIndex] = {
        questionId: quizData[currentQuestionIndex].id,
        selectedAnswer: selectedAnswer,
        isCorrect: isCorrect
    };
}

function submitQuiz() {
    if (selectedAnswer !== null) {
        saveAnswer();
    }
    clearInterval(timerInterval);
    calculateScore();
    showResults();
}

function calculateScore() {
    score = 0;
    userAnswers.forEach(answer => {
        if (answer && answer.isCorrect) {
            score++;
        }
    });
}

function showResults() {
    document.getElementById('quizScreen').classList.add('hidden');
    document.getElementById('resultsScreen').classList.remove('hidden');

    const percentage = Math.round((score / quizData.length) * 100);
    
    document.getElementById('correctScore').textContent = score;
    document.getElementById('wrongScore').textContent = quizData.length - score;
    document.getElementById('percentageScore').textContent = percentage + '%';

    const performanceMessage = document.getElementById('performanceMessage');
    const resultIcon = document.getElementById('resultIcon');

    if (percentage >= 70) {
        performanceMessage.className = 'performance-message excellent';
        performanceMessage.textContent = '🎉 Excellent! You did great!';
        resultIcon.textContent = '🏆';
    } else if (percentage >= 50) {
        performanceMessage.className = 'performance-message good';
        performanceMessage.textContent = '👍 Good effort! Keep practicing!';
        resultIcon.textContent = '🥈';
    } else {
        performanceMessage.className = 'performance-message retry';
        performanceMessage.textContent = '💪 Don\'t give up! Try again!';
        resultIcon.textContent = '📚';
    }

    displayReview();
}

function displayReview() {
    const reviewContainer = document.getElementById('reviewContainer');
    reviewContainer.innerHTML = '';

    quizData.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer?.isCorrect;

        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${isCorrect ? 'correct' : 'wrong'}`;
        
        const icon = isCorrect ? '✓' : '✗';
        
        let answerText = userAnswer ? question.options[userAnswer.selectedAnswer] : 'Not answered';
        let correctAnswerText = '';
        
        if (!isCorrect) {
            correctAnswerText = `<div class="correct-answer"><strong>Correct answer: </strong>${question.options[question.correctAnswer]}</div>`;
        }

        reviewItem.innerHTML = `
            <div class="review-question">
                <span class="review-icon">${icon}</span>
                <div>
                    <div class="review-question-text">Q${index + 1}. ${question.question}</div>
                    <div class="review-answer">
                        <strong>Your answer: </strong>${answerText}
                        ${correctAnswerText}
                    </div>
                </div>
            </div>
        `;
        
        reviewContainer.appendChild(reviewItem);
    });
}

function restartQuiz() {
    document.getElementById('resultsScreen').classList.add('hidden');
    document.getElementById('welcomeScreen').classList.remove('hidden');
    currentQuestionIndex = 0;
    selectedAnswer = null;
    userAnswers = [];
    score = 0;
    timeLeft = 300;
}
