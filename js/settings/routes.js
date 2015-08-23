chromeCrashApp.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl : 'pages/settings.html',
    controller  : 'SettingsController'
  });
});
