var SettingsController = function( $scope, $location, $sharedData ) {
  this._location = $location;
  this._initBase($scope, $sharedData);
};

extend(SettingsController, ChromeCrash.BaseController);

SettingsController.prototype._initScope = function () {
  var _self = this;
  this._scope.setting = {};
  this._scope.save = function( setting ){
    _self.save(setting);
  };
  this._scope.back = function( setting ){
    _self.back(setting);
  };
};

SettingsController.prototype._initSettings = function () {
  this._scope.setting.authTokenName = 'X-Auth-Token';
  this._scope.setting.userIdName = 'X-User-Id';
  this._scope.setting.authTokenPath = '$.data.authToken';
  this._scope.setting.userIdPath = '$.data.userId';
  this._scope.setting.usernameParam = 'user';
  this._scope.setting.passwordParam = 'password';
  this._scope.setting.webhookParam = 'content';
};

SettingsController.prototype.save = function (setting) {
  if ( !this._scope.settingsForm.$valid ) {
    this._displayFormErrorMessage();
    return;
  } else {
    this._sharedData.setting = setting;
    this._saveState();
    this._displaySuccessMessage();
  }
};

SettingsController.prototype.back = function (setting) {
  if ( this._sharedData.setting == null ) {
    this.save( setting );
    setTimeout(function(){
      window.close();
    }, 1000);
  } else {
    window.close();
  }
};

SettingsController.prototype._displaySuccessMessage = function () {
  this._addNotification( 'Settings saved' );
};

SettingsController.prototype._onLoadSettingsFailure = function () {
  this._initSettings();
};

SettingsController.prototype._onLoadSettingsSuccess = function(){
  var _self = this;
  this._scope.$apply(function() {
    angular.extend(_self._scope.setting, _self._sharedData.setting);
  });
};

ChromeCrash.SettingsController = SettingsController;
