var request = require('request'),
	assert = require('assert'),
	should = require('should');
	
var baseURL = 'http://localhost:3333';

console.log("starting user test");
 
describe('NDEx Users: ', function () {

/*  
  before(function(){
  	request(baseURL + '/users/fred', function(err, res, body){
  		if (res.statusCode == 404){
  			console.log("No user fred found, attempting to create");
			request(
						{
							method : 'GET',
							url : baseURL + '/users', 
							json : {username : "fred", password : "bird"}
						},
						function(err, res, body){
							if (err){
								console.log("error on create fred setup " + err);
								throw err;
							}
							console.log("response to create fred setup " + res);
							done();
						 }
					);
		} else if (res.statusCode == 500){
			console.log("Internal error when querying for user fred");
			done();
		} else if (res.statusCode == 200){
			console.log("Found user fred");
			done();
		} else {
			console.log("Unexpected response " + res.statusCode)
			done();
		}
	  });
  });
*/
    
  describe('getUserByNonExistantUserId', function(){
  
  	it("should get 400 for non-existant user adsf", function (done){
  		request({
  				url: baseURL + '/users/adsf'
  				},
  				function(err, res, body){
  					if(err) { done(err) }  
  					else {
	  					res.should.have.status(400)
	  					done();
  					}
  				});	
  	});
  });
  
  var henryJID = null
  
  describe('createUserWithNovelName', function(){
  
  	it("should get 200 for attempting to create new user Henry", function (done){
  		request({
							method : 'POST',
							url : baseURL + '/users', 
							json : {username : "Henry", password : "password"}
				},
  				function(err, res, body){
  					if(err) { done(err) }  
  					else {
	  					res.should.have.status(200)
	  					console.log('Henry has JID ' + res.body.jid)
	  					henryJID = res.body.jid
	  					done();
  					}
  				});	
  	});
  });
  
    
  describe('failToCreateUserWithUsernameAlreadyInUse', function(){
  
  	it("should get 500 for attempting to create user with username already taken", function (done){
  		request({
							method : 'POST',
							url : baseURL + '/users', 
							json : {username : "fred", password : "bird"}
				},
  				function(err, res, body){
  					if(err) { done(err) }  
  					else {
	  					res.should.have.status(500)
	  					done();
  					}
  				});	
  	});
  });

  describe('getUserByExistingUserId', function(){
  
  	it("should get 200 for getting existing user Henry", function (done){
  		request({
  				url: baseURL + '/users/' + henryJID
  				},
  				function(err, res, body){
  					if(!henryJID){
  						console.log('failed because createUserHenryFailed')
  						done();
  					}
  					if(err) { done(err) }  
  					else {
	  					res.should.have.status(200)
	  					console.log('got Henry with JID ' + henryJID)
	  					done();
  					}
  				});	
  	});
  });
  
   describe('deleteUserByNonExistantID', function(){
  
  	it("should get 404 for attempting to delete new user C21R4444", function (done){
  		request({
							method : 'DELETE',
							url : baseURL + '/users/C21R4444', 
							
				},
  				function(err, res, body){
  					if(err) { done(err) }  
  					else {
	  					res.should.have.status(404)
	  					done();
  					}
  				});	
  	});
  });
  
  describe('deleteUserById', function(){
  
  	it("should get 200 for attempting to delete user", function (done){
  		request({
							method : 'DELETE',
							url : baseURL + '/users/' + henryJID, 
							
				},
  				function(err, res, body){
  					if(!henryJID){
  						console.log('failed because createUserHenryFailed')
  						done();
  					}
  					if(err) { done(err) }  
  					else {
	  					res.should.have.status(200)
	  					console.log('deleted ' + henryJID)
	  					done();
  					}
  				});	
  	});
  });
  
   describe('getDeletedUserByUserId', function(){
  
  	it("should get 404 for attempting to get deleted user Henry", function (done){
  		request({
  				url: baseURL + '/users/' + henryJID
  				},
  				function(err, res, body){
  					if(!henryJID){
  						console.log('failed because createUserHenryFailed')
  						done();
  					}
  					if(err) { done(err) }  
  					else {
	  					res.should.have.status(404)
	  					console.log("could not get " + henryJID)
	  					done();
  					}
  				});	
  	});
  });
  
  var bobJID = null
  describe('createUser2WithNovelName', function(){
  
  	it("should get 200 for attempting to create new user Bob", function (done){
  		request({
							method : 'POST',
							url : baseURL + '/users', 
							json : {username : "Bob", password : "password"}
				},
  				function(err, res, body){
  					if(err) { done(err) }  
  					else {
	  					res.should.have.status(200)
	  					console.log('Bob has JID ' + res.body.jid)
	  					bobJID = res.body.jid
	  					done();
  					}
  				});	
  	});
  });
  
   describe('deleteUser2ById', function(){
  	it("should get 200 for attempting to delete user Bob", function (done){
  		request({
							method : 'DELETE',
							url : baseURL + '/users/' + bobJID, 
							
				},
  				function(err, res, body){
  					if(!bobJID){
  						console.log('failed because createUserHenryFailed')
  						done();
  					}
  					if(err) { done(err) }  
  					else {
	  					res.should.have.status(200)
	  					console.log('deleted ' + bobJID)
	  					done();
  					}
  				});	
  	});
  });
  
  describe('getUserByMalformedUserId', function(){
  
  	it("should get 400 for getting user by malformed JID, WC21R3", function (done){
  		request({
  				url: baseURL + '/users/WC21R3' //get 404 if W21R3
  				},
  				function(err, res, body){
  					if(err) { done(err) }  
  					else {
	  					res.should.have.status(400)
	  					done();
  					}
  				});	
  	});
  });
  
  
  
});


/*

  
  var uname = null;

  users.discuss('Basic operations on NDExUser resources:')
       .use('localhost', 3333)
       .setHeader('Content-Type', 'application/json')
       
       .discuss('make sure that there is no user with username fred')
       .get('/users/fred')
       .expect(404)
       
       .discuss('create a User with username = fred and password = bird')
       .post('/users', {username : 'fred', password : 'bird'})
    	.expect(200)
    	
       .discuss('find list of users by username expression')
       .get('/users?nameExpression=fr*')
       .expect(200)
       .expect('size of user list should not be zero', function (err, res, body){
       		var users = body.users;
       		assert.isNotZero(users.size);
       		})
       		
       	.discuss('find fred by exact username')
       	.get('/users/fred')
       	.expect(200)
       	.expect({username : 'fred'})
       	
       	.discuss('delete fred')
       .del('/users/fred')
       .expect(200)
       
       .export(module);
       
*/
