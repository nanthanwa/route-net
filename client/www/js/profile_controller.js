angular.module('starter.controllers')

.controller('ProfileCtrl', function($scope, $http, $location, $window, $ionicModal, DomainsService){
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
    //$window.location.reload();
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



  $ionicModal.fromTemplateUrl('modal-edit', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal2 = modal;
  });

  var indexIns;
  var nameOld;
  var typeOld;

  $scope.openModal2 = function(item, index) {
    $scope.modal2.show();
    $scope.model.typeIns = item.type;
    $scope.model.nameIns = item.name;
    nameOld = item.type;
    typeOld = item.name;
    indexIns = index;
    //console.log(item, index);
  };

  $scope.closeModal2 = function() {
    //console.log(itemIns, indexIns);
    
    $http.post('http://103.245.167.177:3000/api/saveProfile',{
      UUID: "f6a0fd1452a8f404",
      type: $scope.model.typeIns,
      name: $scope.model.nameIns,
      index: indexIns,
      nameOld: nameOld,
      typeOld: typeOld
    })
    .success(function(data, status, headers, config) {            
          $scope.modal2.hide();
    })
    .error(function(data, status, headers, config) {

    });
    $scope.modal2.hide();

  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal2.remove();
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

    $scope.removeCard = function(name, type){
      //console.log(index);
      $http.post('http://103.245.167.177:3000/api/removeFav',{
        UUID: "f6a0fd1452a8f404",
        name: name,
        type: type
      })
      .success(function(data, status, headers, config) {            
        console.log($scope.$apply());
        //console.log(data);
          
      })
      .error(function(data, status, headers, config) {

      });
    }


  $scope.data = {
    showDelete: false
  };
  
  $scope.edit = function(item, index) {
    //alert('Edit Item: ' + item.name);
    $scope.openModal2(item, index);
  };

  $scope.share = function(item) {
    alert('Share Item: ' + item.id);
  };
  
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  };
  
  $scope.onItemDelete = function(item) {
    $scope.object.splice($scope.object.indexOf(item), 1);
    //console.log(item);
    $scope.removeCard(item.name, item.type);
  };


})