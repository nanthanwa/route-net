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

  var locations = [
  /*{
    Location:{domain: "bus", latitude:7.010568199999999, longitude: 100.48500}
  },
  {
    Location:{domain: "bus", latitude:7.005368199999999, longitude:100.49500}
  },
  {
    Location:{domain: "bus", latitude:7.008368199999999, longitude:100.50000}
  },
  {
    Location:{domain: "bus", latitude:7.004368199999999, longitude:100.49000}
  },
  {
    Location:{domain: "bus", latitude:7.007368199999999, longitude:100.49000}
  },
  {
    Location:{domain: "tour", latitude:7.008068199999999, longitude: 100.48300}
  },
  {
    Location:{domain: "tour", latitude:7.005368199999999, longitude:100.49300}
  },
  {
    Location:{domain: "tour", latitude:7.012368199999999, longitude:100.50000}
  },
  {
    Location:{domain: "tour", latitude:7.004368199999999, longitude:100.47000}
  },
  {
    Location:{domain: "tour", latitude:7.007368199999999, longitude:100.48000}
  }*/
  ]


  return {
    getAll: function() {
      // Simple index lookup
      return locations;
    }
  }
});