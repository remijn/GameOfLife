var XSIZE = 100;
var YSIZE = 100;
var UPDATETIME = 400;

var game = require('./game.js');
var express = require('express');

//Set Up Express stuff
var app = express();
var port = 2002;

app.set('views', __dirname + '/pages');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.get('/', function(req, res){
	res.render('page');
});

app.use(express.static(__dirname + '/public'));


//Set Up Socket.IO stuff

var io = require('socket.io').listen(app.listen(port), {log: false});

io.sockets.on('connection', function(socket){
	console.log('new connection');
	socket.on('changes', function(data){
		console.log('recieved changes');
		game.UseChanges(data.changes);

		//create my own changes :)

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


	});
});

//Set Up GoL Stuff
game.SetRunOnTick(function(){
	io.sockets.emit('grid', {grid: game.getGrid(), width: XSIZE, height: YSIZE});
});

game.Start(XSIZE, YSIZE, UPDATETIME, true, 4);