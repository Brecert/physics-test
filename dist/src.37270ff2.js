// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"index.ts":[function(require,module,exports) {
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
// PVector2D with a nicer name.
var Vec2D = /** @class */function () {
    function Vec2D(x, y) {
        if (x === void 0) {
            x = 0;
        }
        if (y === void 0) {
            y = 0;
        }
        this.x = x;
        this.y = y;
    }
    Vec2D.prototype.draw = function (ctx, size) {
        if (size === void 0) {
            size = 2;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2, true);
        ctx.fill();
    };
    return Vec2D;
}();
var Shape2D = /** @class */function () {
    function Shape2D() {
        this.position = new Vec2D(0, 0);
    }
    return Shape2D;
}();
var Box2D = /** @class */function (_super) {
    __extends(Box2D, _super);
    function Box2D(from, to) {
        var _this = _super.call(this) || this;
        _this.from = from;
        _this.to = to;
        return _this;
    }
    Box2D.prototype.contains = function (point) {
        var from = this.from;
        var to = this.to;
        from.x += this.position.x;
        from.y += this.position.y;
        to.x += this.position.x;
        to.y += this.position.y;
        if (from.x < point.x && point.x < to.x && from.y < point.y && point.y < to.y) {
            return true;
        } else {
            return false;
        }
    };
    Box2D.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.to.x - this.from.x, this.to.y - this.from.x);
        ctx.stroke();
    };
    return Box2D;
}(Shape2D);
var Polygon2D = /** @class */function (_super) {
    __extends(Polygon2D, _super);
    function Polygon2D(points) {
        if (points === void 0) {
            points = [];
        }
        var _this = _super.call(this) || this;
        _this.points = points;
        return _this;
    }
    Polygon2D.prototype.boundingBox = function () {
        var min = new Vec2D();
        var max = new Vec2D();
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var point_1 = _a[_i];
            if (point_1.x < min.x) {
                min.x = point_1.x;
            } else if (point_1.x > max.x) {
                max.x = point_1.x;
            }
            if (point_1.y < min.y) {
                min.y = point_1.y;
            } else if (point_1.y > max.y) {
                max.y = point_1.y;
            }
        }
        min.x += this.position.x;
        max.x += this.position.x;
        min.y += this.position.y;
        max.y += this.position.y;
        var box = new Box2D(min, max);
        return box;
    };
    Polygon2D.prototype.contains = function (point) {
        if (this.boundingBox().contains(point)) {
            var inside = false;
            for (var i = 0, n = this.points.length - 1; i < this.points.length; n = i++) {
                var vec = this.points[i];
                var vecNext = this.points[n];
                vec.x += this.position.x;
                vec.y += this.position.y;
                vecNext.x += this.position.x;
                vecNext.y += this.position.y;
                if (vec.y > point.y != vecNext.y > point.y && point.x < (vecNext.x - vec.x) * (point.y - vec.y) / (vecNext.y - vec.y) + vec.x) inside = !inside;
            }
            return inside;
        } else {
            return false;
        }
    };
    Polygon2D.prototype.draw = function (ctx) {
        ctx.beginPath();
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var point_2 = _a[_i];
            ctx.lineTo(point_2.x + this.position.x, point_2.y + this.position.y);
        }
        ctx.lineTo(this.points[0].x + this.position.x, this.points[0].y + this.position.y);
        ctx.stroke();
    };
    return Polygon2D;
}(Shape2D);
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var vertices = [];
vertices[0] = new Vec2D(0, 0); // set X/Y position
vertices[1] = new Vec2D(200, 30);
vertices[2] = new Vec2D(150, 200);
vertices[3] = new Vec2D(50, 200);
var shape = new Polygon2D(vertices);
shape.position.x = 200;
shape.position.y = 200;
shape.draw(ctx);
var point = new Vec2D(250, 255);
ctx.fillStyle = "red";
point.draw(ctx);
ctx.fillStyle = "black";
console.log(shape.contains(point));
},{}],"../../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '40289' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.37270ff2.map