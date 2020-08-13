import { playGame } from './ai-game'

function RNG(seed) {
  // LCG using GCC's constants
  this.m = 0x80000000 // 2**31;
  this.a = 1103515245
  this.c = 12345

  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1))
}
RNG.prototype.nextInt = function () {
  this.state = (this.a * this.state + this.c) % this.m
  return this.state
}
RNG.prototype.nextFloat = function () {
  // returns in range [0,1]
  return this.nextInt() / (this.m - 1)
}
RNG.prototype.nextRange = function (start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start
  var randomUnder1 = this.nextInt() / this.m
  return start + Math.floor(randomUnder1 * rangeSize)
}
RNG.prototype.choice = function (array) {
  return array[this.nextRange(0, array.length)]
}

const inputs = Object.keys({
  topWall: 0,
  topFood: 0,
  leftWall: 0,
  leftFood: 0,
  rightWall: 0,
  rightFood: 0
}).length

const output_template = {
  north: 1,
  east: 0,
  south: 0,
  west: 0
}

const randomInt = max => Math.floor(Math.random() * Math.floor(max))

const generateGenome = () =>
  [...(Array(inputs * Object.keys(output_template).length) + 2)].map(() => Math.random())

const generateNewPopulation = ceiling => {
  let population = []
  for (let i = 0; i < ceiling; i += 1) {
    let member = {
      genome: generateGenome(),
      fitness: null
    }
    population.push(member)
  }
  return population
}

const playGeneration = (population, tiles, seedInput = null) => {
  let maxFitness = -1,
    game = null

  const seed = seedInput !== null ? seedInput : Math.floor(Math.random() * (0x80000000 - 1))

  for (let i = 0; i < population.length; i += 1) {
    let playStatus = playGame(population[i].genome, tiles, new RNG(seed))
    population[i].fitness = playStatus.fitness

    if (playStatus.fitness > maxFitness) {
      game = playStatus.game
      maxFitness = playStatus.fitness
    }
  }

  console.log(maxFitness, game)
  return game
}

const combine = (parentA, parentB) => {
  return {
    genome: parentA.genome.map((_, i) =>
      Math.random() >= 0.5 ? parentA.genome[i] : parentB.genome[i]
    ),
    fitness: null
  }
}

const MUTATION_FACTOR = 0.2

const mutate = genome => genome.map(val => (Math.random() < MUTATION_FACTOR ? Math.random() : val))

const produceNewGeneration = (population, target) => {
  const parents = [...population]
    .sort((p1, p2) => p2.fitness - p1.fitness)
    .slice(0, Math.ceil(Math.sqrt(target)))
  let children = []

  for (let i = 0; i < parents.length; i += 1) {
    for (let j = 0; j < parents.length; j += 1) {
      children.push(combine(parents[i], parents[j]))
    }
  }

  for (let i = 0; i < parents.length; i += 1) {
    children.push({
      genome: generateGenome(),
      fitness: null
    })
  }

  for (let i = 0; i < Math.ceil(population.length * MUTATION_FACTOR); i += 1) {
    let index = randomInt(children.length)
    children[index].genome = mutate(children[index].genome)
  }

  for (let i = 0; i < parents.length; i += 1) {
    children.push(parents[i])
  }

  return children
}

export { generateNewPopulation, playGeneration, produceNewGeneration }
