angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('DomainsService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var wishs = {};

  return {
    set: function(params){
      wishs=params;
    },
    all: function() {
      return wishs;
    },
    get: function() {
      // Simple index lookup
      return wishs;
    }
  }
})
.factory('LocationService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var locations = [{Location:{latitude:20.1,logtitude:101.9}
  },{Location:{latitude:40.1,logtitude:110.9}

  }]

  return {
    getAll: function() {
      // Simple index lookup
      return locations;
    }
  }
});