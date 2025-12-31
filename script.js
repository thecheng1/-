const state = {
    players: [
        { id: 0, name: "老殘", color: "bg-red-500", money: 1000, position: 0, stopped: 0 },
        { id: 1, name: "鐵鉉", color: "bg-blue-500", money: 1000, position: 0, stopped: 0 },
        { id: 2, name: "杜甫", color: "bg-yellow-500", money: 1000, position: 0, stopped: 0 },
        { id: 3, name: "黃花", color: "bg-purple-500", money: 1000, position: 0, stopped: 0 }
    ],
    currentPlayerIndex: 0,
    properties: {}, // Map location ID to player ID
    isMoving: false,
    audioEnabled: true,
    usedQuestionIndices: []
};

const UI = {
    board: document.getElementById('nodes-container'),
    playersContainer: document.getElementById('players-container'),
    turnIndicator: document.getElementById('turn-indicator'),
    // diceResult: document.getElementById('dice-result'), // Removed
    rollBtn: document.getElementById('roll-btn'),
    message: document.getElementById('message-display'),
    soundBtn: document.getElementById('sound-btn'),
    modal: {
        overlay: document.getElementById('modal-overlay'),
        title: document.getElementById('modal-title'),
        content: document.getElementById('modal-content'),
        options: document.getElementById('modal-options'),
        close: document.getElementById('modal-close')
    }
};

const SoundManager = {
    ctx: null,

    init: function () {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playTone: function (freq, type, duration, vol = 0.1) {
        if (!state.audioEnabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    playDice: function () {
        if (!state.audioEnabled) return;
        this.init();
        for (let i = 0; i < 10; i++) {
            setTimeout(() => this.playTone(200 + Math.random() * 100, 'square', 0.05, 0.05), i * 80);
        }
    },

    playMove: function () {
        this.init();
        this.playTone(300, 'sine', 0.1, 0.05);
    },

    playGood: function () {
        if (!state.audioEnabled) return;
        this.init();
        setTimeout(() => this.playTone(523.25, 'sine', 0.3), 0); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.3), 100); // E5
        setTimeout(() => this.playTone(783.99, 'sine', 0.4), 200); // G5
    },

    playBad: function () {
        if (!state.audioEnabled) return;
        this.init();
        this.playTone(150, 'sawtooth', 0.5, 0.1);
        setTimeout(() => this.playTone(140, 'sawtooth', 0.5, 0.1), 200);
    },

    playPurchase: function () {
        if (!state.audioEnabled) return;
        this.init();
        this.playTone(1200, 'sine', 0.1, 0.1);
        setTimeout(() => this.playTone(2000, 'sine', 0.4, 0.05), 50);
    },

    toggle: function () {
        state.audioEnabled = !state.audioEnabled;
        if (UI.soundBtn) UI.soundBtn.textContent = state.audioEnabled ? "🔊" : "🔇";
        if (state.audioEnabled) this.init();
    }
};

let NODE_COORDS = [];

function generateLayout() {
    const total = GAME_DATA.locations.length;
    NODE_COORDS = [];

    // Oval layout
    const cx = 50;
    const cy = 50;
    const rx = 42;
    const ry = 42;

    // Start from Bottom Right (approx 45 deg or PI/4) to match typical board games or Bottom (PI/2)
    // Let's start from Bottom-Right corner area (45 deg) and go Clockwise?
    // Actually, let's start Bottom (90 deg) and go Clockwise to match index 0
    const startAngle = Math.PI / 2;

    for (let i = 0; i < total; i++) {
        const angle = startAngle + (i / total) * (2 * Math.PI);
        const x = cx + rx * Math.cos(angle);
        const y = cy + ry * Math.sin(angle);
        NODE_COORDS.push({ x, y });
    }
}

function initGame() {
    generateLayout();
    renderBoard();
    renderPlayers();
    updatePlayerStats();

    UI.rollBtn.addEventListener('click', handleRollDice);
    UI.modal.close.addEventListener('click', closeModal);
    if (UI.soundBtn) {
        UI.soundBtn.addEventListener('click', () => SoundManager.toggle());
    }

    // Init audio context on first interaction
    document.body.addEventListener('click', () => {
        SoundManager.init();
    }, { once: true });
}

function renderBoard() {
    UI.board.innerHTML = '';
    GAME_DATA.locations.forEach((loc, index) => {
        const node = document.createElement('div');
        const coords = NODE_COORDS[index];
        node.className = 'node-spot absolute w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-xs md:text-sm text-center font-bold rounded-full cursor-help transition-all transform -translate-x-1/2 -translate-y-1/2 bg-white/90 border-2 border-gray-300';
        node.style.left = `${coords.x}%`;
        node.style.top = `${coords.y}%`;

        // Color coding
        if (loc.type === 'start') node.className += ' ring-4 ring-green-300 bg-green-50';
        if (loc.type === 'property') node.className += ' ring-2 ring-orange-200';
        if (loc.type === 'chance') node.className += ' ring-2 ring-purple-200 bg-purple-50';
        if (loc.type === 'view') node.className += ' ring-2 ring-blue-200 bg-blue-50';

        node.innerHTML = `<div class="pointer-events-none p-1 leading-tight text-[0.7rem] md:text-xs">${loc.name}</div>`;
        node.title = loc.description;

        UI.board.appendChild(node);
    });
}

function renderPlayers() {
    UI.playersContainer.innerHTML = '';
    state.players.forEach((player, index) => {
        const token = document.createElement('div');
        token.id = `player-token-${index}`;
        token.className = `token-marker absolute w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white font-bold z-20 transition-all duration-300 ease-linear -translate-x-1/2 -translate-y-1/2 ${player.color}`;
        token.textContent = index + 1;
        updatePlayerPositionUI(index);
        UI.playersContainer.appendChild(token);
    });
}

function updatePlayerPositionUI(playerIndex) {
    const player = state.players[playerIndex];
    if (!NODE_COORDS[player.position]) return;

    const coords = NODE_COORDS[player.position];
    const token = document.getElementById(`player-token-${playerIndex}`);

    if (token) {
        token.style.left = `${coords.x}%`;
        token.style.top = `${coords.y}%`;
        // Spread offset
        token.style.transform = `translate(-50%, -50%) translate(${playerIndex * 6 - 9}px, ${playerIndex * 6 - 9}px)`;
    }
}

function updatePlayerStats() {
    document.querySelectorAll('.player-card').forEach(c => c.classList.remove('active-player', 'border-l-8'));
    document.querySelectorAll('.token-marker').forEach(t => t.classList.remove('active-turn'));

    state.players.forEach((p, i) => {
        const moneyEl = document.getElementById(`p${i + 1}-money`);
        const currentMoney = parseInt(moneyEl.innerText.replace(/[^0-9-]/g, '')) || 0;
        if (currentMoney !== p.money) {
            moneyEl.parentElement.classList.add('money-change');
            setTimeout(() => moneyEl.parentElement.classList.remove('money-change'), 500);
        }
        moneyEl.textContent = p.money;
    });

    const currentPlayer = state.players[state.currentPlayerIndex];
    const activeCard = document.getElementById(`p${state.currentPlayerIndex + 1}-card`);
    if (activeCard) activeCard.classList.add('active-player', 'border-l-8');

    const activeToken = document.getElementById(`player-token-${state.currentPlayerIndex}`);
    if (activeToken) activeToken.classList.add('active-turn');

    UI.turnIndicator.textContent = `輪到：${currentPlayer.name}`;
    UI.turnIndicator.className = `text-2xl font-bold mb-4 font-calligraphy ${currentPlayer.color.replace('bg-', 'text-')}`;
}

async function handleRollDice() {
    if (state.isMoving) return;
    state.isMoving = true;
    UI.rollBtn.disabled = true;
    UI.rollBtn.classList.add('opacity-50', 'cursor-not-allowed');

    // UI.diceResult.classList.add('rolling'); // Old
    const diceEl = document.getElementById('dice');
    if (diceEl) {
        diceEl.classList.add('rolling');
        diceEl.className = 'dice-3d rolling'; // Reset classes
    }

    SoundManager.playDice();

    // Determine result ahead of time or random?
    // Let's decide now
    const steps = Math.floor(Math.random() * 6) + 1;

    // Wait for animation
    await new Promise(r => setTimeout(r, 1000));

    if (diceEl) {
        diceEl.classList.remove('rolling');
        // Add show-X class
        diceEl.className = `dice-3d show-${steps}`;
    }

    finalizeMove(steps);
}

async function finalizeMove(steps) {
    if (!steps) steps = Math.floor(Math.random() * 6) + 1; // Fallback

    // UI.diceResult.textContent = steps; // Old
    UI.message.textContent = `${state.players[state.currentPlayerIndex].name} 擲出了 ${steps} 點！`;

    const player = state.players[state.currentPlayerIndex];

    for (let i = 0; i < steps; i++) {
        player.position = (player.position + 1) % GAME_DATA.locations.length;
        updatePlayerPositionUI(state.currentPlayerIndex);
        SoundManager.playMove();
        await new Promise(r => setTimeout(r, 400));
    }

    handleLanding();
}

function handleLanding() {
    const player = state.players[state.currentPlayerIndex];
    const location = GAME_DATA.locations[player.position];

    UI.message.textContent = `${player.name} 到了 ${location.name}`;

    if (location.type === 'property' || location.type === 'view') {
        handleProperty(location);
    } else if (location.type === 'chance') {
        handleChance();
    } else if (location.type === 'start') {
        SoundManager.playGood();
        endTurn();
    } else {
        endTurn();
    }
}

function handleProperty(location) {
    const player = state.players[state.currentPlayerIndex];
    const ownerId = state.properties[location.id];

    if (ownerId === undefined) {
        if (player.money >= location.price) {
            showModal('購買景點/地產',
                `<div class="text-center"><div class="font-bold text-xl mb-2">${location.name}</div>${location.description}<div class="mt-4 p-4 bg-yellow-50 rounded-lg"><div>價格: <span class="text-red-600 font-bold">$${location.price}</span></div><div>過路費: $${location.rent}</div></div></div>`,
                [
                    {
                        text: '購買/贊助', action: () => {
                            closeModal();
                            setTimeout(() => {
                                askQuestion(() => buyProperty(location));
                            }, 300);
                        }
                    },
                    { text: '放棄', action: () => endTurn() }
                ]
            );
        } else {
            SoundManager.playBad();
            UI.message.textContent = "錢不夠，無法購買。";
            setTimeout(endTurn, 1500);
        }
    } else if (ownerId !== player.id) {
        SoundManager.playBad();
        const owner = state.players[ownerId];
        const rent = location.rent;
        player.money -= rent;
        owner.money += rent;
        UI.message.textContent = `支付給 ${owner.name} 過路費 $${rent}`;
        updatePlayerStats();
        setTimeout(endTurn, 1500);
    } else {
        UI.message.textContent = "這是你自己的地盤，休息一下。";
        setTimeout(endTurn, 1500);
    }
}

function buyProperty(location) {
    const player = state.players[state.currentPlayerIndex];
    player.money -= location.price;
    state.properties[location.id] = player.id;
    updatePlayerStats();
    SoundManager.playPurchase();

    const node = UI.board.children[location.id];
    let borderColor = 'gray';
    if (player.id === 0) borderColor = '#ef4444';
    if (player.id === 1) borderColor = '#3b82f6';
    if (player.id === 2) borderColor = '#eab308';
    if (player.id === 3) borderColor = '#a855f7';

    node.style.borderColor = borderColor;
    node.style.borderWidth = '4px';
    node.style.boxShadow = `0 0 10px ${borderColor}`;

    closeModal();

    // High chance for question removed as requested (moved to pre-purchase)
    endTurn();
}

function handleChance() {
    SoundManager.playGood();
    const isDestiny = Math.random() > 0.5;
    const deck = isDestiny ? GAME_DATA.destinyCards : GAME_DATA.chanceCards;
    const card = deck[Math.floor(Math.random() * deck.length)];

    showModal(isDestiny ? '命運' : '機會',
        `<div class="text-center text-xl font-bold py-4">${card.text}</div>`,
        [{ text: '確定', action: () => applyCardEffect(card) }]
    );
}

function applyCardEffect(card) {
    const player = state.players[state.currentPlayerIndex];

    if (card.effect === 'money') {
        player.money += card.value;
        if (card.value > 0) SoundManager.playGood();
        else SoundManager.playBad();
    } else if (card.effect === 'skip_turn') {
        player.stopped = card.value;
        SoundManager.playBad();
    } else if (card.effect === 'teleport') {
        player.position = 0;
        updatePlayerPositionUI(state.currentPlayerIndex);
        SoundManager.playMove();
    } else if (card.effect === 'roll_again') {
        closeModal();
        SoundManager.playGood();
        state.isMoving = false;
        UI.rollBtn.disabled = false;
        UI.rollBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        updatePlayerStats();
        return;
    } else if (card.effect === 'stop') {
        player.stopped = card.value;
        SoundManager.playBad();
    }

    updatePlayerStats();
    closeModal();
    endTurn();
}

function askQuestion(onSuccess = null) {
    const totalQuestions = GAME_DATA.questions.length;
    let availableIndices = [];

    // Find unused indices
    for (let i = 0; i < totalQuestions; i++) {
        if (!state.usedQuestionIndices.includes(i)) {
            availableIndices.push(i);
        }
    }

    // Reset if all used
    if (availableIndices.length === 0) {
        state.usedQuestionIndices = [];
        for (let i = 0; i < totalQuestions; i++) availableIndices.push(i);
    }

    // Pick random from available
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const qIndex = availableIndices[randomIndex];

    // Mark as used
    state.usedQuestionIndices.push(qIndex);

    const qData = GAME_DATA.questions[qIndex];

    UI.modal.overlay.classList.remove('hidden');
    UI.modal.title.textContent = '國語文問答挑戰';
    UI.modal.content.innerHTML = `<div class="font-bold text-xl text-center mb-4">${qData.q}</div>`;
    UI.modal.options.innerHTML = '';

    qData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn w-full text-left p-4 rounded-lg font-bold text-lg mb-2 hover:bg-lake-blue hover:text-white transition-colors';
        btn.innerHTML = `<span class="mr-2 opacity-50">${String.fromCharCode(65 + index)}.</span> ${opt}`;
        btn.onclick = () => {
            UI.modal.options.innerHTML = '';
            // Check answer (safeguard for index mismatch if any)
            const isCorrect = (index === qData.answer) || (index === qData.answer - 1 && qData.answer > 4);
            // Logic simplified: assume data.js answer is 0-based index or 1-based?
            // Based on previous data.js review, it uses 0-based or 1-based inconsistently in my check?
            // Let's re-verify data.js visually in mind: Answer: 0, 1, 2... these look like 0-based indices.
            // EXCEPT "answer: 1" for options where index 1 is correct.
            // Let's use exact match.

            checkAnswer(index, qData.answer, qData.explanation, onSuccess);
        };
        UI.modal.options.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, correctIndex, explanation, onSuccess) {
    if (selectedIndex === correctIndex) {
        SoundManager.playGood();

        if (onSuccess) {
            UI.modal.content.innerHTML = `<div><div class="text-green-600 font-bold text-2xl text-center mb-4">答對了！</div><div class="bg-green-50 p-4 rounded">${explanation}</div><br><div class="text-center font-bold text-xl text-blue-600">獲得購買資格！</div></div>`;
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } else {
            UI.modal.content.innerHTML = `<div><div class="text-green-600 font-bold text-2xl text-center mb-4">答對了！</div><div class="bg-green-50 p-4 rounded">${explanation}</div><br><div class="text-center font-bold text-xl text-classic-gold">獎勵: $100</div></div>`;
            state.players[state.currentPlayerIndex].money += 100;
            updatePlayerStats();

            UI.modal.close.classList.remove('hidden');
            UI.modal.close.onclick = () => {
                closeModal();
                endTurn();
            };
        }
    } else {
        SoundManager.playBad();
        UI.modal.content.innerHTML = `<div><div class="text-red-600 font-bold text-2xl text-center mb-4">答錯了。</div><div class="bg-red-50 p-4 rounded">${explanation}</div>${onSuccess ? '<br><div class="text-center font-bold text-red-500">無法購買。</div>' : ''}</div>`;

        UI.modal.close.classList.remove('hidden');
        UI.modal.close.onclick = () => {
            closeModal();
            endTurn();
        };
    }
}

function closeModal() {
    UI.modal.overlay.classList.add('hidden');
}

function showModal(title, content, actions = []) {
    UI.modal.overlay.classList.remove('hidden');
    UI.modal.title.innerHTML = title;
    UI.modal.content.innerHTML = content;
    UI.modal.options.innerHTML = '';
    UI.modal.close.classList.add('hidden');

    if (actions.length > 0) {
        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'w-full py-3 px-6 rounded-lg text-white font-bold text-lg mb-3 shadow transition-transform transform active:scale-95 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700';
            btn.textContent = action.text;
            btn.onclick = action.action;
            UI.modal.options.appendChild(btn);
        });
    } else {
        UI.modal.close.classList.remove('hidden');
        UI.modal.close.onclick = closeModal;
    }
}

function endTurn() {
    state.isMoving = false;
    let nextIndex = (state.currentPlayerIndex + 1) % 4;
    let loop = 0;
    while (state.players[nextIndex].stopped > 0 && loop < 4) {
        state.players[nextIndex].stopped--;
        nextIndex = (nextIndex + 1) % 4;
        loop++;
    }

    state.currentPlayerIndex = nextIndex;
    updatePlayerStats();

    UI.rollBtn.disabled = false;
    UI.rollBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    UI.message.innerHTML = `輪到 <span class="font-bold text-lg">${state.players[state.currentPlayerIndex].name}</span>`;
}

initGame();
