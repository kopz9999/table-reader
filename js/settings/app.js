var chromeCrashApp = angular.module('chromeCrashApp', [ 'ngRoute' ]);

chromeCrashApp.value('$sharedData',{
  setting: null,
  user: null,
  authTokenHeaders: null,
  appData: {
    name: 'Meteor Rest Analyzer',
    storeKey: 'meteorData'
  }
});
// create the controller and inject Angular's $scope
chromeCrashApp.controller('MainController', ['$scope', '$sharedData',
  ChromeCrash.MainController]);

chromeCrashApp.controller('SettingsController',
  ['$scope', '$location', '$sharedData', ChromeCrash.SettingsController]);

// Directives
chromeCrashApp.directive('crashNotifications',
  ChromeCrash.CrashNotifications.factory);

chromeCrashApp.directive('crashLoader',
  ChromeCrash.CrashLoader.factory);
