define(['Class', 'GeneticAlgorithm', 'Genome', 'NeuralNetwork', 'Car'], function (Class, GeneticAlgorithm, Genome, NeuralNetwork, Car) {
	"use strict"
	var HIDDEN_LAYER_NEURONS = 8;
	var MAX_GENOME_POPULATION = 30;
	var CHECK_POINT_BONUS = 15.0;
	var DEFAULT_ROTATION = -Math.PI / 3;
	var NN_OUTPUT_COUNT = 2;
	var EntityManager = Class.extend({
			init: function (_handler) {
				this.totalWeights = Car.FEELER_COUNT * HIDDEN_LAYER_NEURONS + HIDDEN_LAYER_NEURONS * NN_OUTPUT_COUNT + HIDDEN_LAYER_NEURONS + NN_OUTPUT_COUNT;
				this.currentAgentFitness = 0.0;
				this.bestFitness = 0.0;
				this.genAlg = new GeneticAlgorithm();
				this.genAlg.generateNewPopulation(MAX_GENOME_POPULATION, this.totalWeights);
				this.neuralNet = new NeuralNetwork();
				this.neuralNet.fromGenome(this.genAlg.getNextGenome(), Car.FEELER_COUNT,
					HIDDEN_LAYER_NEURONS, NN_OUTPUT_COUNT);
				/*this.levels = [];
				levels.push(new SpawnLevel("/levels/SecondLevel.png"));
				levels.push(new SpawnLevel("/levels/SecondLevel2.png"));
				levels.push(new SpawnLevel("/levels/SecondLevel3.png"));*/
				//checkpoints = loadCheckPoints("/checkpoints2.csv");
				//levelIdx = 0;
				this.car = new Car(_handler, 16 * 1, 16 * 6, this.neuralNet);
				//car.attach(neuralNet);
			},
			nextTestSubject: function () {
				this.genAlg.setGenomeFitness(this.currentAgentFitness, this.genAlg.getCurrentGenomeIndex());
				this.currentAgentFitness = 0;
				var genome = this.genAlg.getNextGenome();
				this.neuralNet.fromGenome(genome, Car.FEELER_COUNT,
					EntityManager.HIDDEN_LAYER_NEURONS,
					EntityManager.NN_OUTPUT_COUNT);
				this.car.setX(16);
				this.car.setY(16 * 6);
				this.car.setAngle(0);
				this.car.attach(this.neuralNet);
				this.car.clearFailure();
				// Reset the checkpoint flags
				//for (ar i = 0; i < checkpoints.length; i++) {
				//	checkpoints.get(i).setActive(true);
				//}
			},
			/*
			 * Make new population after the old population failed to help the car finishing the track.
			 */
			evolveGenomes: function () {
				this.genAlg.breedPopulation();
				this.nextTestSubject();
			},

			tick: function (_dt) {
				if (this.car.hasFailed()) {
					if (this.genAlg.getCurrentGenomeIndex() == MAX_GENOME_POPULATION - 1) {
						this.evolveGenomes();
					} else {
						this.nextTestSubject();
					}
				}
				this.car.tick(_dt);
				this.currentAgentFitness += this.car.getDistanceDelta() / 2.0;
				if (this.currentAgentFitness > this.bestFitness) {
					this.bestFitness = this.currentAgentFitness;
				}
				/* Test the agent against the active checkpoints.
				for (var i = 0; i < checkpoints.length; i++) {
				// See if the checkpoint has already been hit.
				if (!checkpoints.get(i).isActive())
				continue;
				Rectangle2D rec = car.getCarBound();
				if (checkpoints.get(i).checkIntersect(rec)) {
				// Each time a check point hit, the fitness gets a bonus of 15
				currentAgentFitness += CHECK_POINT_BONUS;
				checkpoints.get(i).setActive(false);
				if (currentAgentFitness > bestFitness) {
				bestFitness = currentAgentFitness;
				}
				return;
				}
				}*/

			},
			render: function (_g) {
				this.car.render(_g);
				_g.fillText("Best fitness so far: " + this.bestFitness, 5, 10);
				_g.fillText("Car fitness : " +this.currentAgentFitness, 5, 25);
			},

			/*
			 * Force to create new genomes in case the car is stucked moving in circle.
			 */
			forceToNextAgent: function () {
				if (this.genAlg.getCurrentGenomeIndex() == MAX_GENOME_POPULATION - 1) {
					this.evolveGenomes();
					return;
				}
				this.nextTestSubject();
			},

			/*
			 * Change the map to see how the car move with new map

			nextMapIndex : function() {
			levelIdx++;
			if (levelIdx >= levels.length) {
			levelIdx = 0;
			}
			switch (levelIdx) {
			case 0:
			TileCoordinate tileCoor0 = new TileCoordinate(5, 10);
			DEFAULT_POSITION.setLocation(tileCoor0.getX(), tileCoor0.getY());
			car.setPosition(tileCoor0.getX(), tileCoor0.getY());
			car.setLevel(levels.get(levelIdx));
			car.attach(neuralNet);
			checkpoints = loadCheckPoints("/checkpoints2.csv");
			break;
			case 1:
			TileCoordinate tileCoor1 = new TileCoordinate(8, 17);
			DEFAULT_POSITION.setLocation(tileCoor1.getX(), tileCoor1.getY());
			car.setPosition(tileCoor1.getX(), tileCoor1.getY());
			car.setLevel(levels.get(levelIdx));
			car.attach(neuralNet);
			checkpoints = new ArrayList<Checkpoint>();
			break;
			case 2:
			TileCoordinate tileCoor2 = new TileCoordinate(17, 22);
			DEFAULT_POSITION.setLocation(tileCoor2.getX(), tileCoor2.getY());
			car.setPosition(tileCoor2.getX(), tileCoor2.getY());
			car.setLevel(levels.get(levelIdx));
			car.attach(neuralNet);
			checkpoints = new ArrayList<Checkpoint>();
			break;
			}
			}
			 */
		});
	EntityManager.HIDDEN_LAYER_NEURONS = HIDDEN_LAYER_NEURONS;
	EntityManager.MAX_GENOME_POPULATION = MAX_GENOME_POPULATION;
	EntityManager.CHECK_POINT_BONUS = CHECK_POINT_BONUS;
	EntityManager.DEFAULT_ROTATION = DEFAULT_ROTATION;
	EntityManager.NN_OUTPUT_COUNT = NN_OUTPUT_COUNT;
	return EntityManager;
});
