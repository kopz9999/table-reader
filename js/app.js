var chromeCrashApp = angular.module('chromeCrashApp', [ 'ngRoute' ]);

chromeCrashApp.value('$sharedData',{
  setting: null,
  user: null,
  authTokenHeaders: null,
  appData: {
    name: 'Table Reader',
    storeKey: 'meteorData'
  }
});
// create the controller and inject Angular's $scope
chromeCrashApp.controller('MainController', ['$scope', '$sharedData',
  ChromeCrash.MainController]);

// Controllers
chromeCrashApp.controller('LoginController',
  ['$scope', '$http', '$location', '$sharedData',
    ChromeCrash.LoginController]);

chromeCrashApp.controller('SettingsController',
  ['$scope', '$location', '$sharedData', ChromeCrash.SettingsController]);

chromeCrashApp.controller('AuthTokenController',
  ['$scope', '$location', '$sharedData',
    ChromeCrash.AuthTokenController]);

chromeCrashApp.controller('WebhookController',
  ['$scope', '$http', '$location', '$sharedData',
    ChromeCrash.WebhookController]);

// Directives
chromeCrashApp.directive('crashNotifications',
  ChromeCrash.CrashNotifications.factory);

chromeCrashApp.directive('crashLoader',
  ChromeCrash.CrashLoader.factory);
