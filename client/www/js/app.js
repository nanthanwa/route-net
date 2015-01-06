angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  

  $stateProvider

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