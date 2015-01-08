angular.module('starter.controllers', [])

.controller('DomainCtrl', function($scope, $location){
   $scope.domaincar = false;
   $scope.domainbus = false;


  $scope.goMap= function(){

    $location.path('/map');
  }



})
.controller('MapCtrl', function($scope, $ionicLoading, $location) {

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
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.uuid = "UUID: "+localStorage.getItem("uuid");
  //Controller for DOMAIN !!
  $scope.goDomain= function(){
    $location.path('/domain');
  }
  
});
