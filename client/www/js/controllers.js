angular.module('starter.controllers', [])


.controller('DomainCtrl', function($scope, $location, DomainsService){
 $scope.domains={}
 $scope.domains.domainbus = false;
 $scope.domains.domaintour = false;
  //$scope.allLocation = [];

  $scope.goMap= function(params){
    // console.log("route-net : goMap()");
    // console.log("Bus :"+ params.domainbus)
    // console.log("Tour :"+ params.domaintour)
    //
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



.controller('MapCtrl', function($scope, $ionicLoading, $http, $location, $ionicActionSheet, $timeout, $timeout, DomainsService, LocationService) {
  var markersArray = [];
  $scope.device = "";
  $scope.myPosition="";
  $scope.markers=LocationService.getAll();
  $scope.test="bus"
  $scope.bus=DomainsService.get();
  //$scope.poss = null;

  //console.log($scope.bus);

  window.plugins.diagnostic.isLocationEnabled(locationEnabledSuccessCallback, locationEnabledErrorCallback);

   function locationEnabledSuccessCallback(result) {
      if (result)
         alert("Location ON");
      else
         alert("Location OFF");
   }

   function locationEnabledErrorCallback(error) {
      console.log(error);
   }

  $scope.mapCreated = function(map) {
    $scope.map = map;
    getNode();
    $scope.centerOnMe(); 
  };


  $scope.centerOnMe = function() {
    //console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {

      //console.log('Got pos', pos);
      $scope.poss = pos;
      //console.log($scope.poss)

      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
      //console.log(pos.timestamp);
      mymarker();

    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
        //end getCurrentPosition

  }; //end centerOnMe


    //mark current location
    function mymarker(){
      new google.maps.Marker({
        position: new google.maps.LatLng($scope.poss.coords.latitude,$scope.poss.coords.longitude),
        map:$scope.map,
          icon: "img/current.png"

      })
      //console.log($scope.poss.coords.latitude);
      //console.log($scope.poss.coords.longitude);
    }

    $scope.transportRoute = "";

    $scope.shareLocation = function(){
      show();
  }

  
  // Triggered on a button click, or some other target
  function show() {

     // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: 'Bus' },
         { text: 'Tour' }
       ],
       titleText: 'Select Domain',
       cancelText: 'Cancel',
       cancel: function() {
            // add cancel code..
          },
       buttonClicked: function(index) {
        if(index == 0){ //bus
          //console.log("Bus");
          insert_node(index);
        }
        else if(index == 1){ //tour
          //console.log("Tour");
          insert_node(index);
        }
         return true;
       }
     });

  };

  //Controller for DOMAIN !!
  $scope.goDomain= function(){
    //console.log("route-net : goDomain()");
    $location.path('/domain');
  }


  function mark(data){
    //console.log(data.domain.type);
        if(data.domain.type === "bus" && ($scope.bus.domainbus==true)){
          markersArray.push(new google.maps.Marker({
            position: new google.maps.LatLng(data.location.latitude,data.location.longitude),
            map:$scope.map,
            icon: "img/bus.png"
          }));
        }
        else if(data.domain.type === "tour" &&($scope.bus.domaintour==true)){
          markersArray.push(new google.maps.Marker({
            position: new google.maps.LatLng(data.location.latitude,data.location.longitude),
            map:$scope.map,
            icon: "img/tour.png"
          }));
        }
    }

  $scope.clearAllNode = function(){
    //console.log("clear");
    $scope.loading = $ionicLoading.show({
      content: 'All node are cleared',
      showBackdrop: false
    });
    $timeout(function(){
      $scope.loading.hide();
    },1000);
    clearOverlays();
  }


    function clearOverlays() {
      //console.log(markersArray.length);
      //console.log(markersArray);
      for (var i = 0; i < markersArray.length; i++ ) {
        markersArray[i].setMap(null);
      }
      markersArray.length = 0;
    }


    function getNode(){
      $http.get('http://localhost:3000/api/nodeByDomain').success(function(data){
        $scope.node = data;
        //console.log(data);
        for (var i = 0; i < $scope.node.length; i++) {
          //console.log($scope.node[i]);
          //console.log($scope.node[i].domain);
         mark($scope.node[i]);              
        }      
      })
    }


    function saveNode(){
      $scope.testsend={id:"5",name:"wor"};
      //console.log($scope.testsend);
      $http.post('http://localhost:3000/api/saveNode',$scope.testsend)
      .success(function(data, status, headers, config){

      })
      .error(function(data, status, headers, config) {

      });
    }

  function insert_node(index){
      //Create Globally unique identifier for google chrome
      var guid = (function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
      }
      return function() {
        return s4() + s4() + '' + s4() + '' + s4()
      };
      })();

      var uuid = guid();
      
      //console.log(uuid);
      //console.log($scope.transportRoute);
      var type = (index == 0 ? "bus" : "tour");
      //console.log(type);
      $http.post('http://localhost:3000/api/shareNode',{
      UUID: uuid,
      timestamp: parseInt($scope.poss.timestamp),
      location:{
        latitude: $scope.poss.coords.latitude,
        longitude: $scope.poss.coords.longitude
      },
      domain: {
        type : type,
        name : $scope.transportRoute
      }
    })
    .success(function(data, status, headers, config){
      //console.log(data.timestamp);
      //alert(data.transportRoute+"<br>"+data.timestamp+"<br>"+data.latitude+"<br>"+data.longitude);
      //console.log(status);
      $scope.loading = $ionicLoading.show({
      content: 'Success',
      showBackdrop: false
      });
      $timeout(function(){
        $scope.loading.hide();
      },1000);

    })
    .error(function(data, status, headers, config) {

    });
  
    //console.log(index); 
  }


})
