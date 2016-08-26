define("widgets/lazyload/index",[],function(require, exports, module) {
  function LE() {
    this.init.apply(this,arguments);
  }
  LE.prototype = {
    init:function (conf) {
      var _ = this;
      _.CONF = $.extend({
        "selector":".J_LazyLoad",
        "tasks":[],
        "callback":function(){}
      },conf);
      
      $(document).ready(function(){
        _.CONF['tasks'] = $(_.CONF['selector']);//所有需要延时加载的DOM .J_LazyLoad
        _.bindUI();
      });
    },

    bindUI: function () {
      var scrollEvent = $.buffer(this._check,10,this);
      scrollEvent();
      $(window).resize(scrollEvent);
      $(window).scroll(scrollEvent);
    },

    _check: function () {
      var _ = this;
      var _tasks = [];
      // 监控滚动事件,执行加载
      if (_.CONF['tasks'].length < 1) { return;}

      $.each(_.CONF['tasks'], function (index,_item) {
        if (!_item || _item.loaded) {
          _.CONF['tasks'][index] = null;
          return;
        }
        if (_.checkItem(_item)) {
          _.CONF['tasks'][index] = null;
        }
      });

      $.each(_.CONF['tasks'], function (index,_item) {
        if (_item) {
          _tasks.push(_item);
        }
      });
      _.CONF['tasks'] = _tasks;
    },

    //如果在可见区域内则加载
    checkItem: function (_item) {
      var _ = this;
      if(_item && _.inRegion(_.region($(_item)), _.viewportRegion())) {
        _._load(_item);
        _item.loaded = true;
        return true;
      }
      return false;
    },

    // 核心的加载方法,目前只针对图片做懒加载
    _load: function (dom) {
      var _ = this,
          src = $(dom).attr("data-src");

      $(dom).attr({"data-src":'',"src":src}).css("opacity",1);
      _.CONF['callback'] && _.CONF['callback']($(dom));
    },
    
    //获取指定DOM的region
    region: function (node) {
      var offset = node.offset();
      var _w = offset.width;
      var _h = offset.height;
      return {
        left   : offset.left,
        top    : offset.top,
        right  : offset.left + _w,
        bottom : offset.top + _h,
        width  : _w,
        height : _h
      };
    },
    
    //获取可视区域的region
    viewportRegion : function () {
      var _left = $(window).scrollLeft();
      var _top = $(window).scrollTop();
      var _w = $(window).width();
      var _h = $(window).height();
      return {
          left   : _left,
          top    : _top,
          right  : _left + _w,
          bottom : _top + _h,
          width  : _w,
          height : _h
      };
    },
    
    //检测region1是否包含在region2里
    inRegion: function (region1, region2, allInRegion) {
        allInRegion = allInRegion || false;
        var _h = true;
        var _v = true;
        if (allInRegion) {//整个被包含要求region1的最右侧和最下侧均不超过region2的最右侧和最下侧
          _h = (region1.right <= region2.right && region1.left >= region2.left);
          _v = (region1.bottom <= region2.bottom && region1.top >= region2.top);
        }
        var h = ((region1.top >= region2.top && region1.top <= region2.bottom) || (region1.top <= region2.top && region1.bottom >= region2.top )) && _h;
        var v = ((region1.left >= region2.left && region2.left <= region2.right) || (region1.left <= region2.left && region1.right >= region2.left)) && _v;
        return h && v;
    }
    
  }
  module.exports = LE;
});