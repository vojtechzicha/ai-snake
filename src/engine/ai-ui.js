import { generateNewPopulation, playGeneration, produceNewGeneration } from './ai'

const TILES = 10,
  POPULATION = 1000

let generationId = 0,
  people = null,
  currentGame = null,
  currentGameIndex = null

const update = (canvas, ctx) => {
  if (people === null) {
    // Create new populationo
    people = generateNewPopulation(POPULATION)
    generationId = 1

    currentGame = playGeneration(people, TILES)
    currentGameIndex = 0
    return
  }

  if (currentGame !== null && currentGame[currentGameIndex] !== undefined) {
    // Update the view of the game
    currentGameIndex += 1
    return
  }

  if (currentGame !== null) {
    // Generate children
    do {
      people = produceNewGeneration(people, POPULATION)
      generationId += 1

      currentGame = playGeneration(people, TILES)
      currentGameIndex = 0
    } while (generationId % 10 !== 0)
  }

  return () => {}
}

const draw = (canvas, ctx) => {
  const bound = canvas.getBoundingClientRect()

  const rectWidth = Math.floor(bound.width / TILES)
  const rectHeight = Math.floor(bound.height / TILES)

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, bound.width, bound.height)

  if (
    currentGameIndex !== null &&
    currentGame !== null &&
    currentGame !== undefined &&
    currentGameIndex !== undefined &&
    currentGame[currentGameIndex] !== undefined
  ) {
    let food = currentGame[currentGameIndex].food
    let snake = currentGame[currentGameIndex].snake

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
  }

  ctx.fillStyle = 'blue'
  ctx.font = 'bold 16px Arial'
  ctx.fillText(`Generation ${generationId}`, 20, 20)
}

export { update, draw }
