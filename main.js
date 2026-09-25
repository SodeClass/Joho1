document.addEventListener('DOMContentLoaded', () => {
    const btnBubble = document.getElementById('btn-bubble');
    const btnSelection = document.getElementById('btn-selection');
    const controlsArea = document.getElementById('controls');
    const gameArea = document.getElementById('game-area');
    const resultArea = document.getElementById('result-area');
    const currentAlgoTitle = document.getElementById('current-algo-title');
    const guideMessage = document.getElementById('guide-message');
    const cardsContainer = document.getElementById('cards-container');
    const btnOk = document.getElementById('btn-ok');
    const resultMessage = document.getElementById('result-message');
    const btnRetry = document.getElementById('btn-retry');

    let sortableInstance = null;
    let currentSteps = [];
    let currentStepIndex = 0;
    let moveCount = 0;

    // ランダムな配列を生成 (5〜6個、重複なし)
    function generateRandomArray() {
        const length = Math.floor(Math.random() * 2) + 5; // 5 or 6
        const arr = [];
        while (arr.length < length) {
            const num = Math.floor(Math.random() * 99) + 1;
            if (!arr.includes(num)) {
                arr.push(num);
            }
        }
        return arr;
    }

    // バブルソートのステップ履歴を生成
    function generateBubbleSortSteps(initialArray) {
        const steps = [];
        const tempArr = [...initialArray];
        for (let i = 0; i < tempArr.length - 1; i++) {
            for (let j = 0; j < tempArr.length - i - 1; j++) {
                const startState = [...tempArr];
                const msg = `${tempArr[j]} と ${tempArr[j+1]} を比較します。左が大きければカードをドラッグして入れ替えてください。入れ替えが不要な場合はそのまま「これでOK」を押してください。`;
                const targetValues = [tempArr[j], tempArr[j+1]];

                if (tempArr[j] > tempArr[j+1]) {
                    const tmp = tempArr[j];
                    tempArr[j] = tempArr[j+1];
                    tempArr[j+1] = tmp;
                }

                const endState = [...tempArr];
                steps.push({ startState, endState, message: msg, targetValues });
            }
        }
        return steps;
    // 選択ソートのステップ履歴を生成
    function generateSelectionSortSteps(initialArray) {
        const steps = [];
        const tempArr = [...initialArray];
        for (let i = 0; i < tempArr.length - 1; i++) {
            const startState = [...tempArr];
            let minIdx = i;
            for (let j = i + 1; j < tempArr.length; j++) {
                if (tempArr[j] < tempArr[minIdx]) {
                    minIdx = j;
                }
            }

            const msg = `未ソート部分から最小値を探し、左端のカード（${tempArr[i]}）と入れ替えてください。入れ替えが不要な場合はそのまま「これでOK」を押してください。`;
            const targetValues = [tempArr[i]]; 

            if (minIdx !== i) {
                const tmp = tempArr[i];
                tempArr[i] = tempArr[minIdx];
                tempArr[minIdx] = tmp;
            }

            const endState = [...tempArr];
            steps.push({ startState, endState, message: msg, targetValues });
        }
        return steps;
    }

    // ゲーム開始初期化処理
    function initGame(algo) {
        const initialArray = generateRandomArray();
        moveCount = 0;
        currentStepIndex = 0;

        if (algo === 'bubble') {
            currentAlgoTitle.textContent = 'バブルソート';
            currentSteps = generateBubbleSortSteps(initialArray);
        } else if (algo === 'selection') {
            currentAlgoTitle.textContent = '選択ソート';
            currentSteps = generateSelectionSortSteps(initialArray);
        }

        controlsArea.classList.add('hidden');
        gameArea.classList.remove('hidden');
        resultArea.classList.add('hidden');
        
        renderStep();
    }

    // 現在のステップを画面に描画
    function renderStep() {
        if (currentStepIndex >= currentSteps.length) {
            finishGame();
            return;
        }

        const step = currentSteps[currentStepIndex];
        guideMessage.textContent = step.message;
        renderCards(step.startState, step.targetValues);
    }

    // カード要素を描画し、SortableJSを適用
    function renderCards(arr, targetValues) {
        cardsContainer.innerHTML = '';
        arr.forEach(num => {
            const card = document.createElement('div');
            card.className = 'card';
            if (targetValues.includes(num)) {
                card.classList.add('highlight');
            }
            card.textContent = num;
            card.dataset.value = num;
            cardsContainer.appendChild(card);
        });

        if (sortableInstance) {
            sortableInstance.destroy();
        }

        sortableInstance = new Sortable(cardsContainer, {
            animation: 150,
            ghostClass: 'sortable-ghost',
        });
    }

    // 「これでOK」ボタン押下時の判定
    function checkAnswer() {
        const step = currentSteps[currentStepIndex];
        
        const currentCards = Array.from(cardsContainer.children);
        const currentArray = currentCards.map(card => parseInt(card.dataset.value, 10));

        const isCorrect = step.endState.every((val, index) => val === currentArray[index]);
        moveCount++;

        if (isCorrect) {
            currentStepIndex++;
            renderStep();
        } else {
            cardsContainer.classList.add('shake');
            setTimeout(() => {
                cardsContainer.classList.remove('shake');
                alert('不正解です。元の状態に戻ります。もう一度考えてみましょう。');
                renderCards(step.startState, step.targetValues);
            }, 400); 
        }
    }

    // 終了処理
    function finishGame() {
        gameArea.classList.add('hidden');
        resultArea.classList.remove('hidden');
        resultMessage.textContent = `完了しました。手数は${moveCount}回でした。`;
    }

    // リセット
    function resetApp() {
        controlsArea.classList.remove('hidden');
        resultArea.classList.add('hidden');
        gameArea.classList.add('hidden');
    }

    btnBubble.addEventListener('click', () => initGame('bubble'));
    btnSelection.addEventListener('click', () => initGame('selection'));
    btnOk.addEventListener('click', checkAnswer);
    btnRetry.addEventListener('click', resetApp);
});

    }

