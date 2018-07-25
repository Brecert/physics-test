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
})({"index.coffee":[function(require,module,exports) {
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var A, Cd, Entity, Vec2D, Wall, ag, draw, framedelay, framerate, main, mainLoop, radius, rho, scan;

  Vec2D = function Vec2D() {
    _classCallCheck(this, Vec2D);

    this.x = 0;
    this.y = 0;
  };

  Entity = function () {
    function Entity() {
      _classCallCheck(this, Entity);

      this.position = new Vec2D(1, 0);
      this.velocity = new Vec2D(0, 1);
      this.mass = 0.1;
      this.radius = 15;
      this.restitution = -0.7;
      this.ecb = this.position;
    }

    _createClass(Entity, [{
      key: "draw",
      value: function draw(ctx, vec) {
        ctx.beginPath();
        ctx.arc(vec.x, vec.y, this.radius, Math.PI * 2, true);
        ctx.fill();
        return ctx.closePath();
      }
    }]);

    return Entity;
  }();

  Wall = function Wall() {
    _classCallCheck(this, Wall);

    this.pos = new Vec2D(0, 0);
    this.from = -1000;
    this.pos2 = 1000;
    this.type = "ground";
  };

  framerate = 1 / 60;

  framedelay = framerate * 1000;

  radius = 15;

  Cd = 0.47; // Dimensionless

  rho = 1.22; // kg / m^3

  A = Math.PI * radius * radius / 10000; // m^2

  ag = 9.81; // m / s^2

  mainLoop = function mainLoop(entities, walls, ctx, canvas) {
    var Fx, Fy, ax, ay, entity, i, len, results;
    results = [];
    for (i = 0, len = entities.length; i < len; i++) {
      entity = entities[i];
      Fx = -0.5 * Cd * A * rho * entity.velocity.x * entity.velocity.x * entity.velocity.x / Math.abs(entity.velocity.x);
      Fy = -0.5 * Cd * A * rho * entity.velocity.y * entity.velocity.y * entity.velocity.y / Math.abs(entity.velocity.y);
      if (isNaN(Fx)) {
        Fx = 0;
      }
      if (isNaN(Fy)) {
        Fy = 0;
      }
      ax = Fx / entity.mass;
      ay = ag + Fy / entity.mass;
      entity.velocity.x += ax * framerate;
      entity.velocity.y += ay * framerate;
      entity.position.x += entity.velocity.x * framerate * 100;
      entity.position.y += entity.velocity.y * framerate * 100;
      console.log(entity.position);
      scan(walls, entity);
      results.push(draw(ctx, canvas, entities));
    }
    return results;
  };

  scan = function scan(walls, entity) {
    var i, len, ref, results, wall;
    results = [];
    for (i = 0, len = walls.length; i < len; i++) {
      wall = walls[i];
      switch (wall.type) {
        case "ground":
          if (entity.ecb.y < wall.pos.y) {
            if (wall.pos.y - wall.from.y < (ref = entity.ecb.y) && ref < wall.pos.y - wall.to.y) {
              entity.velocity.y *= entity.restitution;
              results.push(entity.position.y = wall.pos.y);
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
          break;
        default:
          results.push(void 0);
      }
    }
    return results;
  };

  draw = function draw(ctx, canvas, entities) {
    var entity, i, len, results;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    results = [];
    for (i = 0, len = entities.length; i < len; i++) {
      entity = entities[i];
      results.push(entity.draw(ctx, entity.position));
    }
    return results;
  };

  main = function main() {
    var canvas, ctx, entities, loopTimer, walls;
    entities = [];
    entities.push(new Entity());
    walls = [];
    walls.push(new Wall());
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    console.log(entities);
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    return loopTimer = setInterval(mainLoop(entities, walls, ctx, canvas), framedelay);
  };

  main();
}).call(this);
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '44289' + '/');
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
},{}]},{},["../../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.coffee"], null)
//# sourceMappingURL=/src.0781f6aa.map