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

var CHANGE_EVENT = 'change';
var ActionTypes = Constants.ActionTypes;
var _urls = [];
var _selected = "";

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

  switch(action.type) {

  	case ActionTypes.RAW_URL_DATA:
      _update_raw_url_data(action.rawUrls);
      UrlDataStore.emitChange();
      break;
    
    case ActionTypes.URL_CLICKED:
      _selected = action.url;
      UrlDataStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = UrlDataStore;