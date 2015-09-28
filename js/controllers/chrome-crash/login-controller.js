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
  this._scope.user = {};
  this._scope.loading = false;
};

LoginController.prototype.requestFile = function () {
  this.inspectTable();
};

LoginController.prototype.inspectTable = function () {
  var _self = this;
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, "inspectTable", function(domContent) {
      _self.readTable( domContent );
    });
  });
};

LoginController.prototype.readTable = function ( domContent ) {
  var rows = $(domContent).find('div.dataWrapper table.dataTable > tbody > tr');
  var clients = [];
  rows.each( function(k, v) {
    var row = $(v);
    var columns = row.find('td');
    if (columns.length == 12) {
      clients.push(new Client({
        identifier: columns.eq(0).text(),
        dateCreated: columns.eq(1).text(),
        salesStatus: columns.eq(2).text(),
        firstName: columns.eq(3).text(),
        lastName: columns.eq(4).text(),
        language: columns.eq(5).text(),
        country: columns.eq(6).text(),
        salesAgent: columns.eq(7).text(),
        type: columns.eq(8).text(),
        lastNoteDate: columns.eq(9).text(),
        loggedIn: columns.eq(10).text()
      }));
    }
  });
  this._doRequest(clients);
};

LoginController.prototype._doRequest = function (clients) {
  var _self = this;
  this._http({
    method: 'POST',
    url: this._sharedData.baseURL+ '/documents',
    data: {
      clients: clients
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function(response){
    var newURL = _self._sharedData.baseURL+'/docs/'+response.data.id+'.csv';
    chrome.tabs.create({ url: newURL });
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
  //this.showSettings();
};

ChromeCrash.LoginController = LoginController;
