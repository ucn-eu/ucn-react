var request = require('superagent');
var extend = require('extend');

var ServerActionCreators = require('../actions/ServerActionCreators');

var params = location.search.substring(1).split('&').reduce(function(acc, pair){
    var nv = pair.split("=");
    acc[nv[0]]=nv[1];
    return acc;
},{});

module.exports ={

  fetch_browsing: function() {
  	console.log("fetching browsing with");
  	console.log(params);
    request
      .get('/viz/browsing')
      .set('Accept', 'application/json')
      .query(params)
      .end(function(err, res){
        if (err){
          console.log(err);
        }else{
    		ServerActionCreators.receivedBrowsingData(res.body);
        }
     });
  },

  fetch_activity: function() {
    request
      .get('/viz/activity')
      .set('Accept', 'application/json')
      .query(params)
      .end(function(err, res){
        if (err){
          console.log(err);
        }else{
          ServerActionCreators.receivedActivityData(res.body);
         }
     });
  },
  
  fetch_urls: function(timerange) {

    request
      .get('/viz/urls')
      .set('Accept', 'application/json')
      .query(extend(timerange,params))
      .end(function(err, res){
        if (err){
          console.log(err);
        }else{
          console.log("great - got some new url data!");
          ServerActionCreators.receivedURLData(res.body);
         }
     });
  },

  fetch_url_history: function(url) {

    request
      .get('/viz/urls/history')
      .set('Accept', 'application/json')
      .query(extend({url:url},params))
      .end(function(err, res){
        if (err){
          console.log(err);
        }else{
          ServerActionCreators.receivedURLHistoryData(res.body);
         }
     });
  },

  fetch_category_data: function(){
    request
      .get('/viz/categories')
      .set('Accept', 'application/json')
      .query(params)
      .end(function(err, res){
        if (err){
          console.log("hmm errror");
          console.log(err);
        }else{
          console.log("ok - firing receieved category data");
          ServerActionCreators.receivedCategoryData(res.body);
         }
     });
  },

  match_categories: function(partial){
    request
      .get('/viz/categories/match')
      .set('Accept', 'application/json')
      .query({partial:partial})
      .end(function(err, res){
        if (err){
          console.log(err);
        }else{
          ServerActionCreators.receivedCategoryMatches(res.body);
        }
     });
  },

  match_urls: function(partial){
    request
      .get('/viz/urls/match')
      .set('Accept', 'application/json')
      .query(extend({partial:partial},params))
      .end(function(err, res){
        if (err){
          console.log(err);
        }else{
          ServerActionCreators.receivedURLMatches(res.body);
        }
     });

  },
};
