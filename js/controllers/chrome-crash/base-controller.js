var BaseController = function() {
};

BaseController.storageKeys = {
  setting: 'setting',
  user: 'user'
};

BaseController.prototype._initBase = function ($scope, $sharedData) {
  this._scope = $scope;
  this._scope.notifications = [];
  this._sharedData = $sharedData;
  this._initScope();
  this._loadSettings();
};

// Force to initialize Scope
BaseController.prototype._initScope = function () {
  throw '_bindScope not implemented';
};

BaseController.prototype._loadSettings = function () {
  var _self = this;
  if ( this._sharedData.setting == null ) {
    chrome.storage.sync.get(this._sharedData.appData.storeKey, function(obj){
      _self._readStorage( obj );
    });
  } else {
    this._onLoadSettingsSuccess();
  }
};

BaseController.prototype._onRequestError = function (status) {
  if ( status < 600 && status >= 500 ){
    this._addNotification('Server side error');
  } else if (status < 500 && status >= 400) {
    if (status == 401) {
      this._addNotification('Unauthorized error.'+
        ' Credentials are invalid');
    } else this._addNotification('Client side occurred');
  } else this._addNotification('Unknown error occurred');
};

BaseController.prototype._saveState = function () {
  chrome.storage.sync.set(this._getStorableData());
};

BaseController.prototype._getStorableData = function () {
  var saveSetting = {};
  saveSetting[this._sharedData.appData.storeKey] = this._sharedData;
  return saveSetting;
};

BaseController.prototype._readStorage = function (storage) {
  var meteorStorage = storage[ this._sharedData.appData.storeKey ] || {};
  var setting = meteorStorage[ BaseController.storageKeys.setting ];
  if (setting === undefined ) {
    this._onLoadSettingsFailure();
  } else {
    angular.extend(this._sharedData, meteorStorage);
    this._onLoadSettingsSuccess();
  }
};

BaseController.prototype._displayFormErrorMessage = function () {
  this._scope.notifications.push( 'Please fill required fields' );
};

BaseController.prototype._addNotification = function (error) {
  this._scope.notifications.push( error );
};

BaseController.prototype.showSettings = function() {
  var settingsUrl = chrome.extension.getURL('settings.html');
  chrome.tabs.create({'url': settingsUrl});
};

// Callbacks

BaseController.prototype._onLoadSettingsSuccess = function(){
  throw '_onLoadSettingsSuccess not implemented';
};

BaseController.prototype._onLoadSettingsFailure = function(){
  throw '_onLoadSettingsFailure not implemented';
};

ChromeCrash.BaseController = BaseController;
