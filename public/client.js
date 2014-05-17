window.onload = function(){
	//Canvas code
	var CELLSIZE = 6;

	var Grid;
	var GridWidth;
	var GridHeight;
	var LastClick = {x:0, y:0};

	var mousedown = false;

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var RenderGame = function(grid, redraw){
		console.log('rendering grid');
		var beginTime = new Date().getMilliseconds();
		//Emtpy canvas

		if(redraw){ ctx.clearRect(0,0,canvas.width,canvas.height)};

		//Draw Grid Fill

		for(var x=0; x<GridWidth; x++){
			for(var y=0; y<GridWidth; y++){
				if(grid[x][y]) ctx.fillStyle = "rgba(80, 80, 80, 1)";
				else ctx.fillStyle = "rgba(10, 10, 10, 1)";

				ctx.fillRect(x*CELLSIZE, y*CELLSIZE, CELLSIZE, CELLSIZE);
			}
		}

		//Draw Grid Lines

		ctx.fillStyle = "rgba(100, 100, 100, 1)";

		//Vertical
		for(var x=0;x<GridWidth+1; x++){
			ctx.fillRect(x*CELLSIZE, 0, 1, GridHeight*CELLSIZE);
		}

		//Horizontal
		for(var y=0;y<GridHeight+1; y++){
			ctx.fillRect(0, y*CELLSIZE, GridWidth*CELLSIZE, 1);
		}

		ctx.strokeStyle = 'black';
		ctx.stroke();

		var endTime = new Date().getMilliseconds();
		var timePassed = endTime - beginTime;
		console.log('Finished Rendering Grid, took ' + timePassed + ' Milliseconds');


	}

	var RenderChanges = function(changes){
		for(var x=0;x<changes.length;x++){
			for(var y=0;y<changes[0].length;y++){
				if(changes[x][y] == true){
					Grid[x][y] = true;
				}
			}
		}
		RenderGame(changes, false);
	}

	//Socket networking code
	var socket = io.connect('thekillerremijn.com');

	socket.on('connect', function(){Initialise()});

	socket.on('grid', function(data){
		console.log('Grid recieved');
		Grid = data.grid;
		GridWidth = data.width;
		GridHeight = data.height;
		RenderGame(Grid, true);

		if(!window.changes) window.changes = CreateEmpty();

	});

	var Initialise;
	Initialise = function () {
		// Mouse input and changes code

		console.log('initialising');

		canvas.onmousedown = function (e) {
			mousedown = true;
			mouseClick({button: 'left', position: e, move: false});
		}
		canvas.onmouseup = function () {
			mousedown = false;

		}

		canvas.onmousemove = function (e) {
			if (!mousedown) return;

			mouseClick({button: 'left', position: e, move: true});

		}


		var mouseClick = function (data) {

			var rect = canvas.getBoundingClientRect();

			var clickPosition = {
				x: data.position.clientX - rect.left,
				y: data.position.clientY - rect.top
			};

			console.log('clicked');

			if (data.button == 'left') {

				var SetOn = function (x, y) {
					window.changes[x][y] = true;
					window.clearTimeout(window.timer);
					window.timer = window.setTimeout(CommitChanges, 200);

				}

				var CommitChanges = function () {
					socket.emit('changes', {changes: window.changes});

					window.changes = CreateEmpty();

				}

				//Calculate Grid square based on mouse position

				var gridpoint = {x: Math.floor(clickPosition.x / CELLSIZE), y: Math.floor(clickPosition.y / CELLSIZE)};

				if(data.move == false){
					SetOn(gridpoint.x, gridpoint.y);
					RenderChanges(window.changes);
				}else{
					var x1 = gridpoint.x;
					var x0 = LastClick.x;

					var y1 = gridpoint.y;
					var y0 = LastClick.y;

					var dx = Math.abs(x1-x0);
					var dy = Math.abs(y1-y0);
					var sx = (x0 < x1) ? 1 : -1;
					var sy = (y0 < y1) ? 1 : -1;
					var err = dx-dy;

					while(true){
						SetOn(x0, y0);

						if ((x0==x1) && (y0==y1)) break;
						var e2 = 2*err;
						if (e2 >-dy){ err -= dy; x0  += sx; }
						if (e2 < dx){ err += dx; y0  += sy; }
					}
					RenderChanges(window.changes);
				}

				LastClick = gridpoint;

			}
		}

		//window.changes = CreateEmpty();

	};

	var CreateEmpty = function () {

		var newGrid = [];
		console.log('Creating new grid, width: ' + GridWidth + ' height: ' + GridHeight);
		for (var x = 0; x < GridWidth; x++) {
			console.log('create grid x');
			newGrid[x] = [];
			for (var y = 0; y < GridHeight; y++) {
				newGrid[x][y] = false;
			}
		}

		return newGrid;

	}



}