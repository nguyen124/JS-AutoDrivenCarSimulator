define(['Class'], function(){
	var Neuron = Class.extend({
		init: function(weightsIn, numOfInputs){
			this.numberOfInputs = numOfInputs;
			this.weights = weightsIn;
		}
	});
	return Neuron;
});