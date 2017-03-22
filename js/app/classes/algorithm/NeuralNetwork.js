define(['Class', 'NeuronsLayer', 'Genome', 'Neuron'], function (Class, NeuronsLayer, Genome, Neuron) {
	var NeuralNetwork = Class.extend({
			init: function () {
				this.inputAmount = 0;
				this.outputAmount = 0;
				this.outputs = [];
				this.inputs = [];
				this.hiddenLayers = [];
				this.outputLayer = null;
			},
			/*
			 * receive input from sensors of car which is normalized distance from
			 * center of car to the wall.
			 */
			setInput: function (normalizedDepths) {
				this.inputs = [];
				for (var i = 0; i < normalizedDepths.length; i++) {
					inputs.push(normalizedDepths[i]);
				}
			},
			update: function () {
				this.outputs = [];
				for (var i = 0; i < this.hiddenLayers.length; i++) {
					if (i > 0) {
						this.inputs = this.outputs;
					}
					// each hidden layer calculates the outputs based on inputs
					// from sensors of the car
					this.hiddenLayers[i].evaluate(this.inputs, this.outputs);
				}
				// the outputs of HiddenLayers will be used as input for
				// OutputLayer
				this.inputs = this.outputs.slice();
				// The output layer will give out the final outputs
				this.outputLayer.evaluate(this.inputs, this.outputs);
			},
			getOutput: function (index) {
				if (index >= this.outputAmount) {
					return 0.0;
				}
				return this.outputs[index];
			},
			releaseNet: function () {
				// inputLayer = null;
				this.outputLayer = null;
				this.hiddenLayers = null;
			},

			/*
			 * Neural network receives weights from genome to make new HiddenLayers and
			 * OutputLayer.
			 */
			fromGenome: function (genome, numOfInputs, neuronsPerHidden, numOfOutputs) {
				if (genome == null) {
					return;
				}
				this.releaseNet();
				this.hiddenLayers = [];
				this.outputAmount = numOfOutputs;
				this.inputAmount = numOfInputs;
				var hiddenLayer = new NeuronsLayer();
				var neurons = [];
				for (var i = 0; i < neuronsPerHidden; i++) {
					var weights = [];
					for (var j = 0; j < numOfInputs + 1; j++) {
						weights.push(genome.weights[i * neuronsPerHidden + j]);
					}
					var n = new Neuron();
					n.init(weights, numOfInputs);
					neurons.push(n);
				}
				hiddenLayer.loadLayer(neurons);
				this.hiddenLayers.push(hiddenLayer);
				// Clear weights and reasign the weights to the output.
				var neuronsOut = [];
				for (var i = 0; i < numOfOutputs; i++) {
					var weights = [];
					for (var j = 0; j < neuronsPerHidden + 1; j++) {
						weights.push(genome.weights[i * neuronsPerHidden + j]);
					}
					var n = new Neuron();
					n.init(weights, neuronsPerHidden);
					neuronsOut.push(n);
				}
				this.outputLayer = new NeuronsLayer();
				this.outputLayer.loadLayer(neuronsOut);
			}
		});
	return NeuralNetwork;
})
