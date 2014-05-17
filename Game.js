
//Conway's Game Of Life

//Constant Variables
var XSIZE = 1000;
var YSIZE = 1000;

var INTERVAL = 1000; // Number of Milliseconds between each calculation

var STARTEMTPY = false;

var FILL_LIKELYHOOD = 5; //1 in X numer of squares get filled

//Variable Variables
var loop;

var Grid;

var RunOnTick = function(){console.log('no callback')};

exports.Start = function(Xsize, YSize, Interval, StartEmpty, Fill_Likelyhood){

	XSIZE = Xsize;
	YSIZE = YSize;
	INTERVAL = Interval;
	STARTEMTPY = StartEmpty;
	FILL_LIKELYHOOD = Fill_Likelyhood;

	if(STARTEMTPY){
		Grid = CreateEmpty();
	}else{
		Grid = CreateRandom();
	}
	loop = setInterval(CalculateStep, INTERVAL);
}

exports.Stop = function(){
	clearInterval(loop);
}

exports.getGrid = function(){
	return Grid;
}

exports.SetRunOnTick = function(CallBack){
	RunOnTick = CallBack;
}

exports.UseChanges = function(changes){
	console.log('[Game of Life] Commiting Changes');

	for(var x=0;x<changes.length;x++){
		for(var y=0;y<changes[0].length;y++){
			if(changes[x][y] == true){
				Grid[x][y] = true;
				console.log('change made at x: ' + x + ' y: ' + y);
			}
		}
	}
}

var CreateEmpty = function(){

	var newGrid = [];

	for(var x=0; x<XSIZE; x++){
		newGrid[x] = [];
		for(var y=0; y<YSIZE; y++){
			newGrid[x][y] = false;
		}
	}

	return newGrid;

}

var CreateRandom = function(){

	var newGrid = [];

	for(var x=0; x<XSIZE; x++){
		newGrid[x] = [];
		for(var y=0; y<YSIZE; y++){
			newGrid[x][y] = Math.random() < 1/FILL_LIKELYHOOD;
		}
	}


	return newGrid;
}

//Loops trough all the cells and calculates their state
var CalculateStep = function(){

	var beginTime = new Date().getMilliseconds();


	console.log('[Game of Life] Calculating next Step');

	var newGrid = [];

	for(var x=0; x<XSIZE; x++){
		newGrid[x] = [];
		for(var y=0; y<YSIZE; y++){
			newGrid[x][y] = newState(x, y);
		}
	}

	Grid = newGrid;

	var endTime = new Date().getMilliseconds();
	var timePassed = endTime - beginTime;
	console.log('[Game of Life] Finished Calculating Step, took ' + timePassed + ' Milliseconds');

	RunOnTick();
}


//returns a cells new state after this step
var newState = function(x, y){

	var neightbours = CalculateNeighbours(x, y);


	if(Grid[x][y]){
		//If Cell is currently alive

		if(neightbours < 2 || neightbours > 3) return false;
		else return true;

	}else{
		//If Cell is currently dead
		if(neightbours == 3) return true;
		else return false;
	}

}

var CalculateNeighbours = function(x, y){

	var neighbours = 0;

	if(GetValue(x, y+1)) neighbours++;
	if(GetValue(x-1, y+1)) neighbours++;
	if(GetValue(x-1, y)) neighbours++;
	if(GetValue(x-1, y-1)) neighbours++;
	if(GetValue(x, y-1)) neighbours++;
	if(GetValue(x+1, y-1)) neighbours++;
	if(GetValue(x+1, y)) neighbours++;
	if(GetValue(x+1, y+1)) neighbours++;

	return neighbours;

}

var GetValue = function(x, y){

	if(x < 0 || y < 0 || x>=XSIZE || y>=YSIZE) return false;

	else return Grid[x][y];

}

