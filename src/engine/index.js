const TILES = 25

let food = null,
  snake = []
const states = {
  NOT_STARTED: 0,
  IN_PROGRESS: 1,
  WINNER: 2,
  LOSER: 3
}
const directions = {
  NORTH: 0,
  WEST: 1,
  SOUTH: 2,
  EAST: 3
}
let state = states.NOT_STARTED,
  currentDirection = null,
  keys = [],
  pressed = []

// const randomColor = () =>
//   [...Array(6)]
//     .map(() => {
//       const val = Math.floor(Math.random() * 16)

//       if (val < 10) {
//         return val.toString()
//       } else {
//         return String.fromCharCode(val + 87)
//       }
//     })
//     .join('')
const randomInt = max => Math.floor(Math.random() * Math.floor(max))

const update = (canvas, ctx) => {
  canvas.addEventListener('keydown', e => {
    if (!pressed.includes(e.code)) {
      keys.unshift(e.code)
      pressed.push(e.code)
    }
  })
  canvas.addEventListener('keyup', e => {
    if (pressed.includes(e.code)) {
      pressed = pressed.filter(v => v !== e.code)
    }
  })

  if (keys.length > 0) {
    console.log(keys)
    const code = keys.pop()
    if (state !== states.WINNER && state !== states.LOSER) {
      switch (code) {
        case 'ArrowLeft':
          if (currentDirection !== directions.WEST) {
            currentDirection = directions.EAST
          }
          break
        case 'ArrowUp':
          if (currentDirection !== directions.SOUTH) {
            currentDirection = directions.NORTH
          }
          break
        case 'ArrowDown':
          if (currentDirection !== directions.NORTH) {
            currentDirection = directions.SOUTH
          }
          break
        case 'ArrowRight':
          if (currentDirection !== directions.EAST) {
            currentDirection = directions.WEST
          }
          break
        default:
          break
      }
    }
  }

  switch (state) {
    case states.NOT_STARTED:
      if (currentDirection !== null) {
        // Generate snake
        snake = [{ x: randomInt(TILES), y: randomInt(TILES) }]

        // Generate food
        do {
          food = { x: randomInt(TILES), y: randomInt(TILES) }
          // eslint-disable-next-line no-loop-func
        } while (snake.find(sp => sp.x === food.x && sp.y === food.y) !== undefined)

        // Change state
        state = states.IN_PROGRESS
      }
      break
    case states.IN_PROGRESS:
      const currentX = snake[0].x,
        currentY = snake[0].y,
        nextX =
          currentX +
          (currentDirection === directions.EAST
            ? -1
            : currentDirection === directions.WEST
            ? 1
            : 0),
        nextY =
          currentY +
          (currentDirection === directions.NORTH
            ? -1
            : currentDirection === directions.SOUTH
            ? 1
            : 0)

      if (nextX < 0 || nextX >= TILES || nextY < 0 || nextY >= TILES) {
        // out of bounds
        currentDirection = null
        state = states.LOSER
      } else if (
        snake.find(sp => sp.x === nextX && sp.y === nextY) === undefined &&
        !(food.x === nextX && food.y === nextY)
      ) {
        // empty field
        snake = [{ x: nextX, y: nextY }, ...snake.slice(0, snake.length - 1)]
      } else if (nextX === food.x && nextY === food.y) {
        // found food - let's grow
        snake = [{ x: nextX, y: nextY }, ...snake]

        // Check for winning
        if (snake.length === (TILES - 1) * (TILES - 1)) {
          currentDirection = null
          state = states.WINNER
        } else {
          // Generate food
          do {
            food = { x: randomInt(TILES), y: randomInt(TILES) }
            // eslint-disable-next-line no-loop-func
          } while (snake.find(sp => sp.x === food.x && sp.y === food.y) !== undefined)
        }
      } else if (snake.find(sp => sp.x === nextX && sp.y === nextY) !== undefined) {
        // intersecting
        currentDirection = null
        state = states.LOSER
      } else {
        console.log({
          current: { x: currentX, y: currentY },
          next: { x: nextX, y: nextY },
          snake,
          food
        })
        alert('ERROR')
        currentDirection = null
        state = states.LOSER
      }
      break
    default:
      break
  }
}

const draw = (canvas, ctx) => {
  const bound = canvas.getBoundingClientRect()

  const rectWidth = Math.floor(bound.width / TILES)
  const rectHeight = Math.floor(bound.height / TILES)

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, bound.width, bound.height)

  for (let row = 0; row < TILES; row += 1) {
    for (let col = 0; col < TILES; col += 1) {
      const color =
        food !== null && food.x === row && food.y === col
          ? 'red'
          : snake.find(sp => sp.x === row && sp.y === col) !== undefined
          ? 'white'
          : 'black'
      const offset = color === 'black' ? 0 : Math.ceil(rectHeight / 8)

      ctx.fillStyle = color
      ctx.fillRect(
        rectWidth * row + offset,
        rectHeight * col + offset,
        rectWidth - offset,
        rectHeight - offset
      )
    }
  }

  if (state === states.WINNER) {
    ctx.fillStyle = 'blue'
    ctx.font = 'bold 16px Arial'
    ctx.fillText('Winner!', 20, 20)
  } else if (state === states.NOT_STARTED) {
    ctx.fillStyle = 'blue'
    ctx.font = 'bold 16px Arial'
    ctx.fillText("Let's start!", 20, 20)
  } else if (state === states.LOSER) {
    ctx.fillStyle = 'blue'
    ctx.font = 'bold 16px Arial'
    ctx.fillText(':( Try harder next time!', 20, 20)
  }
}

export { update, draw }
