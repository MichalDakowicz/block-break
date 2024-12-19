document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("dark-mode");
    const body = document.body;

    if (darkModeToggle) {
        darkModeToggle.addEventListener("change", () => {
            if (darkModeToggle.checked) {
                body.classList.add("dark-mode");
                localStorage.setItem("darkMode", "enabled");
            } else {
                body.classList.remove("dark-mode");
                localStorage.setItem("darkMode", "disabled");
            }
        });

        if (localStorage.getItem("darkMode") === "enabled") {
            body.classList.add("dark-mode");
            darkModeToggle.checked = true;
        }
    }

    const blocksContainer = document.getElementById("block-select");
    const gridContainer = document.getElementById("squares");
    const gameOverDialog = document.getElementById("game-over");
    const reshuffleButton = document.getElementById("reshuffle-blocks");
    const gameOverNoLivesDialog = document.getElementById("game-over-no-lives");
    const resetButtonGameOverDialog = document.getElementById("reset-game-no-lives-dialog");
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

    const resetButtonGameOver = document.getElementById("reset-game-no-lives"); // Added reference for reset button in game-over dialog
    if (resetButtonGameOver) {
        resetButtonGameOver.addEventListener("click", resetGame); // Added event listener
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
    ];

    let selectedBlock = null;
    let placedBlocksCount = 0;

    let score = 0;
    let lives = 3;
    const scoreElement = document.getElementById("score");
    const highScoreElement = document.getElementById("high-score");
    const livesElement = document.getElementById("lives");

    const resetButton = document.getElementById("reset-game");

    let initialBlocksGenerated = false;

    function updateScore(points) {
        score += points;
        scoreElement.textContent = score;
        scoreEndElement.textContent = score;
        const highScore = localStorage.getItem("highScore") || 0;
        if (score > highScore) {
            localStorage.setItem("highScore", score);
            highScoreElement.textContent = score;
        }
    }

    function calculateBlockScore(shape) {
        let count = 0;
        shape.forEach((row) => {
            row.forEach((cell) => {
                if (cell) count++;
            });
        });
        return count * 10;
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
        scoreElement.textContent = score;
        livesElement.textContent = lives;
        initializeGrid(8, 8);
        generateBlocks();
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

            blocksContainer.appendChild(blockElement);
            blockElement.addEventListener("click", () =>
                selectBlock(blockElement)
            );
        }

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
                                `.square[data-row="${row + rIdx}"][data-col="${col + cIdx}"]`
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
                        `.square[data-row="${startRow + rIdx}"][data-col="${startCol + cIdx}"]`
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
                            `.square[data-row="${startRow + rIdx}"][data-col="${startCol + cIdx}"]`
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
            updateScore(multiplier * 50);
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
                                    `.square[data-row="${row + rIdx}"][data-col="${col + cIdx}"]`
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

    highScoreElement.textContent = localStorage.getItem("highScore") || 0;

    const refreshButton = document.getElementById("refresh");
    const refreshIcon = document.getElementById("refresh-icon");

    function updateRefreshIcon() {
        if (body.classList.contains("dark-mode")) {
            refreshIcon.src = "img/refresh_dark.svg";
        } else {
            refreshIcon.src = "img/refresh_light.svg";
        }
    }

    updateRefreshIcon();

    darkModeToggle.addEventListener("change", updateRefreshIcon);

    refreshButton.addEventListener("click", resetGame);

    function showPreview(startRow, startCol) {
        clearPreview();
        if (!selectedBlock) return;

        const shape = JSON.parse(selectedBlock.dataset.shape);
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
                    } else {
                        canPlace = false;
                    }
                }
            });
        });

        if (!canPlace) {
            clearPreview();
        }
    }

    function clearPreview() {
        document.querySelectorAll(".preview").forEach((cell) => {
            cell.classList.remove("preview");
        });
    }

    gridContainer.addEventListener("mousemove", (event) => {
        const cell = event.target;
        if (!cell.classList.contains("square")) {
            clearPreview();
            return;
        }
        const startRow = parseInt(cell.dataset.row);
        const startCol = parseInt(cell.dataset.col);
        showPreview(startRow, startCol);
    });

    gridContainer.addEventListener("mouseleave", () => {
        clearPreview();
    });
});
