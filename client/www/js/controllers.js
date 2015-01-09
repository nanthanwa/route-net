angular.module('starter.controllers', [])


.controller('DomainCtrl', function($scope, $location, DomainsService){
   $scope.domains={}
   $scope.domains.domaincar = false;
   $scope.domains.domainbus = false;

   
    
  $scope.goMap= function(params){
    console.log("BUS :"+ params.domainbus)
    console.log("CAR :"+ params.domaincar)
    DomainsService.set(params);
    $location.path('/map');
  }

})



.controller('MapCtrl', function($scope, $ionicLoading, $location, DomainsService) {

  $scope.device = "";


  $scope.bus=DomainsService.get();
  console.log($scope.bus);
  $scope.mapCreated = function(map) {
    $scope.map = map;
  };

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
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();

    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });

  };


  //Controller for DOMAIN !!
  $scope.goDomain= function(){

    console.log("route-net : GODOMAIN");

    $location.path('/domain');
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

});
