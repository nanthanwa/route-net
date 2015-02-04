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
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
  })
  .state('domain', {
    url: "/domain",
    templateUrl: "templates/domain.html",
    controllers: "DomainCtrl"
  })
  .state('map', {
    url: "/map",
    templateUrl: "templates/map.html",
    controllers: "MapCtrl"
  })
  $urlRouterProvider.otherwise("/domain");
})