define(['Class', 'Neuron', 'Util'], function (Class, Neuron, Util) {
	"use strict"
	var BIAS = -1;
	var NeuronsLayer = Class.extend({
			init: function () {
				this.neurons = [];
				this.totalNeurons = 0;
			},
			evaluate: function (inputs, outputs) {
				var inputIndex = 0;
				for (var i = 0; i < this.totalNeurons; i++) {
					var activation = 0.0;					
					var numOfInputs = this.neurons[i].numberOfInputs;
					var neuron = this.neurons[i];
					// sum the weights up to numberOfInputs-1 and add the bias
					for (var j = 0; j < numOfInputs - 1; j++) {
						if (inputIndex < inputs.length) {
							activation += inputs[inputIndex] * neuron.weights[j];
							inputIndex++;
						}
					}
					// Add the bias.
					activation += neuron.weights[numOfInputs] * BIAS;
					outputs.push(Util.Sigmoid(activation, 1.0));
					inputIndex = 0;
				}
			},
			getWeights: function () {
				// Calculate the size of the output vector by calculating the amount of
				// weights in each neurons.
				var out = [];
				for (var i = 0; i < this.totalNeurons; i++) {
					var n = this.neurons[i];
					for (var j = 0; j < n.weights.length; j++) {
						out.push(n.weights[j]);
					}
				}
				return out;
			},
			loadLayer: function (neurons) {
				this.totalNeurons = neurons.length;
				this.neurons = neurons;
			}
		});
	NeuronsLayer.BIAS = -1;
	return NeuronsLayer;
});
