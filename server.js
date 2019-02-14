// Variable Declarations
//-----------------------------------------------------------------
var express    = require('express'); 		
var app        = express(); 				// App using express router
var bodyParser = require('body-parser');
var gameController = require('./controllers/game'); //For all calls to '/games'
var userController = require('./controllers/user'); //For all calls to '/users'
var passport = require('passport');					//For authentication
var authController = require('./controllers/auth'); //For authentication


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //Allow CORS from all origins
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');//Allow all calls
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");//Add authorization to the header response
  next();
});
app.use(passport.initialize());//Use Passport

var mongoose   = require('mongoose');
mongoose.connect('mongodb://eli:Functions11@ds053160.mongolab.com:53160/lab4');//Connect to Mongoose DB on MongoLab

var port = process.env.PORT || 8080; //Set Port


// ROUTES
//-------------------------------------------------------------
var router = express.Router(); //Instance of the express router	

// On All Calls
router.use(function(req, res, next) {
	console.log('Gamewatch is doing something');
	next(); // Continue on to next routes
});

// Routing Methods for '/games' (uses authentication)
router.route('/games')
  .post(authController.isAuthenticated,gameController.postGames)
  .get(authController.isAuthenticated,gameController.getGames);

// Routing Methods for '/all' (no authentication)
router.route('/all')
  .get(gameController.getAll);

// Routing Methods for '/games/game_id' (uses authentication)
router.route('/games/:game_id')
  .get(authController.isAuthenticated,gameController.getGame)
  .put(authController.isAuthenticated,gameController.putGame)
  .delete(authController.isAuthenticated,gameController.deleteGame);

// Routing Methods for '/users' (no authentication)
router.route('/users')
  .post(userController.postUsers)//For adding a new user
  .get(userController.getUsers) //For checking existing users
  ;

// On All Routes serve the page 'index.html'
router.get('/', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

//On call to 'script.js' serve this file
router.get('/script.js', function(req, res) {
	res.sendfile(__dirname + '/public/script.js');
});

//Use our express router
app.use(router); 

// START
// ----------------------------------------------
app.listen(port);
console.log('Games are being watched on' + port);