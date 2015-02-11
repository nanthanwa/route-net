angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    
  });
  //console.log(device);


})

.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
  .state('home', {
    url: "/home",
    templateUrl: "templates/home.html",
    controllers: "HomeCtrl"
  })
  .state('map', {
    url: "/map",
    templateUrl: "templates/map.html",
    controllers: "MapCtrl"
  })
  .state('profile', {
    url: "/profile",
    templateUrl: "templates/profile.html",
    controllers: "ProfileCtrl"
  })
  $urlRouterProvider.otherwise("/home");
})