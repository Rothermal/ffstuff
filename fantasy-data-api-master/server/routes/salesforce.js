var express = require('express');
var router = express.Router();
var nforce = require('nforce');
var sfUser  = process.env.SFUSERNAME;
var sfPass  = process.env.SFPASS;
var sfToken = process.env.SFTOKEN;
var sfclientId = process.env.SFCLIENTID;
var sfsecret = process.env.SFSECRET;
var oauth;

var org = nforce.createConnection({
    clientId: sfclientId,
    clientSecret: sfsecret,
    redirectUri: 'http://localhost:3000/oauth/_callback',
    environment: 'production',
    mode : 'single',
    autoRefresh : true

});

org.authenticate({username:sfUser, password:sfPass}, function(err, response){
   console.log('in authenticate');
    if(err) {
        console.log(err);
    } else {
        oauth = response;
        console.log('oauth response object', response);
    }
});


router.post('/player', function (req,res) {
    console.log('player in req.body', req.body);
 var   player = nforce.createSObject('Player__c');
    player.set('Name', req.body.Name);
    player.set('Team_Board__c', 'Free Agent');
    player.set('Auction_Estimate__c', req.body.AuctionValuePPR);
    player.set('Position__c', req.body.Position);
    player.set('NFL_team__c', req.body.Team);
    player.set('ByeWeek__c',req.body.ByeWeek);

    org.insert({sobject: player}, function (err, response) {
        if (err) {
            console.log('here is the error: ', err);
        } else {
            console.log('insert player response id in post route',response.id);
            res.send(response.id);
        }
    });
});


router.put('/updatePlayer',function(req,res){
    console.log('req in updatePlayer route', req.body);

    var player = nforce.createSObject('Player__c');
    player.set('id', req.body.id);
    player.set('Auction_Estimate__c', req.body.AuctionValuePPR);
    player.set('Position__c', req.body.Position);
    player.set('NFL_team__c', req.body.Team);
    player.set('ByeWeek__c',req.body.ByeWeek);
    player.set('Fantasy_Data_Id__c',req.body.FantasyPlayerKey);

    org.update({sobject: player}, function (err, response) {
        if (err) {
            console.log('here is the error: ', err);
        } else {
            console.log('update player response in put route',response);
            res.send(response);
        }
    });

});

router.get('/players',function(req, res){
console.log('get salesforce players');
    org.query({query: "" +
    "SELECT id, " +
    "Name, " +
    "Team_Board__c, " +
    "Position__c " +
    "FROM Player__c "},
        function (err, response) {
        if (err) {
            console.log(err);
        }
        console.log('response from get players query', response.records);
            res.send(response.records);

        });
});



console.log('hit salesforce');



module.exports = router;