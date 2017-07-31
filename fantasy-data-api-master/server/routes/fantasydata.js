var express = require('express');
var router = express.Router();
var primaryKey  = process.env.FDprimary;
var secondaryKey  = process.env.FDsecondary;
var options = {
    timeout: 15000, // Service call timeout
    nfl: {
        version: 'nfl/v2',
        key: primaryKey
    }
};

var fantasyData = require('fantasydata-api')(options);

console.log('made it here');
router.get('/', function(req,res){
    console.log(req.body);
    var season = '2016REG';
    fantasyData.nfl.fantasyPlayers(function(err, results){
       // console.log(JSON.stringify(results, null, 2));
        res.send(results);
    });
});





module.exports = router;