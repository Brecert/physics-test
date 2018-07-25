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
    return Vec2D;
}();
var Entity = /** @class */function () {
    function Entity(x, y) {
        if (x === void 0) {
            x = 0;
        }
        if (y === void 0) {
            y = 0;
        }
        this.position = new Vec2D(x, y);
        this.velocity = new Vec2D(0, 0);
        this.mass = 0.1;
        this.radius = 15;
        this.restitution = -0.7;
    }
    return Entity;
}();
var Wall = /** @class */function () {
    function Wall(x, y, type) {
        if (x === void 0) {
            x = 0;
        }
        if (y === void 0) {
            y = 0;
        }
        if (type === void 0) {
            type = "ground";
        }
        this.position = new Vec2D(x, y);
        this.from = -1000;
        this.to = 1000;
        this.type = type;
        this.friction = 1.01;
    }
    Wall.prototype.relative = function () {
        if (this.type === "ground") {
            var x1 = this.position.x + this.from;
            var x2 = this.position.y + this.to;
            return { from: x1, to: x2 };
        } else {
            return { from: this.from, to: this.to };
        }
    };
    return Wall;
}();
function main() {
    // Constants
    var FRAMERATE = 1 / 60;
    var FRAMEDELAY = FRAMERATE * 1000;
    var Cd = 0.47;
    var rho = 1.22;
    // TODO: Make A part of loop.
    var radius = 15;
    var A = Math.PI * radius * radius / 10000; // m^2
    var ag = 9.81;
    // Setup
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var entities = [];
    var walls = [];
    entities.push(new Entity(canvas.width / 2, 0));
    walls.push(new Wall(canvas.height, canvas.width / 2));
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    // setInterval(loop, FRAMEDELAY)
    window.addEventListener('keydown', handleInput, false);
    loop();
    function loop() {
        for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
            var entity = entities_1[_i];
            gravityCalc(entity);
            scanCollisions(entity);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawEntity(entity);
            setInterval(function () {}, FRAMEDELAY);
            drawWalls();
        }
        requestAnimationFrame(loop);
    }
    function gravityCalc(entity) {
        var Fx = -0.5 * Cd * A * rho * entity.velocity.x * entity.velocity.x * entity.velocity.x / Math.abs(entity.velocity.x);
        var Fy = -0.5 * Cd * A * rho * entity.velocity.y * entity.velocity.y * entity.velocity.y / Math.abs(entity.velocity.y);
        if (isNaN(Fx)) {
            Fx = 0;
        }
        if (isNaN(Fy)) {
            Fy = 0;
        }
        var ax = Fx / entity.mass;
        var ay = ag + Fy / entity.mass;
        entity.velocity.x += ax * FRAMERATE;
        entity.velocity.y += ay * FRAMERATE;
        entity.position.x += entity.velocity.x * FRAMERATE * 100;
        entity.position.y += entity.velocity.y * FRAMERATE * 100;
        return entity;
    }
    function scanCollisions(entity) {
        for (var _i = 0, walls_1 = walls; _i < walls_1.length; _i++) {
            var wall = walls_1[_i];
            switch (wall.type) {
                case "ground":
                    {
                        if (entity.position.y + entity.radius > wall.position.y) {
                            if (wall.relative().from < entity.position.x && entity.position.x < wall.relative().to) {
                                entity.velocity.y *= entity.restitution;
                                // entity.velocity.x -= entity.velocity.x / wall.friction
                                // Temporary bad friction
                                // TODO: Redo friction.
                                entity.velocity.x /= wall.friction;
                                entity.position.y = wall.position.y - entity.radius;
                            }
                        }
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }
    }
    function drawEntity(entity) {
        ctx.beginPath();
        ctx.arc(entity.position.x, entity.position.y, entity.radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
    }
    function drawWalls() {
        for (var _i = 0, walls_2 = walls; _i < walls_2.length; _i++) {
            var wall = walls_2[_i];
            ctx.beginPath();
            ctx.moveTo(wall.relative().from, wall.position.y);
            ctx.lineTo(wall.relative().to, wall.position.y);
            ctx.stroke();
        }
    }
    function handleInput(event) {
        switch (event.keyCode) {
            // Left
            case 37:
                {
                    entities[0].velocity.x -= 5;
                    break;
                }
            // Up
            case 38:
                {
                    entities[0].velocity.y -= 5;
                    break;
                }
            // Right
            case 39:
                {
                    entities[0].velocity.x += 5;
                    break;
                }
            // Down
            case 40:
                {
                    entities[0].velocity.y += 5;
                    break;
                }
            default:
                break;
        }
    }
}
main();
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '43907' + '/');
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