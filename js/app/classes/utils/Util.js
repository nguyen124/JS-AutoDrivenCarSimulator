define(['Jquery'],function($){
	var Util = {};
	Util.loadFileAsString = function(_path){
		var string = "";
		// Check for the various File API support.
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			var reader = new FileReader();
			string = reader.readAsText(_path);
		} else {
		  alert('The File APIs are not fully supported in this browser.');
		}		
		return string;
	}
	Util.RandomSigmoid = function(){		
		var r =  Math.random() -  Math.random();
		return r;
	}
	/*
	 * normalize value to make it from 1 to -1
	 */
	Util.Sigmoid = function( a,  p) {
		var ap = (-a) / p;
		return (1 / (1 + Math.exp(ap)));
	}

	/*
	 * compare value of a to b and c. If is smaller then b or greater than c, a will become b or c
	 */
	Util.getValueInRange = function(a, b, c) {
		if (a < b) {
			return b;
		} else if (a > c) {
			return c;
		}		
		return a;
	}
	return Util;
})