document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    const blocksContainer = document.getElementById("block-select");
    const gridContainer = document.getElementById("squares");
    const gameOverDialog = document.getElementById("game-over");
    const reshuffleButton = document.getElementById("reshuffle-blocks");
    const gameOverNoLivesDialog = document.getElementById("game-over-no-lives");
    const resetButtonGameOverDialog = document.getElementById(
        "reset-game-no-lives-dialog"
    );
    const scoreEndElement = document.getElementById("score-end");

    let isLosingReshuffle = false;

    reshuffleButton.addEventListener("click", () => {
        if (blocksContainer.children.length === 0 || isLosingReshuffle) {
            if (lives > 0) {
                lives--;
                livesElement.textContent = lives;
                gameOverDialog.classList.add("hidden");
                isLosingReshuffle = true;
                generateBlocks();

                if (!hasValidMoves() && lives > 0) {
                    showGameOverDialog();
                } else if (!hasValidMoves() && lives <= 0) {
                    showGameOverNoLivesDialog();
                } else {
                    initialBlocksGenerated = true;
                }
            } else {
                showGameOverNoLivesDialog();
            }
        } else {
            console.error(
                "Cannot reshuffle blocks while existing blocks are available."
            );
        }
    });

    resetButtonGameOverDialog.addEventListener("click", resetGame);

    const resetButtonGameOver = document.getElementById("reset-game-no-lives");
    if (resetButtonGameOver) {
        resetButtonGameOver.addEventListener("click", resetGame);
    }

    function showGameOverDialog() {
        if (hasValidMoves()) {
            generateBlocks();
        } else {
            if (lives > 0) {
                isLosingReshuffle = true;
                gameOverDialog.classList.remove("hidden");
            }
        }
    }

    function hideGameOverDialog() {
        gameOverDialog.classList.add("hidden");
    }

    function showGameOverNoLivesDialog() {
        gameOverNoLivesDialog.classList.remove("hidden");
    }

    function hideGameOverNoLivesDialog() {
        gameOverNoLivesDialog.classList.add("hidden");
    }

    if (!gridContainer) {
        console.error("Grid container is missing in the HTML.");
        return;
    }

    const blockShapes = [
        [[1]],

        [[1, 1]],
        [[1], [1]],

        [[1, 1, 1]],
        [[1], [1], [1]],

        [[1, 1, 1, 1]],
        [[1], [1], [1], [1]],

        [
            [1, 1, 1],
            [0, 0, 1],
        ],
        [
            [1, 1, 1],
            [1, 0, 0],
        ],
        [
            [0, 0, 1],
            [1, 1, 1],
        ],
        [
            [1, 0, 0],
            [1, 1, 1],
        ],
        [
            [1, 0],
            [1, 0],
            [1, 1],
        ],
        [
            [0, 1],
            [0, 1],
            [1, 1],
        ],
        [
            [1, 1],
            [0, 1],
            [0, 1],
        ],
        [
            [1, 1],
            [1, 0],
            [1, 0],
        ],

        [
            [1, 1],
            [1, 0],
        ],
        [
            [1, 1],
            [0, 1],
        ],
        [
            [1, 0],
            [1, 1],
        ],
        [
            [0, 1],
            [1, 1],
        ],

        [
            [1, 1, 1],
            [0, 1, 0],
        ],
        [
            [1, 0],
            [1, 1],
            [1, 0],
        ],
        [
            [0, 1, 0],
            [1, 1, 1],
        ],
        [
            [0, 1],
            [1, 1],
            [0, 1],
        ],

        [
            [1, 1],
            [1, 1],
            [1, 1],
        ],
        [
            [1, 1, 1],
            [1, 1, 1],
        ],

        [
            [1, 1],
            [1, 1],
        ],
        [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
        [
            [1, 1, 0],
            [0, 1, 1],
        ],
        [
            [0, 1],
            [1, 1],
            [1, 0],
        ],
        [
            [0, 1, 1],
            [1, 1, 0],
        ],
        [
            [1, 0],
            [1, 1],
            [0, 1],
        ],
        [[1, 1, 1, 1, 1]],
        [[1], [1], [1], [1], [1]],
        [
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 1],
        ],
        [
            [0, 0, 1],
            [0, 0, 1],
            [1, 1, 1],
        ],
        [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 1],
        ],
        [
            [1, 1, 1],
            [1, 0, 0],
            [1, 0, 0],
        ],
        [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ],
        [
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0],
        ],
        [
            [1, 0],
            [0, 1],
        ],
        [
            [0, 1],
            [1, 0],
        ],
    ];

    let selectedBlock = null;
    let placedBlocksCount = 0;

    let score = 0;
    let lives = 3;
    const scoreElement = document.getElementById("score");
    const highScore_Element = document.getElementById("high-score");
    const livesElement = document.getElementById("lives");

    const resetButton = document.getElementById("reset-game");

    let initialBlocksGenerated = false;

    let comboCount = 0;
    let comboMovesLeft = 3;

    const comboCountElement = document.getElementById("combo-count");
    const comboProgressBar = document.getElementById("combo-progress-bar");
    const comboBox = document.getElementById("combo-info");

    const score_base = 10;
    const score_bingo = [1, 3, 6, 10, 15, 21];

    function updateComboDisplay() {
        comboCountElement.textContent = comboCount;
        const progressPercentage = (comboMovesLeft / 3) * 100;
        comboProgressBar.style.width = `${progressPercentage}%`;
        if (comboMovesLeft == 0) {
            comboProgressBar.style.width = "100%";
        }
    }

    function updateScore(points) {
        score += points;
        scoreElement.textContent = score;
        scoreEndElement.textContent = score;
        const highScore_ = localStorage.getItem("highScore_") || 0;
        if (score > highScore_) {
            localStorage.setItem("highScore_", score);
            highScore_Element.textContent = score;
        }
    }

    function calculateBlockScore(shape) {
        let count = 0;
        shape.forEach((row) => {
            row.forEach((cell) => {
                if (cell) count++;
            });
        });
        return count;
    }

    function calculateScore(clearedLines, blockValue) {
        const comboMultiplier = comboCount + 1;
        const linesClearedMultiplier = score_bingo[clearedLines - 1] || 0; 

        const baseScore = blockValue;
        return baseScore * linesClearedMultiplier * comboMultiplier;
    }

    function showReshuffleDialog() {
        const reshuffle = confirm(
            "Game Over! Do you want to reshuffle the blocks and continue? This will remove 1 life."
        );
        if (reshuffle) {
            if (lives > 0) {
                lives -= 1;
                livesElement.textContent = lives;
                isLosingReshuffle = true;
                generateBlocks();

                if (!hasValidMoves() && lives > 0) {
                    showReshuffleDialog();
                } else if (!hasValidMoves() && lives <= 0) {
                    showGameOverNoLivesDialog();
                } else {
                    initialBlocksGenerated = true;
                }
            } else {
                showGameOverNoLivesDialog();
            }
        } else {
            showGameOverNoLivesDialog();
        }
    }

    function resetGame() {
        hideGameOverDialog();
        hideGameOverNoLivesDialog();
        blocksContainer.innerHTML = "";
        score = 0;
        lives = 3;
        comboCount = 0;
        comboMovesLeft = 3;
        scoreElement.textContent = score;
        livesElement.textContent = lives;
        initializeGrid(8, 8);
        generateBlocks();
        updateComboDisplay();
        localStorage.removeItem("boardState");
        localStorage.removeItem("blocksState");
        localStorage.removeItem("blockSelectState");
        localStorage.removeItem("score");
        localStorage.removeItem("lives");
        initialBlocksGenerated = false;
        isLosingReshuffle = false;
    }

    function generateBlocks() {
        if (blocksContainer.children.length > 0 && !isLosingReshuffle) {
            console.error(
                "Cannot generate new blocks while existing blocks are available."
            );
            return;
        }

        blocksContainer.innerHTML = "";

        let attempts = 0;
        const maxAttempts = 100;

        const generatedBlocks = [];

        for (let i = 0; i < 3; i++) {
            let blockShape, blockColor, blockElement;
            do {
                blockShape =
                    blockShapes[Math.floor(Math.random() * blockShapes.length)];
                blockColor = getRandomColor();
                blockElement = createBlockElement(blockShape, blockColor);
                blockElement.classList.add("block-pick");
                blockElement.dataset.index = i;
                blockElement.dataset.shape = JSON.stringify(blockShape);
                blockElement.dataset.color = blockColor;
                attempts++;
            } while (!canPlaceBlock(blockShape) && attempts < maxAttempts);

            if (attempts >= maxAttempts) {
                console.error(
                    "Unable to generate placeable blocks after maximum attempts."
                );
                showGameOverNoLivesDialog();
                return;
            }

            generatedBlocks.push(blockElement);
        }

        if (!canPlaceAllBlocks(generatedBlocks)) {
            console.error("Generated blocks cannot all fit on the board.");
            showGameOverNoLivesDialog();
            return;
        }

        generatedBlocks.forEach((blockElement) => {
            blocksContainer.appendChild(blockElement);
            blockElement.addEventListener("click", () =>
                selectBlock(blockElement)
            );
        });

        saveGameState();

        if (initialBlocksGenerated && !hasValidMoves()) {
            if (lives > 0) {
                showReshuffleDialog();
            } else {
                showGameOverNoLivesDialog();
            }
        } else {
            initialBlocksGenerated = true;
            isLosingReshuffle = false;
        }
    }

    function canPlaceAllBlocks(blocks) {
        const rows = 8;
        const cols = 8;
        const board = Array.from({ length: rows }, () =>
            Array(cols).fill(false)
        );

        for (const block of blocks) {
            const shape = JSON.parse(block.dataset.shape);
            let placed = false;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (canPlaceShapeAt(shape, row, col, board)) {
                        placeShapeAt(shape, row, col, board);
                        placed = true;
                        break;
                    }
                }
                if (placed) break;
            }

            if (!placed) return false;
        }

        return true;
    }

    function canPlaceShapeAt(shape, startRow, startCol, board) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const row = startRow + r;
                    const col = startCol + c;
                    if (
                        row >= board.length ||
                        col >= board[0].length ||
                        board[row][col]
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function placeShapeAt(shape, startRow, startCol, board) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const row = startRow + r;
                    const col = startCol + c;
                    board[row][col] = true;
                }
            }
        }
    }

    function generateBlocksForce() {
        blocksContainer.innerHTML = "";

        for (let i = 0; i < 3; i++) {
            const blockShape =
                blockShapes[Math.floor(Math.random() * blockShapes.length)];
            const blockColor = getRandomColor();
            const blockElement = createBlockElement(blockShape, blockColor);
            blockElement.classList.add("block-pick");
            blockElement.dataset.index = i;
            blockElement.dataset.shape = JSON.stringify(blockShape);
            blockElement.dataset.color = blockColor;
            blocksContainer.appendChild(blockElement);
            blockElement.addEventListener("click", () =>
                selectBlock(blockElement)
            );
        }
    }

    function canPlaceBlock(shape) {
        const rows = 8;
        const cols = 8;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let canPlace = true;

                shape.forEach((shapeRow, rIdx) => {
                    shapeRow.forEach((cell, cIdx) => {
                        if (cell) {
                            const targetCell = document.querySelector(
                                `.square[data-row="${row + rIdx}"][data-col="${
                                    col + cIdx
                                }"]`
                            );
                            if (
                                !targetCell ||
                                targetCell.style.backgroundColor
                            ) {
                                canPlace = false;
                            }
                        }
                    });
                });

                if (canPlace) {
                    return true;
                }
            }
        }

        return false;
    }

    function createBlockElement(shape, color) {
        const blockDiv = document.createElement("div");
        blockDiv.style.display = "flex";
        blockDiv.style.flexDirection = "column";
        blockDiv.style.alignItems = "center";
        blockDiv.style.justifyContent = "center";

        shape.forEach((row) => {
            const rowDiv = document.createElement("div");
            rowDiv.style.display = "flex";
            rowDiv.style.justifyContent = "center";
            row.forEach((cell) => {
                const cellDiv = document.createElement("div");
                cellDiv.style.width = "20px";
                cellDiv.style.height = "20px";
                cellDiv.style.margin = "0";
                if (cell) {
                    cellDiv.style.backgroundColor = color;
                } else {
                    cellDiv.style.visibility = "hidden";
                }
                rowDiv.appendChild(cellDiv);
            });
            blockDiv.appendChild(rowDiv);
        });

        blockDiv.draggable = true;

        return blockDiv;
    }

    function getRandomColor() {
        const colors = [
            "var(--red-block)",
            "var(--green-block)",
            "var(--blue-block)",
            "var(--yellow-block)",
            "var(--purple-block)",
            "var(--orange-block)",
            "var(--pink-block)",
            "var(--cyan-block)",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function selectBlock(block) {
        document
            .querySelectorAll(".block-pick")
            .forEach((b) => b.classList.remove("selected"));

        block.classList.add("selected");
        selectedBlock = block;
    }

    function saveGameState() {
        const boardState = [];
        document.querySelectorAll(".square").forEach((cell) => {
            boardState.push(cell.style.backgroundColor || "");
        });
        const blocksState = [];
        document.querySelectorAll(".block-pick").forEach((block) => {
            blocksState.push({
                shape: block.dataset.shape,
                color: block.dataset.color,
            });
        });
        localStorage.setItem("boardState", JSON.stringify(boardState));
        localStorage.setItem("blocksState", JSON.stringify(blocksState));
        localStorage.setItem("score", score);
        localStorage.setItem("lives", lives);
    }

    function loadGameState() {
        const boardState = JSON.parse(localStorage.getItem("boardState"));
        const blocksState = JSON.parse(localStorage.getItem("blocksState"));
        if (boardState && blocksState) {
            document.querySelectorAll(".square").forEach((cell, index) => {
                cell.style.backgroundColor = boardState[index];
            });
            blocksContainer.innerHTML = "";
            blocksState.forEach((blockData) => {
                const blockShape = JSON.parse(blockData.shape);
                const blockColor = blockData.color;
                const blockElement = createBlockElement(blockShape, blockColor);
                blockElement.classList.add("block-pick");
                blockElement.dataset.shape = blockData.shape;
                blockElement.dataset.color = blockColor;
                blocksContainer.appendChild(blockElement);
                blockElement.addEventListener("click", () =>
                    selectBlock(blockElement)
                );
            });
            score = parseInt(localStorage.getItem("score"));
            lives = parseInt(localStorage.getItem("lives"));
            scoreElement.textContent = score;
            livesElement.textContent = lives;
            scoreEndElement.textContent = score;
        }
    }

    let reshuffled = false;

    gridContainer.addEventListener("click", (event) => {
        if (!selectedBlock) return;

        const cell = event.target;
        if (!cell.classList.contains("square")) return;

        const shape = JSON.parse(selectedBlock.dataset.shape);
        const color = selectedBlock.dataset.color;

        const startRow = parseInt(cell.dataset.row);
        const startCol = parseInt(cell.dataset.col);

        let canPlace = true;

        shape.forEach((row, rIdx) => {
            row.forEach((cell, cIdx) => {
                if (cell) {
                    const targetCell = document.querySelector(
                        `.square[data-row="${startRow + rIdx}"][data-col="${
                            startCol + cIdx
                        }"]`
                    );
                    if (!targetCell || targetCell.style.backgroundColor) {
                        canPlace = false;
                    }
                }
            });
        });

        if (canPlace) {
            shape.forEach((row, rIdx) => {
                row.forEach((cell, cIdx) => {
                    if (cell) {
                        const targetCell = document.querySelector(
                            `.square[data-row="${startRow + rIdx}"][data-col="${
                                startCol + cIdx
                            }"]`
                        );
                        targetCell.style.backgroundColor = color;
                    }
                });
            });

            selectedBlock.remove();
            selectedBlock = null;
            placedBlocksCount++;

            if (placedBlocksCount === 3) {
                generateBlocks();
                placedBlocksCount = 0;
            }

            updateScore(calculateBlockScore(shape));

            checkAndBreakLines();

            if (!hasValidMoves() && initialBlocksGenerated) {
                if (blocksContainer.children.length === 0) {
                    generateBlocksForce();
                } else {
                    if (lives > 0) {
                        showGameOverDialog();
                    } else {
                        showGameOverNoLivesDialog();
                    }
                }
            }

            saveGameState();
            clearPreview();
        }
    });

    function checkAndBreakLines() {
        const rows = 8;
        const cols = 8;
        let breakableRows = [];
        let breakableCols = [];

        for (let row = 0; row < rows; row++) {
            let isRowBreakable = true;
            for (let col = 0; col < cols; col++) {
                const cell = document.querySelector(
                    `.square[data-row="${row}"][data-col="${col}"]`
                );
                if (!cell.style.backgroundColor) {
                    isRowBreakable = false;
                    break;
                }
            }
            if (isRowBreakable) breakableRows.push(row);
        }

        for (let col = 0; col < cols; col++) {
            let isColBreakable = true;
            for (let row = 0; row < rows; row++) {
                const cell = document.querySelector(
                    `.square[data-row="${row}"][data-col="${col}"]`
                );
                if (!cell.style.backgroundColor) {
                    isColBreakable = false;
                    break;
                }
            }
            if (isColBreakable) breakableCols.push(col);
        }

        if (breakableRows.length > 0 || breakableCols.length > 0) {
            comboCount++;
            comboMovesLeft = 3;
        } else {
            comboMovesLeft--;
            if (comboMovesLeft <= 0) {
                comboCount = 0;
            }
        }

        updateComboDisplay();

        breakableRows.forEach((row) => {
            for (let col = 0; col < cols; col++) {
                const cell = document.querySelector(
                    `.square[data-row="${row}"][data-col="${col}"]`
                );
                cell.style.backgroundColor = "";
            }
        });

        breakableCols.forEach((col) => {
            for (let row = 0; row < rows; row++) {
                const cell = document.querySelector(
                    `.square[data-row="${row}"][data-col="${col}"]`
                );
                cell.style.backgroundColor = "";
            }
        });

        if (breakableRows.length > 0 || breakableCols.length > 0) {
            const multiplier = breakableRows.length + breakableCols.length;
            const comboBonus = calculateScore(multiplier, score_base);
            updateScore(comboBonus);
        }
    }

    function hasValidMoves() {
        const rows = 8;
        const cols = 8;
        const blocks = document.querySelectorAll(".block-pick");

        for (let block of blocks) {
            const shape = JSON.parse(block.dataset.shape);

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    let canPlace = true;

                    shape.forEach((shapeRow, rIdx) => {
                        shapeRow.forEach((cell, cIdx) => {
                            if (cell) {
                                const targetCell = document.querySelector(
                                    `.square[data-row="${
                                        row + rIdx
                                    }"][data-col="${col + cIdx}"]`
                                );
                                if (
                                    !targetCell ||
                                    targetCell.style.backgroundColor
                                ) {
                                    canPlace = false;
                                }
                            }
                        });
                    });

                    if (canPlace) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function initializeGrid(rows, cols) {
        gridContainer.innerHTML = "";
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement("div");
                cell.classList.add("square");
                cell.dataset.row = row;
                cell.dataset.col = col;
                gridContainer.appendChild(cell);
            }
        }
    }

    initializeGrid(8, 8);

    if (localStorage.getItem("boardState")) {
        loadGameState();
    } else {
        generateBlocks();
    }

    highScore_Element.textContent = localStorage.getItem("highScore_") || 0;

    const refreshButton = document.getElementById("refresh");

    refreshButton.addEventListener("click", resetGame);

    function showPreview(startRow, startCol) {
        clearPreview();
        if (!selectedBlock && !touchDraggingBlock) return;

        const shape = selectedBlock
            ? JSON.parse(selectedBlock.dataset.shape)
            : JSON.parse(touchDraggingBlock.dataset.shape);
        let canPlace = true;

        shape.forEach((row, rIdx) => {
            row.forEach((cell, cIdx) => {
                if (cell) {
                    const targetRow = startRow + rIdx;
                    const targetCol = startCol + cIdx;
                    const targetCell = document.querySelector(
                        `.square[data-row="${targetRow}"][data-col="${targetCol}"]`
                    );
                    if (targetCell) {
                        targetCell.classList.add("preview");
                        if (targetCell.style.backgroundColor) {
                            canPlace = false;
                            targetCell.classList.add("preview-wrong");
                        }
                    } else {
                        canPlace = false;
                    }
                }
            });
        });

        if (!canPlace) {
            shape.forEach((row, rIdx) => {
                row.forEach((cell, cIdx) => {
                    if (cell) {
                        const targetRow = startRow + rIdx;
                        const targetCol = startCol + cIdx;
                        const targetCell = document.querySelector(
                            `.square[data-row="${targetRow}"][data-col="${targetCol}"]`
                        );
                        if (targetCell) {
                            targetCell.classList.add("preview-wrong");
                        }
                    }
                });
            });
        }
    }

    function clearPreview() {
        document
            .querySelectorAll(".preview, .preview-wrong")
            .forEach((cell) => {
                cell.classList.remove("preview", "preview-wrong");
            });
    }

    function showSnappingPreview(startRow, startCol) {
        clearPreview();
        if (!draggedBlock) return;

        const shape = JSON.parse(draggedBlock.dataset.shape);
        let canPlace = true;

        shape.forEach((row, rIdx) => {
            row.forEach((cell, cIdx) => {
                if (cell) {
                    const targetRow = startRow + rIdx;
                    const targetCol = startCol + cIdx;
                    const targetCell = document.querySelector(
                        `.square[data-row="${targetRow}"][data-col="${targetCol}"]`
                    );
                    if (targetCell) {
                        targetCell.classList.add("preview");
                        if (targetCell.style.backgroundColor) {
                            canPlace = false;
                            targetCell.classList.add("preview-wrong");
                        }
                    } else {
                        canPlace = false;
                    }
                }
            });
        });

        if (!canPlace) {
            shape.forEach((row, rIdx) => {
                row.forEach((cell, cIdx) => {
                    if (cell) {
                        const targetRow = startRow + rIdx;
                        const targetCol = startCol + cIdx;
                        const targetCell = document.querySelector(
                            `.square[data-row="${targetRow}"][data-col="${targetCol}"]`
                        );
                        if (targetCell) {
                            targetCell.classList.add("preview-wrong");
                        }
                    }
                });
            });
        }
    }

    let draggedBlock = null;

    blocksContainer.addEventListener("dragstart", (event) => {
        if (event.target.classList.contains("block-pick")) {
            draggedBlock = event.target;
            event.dataTransfer.setData(
                "text/plain",
                event.target.dataset.index
            );

            const shape = JSON.parse(draggedBlock.dataset.shape);
            const color = draggedBlock.dataset.color;

            const dragPreview = document.createElement("div");
            dragPreview.style.display = "flex";
            dragPreview.style.flexDirection = "column";
            dragPreview.style.alignItems = "center";
            dragPreview.style.justifyContent = "center";
            dragPreview.style.position = "absolute";
            dragPreview.style.top = "-9999px";

            shape.forEach((row) => {
                const rowDiv = document.createElement("div");
                rowDiv.style.display = "flex";
                rowDiv.style.justifyContent = "center";
                row.forEach((cell) => {
                    const cellDiv = document.createElement("div");
                    cellDiv.style.width = "78px";
                    cellDiv.style.height = "78px";
                    cellDiv.style.margin = "0";
                    cellDiv.style.border = "1px solid var(--border-color)";
                    cellDiv.style.opacity = "0.5";
                    if (cell) {
                        cellDiv.style.backgroundColor = color;
                    } else {
                        cellDiv.style.visibility = "hidden";
                    }
                    rowDiv.appendChild(cellDiv);
                });
                dragPreview.appendChild(rowDiv);
            });

            document.body.appendChild(dragPreview);
            event.dataTransfer.setDragImage(dragPreview, 0, 0);
            setTimeout(() => document.body.removeChild(dragPreview), 0);
        }
    });

    blocksContainer.addEventListener("dragend", () => {
        draggedBlock = null;
    });

    gridContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
        const cell = event.target;
        if (cell.classList.contains("square")) {
            const startRow = parseInt(cell.dataset.row);
            const startCol = parseInt(cell.dataset.col);
            showPreview(startRow, startCol);
        }
    });

    gridContainer.addEventListener("drop", (event) => {
        event.preventDefault();
        const cell = event.target;
        if (!draggedBlock || !cell.classList.contains("square")) return;

        placeBlock(cell, draggedBlock);
    });

    gridContainer.addEventListener("dragenter", (event) => {
        const cell = event.target;
        if (cell.classList.contains("square")) {
            const startRow = parseInt(cell.dataset.row);
            const startCol = parseInt(cell.dataset.col);
            showSnappingPreview(startRow, startCol);
        }
    });

    gridContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
        const cell = event.target;
        if (cell.classList.contains("square")) {
            const startRow = parseInt(cell.dataset.row);
            const startCol = parseInt(cell.dataset.col);
            showSnappingPreview(startRow, startCol);
        }
    });

    gridContainer.addEventListener("dragleave", () => {
        clearPreview();
    });

    gridContainer.addEventListener("drop", (event) => {
        event.preventDefault();
        const cell = event.target;
        if (!draggedBlock || !cell.classList.contains("square")) return;

        placeBlock(cell, draggedBlock);
    });

    gridContainer.addEventListener("dragenter", (event) => {
        const cell = event.target;
        if (cell.classList.contains("square")) {
            const startRow = parseInt(cell.dataset.row);
            const startCol = parseInt(cell.dataset.col);
            showSnappingPreview(startRow, startCol);
        }
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let touchDraggingBlock = null;
    let touchDragPreview = null;
    let previewCell = null;

    blocksContainer.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const block = target.closest(".block-pick");
        if (block) {
            touchDraggingBlock = block;
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            block.classList.add("dragging");

            const shape = JSON.parse(block.dataset.shape);
            const color = block.dataset.color;

            touchDragPreview = document.createElement("div");
            touchDragPreview.style.display = "flex";
            touchDragPreview.style.flexDirection = "column";
            touchDragPreview.style.alignItems = "center";
            touchDragPreview.style.justifyContent = "center";
            touchDragPreview.style.position = "fixed";
            touchDragPreview.style.pointerEvents = "none";
            touchDragPreview.style.zIndex = "1000";
            touchDragPreview.style.transform = "translate(0, 0) scale(1)";
            touchDragPreview.style.left = `${touch.clientX - 19}px`;
            touchDragPreview.style.top = `${touch.clientY - 19}px`;

            shape.forEach((row) => {
                const rowDiv = document.createElement("div");
                rowDiv.style.display = "flex";
                rowDiv.style.justifyContent = "center";
                row.forEach((cell) => {
                    const cellDiv = document.createElement("div");
                    cellDiv.style.width = "38px";
                    cellDiv.style.height = "38px";
                    cellDiv.style.margin = "0";
                    cellDiv.style.border = "1px solid var(--border-color)";
                    cellDiv.style.opacity = "0.5";
                    if (cell) {
                        cellDiv.style.backgroundColor = color;
                    } else {
                        cellDiv.style.visibility = "hidden";
                    }
                    rowDiv.appendChild(cellDiv);
                });
                touchDragPreview.appendChild(rowDiv);
            });

            document.body.appendChild(touchDragPreview);
        }
    });

    function mapRange(value, inMin, inMax, outMin, outMax) {
        return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
    }

    blocksContainer.addEventListener("touchmove", (event) => {
        if (touchDraggingBlock && touchDragPreview) {
            event.preventDefault();
            const touch = event.touches[0];
            const screenMid = window.innerHeight / 2;

            const mappedY = mapRange(
                touch.clientY,
                screenMid,
                window.innerHeight,
                0,
                window.innerHeight
            );

            touchDragPreview.style.left = `${touch.clientX - 19}px`;
            touchDragPreview.style.top = `${mappedY - 19}px`;

            previewCell = document.elementFromPoint(touch.clientX, mappedY);
            showPreviewOnTouch(touch.clientX, mappedY);
        }
    });

    blocksContainer.addEventListener("touchend", (event) => {
        if (touchDraggingBlock && touchDragPreview) {
            touchDraggingBlock.classList.remove("dragging");
            document.body.removeChild(touchDragPreview);
            touchDragPreview = null;
            if (previewCell && previewCell.classList.contains("square")) {
                placeBlock(previewCell, touchDraggingBlock);
            }
            touchDraggingBlock = null;
            previewCell = null;
        }
    });

    gridContainer.addEventListener("touchstart", (event) => {
        if (touchDraggingBlock) {
            const touch = event.touches[0];
            const cell = document.elementFromPoint(
                touch.clientX,
                touch.clientY
            );
            if (cell && cell.classList.contains("square")) {
                showPreview(
                    parseInt(cell.dataset.row),
                    parseInt(cell.dataset.col)
                );
            }
        }
    });

    function showPreviewOnTouch(x, y) {
        clearPreview();
        const cell = document.elementFromPoint(x, y);
        if (cell && cell.classList.contains("square")) {
            showPreview(parseInt(cell.dataset.row), parseInt(cell.dataset.col));
        }
    }

    function placeBlock(cell, block) {
        const shape = JSON.parse(block.dataset.shape);
        const color = block.dataset.color;

        const startRow = parseInt(cell.dataset.row);
        const startCol = parseInt(cell.dataset.col);

        let canPlace = true;

        shape.forEach((row, rIdx) => {
            row.forEach((cell, cIdx) => {
                if (cell) {
                    const targetCell = document.querySelector(
                        `.square[data-row="${startRow + rIdx}"][data-col="${
                            startCol + cIdx
                        }"]`
                    );
                    if (!targetCell || targetCell.style.backgroundColor) {
                        canPlace = false;
                    }
                }
            });
        });

        if (canPlace) {
            shape.forEach((row, rIdx) => {
                row.forEach((cell, cIdx) => {
                    if (cell) {
                        const targetCell = document.querySelector(
                            `.square[data-row="${startRow + rIdx}"][data-col="${
                                startCol + cIdx
                            }"]`
                        );
                        targetCell.style.backgroundColor = color;
                    }
                });
            });

            block.remove();
            placedBlocksCount++;

            if (placedBlocksCount === 3) {
                generateBlocks();
                placedBlocksCount = 0;
            }

            updateScore(calculateBlockScore(shape));

            checkAndBreakLines();

            if (!hasValidMoves() && initialBlocksGenerated) {
                if (blocksContainer.children.length === 0) {
                    generateBlocksForce();
                } else {
                    if (lives > 0) {
                        showGameOverDialog();
                    } else {
                        showGameOverNoLivesDialog();
                    }
                }
            }

            saveGameState();
            clearPreview();
        } else {
            clearPreview();
        }
    }
});
