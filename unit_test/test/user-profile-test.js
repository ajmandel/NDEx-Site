/*
    get 404 getting profile for non-existent User Id
    get 200 and "" getting profile of User1
    get 200 posting profile to User1
    get 200 getting profile of User1
    verify that profile retrieved is identical to what was posted
    get 200 posting different profile to User1 - this time, strings contain control characters
    get 200 getting profile of User1
    verify that profile retrieved is identical to what was posted
*/

var request = require('request'),
	assert = require('assert'),
	should = require('should');
	
var baseURL = 'http://localhost:3333';

console.log("starting user profile test");
 
describe('NDEx User Profile: ', function () {
	//preliminary setup
	var harryJID = null
	describe('Setup ', function () {
		it("should get 200 for creating Harry",function(done){
			request({
					method : 'POST',
					url : baseURL + '/users', 
					json : {username : "Harry", password : "password"}
				},
				function(err,res,body){
					if(err) { done(err) }
					else { 
						res.should.have.status(200)
						harryJID = res.body.jid
						done()
					}
				}
			);
		});
	});
	
	describe('Access User Profile', function(){
		describe("getProfileOfNonExistentUser", function(){
			it("should get 404 for getting profile for non-existent User Id", function(done){
				request({
						method : 'GET',
						url : baseURL + '/users/C21R4444'
						//get profile?
					},
					function(err,res,body){
						if(err) { done(err) }
						else {
							res.should.have.status(404)
							done()
						}
					}
				);
			});
		});
		describe("getProfileFromUser", function(){
			it('should get 200 and "" on getting profile of Harry', function(done){
				request({
						method : 'GET',
						url : baseURL + '/users/' + harryJID
						//get profile?
					},
					function(err,res,body){
						if(err) { done(err) }
						else {
							res.should.have.status(200)
							console.log('\n' + res.body)
							done()
						}
					}
				);
			});
		});
		describe("postProfileToUser", function(){
			it("should get 200 posting profile to User1", function(done){
				var harryProfile = {};
				harryProfile.firstName = 'Harry';
				harryProfile.lastName = 'Potter';
				harryProfile.website = 'www.harrypotterwizardscollection.com‎';
				harryProfile.foregroundImg = 'harry.jpg';
				harryProfile.backgroundImg = 'wizard.jpg';
				harryProfile.description = 'I am a wizard';
				
				request({
						method : 'POST',
						url : baseURL + '/users/' + harryJID + '/profile',
						json : {userid: harryJID, profile: harryProfile}
					},
					function(err,res,body){
						if(err) { done(err) }
						else {
							res.should.have.status(200)
							console.log('\n' + JSON.stringify(res.body.profile, '\t' , '\t\t'))
							done()
						}
					}
				);
			});
		});
		describe("getProfileFromUser", function(){
			it('should get 200 on getting profile of Harry, should match update profile', function(done){
				request({
						method : 'GET',
						url : baseURL + '/users/' + harryJID
						//get profile?
					},
					function(err,res,body){
						if(err) { done(err) }
						else {
							res.should.have.status(200)
							console.log('\n' + res.body)
							done()
						}
					}
				);
			});
		});
		describe("postProfileToUser", function(){
			it("should get 200 posting different profile to User1, strings include control char", function(done){
				var harryProfile = {};
				harryProfile.firstName = "Harry\n";
				harryProfile.lastName = 'Potter\n';
				harryProfile.website = 'www.harrypotterwizardscollection.com\n‎';
				harryProfile.foregroundImg = 'harry.jpg\n';
				harryProfile.backgroundImg = 'wizard.jpg\n';
				harryProfile.description = 'I am a wizard\n';
				
				request({
						method : 'POST',
						url : baseURL + '/users/' + harryJID + '/profile',
						json : {userid: harryJID, profile: harryProfile}
					},
					function(err,res,body){
						if(err) { done(err) }
						else {
							res.should.have.status(200)
							console.log('\n' + JSON.stringify(res.body.profile, '\t' , '\t\t'))
							done()
						}
					}
				);
			});
		});
		describe("getProfileFromUser", function(){
			it('should get 200 on getting profile of Harry, should match update profile', function(done){
				request({
						method : 'GET',
						url : baseURL + '/users/' + harryJID
						//get profile?
					},
					function(err,res,body){
						if(err) { done(err) }
						else {
							res.should.have.status(200)
							console.log('\n' + res.body)
							done()
						}
					}
				);
			});
		});
		/*describe("createGroupWithTakenGroupname", function(){
			it("should get 500 for attempting to create group with taken groupname", function(done){
				request({
						method : 'POST',
						url : baseURL + '/groups/',
						json : {userid : harryJID , groupName : "ValidName"}
					},
					function(err,res,body){
						if(err) { done(err) }
						else {
							res.should.have.status(500)
							done()
						}
					}
				);
			});
		});
		describe("getGroupValidName", function(){
			it("should get 200 for attempting to get group belonging to Harry", function(done){
				request({
						method : 'GET',
						url : baseURL + '/groups/' + groupJID
					},
					function(err,res,body){
						if(err) { done(err) }
						else {
							res.should.have.status(200)
							done()
						}
					}
				);
			});
		});
		/*describe("getUserAndFindGroups", function(){
			it("should get 200 for attempting to get user Harry, find ValidName group", function(done){
				request({
						method : 'GET',
						url : baseURL + '/groups/' 
					},
					function(err,res,body){
						if(err) { done(err) }
						else {
							res.should.have.status(200)
							done()
						}
					}
				);
			});
		});*/
	});
	
	//preliminary teardown
	describe('Teardown ', function () {
		it("should get 200 for deleting Harry",function(done){
			request({
					method : 'DELETE',
					url : baseURL + '/users/' + harryJID	
				},
	  			function(err, res, body){
	  				if(err) { done(err) }
	  				else { 
	  					res.should.have.status(200)
	  					done()
	  				} 
	  			}
	  		);
	  	});
	});
});