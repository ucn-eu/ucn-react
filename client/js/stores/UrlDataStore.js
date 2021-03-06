/*
 * Copyright (c) 2015, Tom Lodge
 * All rights reserved.
 *
 * DefaultStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');
var WebAPIUtils = require('../utils/WebAPIUtils');
var DevicesStore = require('./DevicesStore');

var CHANGE_EVENT = 'change';
var ActionTypes = Constants.ActionTypes;
var _urls = [];
var _selected = "";


var _toggle_url = function(url){
	if (_selected === url){
		_selected = "";
	}else{
		_selected = url;
		WebAPIUtils.fetch_url_history(DevicesStore.selected(), url);
	}
};

var _update_raw_url_data = function(data){
 
  _urls = data.urls || [];
};

var UrlDataStore = assign({}, EventEmitter.prototype, {

  urls: function(){
    return _urls;
  },

  selected: function(){
    return _selected;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
UrlDataStore.dispatchToken = AppDispatcher.register(function(action) {

  var action = action.action;
 
  switch(action.type) {

	case ActionTypes.RAW_ZOOM_DATA:
      _update_raw_url_data(action.rawData); 
      UrlDataStore.emitChange();
      break;
    
    case ActionTypes.URL_CLICKED:
      _toggle_url(action.url);
      UrlDataStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = UrlDataStore;
