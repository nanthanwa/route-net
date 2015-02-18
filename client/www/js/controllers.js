angular.module('starter.controllers', [])
.controller('HomeCtrl', function($scope, $ionicLoading, $http, $location, $ionicActionSheet, $timeout, DomainsService, LocationService, $ionicLoading){
 // $scope.domains={}
 // $scope.domains.domainbus = false;
 // $scope.domains.domaintour = false;
  //$scope.allLocation = [];

$scope.model = {};
$scope.model.transportRoute = null;


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
      //content: 'Success',
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
      $http.post('http://localhost:3000/api/shareNode',{

        UUID: uuid,
        timestamp: parseInt($scope.poss.timestamp),
        loc:{
          type: "Point",
          coordinates :[$scope.poss.coords.longitude,$scope.poss.coords.latitude]
        },
        domain: {
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
})



.controller('MapCtrl', function($scope, $ionicLoading, $http, $ionicModal, $location, $ionicActionSheet, $timeout, DomainsService, LocationService) {

  var markersArray = [];
  $scope.device = "";
  $scope.myPosition="";
  $scope.markers=LocationService.getAll();
  $scope.test="bus"
  $scope.bus=DomainsService.get();
  //$scope.poss = null;

  $scope.model = [];
  $scope.model.transportRoute = null;

  $scope.model.bus = true;
  $scope.model.tour = true;
  //console.log($scope.bus);

  //refreshNode();

  infowindow = new google.maps.InfoWindow();
  
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
      //content: 'Getting current location...',
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
    },{timeout:10000});
        //end getCurrentPosition

  }; //end centerOnMe


    //mark current location
    function mymarker(){

      

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng($scope.poss.coords.latitude,$scope.poss.coords.longitude),
        map:$scope.map,
        icon: "img/current.png"
      });

      google.maps.event.addListener(marker, 'mouseover', function() {

          infowindow.setContent("My location");
          infowindow.open($scope.map, this);

        });
      //console.log($scope.poss.coords.latitude);
      //console.log($scope.poss.coords.longitude);
    }

    $scope.button = [];

    $scope.button.shareLocation = function(){
      show();
     // console.log("test");
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
    //console.log(data.domain.name);
    //console.log(data.loc.coordinates[0],data.loc.coordinates[1],data.domain.type)
    if(data.domain.type === "bus" && $scope.model.bus == true){

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.loc.coordinates[1],data.loc.coordinates[0]),
        map:$scope.map,
        icon: "img/bus.png",
        title: data.domain.name
      })

      markersArray.push(marker);

      google.maps.event.addListener(marker, 'mouseover', function() {
          infowindow.setContent("bus");
          infowindow.open($scope.map, this);
        });

    }
    else if(data.domain.type === "tour" && $scope.model.tour == true){
         // console.log("tour TRUE")


         var marker = new google.maps.Marker({
          position: new google.maps.LatLng(data.loc.coordinates[1],data.loc.coordinates[0]),
          map:$scope.map,
          icon: "img/tour.png",
          title: data.domain.name
        })

         markersArray.push(marker);
         google.maps.event.addListener(marker, 'mouseover', function() {
          infowindow.setContent("tour");
          infowindow.open($scope.map, this);
        });


       }


  function getNode(){
    $http.get('http://localhost:3000/api/allMaster').success(function(data){
      $scope.node = data;


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
     $scope.loading = $ionicLoading.show({
        //content: 'Success',
        showBackdrop: false
      });
    //console.log(index);
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
      //console.log($scope.model.transportRoute);
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
        name : ($scope.model.transportRoute).toString()
      }
    })
    .success(function(data, status, headers, config){
      //console.log(data.timestamp);
      //alert(data.transportRoute+"<br>"+data.timestamp+"<br>"+data.latitude+"<br>"+data.longitude);
      //console.log(status);
      $ionicLoading.hide();
      $scope.model.transportRoute = null;

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


  $ionicModal.fromTemplateUrl('modal-map', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  var tmp1;
  var tmp2;
  $scope.openModal = function() {
    $scope.modal.show();
    tmp1 = $scope.model.bus;
    tmp2 = $scope.model.tour;
    // console.log($scope.model.bus);
    // console.log($scope.model.tour);
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.model.bus = tmp1;
    $scope.model.tour = tmp2;
  };

  $scope.saveModal = function() {
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

})

.controller('ProfileCtrl', function($scope, $location, $ionicModal, DomainsService){
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
  };
  $scope.closeModal = function() {
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

})