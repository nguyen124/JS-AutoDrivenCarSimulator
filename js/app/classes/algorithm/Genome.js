 define(['Class'], function(Class){
	 "use strict"
	var Genome = Class.extend({
		init: function(_id,_fitness,weights){
			this.ID = _id;
			this.fitness = _fitness;
			this.weights = weights;		
		}
	});
	return Genome;
 })