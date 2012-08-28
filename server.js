require('cCommon'); // set some global things
var cSettings = require("cSettings");
var router = require('cRouter');

router.addRoute([
	{ // Create a new router
		api: 'favicon.ico',
		method: 'GET',
		callback: require('cFile').staticFile(__dirname + '/client/icons/search_magnifier.png', 'image/png')
		},
		{		// enable for file webserver
			api: 'client',
			method: 'GET',
			callback: require('cFile').staticDir(__dirname + '/client',{ 
            '.html': 'text/html', 
            '.css': 'text/css', 
            '.js': 'application/javascript', 
            '.json': 'mime/json', 
            '.mp3': 'audio/mp3',
            '.png': 'image/png',
            '.gif': 'image/gif'
            })
		}
]);
router.add(require('cSearch'));
router.add(require('cBookmarks'));

var app = require("http")
   .createServer(router.route)
   .listen(cSettings.port);

var io = require('socket.io').listen(app);

io.enable('browser client etag');
io.set('log level', 1);

io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

router.addSocketIO(io);

console.log("Server running at localhost:" + cSettings.port + (__debug? " debug": " production"));

