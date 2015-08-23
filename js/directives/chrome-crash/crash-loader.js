var CrashLoader = function( $parse ){
  this._parse = $parse;
  this.restrict = "E";
  this.replace = true;
  this.transclude = false;
  this.container = null;
  this.messageLabel = null;
  this.init();
};

CrashLoader.prototype.init = function () {
  var imageLoader = $("<img/>", {
    "src": "./img/preloader.gif",
    "class": 'loader'
  });
  this.messageLabel = $("<span/>");
  this.container = $('<div/>', {
    "class": "alert alert-loading",
    "role": "alert"
  });
  this.container.append( imageLoader );
  this.container.append( this.messageLabel );
  this.messageLabel.text( "Loading ..." );
  this.container.hide();
  this.hideText();
};

CrashLoader.prototype.hideText = function () {
  var _self = this;
  this.messageLabel.fadeOut({
    complete: function() {
      _self.showText();
    }
  });
};

CrashLoader.prototype.showText = function () {
  var _self = this;
  this.messageLabel.fadeIn({
    complete: function() {
      _self.hideText();
    }
  });
};

CrashLoader.prototype.onModelUpdate = function( loading ){
  this.loading = loading;
  if ( this.loading ) {
    this.container.show();
  } else {
    this.container.hide();
  }
};

CrashLoader.prototype.compile = function (element, attrs) {
  var _self = this;
  var modelAccessor = this._parse(attrs.ngModel);
  element.replaceWith( this.container );
  return function (scope, element, currentAttrs, controller) {
    scope.$watch(modelAccessor, function (loading) {
      _self.onModelUpdate( loading );
    }, true);
  };
};

CrashLoader.factory = function( $parse ) {
  return new CrashLoader($parse);
};

ChromeCrash.CrashLoader = CrashLoader;
