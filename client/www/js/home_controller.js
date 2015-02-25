angular.module('starter.controllers')
.controller('HomeCtrl', function($scope, $ionicLoading, $http, $interval, $location, $ionicActionSheet, $timeout, DomainsService, LocationService, $ionicLoading){
 // $scope.domains={}
 // $scope.domains.domainbus = false;
 // $scope.domains.domaintour = false;
  //$scope.allLocation = [];

$scope.model = [];
$scope.model.transportRoute = null;

$scope.model.favNum = null;
$scope.object = null;
$scope.model.status = "Idle";


var interval;


  getProfile();

  $scope.goMap= function(){
    // console.log("route-net : goMap()");
    // console.log("Bus :"+ params.domainbus)
    // console.log("Tour :"+ params.domaintour)
    
  //DomainsService.set(params);
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

   function insert_node(index){
    $scope.loading = $ionicLoading.show({
      template: 'Sharing',
      showBackdrop: false
    });


    navigator.geolocation.getCurrentPosition(function (pos) {
      $scope.poss = pos;
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
      //console.log(transportRoute);
      var type = (index == 0 ? "bus" : "tour");
      //console.log(index);
      $http.post('http://103.245.167.177:3000/api/shareNode',{

        UUID: "f6a0fd1452a8f404",
        timestamp: parseInt($scope.poss.timestamp),
        loc:{
          type: "Point",
          coordinates :[$scope.poss.coords.longitude,$scope.poss.coords.latitude]
        },
        domains: {
          type : type,
          name : ($scope.model.transportRoute).toString()
        }
      })
      .success(function(data, status, headers, config){
        //console.log(data.timestamp);
        //alert(data.transportRoute+"<br>"+data.timestamp+"<br>"+data.latitude+"<br>"+data.longitude);
        //console.log(data);
        $scope.model.transportRoute = null;
        $ionicLoading.hide();
        // $timeout(function(){
        //          
        // },1000);
        

      });

    })

  }

  function getProfile(){
    $http.post('http://103.245.167.177:3000/api/getProfile',{
      UUID: "f6a0fd1452a8f404"
    })
    .success(function(data, status, headers, config) {            

          $scope.model.favNum = data[0].domains.length;
          $scope.object = data[0].domains;

          function chunk(arr, size) {
            var newArr = [];
            for (var i=0; i<arr.length; i+=size) {
              newArr.push(arr.slice(i, i+size));
            }
            return newArr;
          }

          $scope.chunkedData = chunk($scope.object, 2);

          
    })
    .error(function(data, status, headers, config) {

    });



    }

    $scope.fastTrack = function(row, column){
      //console.log(row, column);
      //console.log($scope.chunkedData[row][column]);
      insertFromFav($scope.chunkedData[row][column].type, $scope.chunkedData[row][column].name);
    }

    function insertFromFav(type, name){
      navigator.geolocation.getCurrentPosition(function (pos) {
      $scope.poss = pos;

      $scope.loading = $ionicLoading.show({
      template: 'Processing',
      showBackdrop: false
      });

      $http.post('http://103.245.167.177:3000/api/shareNode',{
        UUID: "f6a0fd1452a8f404",
        timestamp: parseInt($scope.poss.timestamp),
        loc:{
          type: "Point",
          coordinates :[$scope.poss.coords.longitude, $scope.poss.coords.latitude]
        },
        domains: {
          type : type,
          name : name.toString()
        }
      })
      .success(function(data, status, headers, config){
        $ionicLoading.hide();
        $scope.model.status = "Tracking";
        refreshNode();
        //console.log(data);
        });
      }
    )};

    
    function refreshNode(){
      interval = $interval(function() {
        $http.post('http://103.245.167.177:3000/api/updateNode', {
          UUID: "f6a0fd1452a8f404",
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
      }, 5000);
    }    

    $scope.statusButton = function(){
      $scope.model.status = "Idle";
      $interval.cancel(interval);
      $interval.cancel(intervalfind);
    }

    $scope.find = function(){
      $scope.model.status = "Looking for " + $scope.model.transportFind;
      intervalfind=$interval(function(){      
      navigator.geolocation.getCurrentPosition(function (pos){
      $http.post('http://103.245.167.177:3000/api/lookingfor',{
        lookingfor:$scope.model.transportFind,
        loc:{
          type: "Point",
          coordinates :[pos.coords.longitude, pos.coords.latitude]
        }

      })
      .success(function(data,status,headers,config){
        console.log(data.length)
        if(data.length!=0){
          alert($scope.model.transportFind+" is Coming")
          $scope.statusButton();
        }
      })
    })
    },3000);
  };

  function stopFind(){
    $scope.model.status = "Idle";
    $interval.cancel(intervalfind);
  }

})
  





