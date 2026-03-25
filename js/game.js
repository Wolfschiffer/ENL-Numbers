// ============================================
// 1. CONFIGURAÇÕES GLOBAIS
// ============================================

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const FRAME_DELAY = isMobile ? 12 : 8;
const JUMP_SPEED = isMobile ? 0.012 : 0.015;
const HORIZONTAL_EASING = isMobile ? 0.12 : 0.15;

let lastFrameTime = 0;
const ANIMATION_INTERVAL = 1000 / 15; // 15 frames por segundo

const SOUND_EFFECTS = {
    correct: 'sfx/CorrectAnswer.mp3',
    wrong: 'sfx/IncorrectAnswer.mp3',
    win: 'sfx/Win.mp3',
    gameOver: 'sfx/GameOver.mp3'
};

const PLATFORM_POSITIONS = [100, 250, 400];

// ============================================
// 2. GERAÇÃO AUTOMÁTICA DOS NÚMEROS
// ============================================

function generateNumbers_21_99() {
    const numbers = [];
    const units = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    for (let t = 0; t < tens.length; t++) {
        for (let u = 0; u < units.length; u++) {
            numbers.push({
                value: (t + 2) * 10 + (u + 1),
                word: `${tens[t]}-${units[u]}`
            });
        }
    }
    return numbers;
}

function generateNumbers_101_999() {
    const numbers = [];
    const hundreds = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const units = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tensList = ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    for (let h = 0; h < hundreds.length; h++) {
        const hundredWord = `${hundreds[h]} hundred`;
        numbers.push({ value: (h + 1) * 100, word: hundredWord });
        
        for (let u = 0; u < units.length; u++) {
            const value = (h + 1) * 100 + (u + 1);
            const word = `${hundredWord} ${units[u]}`;
            numbers.push({ value, word });
        }
        
        for (let s = 0; s < 10; s++) {
            const specials = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 
                              'sixteen', 'seventeen', 'eighteen', 'nineteen'];
            const value = (h + 1) * 100 + 10 + s;
            const word = `${hundredWord} ${specials[s]}`;
            numbers.push({ value, word });
        }
        
        for (let t = 0; t < tensList.length; t++) {
            const tenWord = tensList[t];
            const tenValue = (t + 1) * 10;
            
            const valueTen = (h + 1) * 100 + tenValue;
            const wordTen = `${hundredWord} ${tenWord}`;
            numbers.push({ value: valueTen, word: wordTen });
            
            for (let u = 0; u < units.length; u++) {
                const value = (h + 1) * 100 + tenValue + (u + 1);
                const word = `${hundredWord} ${tenWord}-${units[u]}`;
                numbers.push({ value, word });
            }
        }
    }
    
    const unique = [];
    const seen = new Set();
    for (const num of numbers) {
        if (!seen.has(num.value)) {
            seen.add(num.value);
            unique.push(num);
        }
    }
    return unique;
}

function generateNumbers_1001_9999() {
    const numbers = [];
    const thousands = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const hundreds = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tensList = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const units = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 
                   'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    
    for (let th = 0; th < thousands.length; th++) {
        const thousandWord = `${thousands[th]} thousand`;
        numbers.push({ value: (th + 1) * 1000, word: thousandWord });
        
        for (let u = 0; u < units.length; u++) {
            const value = (th + 1) * 1000 + (u + 1);
            const word = `${thousandWord} ${units[u]}`;
            numbers.push({ value, word });
        }
        
        for (let s = 0; s < teens.length; s++) {
            const value = (th + 1) * 1000 + 10 + s;
            const word = `${thousandWord} ${teens[s]}`;
            numbers.push({ value, word });
        }
        
        for (let t = 0; t < tensList.length; t++) {
            const tenWord = tensList[t];
            const tenValue = (t + 2) * 10;
            
            const valueDezenaRedonda = (th + 1) * 1000 + tenValue;
            const wordDezenaRedonda = `${thousandWord} ${tenWord}`;
            numbers.push({ value: valueDezenaRedonda, word: wordDezenaRedonda });
            
            for (let u = 0; u < units.length; u++) {
                const value = (th + 1) * 1000 + tenValue + (u + 1);
                const word = `${thousandWord} ${tenWord}-${units[u]}`;
                numbers.push({ value, word });
            }
        }
        
        for (let h = 0; h < hundreds.length; h++) {
            const hundredWord = `${hundreds[h]} hundred`;
            const hundredValue = (h + 1) * 100;
            
            const valueCentenaRedonda = (th + 1) * 1000 + hundredValue;
            const wordCentenaRedonda = `${thousandWord} ${hundredWord}`;
            numbers.push({ value: valueCentenaRedonda, word: wordCentenaRedonda });
            
            for (let u = 0; u < units.length; u++) {
                const value = (th + 1) * 1000 + hundredValue + (u + 1);
                const word = `${thousandWord} ${hundredWord} ${units[u]}`;
                numbers.push({ value, word });
            }
            
            for (let s = 0; s < teens.length; s++) {
                const value = (th + 1) * 1000 + hundredValue + 10 + s;
                const word = `${thousandWord} ${hundredWord} ${teens[s]}`;
                numbers.push({ value, word });
            }
            
            for (let t = 0; t < tensList.length; t++) {
                const tenWord = tensList[t];
                const tenValue = (t + 2) * 10;
                
                const valueDezenaRedonda = (th + 1) * 1000 + hundredValue + tenValue;
                const wordDezenaRedonda = `${thousandWord} ${hundredWord} ${tenWord}`;
                numbers.push({ value: valueDezenaRedonda, word: wordDezenaRedonda });
                
                for (let u = 0; u < units.length; u++) {
                    const value = (th + 1) * 1000 + hundredValue + tenValue + (u + 1);
                    const word = `${thousandWord} ${hundredWord} ${tenWord}-${units[u]}`;
                    numbers.push({ value, word });
                }
            }
        }
    }
    
    const unique = [];
    const seen = new Set();
    for (const num of numbers) {
        if (!seen.has(num.value)) {
            seen.add(num.value);
            unique.push(num);
        }
    }
    return unique;
}

// ============================================
// 3. GAME DATA
// ============================================

const gameData = {
    numbers: [
        { value: 1, word: 'one' }, { value: 2, word: 'two' }, { value: 3, word: 'three' },
        { value: 4, word: 'four' }, { value: 5, word: 'five' }, { value: 6, word: 'six' },
        { value: 7, word: 'seven' }, { value: 8, word: 'eight' }, { value: 9, word: 'nine' },
        { value: 10, word: 'ten' }
    ],
    
    numbers11_20: [
        { value: 11, word: 'eleven' }, { value: 12, word: 'twelve' }, { value: 13, word: 'thirteen' },
        { value: 14, word: 'fourteen' }, { value: 15, word: 'fifteen' }, { value: 16, word: 'sixteen' },
        { value: 17, word: 'seventeen' }, { value: 18, word: 'eighteen' }, { value: 19, word: 'nineteen' },
        { value: 20, word: 'twenty' }
    ],
    
    tens: [
        { value: 10, word: 'ten' }, { value: 20, word: 'twenty' }, { value: 30, word: 'thirty' },
        { value: 40, word: 'forty' }, { value: 50, word: 'fifty' }, { value: 60, word: 'sixty' },
        { value: 70, word: 'seventy' }, { value: 80, word: 'eighty' }, { value: 90, word: 'ninety' },
        { value: 100, word: 'one hundred' }
    ],
    
    hundreds: [
        { value: 100, word: 'one hundred' }, { value: 200, word: 'two hundred' },
        { value: 300, word: 'three hundred' }, { value: 400, word: 'four hundred' },
        { value: 500, word: 'five hundred' }, { value: 600, word: 'six hundred' },
        { value: 700, word: 'seven hundred' }, { value: 800, word: 'eight hundred' },
        { value: 900, word: 'nine hundred' }, { value: 1000, word: 'one thousand' }
    ],
    
    random21_99: generateNumbers_21_99(),
    random101_999: generateNumbers_101_999(),
    random1001_9999: generateNumbers_1001_9999(),
    mixedAdvanced: []
};

function generateMixedAdvanced() {
    const categories = [
        gameData.random21_99, gameData.random101_999, gameData.random1001_9999,
        gameData.numbers, gameData.numbers11_20, gameData.tens, gameData.hundreds
    ];
    
    const mixed = [];
    for (let cat of categories) {
        const shuffled = [...cat];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        mixed.push(...shuffled.slice(0, 10));
    }
    
    for (let i = mixed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
    }
    return mixed;
}

gameData.mixedAdvanced = generateMixedAdvanced();

// ============================================
// 4. VARIÁVEIS DE ESTADO
// ============================================

let currentGame = 'numbers';
let currentNumbers = [];
let currentNumber = null;
let score = 0;
let highScores = {
    numbers: 0,
    numbers11_20: 0,
    tens: 0,
    hundreds: 0,
    random21_99: 0,
    random101_999: 0,
    random1001_9999: 0,
    mixedAdvanced: 0
};

let lives = 3, streak = 0, multiplier = 1, answered = false, availableNumbers = [];
let audioPlayer = null, isAudioMuted = false, gameActive = false, gameEnded = false;

// ============================================
// 5. EAGLE ANIMAÇÃO
// ============================================

let eagleX = 250, eagleY = 200, eagleTargetX = 250, isJumping = false, jumpProgress = 0, eagleDirection = -1;
let currentAnimation = 'idle', animationFrame = 0, frameCounter = 0, isAnimating = false;

// ============================================
// 6. TIMER
// ============================================

let startTime = null, endTime = null, timerInterval = null, currentTime = 0;

// ============================================
// 7. DOM ELEMENTS
// ============================================

const DOM = {
    menu: document.getElementById('menu-container'),
    game: document.getElementById('game-container'),
    canvas: document.getElementById('stickman-canvas'),
    ctx: document.getElementById('stickman-canvas')?.getContext('2d'),
    wordDisplay: document.getElementById('wordDisplay'),
    score: document.getElementById('score'),
    highScore: document.getElementById('highScore'),
    multiplier: document.getElementById('multiplier'),
    timer: document.getElementById('timer'),
    lives: document.getElementById('lives'),
    platforms: document.querySelectorAll('#game-platforms .platform'),
    speakerToggle: document.getElementById('speaker-toggle'),
    menuButton: document.getElementById('menu-button'),
    gameSubtitle: document.getElementById('game-subtitle'),
    startButton: document.getElementById('start-game-btn'),
    instructions: document.getElementById('main-instructions'),
    gameStats: document.getElementById('game-stats')
};

// ============================================
// 8. IMAGENS
// ============================================

let eagleImages = { idle: null, flap: [], celebrate: [], wrong: [] };
let menuEagleImage = null;

function loadImages() {
    console.log('Loading images...');
    
    eagleImages.idle = new Image();
    eagleImages.idle.src = 'images/eagle_idle_01.png';
    
    menuEagleImage = new Image();
    menuEagleImage.src = 'images/eagle_idle_01.png';
    menuEagleImage.onload = () => {
        const menuEagle = document.querySelector('.eagle-menu-icon');
        if (menuEagle) {
            menuEagle.innerHTML = '';
            const img = document.createElement('img');
            img.src = menuEagleImage.src;
            img.style.width = '144px';
            img.style.height = '120px';
            img.style.objectFit = 'contain';
            menuEagle.appendChild(img);
        }
    };
    
    for (let i = 1; i <= 18; i++) {
        const img = new Image();
        img.src = `images/flap_${i.toString().padStart(2, '0')}.png`;
        eagleImages.flap.push(img);
    }
    
    for (let i = 1; i <= 11; i++) {
        const img = new Image();
        img.src = `images/eagle_center_${i.toString().padStart(2, '0')}.png`;
        eagleImages.celebrate.push(img);
    }
    
    for (let i = 1; i <= 19; i++) {
        const img = new Image();
        img.src = `images/eagle_wrong_${i.toString().padStart(2, '0')}.png`;
        eagleImages.wrong.push(img);
    }
}

// ============================================
// 9. FUNÇÕES DE SCORE COM FIREBASE
// ============================================

function saveUserScoresToFirebase() {
    if (!window.currentUser || window.isGuest) return;
    
    const userScores = {
        numbers: highScores.numbers,
        numbers11_20: highScores.numbers11_20,
        tens: highScores.tens,
        hundreds: highScores.hundreds,
        random21_99: highScores.random21_99,
        random101_999: highScores.random101_999,
        random1001_9999: highScores.random1001_9999,
        mixedAdvanced: highScores.mixedAdvanced,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    db.collection('users').doc(window.currentUser.uid).collection('scores').doc('highScores').set(userScores)
        .then(() => console.log("✅ Scores saved to Firebase"))
        .catch(err => console.error("❌ Error saving scores:", err));
}

function loadUserScoresFromFirebase() {
    return new Promise((resolve, reject) => {
        if (!window.currentUser || window.isGuest) {
            resolve();
            return;
        }
        
        console.log("📥 Loading scores from Firebase for user:", window.currentUser.uid);
        
        db.collection('users').doc(window.currentUser.uid).collection('scores').doc('highScores').get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    highScores = {
                        numbers: data.numbers || 0,
                        numbers11_20: data.numbers11_20 || 0,
                        tens: data.tens || 0,
                        hundreds: data.hundreds || 0,
                        random21_99: data.random21_99 || 0,
                        random101_999: data.random101_999 || 0,
                        random1001_9999: data.random1001_9999 || 0,
                        mixedAdvanced: data.mixedAdvanced || 0
                    };
                    console.log("✅ Scores loaded from Firebase:", highScores);
                } else {
                    console.log("🆕 New user - scores are ZERO");
                }
                
                if (DOM.highScore) DOM.highScore.textContent = highScores[currentGame] || 0;
                resolve();
            })
            .catch(err => {
                console.error("❌ Error loading scores:", err);
                reject(err);
            });
    });
}

// ============================================
// 10. FUNÇÕES DO LEADERBOARD
// ============================================

function getGameModeName(gameMode) {
    const names = {
        'numbers': 'Numbers 1-10',
        'numbers11-20': 'Numbers 11-20',
        'tens': 'Tens',
        'hundreds': 'Hundreds',
        'random21_99': '21-99',
        'random101_999': '101-999',
        'random1001_9999': '1,001-9,999',
        'mixedAdvanced': 'Mixed Advanced'
    };
    return names[gameMode] || gameMode;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveToLeaderboard(gameMode, score, playerName) {
    if (!playerName || playerName.trim() === "") return;
    
    const leaderboardRef = db.collection('leaderboards').doc(gameMode).collection('scores');
    
    leaderboardRef.add({
        name: playerName.trim(),
        score: score,
        date: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log(`✅ Score ${score} saved to ${gameMode} leaderboard`);
    }).catch(err => {
        console.error("❌ Error saving to leaderboard:", err);
    });
}

async function loadLeaderboard(gameMode) {
    const leaderboardRef = db.collection('leaderboards').doc(gameMode).collection('scores');
    
    try {
        const snapshot = await leaderboardRef
            .orderBy('score', 'desc')
            .limit(20)
            .get();
        
        const scores = [];
        snapshot.forEach(doc => {
            scores.push(doc.data());
        });
        return scores;
    } catch (err) {
        console.error("❌ Error loading leaderboard:", err);
        return [];
    }
}

function showNameEntryModal(score, gameMode) {
    console.log("🎯 showNameEntryModal CHAMADA! Score:", score, "GameMode:", gameMode);
    
    // Remover modal existente
    const existingModal = document.querySelector('.name-entry-modal');
    if (existingModal) existingModal.remove();
    
    // Criar o modal
    const modal = document.createElement('div');
    modal.className = 'name-entry-modal';
    modal.style.zIndex = '10000';
    modal.innerHTML = `
        <div class="name-entry-content">
            <h3>🏆 NEW HIGH SCORE! 🏆</h3>
            <p>You scored <strong style="color:#c9a13b; font-size:1.2rem;">${score}</strong> points in <strong>${getGameModeName(gameMode)}</strong></p>
            <p>Enter your name for the global leaderboard:</p>
            <input type="text" id="player-name-input" class="name-input" placeholder="Your name" maxlength="20">
            <div class="name-entry-buttons">
                <button id="submit-name-btn" class="name-entry-btn submit">SUBMIT</button>
                <button id="skip-name-btn" class="name-entry-btn skip">SKIP</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log("✅ Modal adicionado ao DOM");
    
    // Focar no input
    setTimeout(() => {
        const nameInput = document.getElementById('player-name-input');
        if (nameInput) nameInput.focus();
    }, 100);
    
    // Botão Submit
    const submitBtn = document.getElementById('submit-name-btn');
    if (submitBtn) {
        submitBtn.onclick = () => {
            const name = document.getElementById('player-name-input')?.value;
            if (name && name.trim()) {
                console.log("💾 Salvando no leaderboard:", name, score, gameMode);
                saveToLeaderboard(gameMode, score, name);
            }
            modal.remove();
        };
    }
    
    // Botão Skip
    const skipBtn = document.getElementById('skip-name-btn');
    if (skipBtn) {
        skipBtn.onclick = () => {
            console.log("Usuário pulou o leaderboard");
            modal.remove();
        };
    }
    
    // Enter key
    const nameInput = document.getElementById('player-name-input');
    if (nameInput) {
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const name = e.target.value;
                if (name && name.trim()) {
                    console.log("💾 Salvando no leaderboard (Enter):", name, score, gameMode);
                    saveToLeaderboard(gameMode, score, name);
                }
                modal.remove();
            }
        });
    }
}

async function showLeaderboardModal() {
    const existingModal = document.querySelector('.leaderboard-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'leaderboard-modal';
    modal.innerHTML = `
        <div class="leaderboard-content">
            <div class="leaderboard-header">
                <h2>🏆 GLOBAL LEADERBOARDS</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="leaderboard-tabs" id="leaderboard-tabs"></div>
            <div id="leaderboard-list" class="leaderboard-list">
                <div class="leaderboard-empty">Loading...</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const gameModes = [
        { id: 'numbers', name: '1-10' },
        { id: 'numbers11-20', name: '11-20' },
        { id: 'tens', name: 'Tens' },
        { id: 'hundreds', name: '100s' },
        { id: 'random21_99', name: '21-99' },
        { id: 'random101_999', name: '101-999' },
        { id: 'random1001_9999', name: '1K-9K' },
        { id: 'mixedAdvanced', name: 'Mixed' }
    ];
    
    const tabsContainer = document.getElementById('leaderboard-tabs');
    gameModes.forEach((mode, index) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn' + (index === 0 ? ' active' : '');
        btn.textContent = mode.name;
        btn.dataset.mode = mode.id;
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadLeaderboardForMode(mode.id);
        };
        tabsContainer.appendChild(btn);
    });
    
    async function loadLeaderboardForMode(modeId) {
        const listContainer = document.getElementById('leaderboard-list');
        listContainer.innerHTML = '<div class="leaderboard-empty">Loading...</div>';
        
        const scores = await loadLeaderboard(modeId);
        
        if (scores.length === 0) {
            listContainer.innerHTML = '<div class="leaderboard-empty">No scores yet. Be the first!</div>';
            return;
        }
        
        listContainer.innerHTML = '';
        scores.forEach((score, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `
                <div class="leaderboard-rank">${index + 1}º</div>
                <div class="leaderboard-name">${escapeHtml(score.name)}</div>
                <div class="leaderboard-score">${score.score}</div>
            `;
            listContainer.appendChild(item);
        });
    }
    
    await loadLeaderboardForMode('numbers');
    
    modal.querySelector('.close-modal').onclick = () => modal.remove();
}

// ============================================
// 11. FUNÇÕES PRINCIPAIS DO JOGO
// ============================================

function initGame() {
    console.log('Game starting...');
    
    DOM.canvas.width = 500;
    DOM.canvas.height = 250;
    loadImages();
    audioPlayer = new Audio();
    
    DOM.menuButton?.addEventListener('click', showMenu);
    DOM.speakerToggle?.addEventListener('click', toggleAudio);
    DOM.startButton?.addEventListener('click', startGame);
    DOM.platforms.forEach(p => p.addEventListener('click', handlePlatformClick));
    
  const leaderboardBtn = document.getElementById('global-rankings-btn');
if (leaderboardBtn) {
    leaderboardBtn.addEventListener('click', () => {
        console.log("Botão Rankings clicado!");
        showLeaderboardModal(); // sua função que abre o modal
    });
}
    
    animate();
}

function animate() {
    updateEagle();
    drawEagle();
    requestAnimationFrame(animate);
}

function updateEagle() {
    const now = Date.now();
    const deltaTime = now - lastFrameTime;
    
    if (isJumping) {
        jumpProgress += JUMP_SPEED;
        if (jumpProgress >= 1) {
            eagleX = eagleTargetX;
            eagleY = 200;
            isJumping = false;
            jumpProgress = 0;
            startAnimation('celebrate');
        } else {
            eagleX += (eagleTargetX - eagleX) * HORIZONTAL_EASING;
            eagleY = 200 - 35 * Math.sin(jumpProgress * Math.PI);
            if (currentAnimation !== 'flap') startAnimation('flap');
        }
    }
    
    if (isAnimating && deltaTime >= ANIMATION_INTERVAL) {
        lastFrameTime = now;
        animationFrame++;
        
        if (currentAnimation === 'flap' && animationFrame >= eagleImages.flap.length) {
            animationFrame = 0;
        }
        else if (currentAnimation === 'celebrate' && animationFrame >= eagleImages.celebrate.length) {
            stopAnimation();
            if (!isJumping && gameActive && answered) nextRound();
        }
        else if (currentAnimation === 'wrong' && animationFrame >= eagleImages.wrong.length) {
            stopAnimation();
        }
    }
}

function drawEagle() {
    DOM.ctx.clearRect(0, 0, 500, 250);
    
    let img = eagleImages.idle;
    if (currentAnimation === 'flap' && eagleImages.flap[animationFrame]?.complete) img = eagleImages.flap[animationFrame];
    else if (currentAnimation === 'celebrate' && eagleImages.celebrate[animationFrame]?.complete) img = eagleImages.celebrate[animationFrame];
    else if (currentAnimation === 'wrong' && eagleImages.wrong[animationFrame]?.complete) img = eagleImages.wrong[animationFrame];
    
    if (img?.complete && img.naturalHeight > 0) {
        DOM.ctx.save();
        DOM.ctx.translate(eagleX, eagleY);
        if (eagleDirection === 1) DOM.ctx.scale(-1, 1);
        DOM.ctx.scale(1.2, 1);
        
        let size = currentAnimation === 'flap' ? 165 : 150;
        DOM.ctx.drawImage(img, -size/2, -size, size, size);
        DOM.ctx.restore();
    }
}

function startAnimation(type) { currentAnimation = type; animationFrame = 0; frameCounter = 0; isAnimating = true; }
function stopAnimation() { currentAnimation = 'idle'; animationFrame = 0; isAnimating = false; }
function jumpToPlatform(idx) { eagleTargetX = PLATFORM_POSITIONS[idx]; isJumping = true; jumpProgress = 0; eagleDirection = eagleTargetX > eagleX ? 1 : -1; }
function resetEagle() { eagleX = 250; eagleY = 200; isJumping = false; jumpProgress = 0; currentAnimation = 'idle'; animationFrame = 0; isAnimating = false; eagleDirection = -1; }

function handlePlatformClick(e) {
    const btn = e.currentTarget, idx = parseInt(btn.dataset.index);
    if (!gameActive || answered || !currentNumber) return;
    
    if (parseInt(btn.dataset.value) === currentNumber.value) {
        btn.classList.add('correct');
        streak++;
        multiplier = Math.min(streak, 5);
        score += 50 * multiplier;
        updateScore();
        updateMultiplier();
        updateHighScore();
        playSound('correct');
        
        answered = true;
        DOM.platforms.forEach(p => p.disabled = true);
        
        if (PLATFORM_POSITIONS[idx] === eagleX) startAnimation('celebrate');
        else jumpToPlatform(idx);
    } else {
        btn.classList.add('wrong');
        streak = 0;
        multiplier = 1;
        updateMultiplier();
        playSound('wrong');
        startAnimation('wrong');
        loseLife();
        setTimeout(() => btn.classList.remove('wrong'), 300);
    }
}

// ============================================
// 12. GAME FLOW FUNCTIONS
// ============================================

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        if (gameActive) {
            currentTime = Math.floor((Date.now() - startTime) / 1000);
            if (DOM.timer) {
                let mins = Math.floor(currentTime / 60);
                let secs = currentTime % 60;
                DOM.timer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
        }
    }, 100);
}

function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } endTime = currentTime; }

function updateMultiplier() { if (DOM.multiplier) DOM.multiplier.textContent = `${multiplier}x`; }
function updateScore() { if (DOM.score) DOM.score.textContent = score; }
function updateLives() {
    if (!DOM.lives) return;
    DOM.lives.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        let circle = document.createElement('span');
        circle.className = `life-circle ${i < lives ? 'full' : 'empty'}`;
        DOM.lives.appendChild(circle);
    }
}

function updateHighScore() {
    if (score > highScores[currentGame]) {
        highScores[currentGame] = score;
        
        if (window.currentUser && !window.isGuest) {
            saveUserScoresToFirebase();
        }
        
        if (DOM.highScore) DOM.highScore.textContent = score;
        
        const msg = document.createElement('div');
        msg.textContent = '🏆 NEW HIGH SCORE!';
        msg.style.position = 'fixed';
        msg.style.top = '50%';
        msg.style.left = '50%';
        msg.style.transform = 'translate(-50%, -50%)';
        msg.style.background = '#c9a13b';
        msg.style.color = '#1e3c5c';
        msg.style.padding = '1rem 2rem';
        msg.style.borderRadius = '50px';
        msg.style.fontWeight = 'bold';
        msg.style.zIndex = '1000';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    }
}

function playSound(type) { if (isAudioMuted) return; new Audio(SOUND_EFFECTS[type]).play().catch(() => {}); }

function playAudio() {
    if (!currentNumber || isAudioMuted || !gameActive) return;
    if (audioPlayer) { audioPlayer.pause(); audioPlayer.currentTime = 0; }
    
    let nomeArquivo = currentNumber.word.toLowerCase();
    console.log(`🔊 Tocando: ${nomeArquivo}.mp3`);
    audioPlayer.src = `audio/${nomeArquivo}.mp3`;
    
    audioPlayer.play().catch(() => {
        if ('speechSynthesis' in window) {
            let utter = new SpeechSynthesisUtterance(currentNumber.word);
            utter.lang = 'en-US';
            window.speechSynthesis.speak(utter);
        }
    });
}

function gameOver() {
    if (gameEnded) return;
    gameActive = false; gameEnded = true; stopTimer();
    playSound('gameOver');
    DOM.platforms.forEach(p => p.disabled = true);
    setTimeout(() => { if (DOM.wordDisplay) DOM.wordDisplay.textContent = 'GAME OVER'; addRestartButton(); }, 1000);
}

function winGame() {
    if (gameEnded) return;
    
    const bonus = calculateSpeedBonus();
    const bonusPoints = Math.round(score * (bonus - 1));
    const finalScore = score + bonusPoints;
    
    console.log("=== WIN GAME DEBUG ===");
    console.log("currentGame:", currentGame);
    console.log("finalScore:", finalScore);
    console.log("highScores:", highScores);
    console.log("highScores[currentGame]:", highScores[currentGame]);
    
    gameActive = false;
    gameEnded = true;
    stopTimer();
    playSound('win');
    
    DOM.platforms.forEach(p => p.disabled = true);
    
    // Verificar se o highScores[currentGame] existe
    const currentHighScore = highScores[currentGame] || 0;
    console.log("Comparando:", finalScore, ">", currentHighScore);
    
    if (finalScore > currentHighScore) {
        console.log("🏆 É novo recorde! Chamando showNameEntryModal...");
        highScores[currentGame] = finalScore;
        
        if (window.currentUser && !window.isGuest) {
            saveUserScoresToFirebase();
        }
        
        // Pequeno delay para garantir que a tela de vitória não atrapalhe
        setTimeout(() => {
            showNameEntryModal(finalScore, currentGame);
        }, 500);
    } else {
        console.log("❌ Não é novo recorde");
    }
    
    showWinWithBonus();
}

function loseLife() { if (lives > 0) { lives--; updateLives(); if (lives === 0) gameOver(); } }

function nextRound() {
    if (!gameActive) return;
    if (availableNumbers.length === 0) { winGame(); return; }
    
    const rand = Math.floor(Math.random() * availableNumbers.length);
    currentNumber = availableNumbers[rand];
    availableNumbers.splice(rand, 1);
    if (DOM.wordDisplay) DOM.wordDisplay.textContent = currentNumber.word;
    setupPlatforms();
    answered = false;
    currentAnimation = 'idle'; animationFrame = 0; isAnimating = false;
    DOM.platforms.forEach(p => { p.classList.remove('correct', 'wrong'); p.disabled = false; });
    setTimeout(playAudio, 100);
}

function setupPlatforms() {
    const correctValue = currentNumber.value;
    let options = [correctValue];
    let possibleValues = currentNumbers.map(n => n.value);
    
    while (options.length < 3) {
        const randomIndex = Math.floor(Math.random() * possibleValues.length);
        const randomValue = possibleValues[randomIndex];
        if (!options.includes(randomValue) && randomValue !== correctValue) {
            options.push(randomValue);
        }
    }
    
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    DOM.platforms.forEach((p, i) => {
        p.textContent = options[i];
        p.dataset.value = options[i];
    });
}

function calculateSpeedBonus() { return endTime <= 0 ? 1 : Math.min(5, Math.max(1, Math.round(5 * (15 / endTime) * 100) / 100)); }
function getTimeBonusTitle(bonus) {
    if (bonus >= 4.5) return "🏆 WORLD RECORD!";
    if (bonus >= 3.5) return "⚡ AMAZING!";
    if (bonus >= 2.5) return "🔥 GREAT!";
    if (bonus >= 1.8) return "✨ GOOD!";
    if (bonus >= 1.3) return "👍 DECENT!";
    return "👌 OKAY!";
}

function showWinWithBonus() {
    let bonus = calculateSpeedBonus();
    let bonusPoints = Math.round(score * (bonus - 1));
    let total = score + bonusPoints;
    let title = getTimeBonusTitle(bonus);
    
    let winScreen = document.createElement('div');
    winScreen.className = 'win-screen';
    winScreen.innerHTML = `
        <h2>🎉 YOU WIN! 🎉</h2>
        <div class="win-stats">
            <p class="time-title">${title}</p>
            <p>⏱️ Time: ${DOM.timer.textContent}</p>
            <p>💰 Base: ${score}</p>
            <p>⚡ Bonus: ${bonus}x</p>
            <p class="bonus-points">✨ +${bonusPoints}</p>
            <p class="total-score">🏆 TOTAL: ${total}</p>
        </div>
        <button class="restart-btn">PLAY AGAIN</button>
    `;
    
    if (total > highScores[currentGame]) {
        highScores[currentGame] = total;
        localStorage.setItem(`highScore_${currentGame}`, total);
        DOM.highScore.textContent = total;
        if (window.currentUser && !window.isGuest) saveUserScoresToFirebase();
    }
    
    DOM.game.appendChild(winScreen);
    winScreen.querySelector('.restart-btn').addEventListener('click', () => { winScreen.remove(); removeRestartButton(); showMenu(); });
}

function showMenu() {
    gameActive = false; stopTimer(); removeWinScreen(); removeRestartButton(); resetEagle();
    DOM.platforms.forEach(p => { p.textContent = '?'; p.disabled = true; p.classList.remove('correct', 'wrong'); });
    if (DOM.wordDisplay) DOM.wordDisplay.textContent = 'Ready?';
    if (DOM.instructions) DOM.instructions.textContent = '👆 Click START to begin';
    if (DOM.gameStats) DOM.gameStats.style.display = 'none';
    if (DOM.startButton) { DOM.startButton.style.display = 'block'; DOM.startButton.disabled = false; }
    DOM.game.classList.remove('game-active');
    DOM.menu.style.display = 'block';
    DOM.game.style.display = 'none';
}

function removeRestartButton() { document.querySelector('.restart-btn')?.remove(); }
function removeWinScreen() { document.querySelector('.win-screen')?.remove(); }
function addRestartButton() {
    removeRestartButton(); removeWinScreen();
    let btn = document.createElement('button');
    btn.className = 'restart-btn';
    btn.textContent = 'PLAY AGAIN';
    btn.addEventListener('click', () => { btn.remove(); showMenu(); });
    DOM.game.appendChild(btn);
}

function toggleAudio() {
    isAudioMuted = !isAudioMuted;
    if (DOM.speakerToggle) DOM.speakerToggle.textContent = isAudioMuted ? '🔇' : '🔊';
}

function resetGame() {
    const shuffled = [...currentNumbers];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    availableNumbers = shuffled.slice(0, 10);
    
    score = 0;
    lives = 3;
    streak = 0;
    multiplier = 1;
    gameEnded = false;
    answered = false;
    
    updateScore();
    updateMultiplier();
    updateLives();
    
    removeRestartButton();
    removeWinScreen();
    resetEagle();
    
    nextRound();
}

function startGame() {
    gameActive = true;
    DOM.game.classList.add('game-active');
    if (DOM.startButton) DOM.startButton.style.display = 'none';
    if (DOM.gameStats) DOM.gameStats.style.display = 'flex';
    if (DOM.instructions) DOM.instructions.textContent = '👆 Click the number';
    resetGame();
    startTimer();
}

// ============================================
// 13. SELEÇÃO DE JOGO
// ============================================

window.selectGame = function(gameType) {
    currentGame = gameType;
    
    const names = {
        'numbers': 'numbers 1-10',
        'numbers11-20': 'numbers 11-20',
        'tens': 'tens',
        'hundreds': 'hundreds',
        'random21_99': 'numbers 21-99',
        'random101_999': 'numbers 101-999',
        'random1001_9999': 'numbers 1,001-9,999',
        'mixedAdvanced': 'mixed advanced'
    };
    DOM.gameSubtitle.textContent = names[gameType] || 'numbers edition';
    
    const modeMap = {
        'numbers': gameData.numbers,
        'numbers11-20': gameData.numbers11_20,
        'tens': gameData.tens,
        'hundreds': gameData.hundreds,
        'random21_99': gameData.random21_99,
        'random101_999': gameData.random101_999,
        'random1001_9999': gameData.random1001_9999,
        'mixedAdvanced': gameData.mixedAdvanced
    };
    
    currentNumbers = modeMap[gameType] || gameData.numbers;
    
    const currentHighScore = highScores[gameType] || 0;
    DOM.highScore.textContent = currentHighScore;
    console.log(`📊 High score for ${gameType}: ${currentHighScore}`);
    
    gameActive = false;
    stopTimer();
    removeWinScreen();
    removeRestartButton();
    resetEagle();
    
    DOM.platforms.forEach(p => { p.textContent = '?'; p.disabled = true; p.classList.remove('correct', 'wrong'); });
    DOM.wordDisplay.textContent = 'Ready?';
    DOM.instructions.textContent = '👆 Click START to begin';
    DOM.gameStats.style.display = 'none';
    DOM.startButton.style.display = 'block';
    DOM.startButton.disabled = false;
    DOM.game.classList.remove('game-active');
    
    DOM.menu.style.display = 'none';
    DOM.game.style.display = 'block';
};

// ============================================
// 14. INICIAR O JOGO (AGUARDANDO FIREBASE)
// ============================================

let authInitialized = false;

function startGameAfterAuth() {
    if (authInitialized) return;
    authInitialized = true;
    
    console.log("Firebase ready, checking user...");
    
    firebase.auth().onAuthStateChanged((user) => {
        console.log("Auth state changed:", user ? user.email : "No user");
        
        highScores = {
            numbers: 0,
            numbers11_20: 0,
            tens: 0,
            hundreds: 0,
            random21_99: 0,
            random101_999: 0,
            random1001_9999: 0,
            mixedAdvanced: 0
        };
        
        if (user) {
            window.currentUser = user;
            window.isGuest = false;
            console.log(`👤 User logged in: ${user.uid}`);
            
            loadUserScoresFromFirebase().then(() => {
                console.log("Scores loaded, starting game...");
                initGame();
            }).catch(() => {
                initGame();
            });
        } else {
            window.currentUser = null;
            window.isGuest = false;
            console.log("👤 No user logged in");
            initGame();
        }
    });
}

if (typeof firebase !== 'undefined') {
    startGameAfterAuth();
} else {
    window.addEventListener('load', () => {
        if (typeof firebase !== 'undefined') {
            startGameAfterAuth();
        }
    });
}