var Game = require('../models/game');

// POST at '/games' (adds a game to a specific user)
exports.postGames = function(req, res) {
		
		var game = new Game();		
		game.home = req.body.home;
		game.away = req.body.away;
		game.date = req.body.date;
		game.pub = req.body.pub;
		game.watched = req.body.watched;
		game.pri = req.body.pri;
		game.userName = req.body.userName;
		game.userId = req.user._id;
		
		game.save(function(err) {
			if (err)
				res.send(err);
			
			res.json({ message: 'Game added!', data: game });
		});
};


// GET at '/games' (gets all the games for a specific user)
exports.getGames = function(req, res) {
  
  Game.find({ userId: req.user._id }, function(err, games) {
    if (err)
      res.send(err);

    res.json(games);
  });
};

// GET at '/all' (returns everything in database not based on user)
exports.getAll = function(req, res) {
  // Use the Beer model to find all beer
  Game.find(function(err, games) {
			if (err)
				res.send(err);

			res.json(games);
		});
};


// GET at'/games/game_id' (returns a specific game based on id)
exports.getGame = function(req, res) {
		Game.findById({ userId: req.user._id,_id:req.params.game_id}, function(err, game) {
			if (err)
				res.send(err);
			res.json(game);
		});
	};

// PUT at '/games/game_id' (updates a game at a specific id, for a specific user)
exports.putGame = function(req, res) {
		Game.findById(req.params.game_id, function(err, game) {

			if (err)
				res.send(err);

		game.home = req.body.home;
		game.away = req.body.away;
		game.date = req.body.date;
		game.pub = req.body.pub;
		game.watched = req.body.watched;
		game.pri = req.body.pri;
		game.userName = req.body.userName;
		//game.userId = req.user._id;
			
			game.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bear updated!' });
			});

		});
	};

// DELETE at 'games/game_id' (deletes a specific users game)
exports.deleteGame = function(req, res) {
		Game.remove({
			 userId: req.user._id,_id:req.params.game_id
		}, function(err, game) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	};