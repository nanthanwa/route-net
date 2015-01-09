angular.module('starter.controllers', [])


.controller('DomainCtrl', function($scope, $location, DomainsService){
 $scope.domains={}
 $scope.domains.domainbus = false;
 $scope.domains.domaintour = false;
 $scope.domainbus = null;
 $scope.domaintour = null;
  //$scope.allLocation = [];


 $scope.goMap= function(params){
  console.log("route-net : goMap()");
  console.log("Bus :"+ params.domainbus)
  console.log("Tour :"+ params.domaintour)
  DomainsService.set(params);
  $location.path('/map');
}

  // Wait for device API libraries to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
      var element = document.getElementById('deviceProperties');
      element.innerHTML = 'Device Name: '     + device.name     + '<br />' +
      'Device Cordova: '  + device.cordova  + '<br />' +
      'Device Platform: ' + device.platform + '<br />' +
      'Device UUID: '     + device.uuid     + '<br />' +
      'Device Model: '    + device.model    + '<br />' +
      'Device Version: '  + device.version  + '<br />';
    }

  })



.controller('MapCtrl', function($scope, $ionicLoading, $location, DomainsService, LocationService) {

  $scope.device = "";
  $scope.poss=""

  $scope.bus=DomainsService.get();
  console.log($scope.bus);
  $scope.mapCreated = function(map) {
    $scope.map = map;
    anothermarker();
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      //console.log('Got pos', pos);
      $scope.poss=pos;
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
      mymarker();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });

    
    //mark current location
    function mymarker(){
      new google.maps.Marker({
        position: new google.maps.LatLng($scope.poss.coords.latitude,$scope.poss.coords.longitude),
        map:$scope.map,
        icon: "http://maps.google.com/mapfiles/kml/pal3/icon32.png"
      })
      //console.log($scope.poss.coords.latitude);
      //console.log($scope.poss.coords.longitude);
    }

    
    $scope.ShareLocation = function(){
      clearmarker();
    }


  };


  //Controller for DOMAIN !!
  $scope.goDomain= function(){

    //console.log("route-net : goDomain()");

    $location.path('/domain');
  }

  //mark another location
    function anothermarker(){
      var list = [];
      for (var i = 0; i <LocationService.getAll().length ; i++) {
        //console.log(LocationService.getAll()[i]);
        list.push(LocationService.getAll()[i].Location);
      }

      for (var i = 0; i < list.length; i++) {
        //console.log(list[i].domain, list[i].latitude, list[i].longitude);
        mark(list[i].domain, list[i].latitude, list[i].longitude);
      }
        
      function mark(domain, latitude, longitude){
        if(domain === "bus"){
          new google.maps.Marker({
            position: new google.maps.LatLng(latitude,longitude),
            map:$scope.map,
            icon: "http://maps.google.com/mapfiles/kml/pal2/icon47.png"
          })
        }
        else if(domain === "tour"){
          new google.maps.Marker({
            position: new google.maps.LatLng(latitude,longitude),
            map:$scope.map,
            icon: "http://maps.google.com/mapfiles/kml/pal4/icon62.png"
          })
        }
      }
  }

  function clearmarker(){

    }

});
