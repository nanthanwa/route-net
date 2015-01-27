angular.module('starter.controllers', [])


.controller('DomainCtrl', function($scope, $location, DomainsService){
 $scope.domains={}
 $scope.domains.domainbus = false;
 $scope.domains.domaintour = false;
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



.controller('MapCtrl', function($scope, $ionicLoading, $http, $location, $ionicActionSheet, $timeout, DomainsService, LocationService) {

  $scope.device = "";
  $scope.myPosition="";
  $scope.markers=LocationService.getAll();
  $scope.test="bus"

  $scope.bus=DomainsService.get();
  //$scope.poss = null;

  //console.log($scope.bus);


  $scope.mapCreated = function(map) {
    $scope.map = map;
    getNode();
    $scope.centerOnMe();

   
  };


  $scope.centerOnMe = function() {
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
        icon: "http://maps.google.com/mapfiles/kml/pal3/icon32.png"

      })
      //console.log($scope.poss.coords.latitude);
      //console.log($scope.poss.coords.longitude);
    }

    $scope.transportRoute = "";

    $scope.shareLocation = function(){
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
      
      console.log(uuid);

      show();

      //alert($scope.transportRoute+"<br>"+$scope.poss.timestamp+"<br>"+$scope.poss.coords.latitude+"<br>"+$scope.poss.coords.longitude);
      //alert(msg.setText(Html.fromHtml("<u>Message</u>")));
      //console.log($scope.poss);
      $http.post('http://localhost:3000/api/shareNode',{
        UUID: uuid,
        timestamp: $scope.poss.timestamp,
        location:{
          latitude: $scope.poss.coords.latitude,
          longitude: $scope.poss.coords.longitude
        },
        domain: {
          bus : $scope.transportRoute
        }
      })
      .success(function(data, status, headers, config){
        //console.log(data.timestamp);
        //alert(data.transportRoute+"<br>"+data.timestamp+"<br>"+data.latitude+"<br>"+data.longitude);
      })
      .error(function(data, status, headers, config) {

      });

      getNode();

  }


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
        console.log(list[i].domain, list[i].latitude, list[i].longitude);
        mark(list[i].domain, list[i].latitude, list[i].longitude);
      }

      
    }

  function mark(domain, latitude, longitude){
        if(domain === "bus" && ($scope.bus.domainbus==true)){
          new google.maps.Marker({
            position: new google.maps.LatLng(latitude,longitude),
            map:$scope.map,
            icon: "http://maps.google.com/mapfiles/kml/pal2/icon47.png"
          })
        }
        else if(domain === "tour" &&($scope.bus.domaintour==true)){
          new google.maps.Marker({
            position: new google.maps.LatLng(latitude,longitude),
            map:$scope.map,
            icon: "http://maps.google.com/mapfiles/kml/pal4/icon62.png"
          })
        }
    }
    function clearmarker(){

    }


    function getNode(){
      $http.get('http://localhost:3000/api/nodeByDomain').success(function(data){
        $scope.node = data;
        for (var i = 0; i < $scope.node.length; i++) {
          //console.log("UUID:"+$scope.node[i].UUID+"  TIMESTAMP:"+$scope.node[i].timestamp + "   BUS"+$scope.node[i].domain.bus);
          console.log($scope.node[i].domain);
         mark("bus",$scope.node[i].location.latitude,$scope.node[i].location.longitude);                
        }      
      })
    }

    function getNodeMark(){
    //console.log($scope.testsend);
      $http.get('http://localhost:3000/api/nodeMark').success(function(data){
         $scope.node = data;
      })
    }

    function saveNode(){
      $scope.testsend={id:"5",name:"wor"};
      console.log($scope.testsend);
      $http.post('http://localhost:3000/api/saveNode',$scope.testsend)
      .success(function(data, status, headers, config){

      })
      .error(function(data, status, headers, config) {

      });
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
         return true;
       }
     });

  };

})
