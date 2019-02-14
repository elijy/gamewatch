//All NFL teams and abbreviations for updating select lists
var nflTeams = ["Arizona Cardinals",
"Atlanta Falcons",
"Baltimore Ravens",
"Buffalo Bills",
"Carolina Panthers",
"Chicago Bears",
"Cincinnati Bengals", 
"Cleveland Browns",
"Dallas Cowboys", 
"Denver Broncos",
"Detroit Lions", 
"Green Bay Packers", 
"Houston Texans",
"Indianapolis Colts",
"Jacksonville Jaguars", 
"Kansas City Chiefs", 
"Miami Dolphins", 
"Minnesotta Vikings", 
"New England Patriots",
"New Orleans Saints", 
"New York Giants",
"New York Jets", 
"Oakland Raiders",
"Philadelphia Eagles",
"Pittsburgh Steelers", 
"San Diego Chargers", 
"San Francisco 49ers", 
"Seattle Seahawks", 
"St.Louis Rams",
"Tampa Bay Buccaneers", 
"Tennessee Titans", 
"Washington Redskins"]
var nflAbb = [ "ARI",
"ATL",
"BAL",
"BUF",
"CAR",
"CHI",
"CIN",
"CLE",
"DAL",
"DEN",
"DET",
"GB",
"HOU",
"IND",
"JAX",
"KC",
"MIA",
"MIN",
"NE",
"NO",
"NYG",
"NYJ",
"OAK",
"PHI",
"PIT",
"SD",
"SEA",
"SF",
"STL",
"TB",
"TEN",
"WAS"]

//Variables to hold username and password for all authentication calls
var user ='';
var passw ='';

$(document).ready(function() {
	//hide all not needed div's
	$("#view").hide();
	$("#invalid").hide();
	$("#signPage").hide();
	$("#successAdd").hide();
	$("#invalidNew").hide();
	//console.log("here")
	
	//checking to see if user is in system or not
	var isUser = false;
	$("#ck").on('click',function(e){
		e.preventDefault();
		user = $("#user").val();
		passw = $("#pass").val();
		
		$.ajax({
  		url: "//gamewatch.herokuapp.com/users",
  		type: "GET",
  		dataType: "json",
  		success: function(data) {
  			//check name with everyone in database
    		$.each(data, function() {
  				if(user == this.username){
  					isUser = true;
  					return false;
  				}		
			});
			if(isUser == false){
				$("#invalid").show();
			}else{
				//if user is in system then allow user into system
				$("#log").hide();
    			$("#view").show();
    			displayAll();
			}
			
  			},
  			error: function(e) {
    			console.log(e.message);
 			 }
 			 
		});
	
	});
	
	//sign up to become a new user
	$("#sign").on('click',function(e){
		e.preventDefault();
		$("#log").hide();
    	$("#signPage").show();
    	
    	//add user to the database on correct credentials
    	$("#newU").on('click',function(e){
    		e.preventDefault();
    		
    		var userData = {'username':$("#newuser").val(),'password':$("#newpass").val()};
    		$.ajax({
  			url: "//gamewatch.herokuapp.com/users",
  			type: "POST",
  			dataType: "json",
  			data: userData,
  			success: function(data) {
  				if(data.name == "MongoError"){
  					$("#invalidNew").show();
  				}else{
  					$("#signPage").hide();
    				$("#successAdd").show();
    			}
  			},
  			error: function(e) {
    			
 			 }
 			 
			});
    	});
    	
    	$("#newLogIn").on('click',function(e){
    		e.preventDefault();
    		$("#successAdd").hide();
    		$("#log").show();
    	
    	});
    	
	
	});
 	
 	//basic ajax call for referral
 	/*$.ajax({
  			url: "http://www.fantasyfootballnerd.com/service/schedule/json/gmghmampb62t",
  			type: "GET",
  			dataType: "json",
  			success: function(data) {
  				var sched = data.Schedule;
    			$.each(sched, function() {
  						$("#tweets").append("<li>" + this.homeTeam + "</li>");
  						
				});
			
  			},
  			error: function(e) {
    			console.log(e.message);
 			 }
 			 
		});*/
    

});

//Function for writing the search functionality
function footBall(){
	//Write the dropdown menu
	var text = "<select class ='form-control' id=sel>";
	text+= "<option selected disabled>Choose here</option>";
    for (i=0;i<nflTeams.length;i++){
        text += ("<option value="+nflAbb[i]+">" + nflTeams[i] + "</option>");
    }
    text += "</select>";
    $("#drop").html(text);
    $("#drop").prepend("<h2><small>Select a team: </small><h2>");
  	
  	//used for addAll function
  	var arr = [];
  	
  	//When something in the dropdown menu is changed then call external API and rewrite list
  	$("select").on('change',function(){
    	$("select option:selected" ).each(function() {
    		if( $("#sel").text() != "Choose here"){
      			$("#display").empty();//clear table
      			$("#display").append("<tr><th><span class='glyphicon glyphicon-home'></span> Home Team</th>" +
      			"<th><span class='glyphicon glyphicon-plane'></span> Away Team</th>" 
      			+ "<th><span class='glyphicon glyphicon-calendar'></span>Date</th>" + 
      			"<th><span class='glyphicon glyphicon-time'></span>Time</th><th></th>");//headers for the table
      			
      			//for addAll function
      			arr.length = 0;
      			var i = 0;
      			
      			//GET call to external API for a teams schedule
      			$.ajax({
  					url: "//fantasyfootballnerd.com/service/schedule/json/gmghmampb62t",
  					type: "GET",
  					dataType: "json",
  					success: function(data) {
  						var sched = data.Schedule;//Split the returned json into the section we want
    					$.each(sched, function() {
    						//only get the games for the team we selected
    						if( $("#sel").val() == this.homeTeam || $("#sel").val() == this.awayTeam){
    							
    							//information we will be passing 
    							var info = (this.homeTeam + ","+ this.awayTeam +","+ this.gameDate +" "+ this.gameTimeET).toString();
    							
    							//for addAll function
    							arr[i] = info;
    							i++;
    							
    							$(".add").unbind();
    							//draw the table for each variable in the json array
    							$("#display").append("<tr><td>" + this.homeTeam + "</td><td>"+ this.awayTeam 
    								+ "</td><td>" + this.gameDate + "</td><td>" + this.gameTimeET 
    								+ "</td><td>" + "<button class='btn btn-warning add' name ='" + info 
    								+ "'><span class='glyphicon glyphicon-plus'></span>Add To My Watchlist</button>" + "</td></tr>")
    							
    							//On any specific add button get the information and post to user database
    							$(".add").click(function() {
  										var data = ($(this).attr('name')).split(',')//'name' holds the information we want
  										pass = {'home': data[0],'away':data[1],'date':data[2],'userName':user}//data in json format so we can POST
  										$.ajax({
  												url: "//gamewatch.herokuapp.com/games",
  												type: "POST",
  												headers: {
    												"Authorization": "Basic " + btoa(user + ":" + passw)//So we know which user to add the game to 
  												},
  												dataType: "json",
  												data: pass,
  												success: function(data) {
  														console.log("successful add");
  														writeList();
  												},
  												error: function(e) {
    											console.log(e.message);
 			 									}
										});
										
								});
    						
    						
    						}
						});
			
  					},
  					error: function(e) {
    					console.log(e.message);
 			 		}
 			 
				});
				
				//Add all button
				$("#addAll").html("<button class='btn btn-info btn-lg btn-block adding'><span class='glyphicon glyphicon-plus-sign'></span>"
				+ "   Add All To My Watchlist</button>");
				
				//Add all function
				$(".adding").click(function(){
					for(j=0;j<arr.length;j++){
						var data = (arr[j]).split(',')
  						pass = {'home': data[0],'away':data[1],'date':data[2]}
  							$.ajax({
  									url: "//gamewatch.herokuapp.com/games",
  									type: "POST",
  									headers: {
    									"Authorization": "Basic " + btoa(user + ":" + passw)
  									},
  									dataType: "json",
  									data: pass,
  									success: function(data) {
  											console.log("successful add");
  											writeList();
  									},
  									error: function(e) {
    									console.log(e.message);
 			 						}
							});
					}
				});
      		}
    	});
 	 });
};

//Function for writing a user specific list
function writeList(){
	$("#comments").hide()
	//GET the user specific list using authentication
	$.ajax({
  			url: "//gamewatch.herokuapp.com/games",
  			type: "GET",
  			dataType: "json",
  			headers: {
    			"Authorization": "Basic " + btoa(user + ":" + passw)
  			},
  			success: function(data) {
				$("#yours").empty();
				//Table headers
				$("#yours").append("<tr><th><span class='glyphicon glyphicon-home'></span>  Home Team</th>" +
					"<th><span class='glyphicon glyphicon-plane'></span>  Away Team</th>" +
					"<th><span class='glyphicon glyphicon-calendar'></span>  Date</th>" +
					"<th><span class='glyphicon glyphicon-user'></span> Private Comment</th>" +
					"<th><span class='glyphicon glyphicon-pencil'></span>  Public Comment</th>" +
					"<th></th><th></th><th></th><th></th></tr>")
    			$.each(data, function() {
    					var privateComment = '';
    					var publicComment = '';
    					var wtchbtn = '';
  						$(".remove").unbind();
  						$(".priCom").unbind();
  						$(".pubCom").unbind();
  						$(".watched").unbind();
  						
  						//Handles cases where private or public comment does not exist yet
  						if(typeof this.pri == "undefined") {
  							privateComment = '';
  						}else{
  							privateComment = this.pri;
  						}
  						
  						if(typeof this.pub == "undefined") {
  							publicComment = '';
  						}else{
  							publicComment = this.pub;
  						}
  						
  						//Import information to be passed on button clicks
  						var info = (this.home + ","+ this.away +","+ this.date +","+ this._id+","
    					+privateComment+","+publicComment).toString();
    					
    					//If the returned game is set to watched then draw the button as watched 
  						if(this.watched == true){
  							wtchbtn = "<button class='btn btn-success btn-sm watched' name ='" + info 
  							+ "' disabled='disabled'><span class='glyphicon glyphicon-ok-circle'>Watched</button>"
  						}else{
  							wtchbtn = "<button class='btn btn-default watched' name ='" + info + "'>  Watched</button>"
  						}
  						
  						//Write table with all user games
  						$("#yours").append("<tr><td>" + this.home + "</td><td>" + this.away + "</td><td>" + this.date + "</td><td>" 
  						+ privateComment + "</td><td>"+ publicComment + "</td><td>" + "<button class='btn btn-danger btn-sm remove' name ='" 
  						+ this._id + "'><span class='glyphicon glyphicon-remove-circle'></span>Delete</button>" + "</td><td>" + wtchbtn + "</td><td>" +
  						"<button class='btn btn-primary btn-sm priCom' name ='" + info + "'><span class='glyphicon glyphicon-pencil'></span>Add Private Comment</button></td><td>" 
  						+ "<button class='btn btn-primary btn-sm pubCom' name ='" + info + "'><span class='glyphicon glyphicon-pencil'></span>Add Public Comment</button></td></tr>");
  						
  						//Click to remove a game
  						$(".remove").click(function() {
  							$.ajax({
    							url: "//gamewatch.herokuapp.com/games/" + $(this).attr('name'),
   								type: 'DELETE',
   								headers: {
    								"Authorization": "Basic " + btoa(user + ":" + passw)
  								},
    							success: function(result) {
        								console.log("it worked");
        								writeList();
        								displayAll();
   		 						}
							});
							
  										
						});
						
						//Click to add a private comment
						$(".priCom").click(function(){
							$("#comments").show()
							var inp = $(this).attr('name')//get the information we are passing e.g the game_id
							$("#ent").unbind();
							$("#pcom").html("<input type='text' id='comm' class='form-control input-lg' placeholder='Enter a Private Comment'></input>")
							$("#ent").html("<button class='btn btn-primary btn-lg'>Enter</button>").click(function(){
								
								var data = inp.split(',')
								//pass all data as it was but change private comment to value entered in input
  								pass = {'home': data[0],'away':data[1],'date':data[2],'pri':$("#comm").val(),'pub':data[5],'watched':data[6],'userName':user}
  								console.log(pass);
								$.ajax({
    							url: "//gamewatch.herokuapp.com/games/" + data[3],//append game_id 
   								type: 'PUT',
   								data: pass,
   								headers: {
    								"Authorization": "Basic " + btoa(user + ":" + passw)
  								},
    							success: function(result) {
        								console.log("it worked");
        								$("#comm").val('')
        								writeList();
        							
   		 						}
								});
								
							});
							
						});
						
						//Click to set a game to watched
						$(".watched").click(function(){
							//Draw the button as watched(green)
							$(this).html("<button class='btn btn-success btn-sm watched'><span class='glyphicon glyphicon-ok-circle' disabled='disabled'>  Watched</button>")
							var data = ($(this).attr('name')).split(',');
							pass = {'home': data[0],'away':data[1],'date':data[2],'pri':$("#comm").val(),'pub':data[5],'watched':true,'userName':user}
								$.ajax({
    							url: "//gamewatch.herokuapp.com/games/" + data[3],
   								type: 'PUT',
   								data: pass,
   								headers: {
    								"Authorization": "Basic " + btoa(user + ":" + passw)
  								},
    							success: function(result) {
        								console.log("it worked");
        								writeList();
        							
   		 						}
								});
							
						});
						
						//Click to add a public comment
						$(".pubCom").click(function(){
							$("#comments").show()
							var inp = $(this).attr('name')
							$("#ent").unbind();
							$("#pcom").html("<input type='text' id='comm' class='form-control input-lg' placeholder='Enter a Public Comment'></input>")
							$("#ent").html("<button class='btn btn-primary btn-lg'>Enter</button>").click(function(){
	
								var data = inp.split(',')
  								pass = {'home': data[0],'away':data[1],'date':data[2],'pub':$("#comm").val(),'pri':data[4],'watched':data[6],'userName':user}
  								//console.log(pass);
								$.ajax({
    								url: "//gamewatch.herokuapp.com/games/" + data[3],
   									type: 'PUT',
   									data: pass,
   									headers: {
    									"Authorization": "Basic " + btoa(user + ":" + passw)
  									},
    								success: function(result) {
        								console.log(result);
        								$("#comm").val('')
        								writeList();
        								displayAll();
   		 							}
								});
								
								
							});						
						});
				});
			
  			},
  			error: function(e) {
    			console.log(e.message);
 			 }
		}); 
};

//Function to draw main table with all games from all users
function displayAll(){
	$("#comments").hide()
	
	//Same functionalities as other functions
	$.ajax({
    	url: "//gamewatch.herokuapp.com/all",
   		type: 'GET',
    	success: function(data) {
    	$.each(data, function() {
    		
    		if(typeof this.pri == "undefined") {
  				privateComment = '';
  			}else{
  				privateComment = this.pri;
  			}
  			if(typeof this.pub == "undefined") {
  				publicComment = '';
  			}else{
  				publicComment = this.pub;
  			}
  			
  			var info = (this.home + ","+ this.away +","+ this.date +","+ this._id+","
    					+privateComment+","+this.userName).toString();
    	
        	$("#allDisplay").append("<tr><td>" + this.home + "</td><td>" + this.away + "</td><td>" + this.date + "</td><td>" 
  			+ this.userName + "</td><td>" + publicComment + "</td><td>" + 
  			"<button class='btn btn-warning add' name ='" + info + "'><span class='glyphicon glyphicon-plus'></span>Add To My Watchlist</button>" 
  			+ "</td></tr>");
  			
  			$(".add").unbind();
  			$(".add").click(function() {
  					var data = ($(this).attr('name')).split(',')
  					pass = {'home': data[0],'away':data[1],'date':data[2],'userName':user}
  					$.ajax({
  						url: "//gamewatch.herokuapp.com/games",
  						type: "POST",
  						headers: {
    						"Authorization": "Basic " + btoa(user + ":" + passw)
  						},
  						dataType: "json",
  						data: pass,
  						success: function(data) {
  							console.log("successful add");
  							writeList();
  						},
  							error: function(e) {
    						console.log(e.message);
 			 			}
					});
										
  										
			});
   		
   		})
   		
   		}
	});

};

//On Logout reload the page
function logout(){
	location.reload();	
};

