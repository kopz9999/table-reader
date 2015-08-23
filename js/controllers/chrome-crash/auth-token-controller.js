var AuthTokenController = function($scope, $location, $sharedData) {
  this._initBase($scope, $location, $sharedData);
};

extend(AuthTokenController, ChromeCrash.BaseController);

AuthTokenController.prototype._initBase = function ($scope, $location,
                                                        $sharedData) {
  this._location = $location;
  ChromeCrash.AuthTokenController.__super__._initBase.call(this, $scope,
    $sharedData);
};

AuthTokenController.prototype._initScope = function () {
  var _self = this;
  this._scope.logout = function(){
    _self.logout();
  };
  this._scope.showSettings = function(){
    _self.showSettings();
  };
};

AuthTokenController.prototype.logout = function () {
  this._sharedData.authTokenHeaders = null;
  this._addNotification( "Token has been dropped" );
  this._saveState();
  this._redirectToLogin();
};

AuthTokenController.prototype._redirectToLogin = function(){
  this._location.path( '/' );
};

AuthTokenController.prototype._onLoadSettingsSuccess = function () {
  if ( this._sharedData.authTokenHeaders == null ) {
    this._redirectToLogin();
  }
};

AuthTokenController.prototype._onLoadSettingsFailure = function () {
  this._redirectToLogin();
};

ChromeCrash.AuthTokenController = AuthTokenController;
