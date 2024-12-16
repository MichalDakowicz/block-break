document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("dark-mode");
    const body = document.body;

    // Load dark mode preference from local storage
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

    if (!gridContainer) {
        console.error("Grid container is missing in the HTML.");
        return; // Prevent further script execution if gridContainer is missing
    }

    // Define block shapes (2D arrays)
    const blockShapes = [
        [[1]], // Single block

        [[1, 1]], // Small line (2 blocks)
        [[1], [1]], // Vertical line (2 blocks)

        [[1, 1, 1]], // Long line (3 blocks)
        [[1], [1], [1]], // Vertical line (3 blocks)

        [[1, 1, 1, 1]], // Long line (4 blocks)
        [[1], [1], [1], [1]], // Vertical line (4 blocks)

        [
            [1, 1, 1],
            [0, 0, 1],
        ], // L-shape
        [
            [1, 1, 1],
            [1, 0, 0],
        ], // Reverse L-shape
        [
            [0, 0, 1],
            [1, 1, 1],
        ], // Flipped L-shape
        [
            [1, 0, 0],
            [1, 1, 1],
        ], // Flipped Reverse L-shape
        [
            [1, 0],
            [1, 0],
            [1, 1],
        ], // L-shape rotated 90 degrees
        [
            [0, 1],
            [0, 1],
            [1, 1],
        ], // Reverse L-shape rotated 90 degrees
        [
            [1, 1],
            [0, 1],
            [0, 1],
        ], // Flipped L-shape rotated 90 degrees
        [
            [1, 1],
            [1, 0],
            [1, 0],
        ], // Flipped Reverse L-shape rotated 90 degrees

        [
            [1, 1],
            [1, 0],
        ], // Small L-shape
        [
            [1, 1],
            [0, 1],
        ], // Small L-shape rotated 90 degrees
        [
            [1, 0],
            [1, 1],
        ], // Flipped Small L-shape
        [
            [0, 1],
            [1, 1],
        ], // Flipped Small Reverse L-shape

        [
            [1, 1, 1],
            [0, 1, 0],
        ], // T-shape
        [
            [1, 0],
            [1, 1],
            [1, 0],
        ], // T-shape rotated 90 degrees
        [
            [0, 1, 0],
            [1, 1, 1],
        ], // T-shape rotated 180 degrees
        [
            [0, 1],
            [1, 1],
            [0, 1],
        ], // T-shape rotated 270 degrees

        [
            [1, 1],
            [1, 1],
            [1, 1],
        ], // Rectangle
        [
            [1, 1, 1],
            [1, 1, 1],
        ], // Rotated Rectangle

        [
            [1, 1],
            [1, 1],
        ], // Small Square
        [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ], // Big Square
        [
            [1, 1, 0],
            [0, 1, 1],
        ], // Z-shape
        [
            [0, 1],
            [1, 1],
            [1, 0],
        ], // Z-shape rotated 90 degrees
        [
            [0, 1, 1],
            [1, 1, 0],
        ], // S-shape
        [
            [1, 0],
            [1, 1],
            [0, 1],
        ], // S-shape rotated 90 degrees
        [[1, 1, 1, 1, 1]], // Long line (5 blocks)
        [[1], [1], [1], [1], [1]], // Vertical line (5 blocks)
        [
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 1],
        ], // Big L-shape
        [
            [0, 0, 1],
            [0, 0, 1],
            [1, 1, 1],
        ], // Big Reverse L-shape
        [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 1],
        ], // Big Flipped L-shape
        [
            [1, 1, 1],
            [1, 0, 0],
            [1, 0, 0],
        ], // Big Flipped Reverse L-shape
    ];

    let selectedBlock = null;
    let placedBlocksCount = 0;

    let score = 0;
    let lives = 3;
    const scoreElement = document.getElementById("score");
    const highScoreElement = document.getElementById("high-score");
    const livesElement = document.getElementById("lives");

    const resetButton = document.getElementById("reset-game");
    resetButton.addEventListener("click", resetGame);

    let initialBlocksGenerated = false;

    function updateScore(points) {
        score += points;
        scoreElement.textContent = score;
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
        return count * 10; // Each square in the block is worth 10 points
    }

    function showReshuffleDialog() {
        const reshuffle = confirm(
            "Game Over! Do you want to reshuffle the blocks and continue? This will remove 1 life."
        );
        if (reshuffle) {
            lives -= 1; // Set lives to 1 since the user chose to reshuffle
            livesElement.textContent = lives;
            generateBlocks();
        } else {
            resetGame();
        }
    }

    function resetGame() {
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
    }

    // Generate random blocks
    function generateBlocks() {
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

        saveGameState(); // Save game state after generating new blocks

        if (initialBlocksGenerated && !hasValidMoves()) {
            showReshuffleDialog();
        } else {
            initialBlocksGenerated = true;
        }
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
        }
    }

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

            updateScore(calculateBlockScore(shape)); // Add points based on block size

            checkAndBreakLines();

            if (!hasValidMoves()) {
                if (lives > 0) {
                    showReshuffleDialog();
                } else {
                    resetGame();
                }
            }

            saveGameState(); // Save game state after each move
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
            updateScore(multiplier * 50); // Add points with multiplier for breaking lines
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

    highScoreElement.textContent = localStorage.getItem("highScore") || 0;
});
