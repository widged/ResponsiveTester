var widged = {};

(function(namespace) {

  namespace.ClassUtil = {};
  (function(Class) {
    Class.accessMaker = function(state, instance) {
        return {
          getSet: function(attr, aroundFns) {
              return function(_) {
                if(_ === undefined) { return state[attr]; }
                if(_ !== state[attr]) {
                  (aroundFns || []).forEach(function(fn) {
                    fn(_, function(new_) { _ = new_; });
                  });
                  state[attr] = _;
                }
                return instance;
            };
          }
        };
      };
  })(namespace.ClassUtil);


  namespace.DomUtil = {};
  (function(Class) {

     var stylesheetCache = [];

     Class.includeStyleSheet = function(url) {
      // early exit condition. Stylesheet has already been added
      if(stylesheetCache.indexOf(url) !== -1) { return; }

      // doesn't work in IE8?
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = url;
      document.getElementsByTagName("head")[0].appendChild(link);
    };

  })(namespace.DomUtil);


  namespace.ResponsiveTester = {};
  (function(Class, ClassUtil, DomUtil) {
    var template = function() {/*
     <div class="view responsive">
      <div class="responsive-wrap">
        <img src="img/browser-nav.png" alt="" class="browser-nav" />
        <img src="img/browser-tools.png" alt="" class="browser-tools png" />
        <img src="img/browser-top.png" alt="" class="browser-top" />
        <div class="responsive-injectable"></div>
      </div>

      <div class="responsive-control"></div>
    </div>
    */}.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];


    Class.instance = function() {
      var instance = {}, s = {};

      var access = ClassUtil.accessMaker(s, instance);
      instance.target      = access.getSet('target');
      instance.html        = access.getSet('html');
      instance.stylesheets = access.getSet('stylesheets');
      instance.width        = access.getSet('width');

      instance.render = function() {
        s.target.html(template);
        s.target.find(".responsive-wrap").css("width",'' + (s.width || 60) +"%");
        s.target.find(".responsive-control").slider({
          max:100,min:20,step:0.1,value:s.width,
          slide:function(e,t){
            s.target.find(".responsive-wrap").css("width",t.value+"%");
          }
        });
        instance.refresh();
      };

      instance.refresh = function() {
        s.target.find('.responsive-injectable').html(s.html);
        s.stylesheets.forEach(function(url) {
          DomUtil.includeStyleSheet(url);
        });

      };

      return instance;
    };

  })(namespace.ResponsiveTester, namespace.ClassUtil, namespace.DomUtil);

})(widged);
