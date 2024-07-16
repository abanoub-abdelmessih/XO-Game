$(document).ready(function() {
    let currentPlayer = 'X';
    let numPlays = 0;
    let gameOver = false;
    let currentPlayers = {
        X: [],
        O: [],
    };
    const winningPositions = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ];

    // Initialize scores
    let XScore = 0;
    let OScore = 0;
    let Draw = 0;

    // Event Listener for cell clicks with debounce
    $('.cell').on('click', debounce(function () {
        // Prevent clicking on already filled cells or if the game is over
        if ($(this).text() !== '' || gameOver) return;

        numPlays++;
        $(this).text(currentPlayer);
        currentPlayers[currentPlayer].push(parseInt($(this).attr('id')));

        // Immediate check for winner after each click
        if (isWinner(currentPlayer)) {
            gameOver = true;
            displayWinner(currentPlayer);
            updateScore(currentPlayer);
            setTimeout(resetGame, 3000);
            return;
        } else if (numPlays === 9) {
            // Draw Case
            gameOver = true;
            displayWinner(null);
            updateScore(null);
            setTimeout(resetGame, 3000);
            return;
        }

        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        updateDashboardText(500);
    }, 60));

    function displayWinner(player) {
        let dots = '';
        let dotsInterval = setInterval(function() {
            dots += '.';
            if (player == null) {
                $('#playerTurn').html('It\'s a Draw ' + dots);
                if (dots.length === 4) {
                    clearInterval(dotsInterval);
                }
            } else {
                $('#playerTurn').html("<span class='md:text-xl text-xs'>Player :<span class='text-o-color'> " + player + "</span> Wins " + dots + "</span>");
                if (dots.length === 4) {
                    clearInterval(dotsInterval);
                }
            }
        }, 600); // Interval between adding dots (adjust as needed)
    }

    // Event Listener for New Game button
    $('.newGame').on('click', function() {
        resetGame();
    });

    // Function to check if there's a winner
    function isWinner(player) {
        if (numPlays < 5) return false;
        for (let i = 0; i < winningPositions.length; i++) {
            if (winningPositions[i].every(pos => currentPlayers[player].includes(pos))) {
                let winningCombination = winningPositions[i];
                winningCombination.forEach(index => {
                    if(player=='X'){
                        $(`#${index}`).toggleClass('bg-main-color bg-x-color').addClass('text-black');
                    }else{
                        $(`#${index}`).toggleClass('bg-main-color bg-o-color').addClass('text-black');
                    }
                });
                return true;
            }
        }
        return false;
    }

    // Function to reset the game
    function resetGame() {
        numPlays = 0;
        currentPlayers = {
            X: [],
            O: [],
        };
        currentPlayer = 'X';
        gameOver = false;
        $('.cell').text('').removeClass('bg-x-color bg-o-color text-black').addClass('bg-main-color');
        $('#playerTurn').fadeOut(500, function() {
            $(this).html('<span class="md:text-xl text-xs">New Game Started</span>').fadeIn(500, function() {
                updateDashboardText(900);
            });
        });
    }

    // Function to update the dashboard text
    function updateDashboardText(time) {
        $('#playerTurn').fadeOut(time, function() {
            $(this).html('Player <span class="text-o-color">' + currentPlayer + '</span> Turn').fadeIn(500);
        });
        // Clear the timeout when a cell is clicked
    }

    // Debounce function to limit click events
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            debounceTimer = setTimeout(() => func.apply(context, args), delay, 10);
        };
    }

    // Function to update the score
    function updateScore(player) {
        if (player === 'X') {
            XScore++;
            $('#XScore').text(XScore);
        } else if (player === 'O') {
            OScore++;
            $('#OScore').text(OScore);
        } else {
            Draw++;
            $('#Draw').text(Draw);
        }
    }
});
