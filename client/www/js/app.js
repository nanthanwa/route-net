angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives'])

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
    templateUrl: "templates/domain.html"
  })
  .state('map', {
    url: "/map",
    templateUrl: "templates/map.html"
  })
  $urlRouterProvider.otherwise("/domain");
})