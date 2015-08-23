var CrashNotifications = function( $parse ){
  this._parse = $parse;
  this.restrict = "E";
  this.element = null;
  this.notifications = null;
};

CrashNotifications.prototype.onModelUpdate = function(){
  var message = null;
  if ( this.notifications.length > 0 ) {
    message = this.notifications.pop();
    $.gritter.add({
      title: 'Chrome Crash',
      text: message
    });
  }
};

CrashNotifications.prototype.compile = function (element, attrs) {
  var modelAccessor = this._parse(attrs.ngModel);
  var _self = this;
  this.element = element;
  this.element.hide();
  return function (scope, element, currentAttrs, controller) {
    _self.notifications = scope[ attrs.ngModel ];
    scope.$watch(modelAccessor, function (val) {
      _self.onModelUpdate();
    }, true);
  };
};

CrashNotifications.factory = function( $parse ) {
  return new CrashNotifications($parse);
};

ChromeCrash.CrashNotifications = CrashNotifications;
