import layout from "./level.js";
import ghosts from "./ghost.js";

const grid = document.getElementById('grid');
const scoreEl = document.getElementById('score');

const WIDTH = 28; // 28 * 28 

let squares = [];
let score = 0;
let pacmanCurrentIndex = 490;

const createBoard = () => {
    for (let i = 0; i < layout.length; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square)

        if(layout[i] === 0) {
            squares[i].classList.add('pac-dot')
        } else if (layout[i] === 1) {
            squares[i].classList.add('wall')
        } else if (layout[i] === 2) {
            squares[i].classList.add('ghost-lair')
        } else if (layout[i] === 3) {
            squares[i].classList.add('power-pellet')
        }
    }
}

const dotEaten = () => {
    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
        score++;
        scoreEl.innerHTML = score;
        squares[pacmanCurrentIndex].classList.remove('pac-dot')
    }
}

const checkGameOver = () => {
  if(squares[pacmanCurrentIndex].classList.contains('ghost') &&
  !squares[pacmanCurrentIndex].classList.contains('scared-ghost')) {
    ghosts.forEach(ghost => clearInterval(ghost.timerId));
    document.removeEventListener('keyup', movePacman);
    scoreEl.innerHTML = 'YOU LOST!'
  }
}

const checkForWin = () => {
  if(score === 274) {
    ghosts.forEach(ghost => clearInterval(ghost.timerId));
    document.removeEventListener('keyup', movePacman);
    scoreEl.innerHTML = 'YOU WON!'
  }
}

const unScareGhost = () => ghosts.forEach(ghost => ghost.isScared = false)

const powerPalletEaten = () => {
  if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
    score += 10;
    ghosts.forEach(ghost => ghost.isScared = true);
    setTimeout(unScareGhost, 10000);
    squares[pacmanCurrentIndex].classList.remove('power-pellet')
  }
}

const moveGhost = (ghost) => {
  const directions = [-1, +1, WIDTH, -WIDTH];

  let direction = directions[Math.floor(Math.random() * directions.length)];

  ghost.timerId = setInterval(() => {
    if  (!squares[ghost.currentIndex + direction].classList.contains('ghost') &&
    !squares[ghost.currentIndex + direction].classList.contains('wall') ) {
      //remove the ghosts classes
      squares[ghost.currentIndex].classList.remove(ghost.className)
      squares[ghost.currentIndex].classList.remove('ghost', 'scared-ghost')
      //move into that space
      ghost.currentIndex += direction
      squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
  //else find a new random direction ot go in
  } else direction = directions[Math.floor(Math.random() * directions.length)]

  //if the ghost is currently scared
  if (ghost.isScared) {
    squares[ghost.currentIndex].classList.add('scared-ghost')
  }

  //if the ghost is currently scared and pacman is on it
  if(ghost.isScared && squares[ghost.currentIndex].classList.contains('pac-man')) {
    squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost')
    ghost.currentIndex = ghost.startIndex
    score +=100
    squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
  }
  checkGameOver()
  }, ghost.speed)
}

const movePacman = (e) => {
    squares[pacmanCurrentIndex].classList.remove('pac-man')
    switch(e.keyCode) {
        case 37:
        if(
          pacmanCurrentIndex % WIDTH !== 0 &&
          !squares[pacmanCurrentIndex -1].classList.contains('wall') &&
          !squares[pacmanCurrentIndex -1].classList.contains('ghost-lair')
          )
        pacmanCurrentIndex -= 1
        if (squares[pacmanCurrentIndex -1] === squares[363]) {
          pacmanCurrentIndex = 391
        }
        break
      case 38:
        if(
          pacmanCurrentIndex - WIDTH >= 0 &&
          !squares[pacmanCurrentIndex -WIDTH].classList.contains('wall') &&
          !squares[pacmanCurrentIndex -WIDTH].classList.contains('ghost-lair')
          ) 
        pacmanCurrentIndex -= WIDTH
        break
      case 39:
        if(
          pacmanCurrentIndex % WIDTH < WIDTH - 1 &&
          !squares[pacmanCurrentIndex +1].classList.contains('wall') &&
          !squares[pacmanCurrentIndex +1].classList.contains('ghost-lair')
        )
        pacmanCurrentIndex += 1
        if (squares[pacmanCurrentIndex +1] === squares[392]) {
          pacmanCurrentIndex = 364
        }
        break
      case 40:
        if (
          pacmanCurrentIndex + WIDTH < WIDTH * WIDTH &&
          !squares[pacmanCurrentIndex +WIDTH].classList.contains('wall') &&
          !squares[pacmanCurrentIndex +WIDTH].classList.contains('ghost-lair')
        )
        pacmanCurrentIndex += WIDTH
        break
    }

    squares[pacmanCurrentIndex].classList.add('pac-man');

    dotEaten();
    powerPalletEaten();
    checkGameOver();
    checkForWin();
}


document.addEventListener('keyup', movePacman)

createBoard();
squares[pacmanCurrentIndex].classList.add('pac-man');

ghosts.forEach(ghost => {
  squares[ghost.currentIndex].classList.add(ghost.className);
  squares[ghost.currentIndex].classList.add('ghost');
  moveGhost(ghost);
})