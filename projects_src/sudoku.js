
// This method takes one parameter:
// 	obj - the object to search for in the array. the object must be of the
// 	      same type as the objects stored in the array.
Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}

// This clear method resets the values in the array to zero.
Array.prototype.clear = function() {
	var i = this.length;
	while (i--) {
		this[i] = 0;
	}
}

// The timeDiff object is used for debugging, calculating the execution time for
// the board generation algorithm. It may in the future be used to measure the
// time it takes for the user to solve the puzzle.
var timeDiff  =  {
	// this method marks the beginning of an event.
	start:function (){
		d = new Date();
		time  = d.getTime();
	},

	// this method returns the time elapsed in milliseconds since the
	// beginning of an event.
	end:function (){
		d = new Date();
		return (d.getTime()-time);
	}
}

// The Sudoku class stores the matrix array and implements the game logic.
// Instantiation of this class will automatically generate a new puzzle.
function Sudoku() {
	// 'private' methods...
	this.newGame = function() {
		this.matrix.clear();

		switch(this.level){
			// Medium
			case 1:
				this.matrix=("000540008600002300007003090031050020000000000040030710090700200008600005100024000").split``.map(x=>+x)
				break;
			// Hard
			case 2:
				this.matrix=("070042000000008610390000007000004009003000700500100000800000076054800000000610050").split``.map(x=>+x)
				break;

			// Manual
			case 3:
				break;

			// Easy
			default:
				this.matrix=("608702100400010002025400000701080405080000070509060301000006750200090008006805203").split``.map(x=>+x)
				break;
		}
	}
	// stores the 9x9 game data. the puzzle data is stored with revealed
	// numbers as 1-9 and hidden numbers for the user to discover as zeros.
	this.matrix = new Array(81);

	// initial puzzle is all zeros.
	this.matrix.clear();

	// stores the difficulty level of the puzzle 0 is easiest.
	this.level = 0;

	this.setVal = function(row, col, val)
	{
		this.matrix[row * 9 + col] = val;
	}

	this.getVal = function(row, col)
	{
		return this.matrix[row * 9 + col];
	}

	this.getBoardString = function()
	{
		var str = "";
       		for(var i = 0; i < 81; i++)
        	{
			str += this.matrix[i];
	        }

		str = str = str.replace(/0/g, '.');
        	return str;
	}

}






