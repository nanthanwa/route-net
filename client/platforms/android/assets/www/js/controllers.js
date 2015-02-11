angular.module('starter.controllers', [])
.controller('HomeCtrl', function($scope, $location, DomainsService){
 $scope.domains={}
 $scope.domains.domainbus = false;
 $scope.domains.domaintour = false;
  //$scope.allLocation = [];

  $scope.goMap= function(params){
    // console.log("route-net : goMap()");
    // console.log("Bus :"+ params.domainbus)
    // console.log("Tour :"+ params.domaintour)
    
    DomainsService.set(params);
    $location.path('/map');
  }

  $scope.goProfile= function(){
    $location.path('/profile');
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
  
  var markersArray = [];
  $scope.device = "";
  $scope.myPosition="";
  $scope.markers=LocationService.getAll();
  $scope.test="bus"
  $scope.bus=DomainsService.get();
  //$scope.poss = null;

  //console.log($scope.bus);

  //refreshNode();




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

  $scope.centerOnMe();
  refreshNode();

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
      $ionicLoading.hide();
      //console.log(pos.timestamp);
      mymarker();

    }, function (error) {
      alert('Unable to get location: ' + error.message);
    },{timeout:30000});
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
  $scope.goHome= function(){
    //console.log("route-net : goDomain()");
    $location.path('/home');
  }

  $scope.goProfile= function(){
    $location.path('/profile');
  }



  function mark(data){
    //console.log(data.domain.type);

    //console.log(data.loc.coordinates[0],data.loc.coordinates[1],data.domain.type)
        if(data.domain.type === "bus" && ($scope.bus.domainbus==true)){

          markersArray.push(new google.maps.Marker({
            position: new google.maps.LatLng(data.loc.coordinates[1],data.loc.coordinates[0]),
            map:$scope.map,
            icon: "img/bus.png",
            title:data.domain.name
          }));
        }
        else if(data.domain.type === "tour" &&($scope.bus.domaintour==true)){
         // console.log("tour TRUE")
          markersArray.push(new google.maps.Marker({
            position: new google.maps.LatLng(data.loc.coordinates[1],data.loc.coordinates[0]),
            map:$scope.map,
            icon: "img/tour.png",
            title:data.domain.name
          }));
        }

  
  }

  function getNode(){
    $http.get('http://localhost:3000/api/nodeByDomain').success(function(data){
      $scope.node = data;
        //console.log(data);
        for (var i = 0; i < $scope.node.length; i++) {
          //console.log($scope.node[i]);
          mark($scope.node[i]);              
        }      
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
      loc:{
        type: "Point",
        coordinates :[$scope.poss.coords.longitude,$scope.poss.coords.latitude]
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
        $ionicLoading.hide();
      },1000);

    })
      .error(function(data, status, headers, config) {

      });

    //console.log(index); 
  }

  function clearAllNode(){
    //console.log("clear");
    /*$scope.loading = $ionicLoading.show({
      content: 'All node are cleared',
      showBackdrop: false
    });
    $timeout(function(){
      $scope.loading.hide();
    },1000);*/
    clearOverlays();
    
  }


  function clearOverlays() {
      //console.log(markersArray.length);
      //console.log(markersArray);
      for (var i = 0; i < markersArray.length; i++ ) {
        markersArray[i].setMap(null);
      }
      markersArray = [];
    }
    

    function refreshNode(){
      
      setInterval(function(){
        clearAllNode();
            getNode();

        $http.post('http://localhost:3000/api/updateNode', {
            UUID: "f6a0fd1452f8f736",
          loc:{
            type: "Point",
            coordinates :[$scope.poss.coords.longitude,$scope.poss.coords.latitude]
          },
              
        })

        .success(function(data, status, headers, config) {            
            console.log(data);
            
        })
        .error(function(data, status, headers, config) {
            
        });
       
      },5000);

    }    


  })

.controller('ProfileCtrl', function($scope, $location, DomainsService){
  $scope.goMap= function(params){
    // console.log("route-net : goMap()");
    // console.log("Bus :"+ params.domainbus)
    // console.log("Tour :"+ params.domaintour)
    
    DomainsService.set(params);
    $location.path('/map');
  }

  $scope.goHome= function(){
    //console.log("route-net : goDomain()");
    $location.path('/home');
  }
})