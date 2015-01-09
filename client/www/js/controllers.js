angular.module('starter.controllers', [])


.controller('DomainCtrl', function($scope, $location, DomainsService){
 $scope.domains={}
 $scope.domains.domaincar = false;
 $scope.domains.domainbus = false;



 $scope.goMap= function(params){
  console.log("route-net : goMap()");
  console.log("BUS :"+ params.domainbus)
  console.log("CAR :"+ params.domaincar)
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
  $scope.myPosition="";
  $scope.markers=LocationService.getAll();

  $scope.bus=DomainsService.get();
  console.log($scope.bus);
  $scope.mapCreated = function(map) {
    $scope.map = map;

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
      console.log('Got pos', pos);
      $scope.myPosition=pos;

      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
      mymarker();

    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };

    //mark current location
    function mymarker(){
      new google.maps.Marker({
        position: new google.maps.LatLng($scope.myPosition.coords.latitude,$scope.myPosition.coords.longitude),
        map:$scope.map
      })
    }

    //mark another location
    function anothermarker(markers){
      for(var i=0;i<markers.length;i++){       
       new google.maps.Marker({
        position: new google.maps.LatLng(markers[i].Location.latitude,markers[i].Location.longtitude),
        map:$scope.map,
        pin:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      });
       console.log("marker"+(i+1)+"  "+markers[i].Location.latitude+","+markers[i].Location.longtitude);
      }
   }

   function clearmarker(){

   }


   $scope.ShareLocation = function(){
    clearmarker();
  }


  //Controller for DOMAIN !!
  $scope.goDomain= function(){
    console.log("route-net : goDomain()");
    $location.path('/domain');
  }

});
