/*
Setup:

    create User: WorkspaceOwner
    create Network: NewNetwork
    requires that we have some standard networks loaded in the knowledge base that are intended for testing

Should:

    get 404 getting workspace for non-existent User Id
    get 200 and empty workspace getting workspace of new user WorkspaceOwner
    get 200 and network descriptors finding existing networks by name that will be added to workspace.
    get 200 adding a network to WorkspaceOwner's workspace; repeat to add all of the test networks.
    get 200 and network descriptors getting workspace
    get 404 attempting to remove network from workspace that is not in workspace
    get 400 attempting to add network already in workspace
    get 404 attempting to add non-existent Network Id
    get 404 attempting to add using non-existent User Id
    get 200 creating new test network
    get 200 adding new network to workspace
    get 200 and network descriptors including new network when getting workspace
    get 200 deleting new network
    get 200 and network descriptors NOT including the deleted network on getting workspace

Teardown

    delete WorkspaceOwner
    ensure that NewNetwork was deleted during testing.
*/
var request = require('request'),
	assert = require('assert'),
	should = require('should'),
	fs = require('fs');
	
var baseURL = 'http://localhost:3333';

console.log("starting user workspace test");
 
describe('NDEx Workspaces: ', function (done) {
	//to be used throughout test cases
	var workspaceOwnerJID = null;
	var newNetworkJID = null;
	//unit test setup
	before( function (done) {
		console.log('\nsetup: user workspace test');
		request({
				method : 'POST',
				url : baseURL + '/users/', 
				json : {username : "WorkspaceOwner", password : "password"}
			},
			function(err,res,body){
				if(err) { console.log(err) }
				else { 
					res.should.have.status(200)
					workspaceOwnerJID = res.body.jid
					console.log(' -user created')//ensures completion
					done()
				}
			}
		);
	});
	before( function (done) {
		console.log('setup: user workspace test');
		var data = fs.readFileSync('../test_db/test_networks/pc_sif/testNetwork.jdex', 'utf8'); 
		data = JSON.parse(data);	
		request({
				method : 'POST',
				url: baseURL + '/networks',
				json : {network : data, accountid : workspaceOwnerJID}
			},
			function(err, res, body){
				if(err) { done(err) }
				else {
					res.should.have.status(200)
					newNetworkJID = res.body.jid
					console.log(' -network created')//ensures completion
					done()
				}
			}
		);
	});	
	describe('Should', function() {
		this.timeout(6000);// occasionally, requests take longer
		it("should get 404 getting workspace for non-existent User Id", function(done){
			request({
					method : 'GET',
					url: baseURL + '/users/C21R4444/workspace',
					json: true
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
		it("should get 200 and empty workspace on getting workspace of new user WorkspaceOwner", function(done){
			request({
					method : 'GET',
					url: baseURL + '/users/'+ workspaceOwnerJID +'/workspace',
					json: true
				},
				function(err,res,body){
					if(err) { done(err) }
					else {
						res.should.have.status(200)
						var networks = res.body.networks
						networks.should.have.length
						done()
					}
				}
			);							
				
		});
		var networkArray = []; //searchExpression currently not working
		it("should get 200 and network descriptors finding existing networks by name that will be added to workspace.", function(done){
			request({
					method : 'GET',
					url: baseURL + '/networks/',
					json: {searchExpression: 'REACT', limit: 100, offset: 0}
				},
				function(err,res,body){
					if(err) { done(err) }
					else {
						res.should.have.status(200)
						var networks = res.body.networks
						networkArray = networks
						console.log(networkArray)
						done()
					}
				}
			);	
		});
		
		it("should get 200 adding a network to WorkspaceOwner's workspace; repeat to add all of the test networks.",function(done){
			//console.log(networkArray);
			/*var isFin = function doNothing() {};
			for(var ii = 0; ii < networkArray.length ; ii ++){
				if(ii == (networkArray.length -1)) { isFin = done }
			(function(tempNet, isFinished){*/
			var tempNet = networkArray[0];
			request({
					method : 'POST',
					url: baseURL + '/users/'+ workspaceOwnerJID +'/workspace',
					json: {networkid: tempNet.jid, profile: ''}
				},
				function(err,res,body){
					if(err) { done(err) }
					else {
						res.should.have.status(200)
						console.log(body)
						done()
					}
				}
			);	
			//console.log(tempNet.jid);
			//isFinished();
			
			//})(networkArray[ii],isFin);
			//}					
		});
		it("should get 200 and workspace on getting workspace of new user WorkspaceOwner", function(done){
			request({
					method : 'GET',
					url: baseURL + '/users/'+ workspaceOwnerJID +'/workspace',
					json: true
				},
				function(err,res,body){
					if(err) { done(err) }
					else {
						res.should.have.status(200)
						var networks = res.body.networks
						console.log(networks)
						done()
					}
				}
			);							
				
		});
		
		
		
	});
	//unit test teardown
	after( function (done) {
		console.log('\nteardown: user workspace test');
		request({
				method : 'DELETE',
				url : baseURL + '/networks/' + newNetworkJID
			},
			function(err, res, body){
				if(err) { done(err) }
				else {
					res.should.have.status(200)
					console.log(' -network deleted')// ensures completion
					done()
				}
			}
		);
	});
	after(function (done) {
		console.log('teardown: user workspace test');
		request({
				method : 'DELETE',
				url : baseURL + '/users/' + workspaceOwnerJID	
			},
	  		function(err, res, body){
	  			if(!workspaceOwnerJID){
  					console.log(' -failed because setup failed')
  				}
	  			else if(err) { console.log(err) }
	  			else { 
	  				res.should.have.status(200)
	  				console.log(' -user deleted')//ensures completion
	  				done()
	  			} 
	  		}
	  	);
	});

});
