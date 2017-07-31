/**
 * Created by Mark on 7/22/17.
 */
var salesforcePlayers = [];
var goodPlayers = [];
var rookies = [];
var adp = [];
$(document).ready(function(){
    init();
});

var init = function(){
    console.log('jquery initalized');
    enable();
    getplayersList();
};


var enable = function (){
    console.log('buttons enabled');
    $("#players").on("click", ".insert", insertPlayer);
    $("#rookies").on("click", ".insert", insertPlayer);
    $("#adp").on("click", ".insert", insertPlayer);
    $("#adp").on("click", ".update", updatePlayer);

};

var getplayersList = function () {
    $.ajax({
        type:'GET',
        url:"fantasydata",
        success:function(response){
          //  console.log('players',response);
            for (var i = 0; i < response.length; i++){
                if (response[i].AuctionValue > 1) {
                    goodPlayers.push(response[i]);
                }
                if(response[i].LastSeasonFantasyPoints === 0 && response[i].ProjectedFantasyPoints > 45 && response[i].Position != 'K'){
                    rookies.push(response[i]);
                }
                if (response[i].AverageDraftPositionPPR < 300 && response[i].Position != 'K'){
                    adp.push(response[i]);
                }
            }
            getSalesforcePlayers();
            //console.log(goodPlayers);
            //updatePlayersDom();
            //console.log(rookies);
            //updateRookiesDom();
            //console.log(adp);
            //updateAdpDom();
        }
    });
};

var getSalesforcePlayers = function(){
    $.ajax({
        type:'GET',
        url:"salesforce/players",
        success:function(response){
            console.log(response);
            salesforcePlayers = response;
            for (var i = 0; i < salesforcePlayers.length; i++){
               // console.log(salesforcePlayers[i].name);
                for(var j = 0; j< adp.length; j++){
                 if(salesforcePlayers[i].name == adp[j].Name){
                    adp[j].SalesforceId = response[i].id;
                     console.log(salesforcePlayers[i].name);
                }
              }
            }
            //console.log(goodPlayers);
          //  updatePlayersDom();
            //console.log(rookies);
          //  updateRookiesDom();
            console.log(adp);
            updateAdpDom();
        }
    });
};

var updatePlayersDom = function(){
    $("#players").empty();
    for(var i = 0; i < goodPlayers.length; i++){
        $("#players").append("<div class='container col-sm-2 playercard'></div>");
        var $el = $("#players").children().last();
        $el.data("player", goodPlayers[i]);
        $el.append("<p>" + goodPlayers[i].Name + "</p>");
        $el.append("<p class=''> points: " + goodPlayers[i].LastSeasonFantasyPoints + "</p>");
        $el.append("<p class=''> auction$: " +  goodPlayers[i].AuctionValuePPR  + "</p>");
        $el.append("<p class=''> adp: " +  goodPlayers[i].AverageDraftPositionPPR  + "</p>");
        //$el.append("<button class='btn btn-warning '>Update</button>");
        $el.append("<button class='btn btn-warning insert'>Insert</button>");
        goodPlayers[i].element = $el;
    }
};
var updateRookiesDom = function(){
    $("#rookies").empty();
    for(var i = 0; i < rookies.length; i++){
        $("#rookies").append("<div class='container col-sm-2 playercard'></div>");
        var $el = $("#rookies").children().last();
        $el.data("player", rookies[i]);
        $el.append("<p>" + rookies[i].Name + "</p>");
        $el.append("<p class=''> Team: " + rookies[i].Team + "</p>");
        $el.append("<p class=''> Position: " + rookies[i].Position + "</p>");
        $el.append("<p class=''> Price: " +  rookies[i].AuctionValuePPR  + "</p>");
        //$el.append("<p class=''> adp: " +  rookies[i].AverageDraftPositionPPR  + "</p>");
        //$el.append("<button class='btn btn-warning '>Update</button>");
        $el.append("<button class='btn btn-warning insert'>Insert</button>");
        rookies[i].element = $el;
    }
};
var updateAdpDom = function(){
    $("#adp").empty();
    for(var i = 0; i < adp.length; i++){
        $("#adp").append("<div class='container col-sm-2 playercard'></div>");
        var $el = $("#adp").children().last();
        $el.data("player", adp[i]);
        $el.append("<p>" + adp[i].Name + "</p>");
        $el.append("<p class=''> salesforceid: " + adp[i].SalesforceId + "</p>");
        $el.append("<p class=''> auction$: " +  adp[i].AuctionValuePPR  + "</p>");
        $el.append("<p class=''> adp: " +  adp[i].AverageDraftPositionPPR  + "</p>");
        $el.append("<button class='btn btn-warning update'>Update</button>");
        $el.append("<button class='btn btn-warning insert'>Insert</button>");
        adp[i].element = $el;
    }
};

var insertPlayer = function(){
   console.log('clicked');
    var player = $(this).parent().data("player");
    postPlayer(player);
};

var updatePlayer = function(){
    console.log('clicked');
    var player = $(this).parent().data("player");
    putPlayer(player);
};

var postPlayer = function (player){
    console.log(player);
        $.ajax({
            type:'POST',
            url:"salesforce/player",
            data:
            {   "Name" : player.Name,
                "AuctionValuePPR" : player.AuctionValuePPR,
                "Position" : player.Position,
                "Team" : player.Team
            },
            success: function(response){
                console.log(response);
            }
        });
};

var putPlayer = function(player){
    console.log(player);
    $.ajax({
        type:'PUT',
        url:"salesforce/updatePlayer",
        data:
        {   "Name" : player.Name,
            "AuctionValuePPR" : player.AuctionValuePPR,
            "Position" : player.Position,
            "Team" : player.Team,
            "id": player.SalesforceId,
            "ByeWeek" : player.ByeWeek,
            "FantasyPlayerKey": player.FantasyPlayerKey
        },
        success: function(response){
            console.log(response);
        }
    });
};