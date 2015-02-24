angular.module('starter.controllers')

.controller('ProfileCtrl', function($scope, $http, $location, $ionicModal, DomainsService){
  $scope.model = [];
  $scope.model.favNum = null;
  $scope.model.input = [];
  $scope.object = null;
  getProfile();
  $scope.goMap= function(){
    $location.path('/map');
  }

  $scope.goHome= function(){
    //console.log("route-net : goDomain()");
    $location.path('/home');
  }

  $ionicModal.fromTemplateUrl('modal-favorite', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
    //console.log($scope.model.input);
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.saveModal = function() {
    //console.log($scope.model.type[0]);
    //console.log($scope.object);
    //console.log($scope.model.line);

    $http.post('http://103.245.167.177:3000/api/saveProfile',{

      UUID: "f6a0fd1452a8f404",
      domain: $scope.object
    })
    .success(function(data, status, headers, config) {            
          //console.log(data);
    })
    .error(function(data, status, headers, config) {

    });
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  
  function getProfile(){

    $http.post('http://103.245.167.177:3000/api/getProfile',{

      UUID: "f6a0fd1452a8f404"
    })
    .success(function(data, status, headers, config) {            
          //console.log(data[0].domain.length);
          $scope.model.favNum = data[0].domains.length;
          $scope.object = data[0].domains;
          $scope.trust = data[0].trust;

          function chunk(arr, size) {
            var newArr = [];
            for (var i=0; i<arr.length; i+=size) {
              newArr.push(arr.slice(i, i+size));
            }
            return newArr;
          }

          $scope.chunkedData = chunk($scope.object, 2);

          //console.log($scope.chunkedData);
          
    })
    .error(function(data, status, headers, config) {

    });



    }

    $scope.removeCard = function(index){
      console.log(index);
    }
})