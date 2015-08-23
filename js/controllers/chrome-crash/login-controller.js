var LoginController = function( $scope, $http, $location, $sharedData ) {
  this._location = $location;
  this._http = $http;
  this._setting = null;
  this._currentUser = null;
  this._loadedSettings = false;
  this._initBase($scope, $sharedData);
};

// SuperClass
extend(LoginController, ChromeCrash.BaseController);
// Concerns
extend(LoginController.prototype, ChromeCrash.Authenticable);

LoginController.prototype._initScope = function () {
  var _self = this;
  this._scope.user = {};
  this._scope.loading = false;
  this._scope.authenticate = function( user ){
    _self.authenticate(user);
  };
  this._scope.showSettings = function(){
    _self.showSettings();
  };
};

LoginController.prototype.authenticate = function (user) {
  if ( this._loadedSettings ) {
    if ( !this._scope.usersForm.$valid ) {
      this._displayFormErrorMessage();
      return;
    } else {
      this._currentUser = user;
      if (this._setting.rememberCredentials) this._saveCredentials();
      this._doRequest();
    }
  } else {
    this._addNotification('Settings not loaded');
  }
};

LoginController.prototype._doRequest = function () {
  var _self = this;
  this._scope.loading = true;
  this._http.post( this._setting.loginResource,
    this.getCredentialParams(this._currentUser)).
      success(function(data, status, headers, config) {
        _self._scope.loading = false;
        _self._onRequestSuccess( data );
      }).
      error(function(data, status, headers, config) {
        _self._scope.loading = false;
        _self._onRequestError( status );
      });
};

LoginController.prototype._onRequestSuccess = function( data ){
  var authTokenHeaders = this.getAuthTokenHeaders(data);
  if ( Object.keys(authTokenHeaders).length > 0 ) {
    this._sharedData.authTokenHeaders = authTokenHeaders;
    this._saveState();
    this._location.path("/land");
  } else this._addNotification("Could not read auth token");
};

LoginController.prototype._saveCredentials = function () {
  this._sharedData.user = this._currentUser;
  this._saveState();
  this._displaySaveCredentialsSuccessMessage();
};

LoginController.prototype._displaySaveCredentialsSuccessMessage = function () {
  this._addNotification( 'Credentials saved' );
};

LoginController.prototype._onLoadSettingsSuccess = function() {
  var _self = null;
  this._loadedSettings = true;
  // You are already logged in
  if ( this._sharedData.authTokenHeaders != null ) {
    this._location.path('/webhook');
  } else {
    this._setting = this._sharedData.setting;
    if (this._sharedData.setting.rememberCredentials) {
      angular.extend( this._scope.user, this._sharedData.user );
      var _self = this;
      this._scope.$apply(function() {
        angular.extend( _self._scope.user, _self._sharedData.user );
      });
    }
  }
};

LoginController.prototype._onLoadSettingsFailure = function() {
  this.showSettings();
};

ChromeCrash.LoginController = LoginController;
