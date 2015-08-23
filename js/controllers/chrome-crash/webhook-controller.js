var WebhookController = function( $scope, $http, $location, $sharedData ) {
  this._http = $http;
  this._attempts = 0;
  this._attemptsLimit = 1;
  this._setting = null;
  this._tab = null;
  this._initBase($scope, $location, $sharedData);
};

// Super class
extend(WebhookController, ChromeCrash.AuthTokenController);
// Concerns
extend(WebhookController.prototype, ChromeCrash.Authenticable);

WebhookController.prototype._initScope = function () {
  var _self = this;
  this._scope.loading = true;
  this._scope.success = false;
  ChromeCrash.WebhookController.__super__._initScope.call(this);
  this._scope.processTab = function() {
    _self.processTab();
  };
};

WebhookController.prototype.processTab = function () {
  var _self = this;
  chrome.tabs.sendMessage(this._tab.id, "inspectDom", function(domContent) {
    _self._analizeCurrentContent( domContent );
  });
};

WebhookController.prototype._setTab = function (tab) {
  this._tab = tab;
  this.processTab();
};

WebhookController.prototype._analizeCurrentContent = function (domContent) {
  var postParams = {};
  var _self = this;
  postParams[ this._setting.webhookParam ] = domContent;
  var req = {
    method: 'POST',
    url: this._setting.webhookResource,
    headers: this._sharedData.authTokenHeaders,
    data: postParams
  };
  this._scope.loading = true;
  this._http(req).
    success(function(data, status, headers, config) {
      _self._onRequestSuccess();
    }).
    error(function(data, status, headers, config) {
      _self._processError( status );
    });
};

WebhookController.prototype._onRequestSuccess = function () {
  var _self = this;
  // Due to UI Problems with large pages
  setTimeout(function(){
    _self._finishStatus();
  }, 1000);
};

WebhookController.prototype._finishStatus = function () {
  var _self = this;
  this._scope.$apply(function(){
    _self._scope.loading = false;
    _self._scope.success = true;
  });
};

WebhookController.prototype._processError = function (status) {
  if ( this._setting.rememberCredentials ) {
    if ( this._attempts >= this._attemptsLimit ) {
      this._onRequestError( status );
    } else {
      // Start renew token process
      this._attemptLogin();
    }
  } else {
    this._onRequestError( status );
  }
};

WebhookController.prototype._onRequestError = function (status) {
  this._scope.success = false;
  this._scope.loading = false;
  ChromeCrash.WebhookController.__super__._onRequestError.call(this, status);
};

WebhookController.prototype._attemptLogin = function () {
  var _self = this;
  ++this._attempts;
  this._http.post( this._setting.loginResource,
    this.getCredentialParams(this._sharedData.user)).
      success(function(data, status, headers, config) {
        _self._renewToken( data );
      }).
      error(function(data, status, headers, config) {
        _self._scope.loading = false;
        _self._processError( status );
      });
};

WebhookController.prototype._renewToken = function(data){
  var authTokenHeaders = this.getAuthTokenHeaders(data);
  if ( Object.keys(authTokenHeaders).length > 0 ) {
    this._sharedData.authTokenHeaders = authTokenHeaders;
    this._saveState();
    this._addNotification( "Token Renewed" );
    this.processTab();
  } else {
    this._scope.loading = false;
    this._scope.success = false;
    this._addNotification("Could not read auth token");
  }
};

WebhookController.prototype._onLoadSettingsSuccess = function () {
  var _self = null;
  if ( this._sharedData.authTokenHeaders == null ) {
    this._redirectToLogin();
  } else {
    _self = this;
    this._setting = this._sharedData.setting;
    // Analyze current content
    chrome.tabs.getSelected(null, function(tab) {
      _self._setTab( tab );
    });
  }
};

ChromeCrash.WebhookController = WebhookController;
