var MainController = function($scope, $sharedData) {
  $scope.appTitle = $sharedData.appData.name;
};

ChromeCrash.MainController = MainController;
