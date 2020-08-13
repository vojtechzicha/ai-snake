/*
const output_template = {
  north: 1,
  east: 0,
  south: 0,
  west: 0
}
*/

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

const evaluate = (snake, x, y, tiles) => {
  if (x < 0 || x >= tiles || y < 0 || y >= tiles) return 0
  if (snake.find(sp => sp.x === x && sp.y === y) !== undefined) return 0
  return 1
}

const findFood = (dir, x, y, food, tiles) => {
  let distance = 0
  for (
    let ix = x, iy = y;
    ix < tiles && ix >= 0 && iy < tiles && iy >= 0;
    ix += dir === 'west' ? -1 : dir === 'east' ? 1 : 0,
      iy += dir === 'north' ? -1 : dir === 'south' ? 1 : 0
  ) {
    if (food.x === ix && food.y === iy) {
      break
    } else {
      distance += 1
    }
  }
  return -1
}

const findWall = (dir, x, y, snake, tiles) => {
  let distance = 0
  for (
    let ix = x, iy = y;
    ix < tiles && ix >= 0 && iy < tiles && iy >= 0;
    ix += dir === 'west' ? -1 : dir === 'east' ? 1 : 0,
      iy += dir === 'north' ? -1 : dir === 'south' ? 1 : 0
  ) {
    if (snake.find(sp => sp.x === ix && sp.y === iy) !== undefined) {
      break
    } else {
      distance += 1
    }
  }
  return distance
}

const rel = (currentDirection, relativeDirection) => {
  if (currentDirection === directions.NORTH) {
    return relativeDirection === 'top' ? 'north' : relativeDirection === 'left' ? 'east' : 'west'
  } else if (currentDirection === directions.SOUTH) {
    return relativeDirection === 'top' ? 'south' : relativeDirection === 'left' ? 'west' : 'east'
  } else if (currentDirection === directions.WEST) {
    return relativeDirection === 'top' ? 'west' : relativeDirection === 'left' ? 'south' : 'north'
  } else {
    return relativeDirection === 'top' ? 'east' : relativeDirection === 'left' ? 'north' : 'south'
  }
}

const getMoves = (dir, cur, genome, snake, food, tiles) => {
  // topWall: 0,
  // topFood: 0,
  // leftWall: 0,
  // leftFood: 0,
  // rightWall: 0,
  // rightFood: 0
  const x = snake[0].x,
    y = snake[0].y

  return (
    genome[0 + dir * 6] * findWall(rel(cur, 'top'), x, y, snake, tiles) +
    genome[1 + dir * 6] * findFood(rel('top'), x, y, food, tiles) +
    genome[2 + dir * 6] * findWall(rel(cur, 'left'), x, y, snake, tiles) +
    genome[3 + dir * 6] * findFood(rel('left'), x, y, food, tiles) +
    genome[4 + dir * 6] * findWall(rel(cur, 'right'), x, y, snake, tiles) +
    genome[5 + dir * 6] * findFood(rel('right'), x, y, food, tiles)
  )
}

const playGame = (genome, tiles, rng) => {
  let food = null,
    snake = [],
    steps = 0,
    empties = 0

  let state = states.NOT_STARTED,
    currentDirection = directions.NORTH,
    game = []

  while (state !== states.WINNER && state !== states.LOSER) {
    // Perform game logic
    switch (state) {
      case states.NOT_STARTED:
        // Generate snake
        snake = [{ x: rng.nextRange(0, tiles), y: rng.nextRange(0, tiles) }]

        // Generate food
        do {
          food = { x: rng.nextRange(0, tiles), y: rng.nextRange(0, tiles) }
          // eslint-disable-next-line no-loop-func
        } while (snake.find(sp => sp.x === food.x && sp.y === food.y) !== undefined)

        // Change state
        state = states.IN_PROGRESS
        break
      case states.IN_PROGRESS:
        // Store game state
        game.push({ food, snake })

        // Start calculation
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

        if (nextX < 0 || nextX >= tiles || nextY < 0 || nextY >= tiles) {
          // out of bounds
          currentDirection = null
          state = states.LOSER
        } else if (
          snake.find(sp => sp.x === nextX && sp.y === nextY) === undefined &&
          !(food.x === nextX && food.y === nextY)
        ) {
          // empty field
          snake = [{ x: nextX, y: nextY }, ...snake.slice(0, snake.length - 1)]
          empties += 1
        } else if (nextX === food.x && nextY === food.y) {
          // found food - let's grow
          snake = [{ x: nextX, y: nextY }, ...snake]
          empties = 0

          // Check for winning
          if (snake.length === (tiles - 1) * (tiles - 1)) {
            currentDirection = null
            state = states.WINNER
          } else {
            // Generate food
            do {
              food = { x: rng.nextRange(0, tiles), y: rng.nextRange(0, tiles) }
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

    // Calculate inputs
    // const inputs = []
    const moves = [
      getMoves(0, currentDirection, genome, snake, food, tiles),
      getMoves(1, currentDirection, genome, snake, food, tiles),
      getMoves(2, currentDirection, genome, snake, food, tiles),
      getMoves(3, currentDirection, genome, snake, food, tiles)
    ]

    // Perform AI move
    // const moves = [
    //     getMove(inputs, genome, 0),
    //     getMove(inputs, genome, 1),
    //     getMove(inputs, genome, 2),
    //     getMove(inputs, genome, 3)
    //   ],
    //   moveIndex = moves.findIndex(v => v === Math.max(...moves))
    const moveIndex = moves.findIndex(v => v === Math.max(...moves))

    // console.log(moveIndex)
    if (empties >= tiles * 10 * Math.ceil(snake.length / 5)) {
      currentDirection = directions.NORTH
    } else if (moveIndex === 0) {
      currentDirection = directions.NORTH
    } else if (moveIndex === 1) {
      currentDirection = directions.SOUTH
    } else if (moveIndex === 2) {
      currentDirection = directions.EAST
    } else {
      currentDirection = directions.WEST
    }

    // Increment steps
    steps += 1
  }

  return {
    fitness: 100 * snake.length + steps,
    game
  }
}

export { playGame }
