chromeCrashApp.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl : 'pages/login.html',
    controller  : 'LoginController',
    controllerAs: 'loginController'
  });
  $routeProvider.when('/land', {
    templateUrl : 'pages/land.html',
    controller  : 'AuthTokenController'
  });
  $routeProvider.when('/webhook', {
    templateUrl : 'pages/webhook.html',
    controller  : 'WebhookController'
  });
});
