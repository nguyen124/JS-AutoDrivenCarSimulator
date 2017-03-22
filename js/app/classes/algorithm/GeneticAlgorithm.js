define(['Class', 'Genome', 'Util'], function (Class, Genome, Util) {
	"use strict"
	var MAX_PERMUTATION = 0.3;
	var MUTATION_RATE = 0.15;
	var GeneticAlgorithm = Class.extend({
			init : function() {
				this.currentGenome = -1;
				this.totalPopulation = 0;
				this.genomeID = 0;
				this.generation = 1;
				this.population = [];
			},
			generateNewPopulation: function (totalPop, totalWeights) {
				this.generation = 1;
				this.clearPopulation();
				this.currentGenome = -1;
				this.totalPopulation = totalPop;
				for (var i = 0; i < this.totalPopulation; i++) {
					var genome = new Genome();
					genome.ID = this.genomeID;
					genome.fitness = 0.0;
					genome.weights = [];
					for (var j = 0; j < totalWeights; j++) {
						genome.weights.push(Util.RandomSigmoid());
					}
					this.genomeID++;
					this.population.push(genome);
				}
			},
			setGenomeFitness: function (fitness, index) {
				if (index >= this.population.length || index < 0) {
					return;
				}
				this.population[index].fitness = fitness;
			},
			getNextGenome: function () {
				this.currentGenome++;
				if (this.currentGenome >= this.population.length) {
					return null;
				}
				return this.population[this.currentGenome];
			},
			clearPopulation: function () {
				this.population = [];
			},
			/*
			 * This function will generate new population of genomes based on best 4
			 * genomes (genomes which have highest fitness). The best genomes will be
			 * mixed up and mutated to create new genomes.
			 */
			breedPopulation: function () {
				var bestGenomes = [];
				// Find the 4 best genomes which have highest fitness.
				var bestGenomes = this.getBestGenomes(4);
				var children = [];
				// Carry on the best genome.
				var bestGenome = new Genome();
				bestGenome.fitness = 0.0;
				bestGenome.ID = bestGenomes[0].ID;
				bestGenome.weights = bestGenomes[0].weights;
				// mutate few gene of genome to create new genome
				this.mutate(bestGenome);
				children.push(bestGenome);
				// Child genomes.
				var crossedOverGenomes;
				// Breed with genome 0.
				crossedOverGenomes = this.crossOver(bestGenomes[0], bestGenomes[1]);
				this.mutate(crossedOverGenomes[0]);
				this.mutate(crossedOverGenomes[1]);
				children.push(crossedOverGenomes[0]);
				children.push(crossedOverGenomes[1]);
				crossedOverGenomes = this.crossOver(bestGenomes[0], bestGenomes[2]);
				this.mutate(crossedOverGenomes[0]);
				this.mutate(crossedOverGenomes[1]);
				children.push(crossedOverGenomes[0]);
				children.push(crossedOverGenomes[1]);
				crossedOverGenomes = this.crossOver(bestGenomes[0], bestGenomes[3]);
				this.mutate(crossedOverGenomes[0]);
				this.mutate(crossedOverGenomes[1]);
				children.push(crossedOverGenomes[0]);
				children.push(crossedOverGenomes[1]);

				// Breed with genome 1.
				crossedOverGenomes = this.crossOver(bestGenomes[1], bestGenomes[2]);
				this.mutate(crossedOverGenomes[0]);
				this.mutate(crossedOverGenomes[1]);
				children.push(crossedOverGenomes[0]);
				children.push(crossedOverGenomes[1]);
				crossedOverGenomes = this.crossOver(bestGenomes[1], bestGenomes[3]);
				this.mutate(crossedOverGenomes[0]);
				this.mutate(crossedOverGenomes[1]);
				children.push(crossedOverGenomes[0]);
				children.push(crossedOverGenomes[1]);
				// For the remainding n population, add some random genomes.
				var remainingChildren = (this.totalPopulation - children.length);
				for (var i = 0; i < remainingChildren; i++) {
					children.push(this.createNewGenome(bestGenomes[0].weights.length));
				}
				this.clearPopulation();
				this.population = children;
				this.currentGenome = -1;
				this.generation++;
			},
			createNewGenome : function (totalWeights) {
				var genome = new Genome();
				genome.ID = this.genomeID;
				genome.fitness = 0.0;
				genome.weights = [];
				for (var j = 0; j < totalWeights; j++) {
					genome.weights.push(Util.RandomSigmoid());
				}
				this.genomeID++;
				return genome;
			},
			/*
			 * This function will mix up two genomes to create 2 other new genomes
			 */
			crossOver: function (g1, g2) {
				// Select a random cross over point.
				var totalWeights = g1.weights.length;
				var crossover = Math.abs(Util.random() * Number.MAX_VALUE) % totalWeights;
				var genomes = [];
				var genome1 = new Genome();
				genome1.ID = this.genomeID;
				genome1.weights = [];
				this.genomeID++;
				var genome2 = new Genome();
				genome2.ID = this.genomeID;
				genome2.weights = [];
				this.genomeID++;
				// Go from start to crossover point, copying the weights from g1 to children.
				for (var i = 0; i < crossover; i++) {
					genome1.weights.push(g1.weights[i]);
					genome2.weights.push(g2.weights[i]);
				}
				// Go from start to crossover point, copying the weights from g2 to children.
				for (var i = crossover; i < totalWeights; i++) {
					genome1.weights.push(g2.weights[i]);
					genome2.weights.push(g1.weights[i]);
				}
				genomes.push(genome1);
				genomes.push(genome2);
				return genomes;
			},

			/*
			 * Generate a random chance of mutating the weight in the genome.
			 */
			mutate: function (genome) {
				for (var i = 0; i < genome.weights.length; ++i) {
					var randomSigmoid = Util.RandomSigmoid();
					if (randomSigmoid < MUTATION_RATE) {
						genome.weights[i] = genome.weights[i] + (randomSigmoid * MAX_PERMUTATION);
					}
				}
			},

			/*
			 * Get the best genomes to breed new population
			 */
			getBestGenomes: function (totalGenomes) {
				var genomeCount = 0;
				var runCount = 0;
				var bestGenomes = [];
				while (genomeCount < totalGenomes) {
					if (runCount > 10) {
						break;
					}
					runCount++;
					// Find the best cases for cross breeding based on fitness score.
					var bestFitness = 0;
					var bestIndex = -1;
					for (var i = 0; i < this.totalPopulation; i++) {
						if (this.population[i].fitness > bestFitness) {
							var isUsed = false;
							for (var j = 0; j < bestGenomes.length; j++) {
								if (bestGenomes[j].ID == this.population[i].ID) {
									isUsed = true;
								}
							}
							if (isUsed == false) {
								bestIndex = i;
								bestFitness = this.population[bestIndex].fitness;
							}
						}
					}
					if (bestIndex != -1) {
						genomeCount++;
						bestGenomes.push(this.population[bestIndex]);
					}
				}
				return bestGenomes;
			},
			getCurrentGeneration: function () {
				return this.generation;
			},
			getCurrentGenomeIndex: function () {
				return this.currentGenome;
			}
		})
		GeneticAlgorithm.MAX_PERMUTATION = MAX_PERMUTATION;
	GeneticAlgorithm.MUTATION_RATE = MUTATION_RATE;
	return GeneticAlgorithm;
})
