document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const textDisplay = document.getElementById('textDisplay');
    const textInput = document.getElementById('textInput');
    const startBtn = document.getElementById('startTest');
    const resetBtn = document.getElementById('resetTest');
    const timerEl = document.getElementById('timer');
    const resultsEl = document.getElementById('results');
    const wpmEl = document.getElementById('wpm');
    const accEl = document.getElementById('accuracy');
    const rawEl = document.getElementById('raw');
    const charsEl = document.getElementById('chars');
    const errorsEl = document.getElementById('errors');

    // Test variables
    let timer;
    let timeLeft = 30;
    let isRunning = false;
    let startTime;
    let correct = 0;
    let total = 0;
    let errors = 0;
    let currentText = '';
    let currentPos = 0;
    let typedCorrectly = []; // Track correctness of each typed character

    // Sample texts
    const texts = [
        "The quick brown fox jumps over the lazy dog. This classic sentence contains all letters of the English alphabet. Typing is an essential skill in today's digital world where communication happens mostly through written words.",
        "Programming computers requires logical thinking and problem-solving skills. JavaScript is one of the core technologies of the World Wide Web, alongside HTML and CSS. Over 97% of websites use JavaScript on the client side.",
        "Practice makes perfect when it comes to developing any skill, including typing. Consistent practice helps build muscle memory in your fingers, allowing you to type without looking at the keyboard. The average typing speed is about 40 words per minute.",
        "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them. This famous soliloquy explores life's big questions.",
        "The history of computing spans thousands of years, from early counting devices like the abacus to modern supercomputers. The first electronic computers were developed in the mid-20th century and filled entire rooms. Today's devices are millions of times more powerful."
    ];

    // Initialize
    resetTest();

    // Event listeners
    startBtn.addEventListener('click', startTest);
    resetBtn.addEventListener('click', resetTest);
    textInput.addEventListener('input', checkTyping);

    function startTest() {
        if (isRunning) return;
        
        isRunning = true;
        startBtn.disabled = true;
        resetBtn.disabled = false;
        textInput.disabled = false;
        textInput.value = '';
        textInput.focus();
        
        currentText = texts[Math.floor(Math.random() * texts.length)];
        displayText();
        
        timeLeft = 30;
        currentPos = 0;
        correct = 0;
        total = 0;
        errors = 0;
        typedCorrectly = [];
        startTime = new Date();
        
        timerEl.textContent = `${timeLeft}s`;
        resultsEl.style.display = 'none';
        
        timer = setInterval(updateTimer, 1000);
    }

    function resetTest() {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        resetBtn.disabled = true;
        textInput.disabled = true;
        textInput.value = '';
        timeLeft = 30;
        currentPos = 0;
        typedCorrectly = [];
        
        textDisplay.innerHTML = "Click 'Start Test' to begin. You'll have 30 seconds to type the text that appears here.";
        timerEl.textContent = `${timeLeft}s`;
        resultsEl.style.display = 'none';
    }

    function updateTimer() {
        timeLeft--;
        timerEl.textContent = `${timeLeft}s`;
        
        if (timeLeft <= 0) {
            endTest();
        }
    }

    function endTest() {
        clearInterval(timer);
        isRunning = false;
        const endTime = new Date();
        textInput.disabled = true;
        
        const minutes = (endTime - startTime) / 60000 || 0.001; // Prevent division by zero
        const wpm = Math.round((correct / 5) / minutes);
        const raw = Math.round((total / 5) / minutes);
        const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        // Store results in localStorage
        const results = {
            wpm: wpm,
            accuracy: acc,
            raw: raw,
            correct: correct,
            errors: errors,
            total: total
        };
        localStorage.setItem('typingTestResults', JSON.stringify(results));
        
        // Redirect to results page
        window.location.href = 'results.html';
    }

    function checkTyping() {
        if (!isRunning) return;
        
        const input = textInput.value;
        
        // Handle backspace
        if (input.length < currentPos) {
            if (currentPos > 0) {
                if (typedCorrectly[currentPos - 1]) {
                    correct--;
                } else {
                    errors--;
                }
                total--;
                currentPos--;
                typedCorrectly.pop();
            }
            displayText();
            return;
        }
        
        // Check character
        const char = input[input.length - 1];
        const isCorrect = char === currentText[currentPos];
        if (isCorrect) {
            correct++;
        } else {
            errors++;
        }
        total++;
        typedCorrectly.push(isCorrect);
        currentPos++;
        
        displayText();
    }

    function displayText() {
        let html = '';
        
        // Typed characters
        for (let i = 0; i < currentPos; i++) {
            const char = currentText[i];
            const inputChar = i < textInput.value.length ? textInput.value[i] : '';
            
            if (char === inputChar) {
                html += `<span class="correct">${char}</span>`;
            } else {
                html += `<span class="incorrect">${char}</span>`;
            }
        }
        
        // Current character
        if (currentPos < currentText.length) {
            html += `<span class="current">${currentText[currentPos]}</span>`;
            html += currentText.substring(currentPos + 1);
        }
        
        textDisplay.innerHTML = html;
        
        // Scroll to current position
        const currentSpan = textDisplay.querySelector('.current');
        if (currentSpan) {
            currentSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});