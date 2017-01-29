/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if(err) {
/******/ 				if(__webpack_require__.onError)
/******/ 					return __webpack_require__.onError(err);
/******/ 				else
/******/ 					throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext("(function(exports) {" + content + "\n})", filename)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if(err) return callback();
/******/ 			try {
/******/ 				var update = JSON.parse(content);
/******/ 			} catch(e) {
/******/ 				return callback(e);
/******/ 			}
/******/ 			callback(null, update);
/******/ 		});
/******/ 	}

/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "e80b6f6433b6d207f634"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(5);


/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("module.exports = require(\"electron\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzY5MjgiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZWxlY3Ryb25cIlxuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _path = __webpack_require__(3);\n\nvar _path2 = _interopRequireDefault(_path);\n\nvar _electron = __webpack_require__(1);\n\nvar _electron2 = _interopRequireDefault(_electron);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar ROOT = _electron2.default.app && _electron2.default.app.getAppPath() || null;\nvar GLOBAL = typeof process !== 'undefined' ? process : window;\nvar IS_PROD = (false);\n\nif (!ROOT) {\n  console.log('Unable to launch due to missing app root');\n}\n\nvar APP_NAME = 'g';\nvar APP_VERSION = '0.0.0';\n\nvar config = {\n  APP_NAME: APP_NAME,\n  APP_VERSION: APP_VERSION,\n\n  runtime: {\n    IS_PROD: IS_PROD,\n    ROOT: ROOT,\n    DELAY_INIT_MS: 300\n  },\n\n  rpc: {\n    isLaughter: {\n      serverUrl: 'https://api.ohsloth.com/isLaughter'\n    }\n  },\n\n  icons: {\n    menu: _path2.default.join(ROOT, '_assets', 'icon.png')\n  },\n\n  renderer: {\n    app: {\n      name: 'app',\n      dimension: {\n        width: 500,\n        height: 500\n      },\n      position: {\n        x: 800,\n        y: 0\n      }\n    }\n  }\n};\n\nmodule.exports = config;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zaGFyZWQvY29uZmlnLmpzPzlhYzIiXSwibmFtZXMiOlsiUk9PVCIsImFwcCIsImdldEFwcFBhdGgiLCJHTE9CQUwiLCJwcm9jZXNzIiwid2luZG93IiwiSVNfUFJPRCIsImNvbnNvbGUiLCJsb2ciLCJBUFBfTkFNRSIsIkFQUF9WRVJTSU9OIiwiY29uZmlnIiwicnVudGltZSIsIkRFTEFZX0lOSVRfTVMiLCJycGMiLCJpc0xhdWdodGVyIiwic2VydmVyVXJsIiwiaWNvbnMiLCJtZW51Iiwiam9pbiIsInJlbmRlcmVyIiwibmFtZSIsImRpbWVuc2lvbiIsIndpZHRoIiwiaGVpZ2h0IiwicG9zaXRpb24iLCJ4IiwieSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsT0FBUSxtQkFBU0MsR0FBVCxJQUFnQixtQkFBU0EsR0FBVCxDQUFhQyxVQUFiLEVBQWpCLElBQStDLElBQTVEO0FBQ0EsSUFBTUMsU0FBUyxPQUFPQyxPQUFQLEtBQW1CLFdBQW5CLEdBQWlDQSxPQUFqQyxHQUEyQ0MsTUFBMUQ7QUFDQSxJQUFNQyxVQUFVLE9BQWhCOztBQUVBLElBQUksQ0FBQ04sSUFBTCxFQUFXO0FBQ1RPLFVBQVFDLEdBQVIsQ0FBWSwwQ0FBWjtBQUNEOztBQUVELElBQU1DLFdBQVcsR0FBakI7QUFDQSxJQUFNQyxjQUFjLE9BQXBCOztBQUVBLElBQU1DLFNBQVM7QUFDYkYsb0JBRGE7QUFFYkMsMEJBRmE7O0FBSWJFLFdBQVM7QUFDUE4sb0JBRE87QUFFUE4sY0FGTztBQUdQYSxtQkFBZTtBQUhSLEdBSkk7O0FBVWJDLE9BQUs7QUFDSEMsZ0JBQVk7QUFDVkMsaUJBQVc7QUFERDtBQURULEdBVlE7O0FBZ0JiQyxTQUFPO0FBQ0xDLFVBQU0sZUFBS0MsSUFBTCxDQUFVbkIsSUFBVixFQUFnQixTQUFoQixFQUEyQixVQUEzQjtBQURELEdBaEJNOztBQW9CYm9CLFlBQVU7QUFDUm5CLFNBQUs7QUFDSG9CLFlBQU0sS0FESDtBQUVIQyxpQkFBVztBQUNUQyxlQUFPLEdBREU7QUFFVEMsZ0JBQVE7QUFGQyxPQUZSO0FBTUhDLGdCQUFVO0FBQ1JDLFdBQUcsR0FESztBQUVSQyxXQUFHO0FBRks7QUFOUDtBQURHO0FBcEJHLENBQWY7O0FBbUNBQyxPQUFPQyxPQUFQLEdBQWlCbEIsTUFBakIiLCJmaWxlIjoiMi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGVsZWN0cm9uIGZyb20gJ2VsZWN0cm9uJztcblxuY29uc3QgUk9PVCA9IChlbGVjdHJvbi5hcHAgJiYgZWxlY3Ryb24uYXBwLmdldEFwcFBhdGgoKSkgfHwgbnVsbDtcbmNvbnN0IEdMT0JBTCA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyA/IHByb2Nlc3MgOiB3aW5kb3c7XG5jb25zdCBJU19QUk9EID0gX19QUk9EX187XG5cbmlmICghUk9PVCkge1xuICBjb25zb2xlLmxvZygnVW5hYmxlIHRvIGxhdW5jaCBkdWUgdG8gbWlzc2luZyBhcHAgcm9vdCcpO1xufVxuXG5jb25zdCBBUFBfTkFNRSA9ICdnJztcbmNvbnN0IEFQUF9WRVJTSU9OID0gJzAuMC4wJztcblxuY29uc3QgY29uZmlnID0ge1xuICBBUFBfTkFNRSxcbiAgQVBQX1ZFUlNJT04sXG5cbiAgcnVudGltZToge1xuICAgIElTX1BST0QsXG4gICAgUk9PVCxcbiAgICBERUxBWV9JTklUX01TOiAzMDAsXG4gIH0sXG5cbiAgcnBjOiB7XG4gICAgaXNMYXVnaHRlcjoge1xuICAgICAgc2VydmVyVXJsOiAnaHR0cHM6Ly9hcGkub2hzbG90aC5jb20vaXNMYXVnaHRlcicsXG4gICAgfSxcbiAgfSxcblxuICBpY29uczoge1xuICAgIG1lbnU6IHBhdGguam9pbihST09ULCAnX2Fzc2V0cycsICdpY29uLnBuZycpLFxuICB9LFxuXG4gIHJlbmRlcmVyOiB7XG4gICAgYXBwOiB7XG4gICAgICBuYW1lOiAnYXBwJyxcbiAgICAgIGRpbWVuc2lvbjoge1xuICAgICAgICB3aWR0aDogNTAwLFxuICAgICAgICBoZWlnaHQ6IDUwMCxcbiAgICAgIH0sXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB4OiA4MDAsXG4gICAgICAgIHk6IDAsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NoYXJlZC9jb25maWcuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 3 */
/***/ function(module, exports) {

	eval("module.exports = require(\"path\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NWIyYSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiIzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 4 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar type = exports.type = {\n  ASYNC: 'asynchronous-message',\n  SYNC: 'synchronous-message'\n};\n\nexports.default = {\n  TOGGLE_RENDER_APP: 'TOGGLE_RENDER_APP',\n  HIDE_APP: 'HIDE_APP',\n\n  CHECK_URL: 'CHECK_URL',\n  URL_RESULT: 'URL_RESULT',\n\n  GET_GIF: 'GET_GIF',\n  SHOW_GIF: 'SHOW_GIF'\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zaGFyZWQvbWVzc2FnZS5qcz9kZmUzIl0sIm5hbWVzIjpbInR5cGUiLCJBU1lOQyIsIlNZTkMiLCJUT0dHTEVfUkVOREVSX0FQUCIsIkhJREVfQVBQIiwiQ0hFQ0tfVVJMIiwiVVJMX1JFU1VMVCIsIkdFVF9HSUYiLCJTSE9XX0dJRiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBTyxJQUFNQSxzQkFBTztBQUNsQkMsU0FBTyxzQkFEVztBQUVsQkMsUUFBTTtBQUZZLENBQWI7O2tCQUtRO0FBQ2JDLHFCQUFtQixtQkFETjtBQUViQyxZQUFVLFVBRkc7O0FBSWJDLGFBQVcsV0FKRTtBQUtiQyxjQUFZLFlBTEM7O0FBT2JDLFdBQVMsU0FQSTtBQVFiQyxZQUFVO0FBUkcsQyIsImZpbGUiOiI0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IHR5cGUgPSB7XG4gIEFTWU5DOiAnYXN5bmNocm9ub3VzLW1lc3NhZ2UnLFxuICBTWU5DOiAnc3luY2hyb25vdXMtbWVzc2FnZScsXG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIFRPR0dMRV9SRU5ERVJfQVBQOiAnVE9HR0xFX1JFTkRFUl9BUFAnLFxuICBISURFX0FQUDogJ0hJREVfQVBQJyxcblxuICBDSEVDS19VUkw6ICdDSEVDS19VUkwnLFxuICBVUkxfUkVTVUxUOiAnVVJMX1JFU1VMVCcsXG5cbiAgR0VUX0dJRjogJ0dFVF9HSUYnLFxuICBTSE9XX0dJRjogJ1NIT1dfR0lGJyxcbn07XG5cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2hhcmVkL21lc3NhZ2UuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\n__webpack_require__(16);\n\nglobal.Promise = __webpack_require__(17);\n__webpack_require__(8);//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ib290c3RyYXAuanM/Y2YyZCJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiZ2xvYmFsIiwiUHJvbWlzZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQkFBQUEsQ0FBUSxFQUFSOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCLG1CQUFBRixDQUFRLEVBQVIsQ0FBakI7QUFDQSxtQkFBQUEsQ0FBUSxDQUFSIiwiZmlsZSI6IjUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpO1xuXG5nbG9iYWwuUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5yZXF1aXJlKCcuL21haW5qcycpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYm9vdHN0cmFwLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.setFilePermission = exports.copyToDataPath = undefined;\n\nvar copyToDataPath = exports.copyToDataPath = function () {\n  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(srcPath, dstDir) {\n    return regeneratorRuntime.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.next = 2;\n            return fs.ensureDirAsync(_path2.default.join(userDataPath, dstDir));\n\n          case 2:\n            return _context.abrupt('return', fs.copyAsync(srcPath, _path2.default.join(userDataPath, dstDir || '')));\n\n          case 3:\n          case 'end':\n            return _context.stop();\n        }\n      }\n    }, _callee, this);\n  }));\n\n  return function copyToDataPath(_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}();\n\nvar setFilePermission = exports.setFilePermission = function () {\n  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(path) {\n    var permission = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '755';\n    return regeneratorRuntime.wrap(function _callee2$(_context2) {\n      while (1) {\n        switch (_context2.prev = _context2.next) {\n          case 0:\n            return _context2.abrupt('return', fs.chmodAsync(path, permission));\n\n          case 1:\n          case 'end':\n            return _context2.stop();\n        }\n      }\n    }, _callee2, this);\n  }));\n\n  return function setFilePermission(_x3) {\n    return _ref2.apply(this, arguments);\n  };\n}();\n\nexports.ensureDir = ensureDir;\n\nvar _electron = __webpack_require__(1);\n\nvar _electron2 = _interopRequireDefault(_electron);\n\nvar _path = __webpack_require__(3);\n\nvar _path2 = _interopRequireDefault(_path);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step(\"next\", value); }, function (err) { step(\"throw\", err); }); } } return step(\"next\"); }); }; }\n\nvar fs = Promise.promisifyAll(__webpack_require__(19));\nvar userDataPath = _electron2.default.app.getPath('userData');\n\nfunction ensureDir(dir) {\n  return fs.ensureDirAsync(dir);\n}//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluanMvZnNVdGlsLmpzPzcyNTEiXSwibmFtZXMiOlsic3JjUGF0aCIsImRzdERpciIsImZzIiwiZW5zdXJlRGlyQXN5bmMiLCJqb2luIiwidXNlckRhdGFQYXRoIiwiY29weUFzeW5jIiwiY29weVRvRGF0YVBhdGgiLCJwYXRoIiwicGVybWlzc2lvbiIsImNobW9kQXN5bmMiLCJzZXRGaWxlUGVybWlzc2lvbiIsImVuc3VyZURpciIsIlByb21pc2UiLCJwcm9taXNpZnlBbGwiLCJyZXF1aXJlIiwiYXBwIiwiZ2V0UGF0aCIsImRpciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7dURBVU8saUJBQThCQSxPQUE5QixFQUF1Q0MsTUFBdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQ0NDLEdBQUdDLGNBQUgsQ0FBa0IsZUFBS0MsSUFBTCxDQUFVQyxZQUFWLEVBQXdCSixNQUF4QixDQUFsQixDQUREOztBQUFBO0FBQUEsNkNBRUVDLEdBQUdJLFNBQUgsQ0FBYU4sT0FBYixFQUFzQixlQUFLSSxJQUFMLENBQVVDLFlBQVYsRUFBd0JKLFVBQVUsRUFBbEMsQ0FBdEIsQ0FGRjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOztrQkFBZU0sYzs7Ozs7O3dEQUtmLGtCQUFpQ0MsSUFBakM7QUFBQSxRQUF1Q0MsVUFBdkMsdUVBQWtELEtBQWxEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FDRVAsR0FBR1EsVUFBSCxDQUFjRixJQUFkLEVBQW9CQyxVQUFwQixDQURGOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7O2tCQUFlRSxpQjs7Ozs7UUFUTkMsUyxHQUFBQSxTOztBQU5oQjs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU1WLEtBQUtXLFFBQVFDLFlBQVIsQ0FBcUIsbUJBQUFDLENBQVEsRUFBUixDQUFyQixDQUFYO0FBQ0EsSUFBTVYsZUFBZSxtQkFBU1csR0FBVCxDQUFhQyxPQUFiLENBQXFCLFVBQXJCLENBQXJCOztBQUVPLFNBQVNMLFNBQVQsQ0FBbUJNLEdBQW5CLEVBQXdCO0FBQzdCLFNBQU9oQixHQUFHQyxjQUFILENBQWtCZSxHQUFsQixDQUFQO0FBQ0QiLCJmaWxlIjoiNi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbGVjdHJvbiBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgZnMgPSBQcm9taXNlLnByb21pc2lmeUFsbChyZXF1aXJlKCdmcy1leHRyYScpKTtcbmNvbnN0IHVzZXJEYXRhUGF0aCA9IGVsZWN0cm9uLmFwcC5nZXRQYXRoKCd1c2VyRGF0YScpO1xuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlRGlyKGRpcikge1xuICByZXR1cm4gZnMuZW5zdXJlRGlyQXN5bmMoZGlyKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvcHlUb0RhdGFQYXRoKHNyY1BhdGgsIGRzdERpcikge1xuICBhd2FpdCBmcy5lbnN1cmVEaXJBc3luYyhwYXRoLmpvaW4odXNlckRhdGFQYXRoLCBkc3REaXIpKTtcbiAgcmV0dXJuIGZzLmNvcHlBc3luYyhzcmNQYXRoLCBwYXRoLmpvaW4odXNlckRhdGFQYXRoLCBkc3REaXIgfHwgJycpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldEZpbGVQZXJtaXNzaW9uKHBhdGgsIHBlcm1pc3Npb249Jzc1NScpIHtcbiAgcmV0dXJuIGZzLmNobW9kQXN5bmMocGF0aCwgcGVybWlzc2lvbik7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tYWluanMvZnNVdGlsLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nfunction _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step(\"next\", value); }, function (err) { step(\"throw\", err); }); } } return step(\"next\"); }); }; }\n\nvar Gfycat = __webpack_require__(20);\n\nvar client_id = '2_QP_H2Q';\nvar client_secret = 'APUXSwSLoYb3YFVzisfF-ga1wUJU3ams66ELAki-sX0jlGPVi-HOUgoEZceJhwte';\nvar gfycat = new Gfycat({ clientId: client_id, clientSecret: client_secret });\n\nvar setupPromise = null;\nvar svc = {\n\tsearch: function search() {\n\t\tvar _this = this;\n\n\t\tvar query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'laughing';\n\t\treturn _asyncToGenerator(regeneratorRuntime.mark(function _callee() {\n\t\t\tvar options;\n\t\t\treturn regeneratorRuntime.wrap(function _callee$(_context) {\n\t\t\t\twhile (1) {\n\t\t\t\t\tswitch (_context.prev = _context.next) {\n\t\t\t\t\t\tcase 0:\n\t\t\t\t\t\t\t_context.next = 2;\n\t\t\t\t\t\t\treturn svc.ensureSetup();\n\n\t\t\t\t\t\tcase 2:\n\t\t\t\t\t\t\toptions = {\n\t\t\t\t\t\t\t\tsearch_text: query,\n\t\t\t\t\t\t\t\tcount: 10,\n\t\t\t\t\t\t\t\tfirst: 1,\n\t\t\t\t\t\t\t\trandom: true\n\t\t\t\t\t\t\t};\n\t\t\t\t\t\t\treturn _context.abrupt('return', gfycat.search(options).then(function (data) {\n\t\t\t\t\t\t\t\tconsole.log('gfycats', data);\n\t\t\t\t\t\t\t\treturn data;\n\t\t\t\t\t\t\t}));\n\n\t\t\t\t\t\tcase 4:\n\t\t\t\t\t\tcase 'end':\n\t\t\t\t\t\t\treturn _context.stop();\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}, _callee, _this);\n\t\t}))();\n\t},\n\tensureSetup: function ensureSetup() {\n\t\tvar _this2 = this;\n\n\t\treturn _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {\n\t\t\treturn regeneratorRuntime.wrap(function _callee2$(_context2) {\n\t\t\t\twhile (1) {\n\t\t\t\t\tswitch (_context2.prev = _context2.next) {\n\t\t\t\t\t\tcase 0:\n\t\t\t\t\t\t\tif (!setupPromise) {\n\t\t\t\t\t\t\t\t_context2.next = 2;\n\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\treturn _context2.abrupt('return', setupPromise);\n\n\t\t\t\t\t\tcase 2:\n\t\t\t\t\t\t\tsetupPromise = gfycat.authenticate();\n\t\t\t\t\t\t\treturn _context2.abrupt('return', setupPromise);\n\n\t\t\t\t\t\tcase 4:\n\t\t\t\t\t\tcase 'end':\n\t\t\t\t\t\t\treturn _context2.stop();\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}, _callee2, _this2);\n\t\t}))();\n\t}\n};\n\nexports.default = svc;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluanMvZ2Z5Y2F0LmpzPzNmYTIiXSwibmFtZXMiOlsiR2Z5Y2F0IiwicmVxdWlyZSIsImNsaWVudF9pZCIsImNsaWVudF9zZWNyZXQiLCJnZnljYXQiLCJjbGllbnRJZCIsImNsaWVudFNlY3JldCIsInNldHVwUHJvbWlzZSIsInN2YyIsInNlYXJjaCIsInF1ZXJ5IiwiZW5zdXJlU2V0dXAiLCJvcHRpb25zIiwic2VhcmNoX3RleHQiLCJjb3VudCIsImZpcnN0IiwicmFuZG9tIiwidGhlbiIsImNvbnNvbGUiLCJsb2ciLCJkYXRhIiwiYXV0aGVudGljYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU1BLFNBQVMsbUJBQUFDLENBQVEsRUFBUixDQUFmOztBQUVBLElBQU1DLFlBQVksVUFBbEI7QUFDQSxJQUFNQyxnQkFBZ0Isa0VBQXRCO0FBQ0EsSUFBTUMsU0FBUyxJQUFJSixNQUFKLENBQVcsRUFBQ0ssVUFBVUgsU0FBWCxFQUFzQkksY0FBY0gsYUFBcEMsRUFBWCxDQUFmOztBQUVBLElBQUlJLGVBQWUsSUFBbkI7QUFDQSxJQUFNQyxNQUFNO0FBQ0xDLE9BREssb0JBQ29CO0FBQUE7O0FBQUEsTUFBbEJDLEtBQWtCLHVFQUFaLFVBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBQ3hCRixJQUFJRyxXQUFKLEVBRHdCOztBQUFBO0FBR3hCQyxjQUh3QixHQUdkO0FBQ2ZDLHFCQUFhSCxLQURFO0FBRWZJLGVBQU8sRUFGUTtBQUdmQyxlQUFPLENBSFE7QUFJZkMsZ0JBQVE7QUFKTyxRQUhjO0FBQUEsd0NBVXZCWixPQUFPSyxNQUFQLENBQWNHLE9BQWQsRUFBdUJLLElBQXZCLENBQTRCLGdCQUFRO0FBQzFDQyxnQkFBUUMsR0FBUixDQUFZLFNBQVosRUFBdUJDLElBQXZCO0FBQ0csZUFBT0EsSUFBUDtBQUNILFFBSE0sQ0FWdUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFjN0IsRUFmUztBQWlCTFQsWUFqQksseUJBaUJTO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBQ2JKLFlBRGE7QUFBQTtBQUFBO0FBQUE7O0FBQUEseUNBQ1FBLFlBRFI7O0FBQUE7QUFFakJBLHNCQUFlSCxPQUFPaUIsWUFBUCxFQUFmO0FBRmlCLHlDQUdaZCxZQUhZOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSW5CO0FBckJVLENBQVo7O2tCQXdCZUMsRyIsImZpbGUiOiI3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgR2Z5Y2F0ID0gcmVxdWlyZSgnZ2Z5Y2F0LXNkaycpO1xuXG5jb25zdCBjbGllbnRfaWQgPSAnMl9RUF9IMlEnO1xuY29uc3QgY2xpZW50X3NlY3JldCA9ICdBUFVYU3dTTG9ZYjNZRlZ6aXNmRi1nYTF3VUpVM2FtczY2RUxBa2ktc1gwamxHUFZpLUhPVWdvRVpjZUpod3RlJztcbmNvbnN0IGdmeWNhdCA9IG5ldyBHZnljYXQoe2NsaWVudElkOiBjbGllbnRfaWQsIGNsaWVudFNlY3JldDogY2xpZW50X3NlY3JldH0pO1xuXG5sZXQgc2V0dXBQcm9taXNlID0gbnVsbDtcbmNvbnN0IHN2YyA9IHtcblx0YXN5bmMgc2VhcmNoKHF1ZXJ5PSdsYXVnaGluZycpIHtcblx0XHRhd2FpdCBzdmMuZW5zdXJlU2V0dXAoKTtcblxuXHRcdGNvbnN0IG9wdGlvbnMgPSB7XG5cdFx0XHRzZWFyY2hfdGV4dDogcXVlcnksXG5cdFx0XHRjb3VudDogMTAsXG5cdFx0XHRmaXJzdDogMSxcblx0XHRcdHJhbmRvbTogdHJ1ZSxcblx0XHR9O1xuXG5cdFx0cmV0dXJuIGdmeWNhdC5zZWFyY2gob3B0aW9ucykudGhlbihkYXRhID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKCdnZnljYXRzJywgZGF0YSk7XG4gICAgICByZXR1cm4gZGF0YTtcblx0XHR9KTtcbiAgfSxcblxuXHRhc3luYyBlbnN1cmVTZXR1cCgpIHtcbiAgICBpZiAoc2V0dXBQcm9taXNlKSByZXR1cm4gc2V0dXBQcm9taXNlO1xuICAgIHNldHVwUHJvbWlzZSA9IGdmeWNhdC5hdXRoZW50aWNhdGUoKTtcblx0XHRyZXR1cm4gc2V0dXBQcm9taXNlO1xuXHR9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc3ZjO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbWFpbmpzL2dmeWNhdC5qcyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _electron = __webpack_require__(1);\n\nvar _config = __webpack_require__(2);\n\nvar _config2 = _interopRequireDefault(_config);\n\nvar _message = __webpack_require__(4);\n\nvar _message2 = _interopRequireDefault(_message);\n\nvar _ipc = __webpack_require__(9);\n\nvar _ipc2 = _interopRequireDefault(_ipc);\n\nvar _tray = __webpack_require__(13);\n\nvar _tray2 = _interopRequireDefault(_tray);\n\nvar _overlay = __webpack_require__(12);\n\nvar _overlay2 = _interopRequireDefault(_overlay);\n\nvar _watcher = __webpack_require__(14);\n\nvar _watcher2 = _interopRequireDefault(_watcher);\n\nvar _monitor = __webpack_require__(11);\n\nvar _monitor2 = _interopRequireDefault(_monitor);\n\nvar _gfycat = __webpack_require__(7);\n\nvar _gfycat2 = _interopRequireDefault(_gfycat);\n\nvar _laughterAnalysis = __webpack_require__(10);\n\nvar _laughterAnalysis2 = _interopRequireDefault(_laughterAnalysis);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// remote svc\nvar _checked = {};\nvar _currentUrl = null;\nfunction registerIpc() {\n  console.log('registering ipc...');\n\n  // hack, renderer has setinterval that calls check_url every now and then;\n  // why renderer? why not?\n  _ipc2.default.register('async', _message2.default.CHECK_URL, function (data) {\n    _monitor2.default.getUrl().then(function (url) {\n      if (!url) {\n        return;\n      }\n\n      if (url.indexOf('youtube.com') > -1 && url.indexOf('watch') > -1) {\n        // if already checking/checked, do nothing\n        if (_checked[url]) return;\n        _checked[url] = true;\n        _currentUrl = url;\n\n        console.log('Analyzing youtube url');\n\n        // we have a youtube url\n        // send to backend for analysis\n        (0, _laughterAnalysis2.default)(url).then(function (result) {\n          console.log('Analyzed:: ' + url, result.length, result);\n          _overlay2.default.render('app', { exclusive: true });\n          // provide timestamp to frontend\n          _overlay2.default.send('app', {\n            action: _message2.default.URL_RESULT,\n            data: { url: url, result: result }\n          });\n        }).catch(function (err) {\n          return console.error(err);\n        });\n      } else {\n        // user navigated away from url, stop laughing!!\n        _overlay2.default.hide('app');\n      }\n    });\n  });\n\n  _ipc2.default.register('async', _message2.default.HIDE_APP, function (data) {\n    _overlay2.default.hide('app');\n  });\n\n  _ipc2.default.register('async', _message2.default.GET_GIF, function (data) {\n    // ignore no longer valid GET_GIF\n    if (data.url !== _currentUrl) return;\n\n    _gfycat2.default.search().then(function (result) {\n      console.log('GET_GIF');\n      _overlay2.default.render('app', { exclusive: true });\n\n      // provide timestamp to frontend\n      _overlay2.default.send('app', {\n        action: _message2.default.SHOW_GIF,\n        data: result\n      });\n    });\n  });\n}\n\nfunction delayInit() {\n  registerIpc();\n\n  console.log('rendering app');\n  _overlay2.default.render('app', { exclusive: true });\n}\n\nif (!_electron.app.shouldQuit) {\n  _electron.app.shouldQuit = _electron.app.makeSingleInstance(function () {});\n  if (_electron.app.shouldQuit) {\n    _electron.app.quit();\n  }\n}\n\n_electron.app.commandLine.appendSwitch('enable-transparent-visuals'); // try add this line\n\n// This method will be called when Electron has finished\n// initialization and is ready to create browser windows.\n// Some APIs can only be used after this event occurs.\n_electron.app.on('ready', function () {\n  _tray2.default.createTray();\n\n  _watcher2.default.registerAll([\n    // register monitor\n  ]);\n\n  setTimeout(delayInit, _config2.default.runtime.DELAY_INIT_MS);\n\n  // Report uncaught exceptions\n  process.on('uncaughtException', function (err) {\n    var errJSON = { message: err.message, stack: err.stack };\n    //TODO: fix this\n    //windows.main.dispatch('uncaughtError', 'main', errJSON)\n  });\n});\n\n_electron.app.once('will-finish-launching', function () {\n  //crashReporter.init()\n});\n\n_electron.app.on('browser-window-created', function (evt, window) {\n  //window.setMenu(null);\n});\n\n_electron.app.on('browser-window-blur', function (evt, window) {});\n\n_electron.app.on('browser-window-focus', function (evt, window) {});\n\n// Quit when all windows are closed.\n_electron.app.on('window-all-closed', function () {\n  // On OS X it is common for applications and their menu bar\n  // to stay active until the user quits explicitly with Cmd + Q\n  if (process.platform !== 'darwin') {\n    _electron.app.quit();\n  }\n});\n\n_electron.app.on('activate', function () {\n  // On OS X it's common to re-create a window in the app when the\n  // dock icon is clicked and there are no other windows open.\n});\n\n_electron.app.on('will-quit', function () {});\n\n_electron.app.dock.hide();\nconsole.log('running...');//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluanMvaW5kZXguanM/NmJiYiJdLCJuYW1lcyI6WyJfY2hlY2tlZCIsIl9jdXJyZW50VXJsIiwicmVnaXN0ZXJJcGMiLCJjb25zb2xlIiwibG9nIiwicmVnaXN0ZXIiLCJDSEVDS19VUkwiLCJkYXRhIiwiZ2V0VXJsIiwidGhlbiIsInVybCIsImluZGV4T2YiLCJyZXN1bHQiLCJsZW5ndGgiLCJyZW5kZXIiLCJleGNsdXNpdmUiLCJzZW5kIiwiYWN0aW9uIiwiVVJMX1JFU1VMVCIsImNhdGNoIiwiZXJyb3IiLCJlcnIiLCJoaWRlIiwiSElERV9BUFAiLCJHRVRfR0lGIiwic2VhcmNoIiwiU0hPV19HSUYiLCJkZWxheUluaXQiLCJzaG91bGRRdWl0IiwibWFrZVNpbmdsZUluc3RhbmNlIiwicXVpdCIsImNvbW1hbmRMaW5lIiwiYXBwZW5kU3dpdGNoIiwib24iLCJjcmVhdGVUcmF5IiwicmVnaXN0ZXJBbGwiLCJzZXRUaW1lb3V0IiwicnVudGltZSIsIkRFTEFZX0lOSVRfTVMiLCJwcm9jZXNzIiwiZXJySlNPTiIsIm1lc3NhZ2UiLCJzdGFjayIsIm9uY2UiLCJldnQiLCJ3aW5kb3ciLCJwbGF0Zm9ybSIsImRvY2siXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBUUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7Ozs7QUFGQTtBQUlBLElBQU1BLFdBQVcsRUFBakI7QUFDQSxJQUFJQyxjQUFjLElBQWxCO0FBQ0EsU0FBU0MsV0FBVCxHQUF1QjtBQUNyQkMsVUFBUUMsR0FBUixDQUFZLG9CQUFaOztBQUVBO0FBQ0E7QUFDQSxnQkFBSUMsUUFBSixDQUFhLE9BQWIsRUFBc0Isa0JBQVFDLFNBQTlCLEVBQXlDLFVBQUNDLElBQUQsRUFBVTtBQUNqRCxzQkFBUUMsTUFBUixHQUFpQkMsSUFBakIsQ0FBc0IsZUFBTztBQUMzQixVQUFJLENBQUNDLEdBQUwsRUFBVTtB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LENBQVMsdUJBQVQsRUFBa0MsWUFBTTtBQUN0QztBQUNELENBRkQ7O0FBSUEsY0FBSVYsRUFBSixDQUFPLHdCQUFQLEVBQWlDLFVBQUNXLEdBQUQsRUFBT0MsTUFBUCxFQUFrQjtBQUNqRDtBQUNELENBRkQ7O0FBSUEsY0FBSVosRUFBSixDQUFPLHFCQUFQLEVBQThCLFVBQUNXLEdBQUQsRUFBTUMsTUFBTixFQUFpQixDQUM5QyxDQUREOztBQUdBLGNBQUlaLEVBQUosQ0FBTyxzQkFBUCxFQUErQixVQUFDVyxHQUFELEVBQU1DLE1BQU4sRUFBaUIsQ0FDL0MsQ0FERDs7QUFHQTtBQUNBLGNBQUlaLEVBQUosQ0FBTyxtQkFBUCxFQUE0QixZQUFNO0FBQ2hDO0FBQ0E7QUFDQSxNQUFJTSxRQUFRTyxRQUFSLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ2pDLGtCQUFJaEIsSUFBSjtBQUNEO0FBQ0YsQ0FORDs7QUFRQSxjQUFJRyxFQUFKLENBQU8sVUFBUCxFQUFtQixZQUFNO0FBQ3ZCO0FBQ0E7QUFDRCxDQUhEOztBQUtBLGNBQUlBLEVBQUosQ0FBTyxXQUFQLEVBQW9CLFlBQU0sQ0FDekIsQ0FERDs7QUFHQSxjQUFJYyxJQUFKLENBQVN6QixJQUFUO0FBQ0FuQixRQUFRQyxHQUFSLENBQVksWUFBWiIsImZpbGUiOiI4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQnJvd3NlcldpbmRvdyxcbiAgTWVudSxcbiAgYXBwLFxuICBnbG9iYWxTaG9ydGN1dCxcbiAgc2NyZWVuLFxufSBmcm9tICdlbGVjdHJvbic7XG5cbmltcG9ydCBjb25maWcgZnJvbSAnLi4vc2hhcmVkL2NvbmZpZyc7XG5pbXBvcnQgbWVzc2FnZSBmcm9tICcuLi9zaGFyZWQvbWVzc2FnZSc7XG5cbmltcG9ydCBpcGMgZnJvbSAnLi9pcGMnO1xuaW1wb3J0IHRyYXkgZnJvbSAnLi90cmF5JztcbmltcG9ydCBvdmVybGF5IGZyb20gJy4vb3ZlcmxheSc7XG5pbXBvcnQgd2F0Y2hlciBmcm9tICcuL3dhdGNoZXInO1xuaW1wb3J0IG1vbml0b3IgZnJvbSAnLi9tb25pdG9yJztcblxuLy8gcmVtb3RlIHN2Y1xuaW1wb3J0IGdmeWNhdCBmcm9tICcuL2dmeWNhdCc7XG5pbXBvcnQgbGF1Z2h0ZXJBbmFseXNpcyBmcm9tICcuL2xhdWdodGVyQW5hbHlzaXMnO1xuXG5jb25zdCBfY2hlY2tlZCA9IHt9O1xubGV0IF9jdXJyZW50VXJsID0gbnVsbDtcbmZ1bmN0aW9uIHJlZ2lzdGVySXBjKCkge1xuICBjb25zb2xlLmxvZygncmVnaXN0ZXJpbmcgaXBjLi4uJyk7XG5cbiAgLy8gaGFjaywgcmVuZGVyZXIgaGFzIHNldGludGVydmFsIHRoYXQgY2FsbHMgY2hlY2tfdXJsIGV2ZXJ5IG5vdyBhbmQgdGhlbjtcbiAgLy8gd2h5IHJlbmRlcmVyPyB3aHkgbm90P1xuICBpcGMucmVnaXN0ZXIoJ2FzeW5jJywgbWVzc2FnZS5DSEVDS19VUkwsIChkYXRhKSA9PiB7XG4gICAgbW9uaXRvci5nZXRVcmwoKS50aGVuKHVybCA9PiB7XG4gICAgICBpZiAoIXVybCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh1cmwuaW5kZXhPZigneW91dHViZS5jb20nKSA+IC0xICYmXG4gICAgICAgICAgdXJsLmluZGV4T2YoJ3dhdGNoJykgPiAtMSkge1xuICAgICAgICAvLyBpZiBhbHJlYWR5IGNoZWNraW5nL2NoZWNrZWQsIGRvIG5vdGhpbmdcbiAgICAgICAgaWYgKF9jaGVja2VkW3VybF0pIHJldHVybjtcbiAgICAgICAgX2NoZWNrZWRbdXJsXSA9IHRydWU7XG4gICAgICAgIF9jdXJyZW50VXJsID0gdXJsO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdBbmFseXppbmcgeW91dHViZSB1cmwnKTtcblxuICAgICAgICAvLyB3ZSBoYXZlIGEgeW91dHViZSB1cmxcbiAgICAgICAgLy8gc2VuZCB0byBiYWNrZW5kIGZvciBhbmFseXNpc1xuICAgICAgICBsYXVnaHRlckFuYWx5c2lzKHVybCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBBbmFseXplZDo6ICR7dXJsfWAsIHJlc3VsdC5sZW5ndGgsIHJlc3VsdCk7XG4gICAgICAgICAgb3ZlcmxheS5yZW5kZXIoJ2FwcCcsIHsgZXhjbHVzaXZlOiB0cnVlIH0pO1xuICAgICAgICAgIC8vIHByb3ZpZGUgdGltZXN0YW1wIHRvIGZyb250ZW5kXG4gICAgICAgICAgb3ZlcmxheS5zZW5kKCdhcHAnLCB7XG4gICAgICAgICAgICBhY3Rpb246IG1lc3NhZ2UuVVJMX1JFU1VMVCxcbiAgICAgICAgICAgIGRhdGE6IHsgdXJsLCByZXN1bHQsIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVycikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdXNlciBuYXZpZ2F0ZWQgYXdheSBmcm9tIHVybCwgc3RvcCBsYXVnaGluZyEhXG4gICAgICAgIG92ZXJsYXkuaGlkZSgnYXBwJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGlwYy5yZWdpc3RlcignYXN5bmMnLCBtZXNzYWdlLkhJREVfQVBQLCAoZGF0YSkgPT4ge1xuICAgICAgb3ZlcmxheS5oaWRlKCdhcHAnKTtcbiAgfSk7XG5cbiAgaXBjLnJlZ2lzdGVyKCdhc3luYycsIG1lc3NhZ2UuR0VUX0dJRiwgKGRhdGEpID0+IHtcbiAgICAvLyBpZ25vcmUgbm8gbG9uZ2VyIHZhbGlkIEdFVF9HSUZcbiAgICBpZiAoZGF0YS51cmwgIT09IF9jdXJyZW50VXJsKSByZXR1cm47XG5cbiAgICBnZnljYXQuc2VhcmNoKCkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ0dFVF9HSUYnKTtcbiAgICAgIG92ZXJsYXkucmVuZGVyKCdhcHAnLCB7IGV4Y2x1c2l2ZTogdHJ1ZSB9KTtcblxuICAgICAgLy8gcHJvdmlkZSB0aW1lc3RhbXAgdG8gZnJvbnRlbmRcbiAgICAgIG92ZXJsYXkuc2VuZCgnYXBwJywge1xuICAgICAgICBhY3Rpb246IG1lc3NhZ2UuU0hPV19HSUYsXG4gICAgICAgIGRhdGE6IHJlc3VsdCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVsYXlJbml0KCkge1xuICByZWdpc3RlcklwYygpO1xuXG4gIGNvbnNvbGUubG9nKCdyZW5kZXJpbmcgYXBwJyk7XG4gIG92ZXJsYXkucmVuZGVyKCdhcHAnLCB7IGV4Y2x1c2l2ZTogdHJ1ZSB9KTtcbn1cblxuaWYgKCFhcHAuc2hvdWxkUXVpdCkge1xuICBhcHAuc2hvdWxkUXVpdCA9IGFwcC5tYWtlU2luZ2xlSW5zdGFuY2UoKCkgPT4ge30pO1xuICBpZiAoYXBwLnNob3VsZFF1aXQpIHtcbiAgICBhcHAucXVpdCgpXG4gIH1cbn1cblxuYXBwLmNvbW1hbmRMaW5lLmFwcGVuZFN3aXRjaCgnZW5hYmxlLXRyYW5zcGFyZW50LXZpc3VhbHMnKTsgLy8gdHJ5IGFkZCB0aGlzIGxpbmVcblxuLy8gVGhpcyBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgd2hlbiBFbGVjdHJvbiBoYXMgZmluaXNoZWRcbi8vIGluaXRpYWxpemF0aW9uIGFuZCBpcyByZWFkeSB0byBjcmVhdGUgYnJvd3NlciB3aW5kb3dzLlxuLy8gU29tZSBBUElzIGNhbiBvbmx5IGJlIHVzZWQgYWZ0ZXIgdGhpcyBldmVudCBvY2N1cnMuXG5hcHAub24oJ3JlYWR5JywgKCkgPT4ge1xuICB0cmF5LmNyZWF0ZVRyYXkoKTtcblxuICB3YXRjaGVyLnJlZ2lzdGVyQWxsKFtcbiAgICAvLyByZWdpc3RlciBtb25pdG9yXG4gIF0pO1xuXG4gIHNldFRpbWVvdXQoZGVsYXlJbml0LCBjb25maWcucnVudGltZS5ERUxBWV9JTklUX01TKTtcblxuICAvLyBSZXBvcnQgdW5jYXVnaHQgZXhjZXB0aW9uc1xuICBwcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIChlcnIpID0+IHtcbiAgICBjb25zdCBlcnJKU09OID0ge21lc3NhZ2U6IGVyci5tZXNzYWdlLCBzdGFjazogZXJyLnN0YWNrfVxuICAgIC8vVE9ETzogZml4IHRoaXNcbiAgICAvL3dpbmRvd3MubWFpbi5kaXNwYXRjaCgndW5jYXVnaHRFcnJvcicsICdtYWluJywgZXJySlNPTilcbiAgfSk7XG59KTtcblxuYXBwLm9uY2UoJ3dpbGwtZmluaXNoLWxhdW5jaGluZycsICgpID0+IHtcbiAgLy9jcmFzaFJlcG9ydGVyLmluaXQoKVxufSk7XG5cbmFwcC5vbignYnJvd3Nlci13aW5kb3ctY3JlYXRlZCcsIChldnQgLCB3aW5kb3cpID0+IHtcbiAgLy93aW5kb3cuc2V0TWVudShudWxsKTtcbn0pO1xuXG5hcHAub24oJ2Jyb3dzZXItd2luZG93LWJsdXInLCAoZXZ0LCB3aW5kb3cpID0+IHtcbn0pO1xuXG5hcHAub24oJ2Jyb3dzZXItd2luZG93LWZvY3VzJywgKGV2dCwgd2luZG93KSA9PiB7XG59KTtcblxuLy8gUXVpdCB3aGVuIGFsbCB3aW5kb3dzIGFyZSBjbG9zZWQuXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xuICAvLyBPbiBPUyBYIGl0IGlzIGNvbW1vbiBmb3IgYXBwbGljYXRpb25zIGFuZCB0aGVpciBtZW51IGJhclxuICAvLyB0byBzdGF5IGFjdGl2ZSB1bnRpbCB0aGUgdXNlciBxdWl0cyBleHBsaWNpdGx5IHdpdGggQ21kICsgUVxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcbiAgICBhcHAucXVpdCgpO1xuICB9XG59KTtcblxuYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcbiAgLy8gT24gT1MgWCBpdCdzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgaW4gdGhlIGFwcCB3aGVuIHRoZVxuICAvLyBkb2NrIGljb24gaXMgY2xpY2tlZCBhbmQgdGhlcmUgYXJlIG5vIG90aGVyIHdpbmRvd3Mgb3Blbi5cbn0pO1xuXG5hcHAub24oJ3dpbGwtcXVpdCcsICgpID0+IHtcbn0pO1xuXG5hcHAuZG9jay5oaWRlKClcbmNvbnNvbGUubG9nKCdydW5uaW5nLi4uJyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tYWluanMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _electron = __webpack_require__(1);\n\nvar _getIpcServer = __webpack_require__(15);\n\nvar _getIpcServer2 = _interopRequireDefault(_getIpcServer);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar ipcServer = (0, _getIpcServer2.default)(_electron.ipcMain);\n\nexports.default = ipcServer;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluanMvaXBjLmpzP2RmNjUiXSwibmFtZXMiOlsiaXBjU2VydmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFFQTs7Ozs7O0FBRUEsSUFBTUEsWUFBWSw4Q0FBbEI7O2tCQUVlQSxTIiwiZmlsZSI6IjkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lwY01haW59IGZyb20gJ2VsZWN0cm9uJztcblxuaW1wb3J0IGdldElwY1NlcnZlciBmcm9tICcuLi9zaGFyZWQvZ2V0SXBjU2VydmVyJztcblxuY29uc3QgaXBjU2VydmVyID0gZ2V0SXBjU2VydmVyKGlwY01haW4pO1xuXG5leHBvcnQgZGVmYXVsdCBpcGNTZXJ2ZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tYWluanMvaXBjLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar analysisUrl = function () {\n  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {\n    var res, jBody;\n    return regeneratorRuntime.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.next = 2;\n            return (0, _nodeFetch2.default)('https://api.ohsloth.com/laughter/classify?url=' + url);\n\n          case 2:\n            res = _context.sent;\n            jBody = res.json();\n            return _context.abrupt('return', jBody);\n\n          case 5:\n          case 'end':\n            return _context.stop();\n        }\n      }\n    }, _callee, this);\n  }));\n\n  return function analysisUrl(_x) {\n    return _ref.apply(this, arguments);\n  };\n}();\n\nvar _nodeFetch = __webpack_require__(21);\n\nvar _nodeFetch2 = _interopRequireDefault(_nodeFetch);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step(\"next\", value); }, function (err) { step(\"throw\", err); }); } } return step(\"next\"); }); }; }\n\nexports.default = analysisUrl;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluanMvbGF1Z2h0ZXJBbmFseXNpcy5qcz8yZDMyIl0sIm5hbWVzIjpbInVybCIsInJlcyIsImpCb2R5IiwianNvbiIsImFuYWx5c2lzVXJsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O3VEQUVBLGlCQUEyQkEsR0FBM0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFDbUIsNEVBQXVEQSxHQUF2RCxDQURuQjs7QUFBQTtBQUNPQyxlQURQO0FBRVFDLGlCQUZSLEdBRWdCRCxJQUFJRSxJQUFKLEVBRmhCO0FBQUEsNkNBR1NELEtBSFQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7a0JBQWVFLFc7Ozs7O0FBRmY7Ozs7Ozs7O2tCQVFlQSxXIiwiZmlsZSI6IjEwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZldGNoIGZyb20gJ25vZGUtZmV0Y2gnO1xuXG5hc3luYyBmdW5jdGlvbiBhbmFseXNpc1VybCh1cmwpIHtcblx0Y29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9oc2xvdGguY29tL2xhdWdodGVyL2NsYXNzaWZ5P3VybD0ke3VybH1gKTtcbiAgY29uc3QgakJvZHkgPSByZXMuanNvbigpO1xuICByZXR1cm4gakJvZHk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFuYWx5c2lzVXJsO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbWFpbmpzL2xhdWdodGVyQW5hbHlzaXMuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _register = function () {\n  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(callback, repeats, interval) {\n    var parameters, ls;\n    return regeneratorRuntime.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            _context.next = 2;\n            return ensureSetup();\n\n          case 2:\n\n            interval = interval ? interval : 0;\n            repeats = repeats ? repeats : 1;\n\n            parameters = scriptConfig.parameters;\n\n            // Run script\n\n            ls = (0, _child_process.spawn)(scriptConfig.bin, parameters);\n\n            ls.stdout.setEncoding('utf8');\n\n            // Obtain successful response from script\n            ls.stdout.on('data', function (stdout) {\n              var str = stdout.toString();\n              callback(str);\n            });\n\n            // Obtain error response from script\n            ls.stderr.on('data', function (stderr) {\n              console.log('???::', str);\n              throw stderr.toString();\n            });\n\n            ls.stdin.end();\n\n          case 10:\n          case 'end':\n            return _context.stop();\n        }\n      }\n    }, _callee, this);\n  }));\n\n  return function _register(_x, _x2, _x3) {\n    return _ref.apply(this, arguments);\n  };\n}();\n\nvar _electron = __webpack_require__(1);\n\nvar _electron2 = _interopRequireDefault(_electron);\n\nvar _path = __webpack_require__(3);\n\nvar _path2 = _interopRequireDefault(_path);\n\nvar _child_process = __webpack_require__(18);\n\nvar _config = __webpack_require__(2);\n\nvar _config2 = _interopRequireDefault(_config);\n\nvar _fsUtil = __webpack_require__(6);\n\nvar fsUtil = _interopRequireWildcard(_fsUtil);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step(\"next\", value); }, function (err) { step(\"throw\", err); }); } } return step(\"next\"); }); }; }\n\nvar userDataPath = _electron2.default.app.getPath('userData');\n\nvar PLATFORM = {\n  'mac': {\n    'bin': 'sh',\n    'parameters': [userDataPath + '/scripts/mac.sh', userDataPath + '/scripts/urlWatcher.scpt', 1, 0]\n  }\n};\n\nvar setupPromise = null;\nfunction ensureSetup() {\n  if (!setupPromise) {\n    setupPromise = fsUtil.copyToDataPath(_path2.default.join(_config2.default.runtime.ROOT, 'vendor', 'scripts'), 'scripts').then(function () {\n      var scriptsPath = _path2.default.join(userDataPath, 'scripts');\n    }).then(function () {\n      return null;\n    });\n  }\n  return setupPromise;\n}\n\nfunction getScriptConfig() {\n  var config = void 0;\n  switch (process.platform) {\n    case 'darwin':\n      config = PLATFORM.mac;\n      break;\n    default:\n      throw 'Operating System not supported yet. ' + process.platform;\n  }\n\n  // Append directory to script url\n  if (config.script_url) {\n    var script_url = _path2.default.join(userDataPath, config.script_url);\n    console.log('I GOT THIS::', config.script_url);\n    config.parameters.push(script_url);\n  }\n  // Append directory to subscript url on OSX\n  //if (process.platform === 'darwin') {\n  //config.parameters.push(path.join(userDataPath, config.subscript_url));\n  //}\n\n  return config;\n}\n\nvar scriptConfig = getScriptConfig();\n\nexports.default = {\n  setup: function setup() {\n    var _this = this;\n\n    return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {\n      return regeneratorRuntime.wrap(function _callee2$(_context2) {\n        while (1) {\n          switch (_context2.prev = _context2.next) {\n            case 0:\n              _context2.next = 2;\n              return ensureSetup();\n\n            case 2:\n            case 'end':\n              return _context2.stop();\n          }\n        }\n      }, _callee2, _this);\n    }))();\n  },\n  register: function register() {\n    var _this2 = this;\n\n    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {\n      return regeneratorRuntime.wrap(function _callee3$(_context3) {\n        while (1) {\n          switch (_context3.prev = _context3.next) {\n            case 0:\n              return _context3.abrupt('return', _register.apply(undefined, args));\n\n            case 1:\n            case 'end':\n              return _context3.stop();\n          }\n        }\n      }, _callee3, _this2);\n    }))();\n  },\n  getUrl: function getUrl() {\n    return Promise.race([new Promise(function (resolve) {\n      _register(function (result) {\n        return resolve(result);\n      });\n    }), Promise.delay(2500).then(function () {})]);\n  }\n};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluanMvbW9uaXRvci5qcz9hZjcxIl0sIm5hbWVzIjpbImNhbGxiYWNrIiwicmVwZWF0cyIsImludGVydmFsIiwiZW5zdXJlU2V0dXAiLCJwYXJhbWV0ZXJzIiwic2NyaXB0Q29uZmlnIiwibHMiLCJiaW4iLCJzdGRvdXQiLCJzZXRFbmNvZGluZyIsIm9uIiwic3RyIiwidG9TdHJpbmciLCJzdGRlcnIiLCJjb25zb2xlIiwibG9nIiwic3RkaW4iLCJlbmQiLCJyZWdpc3RlciIsImZzVXRpbCIsInVzZXJEYXRhUGF0aCIsImFwcCIsImdldFBhdGgiLCJQTEFURk9STSIsInNldHVwUHJvbWlzZSIsImNvcHlUb0RhdGFQYXRoIiwiam9pbiIsInJ1bnRpbWUiLCJST09UIiwidGhlbiIsInNjcmlwdHNQYXRoIiwiZ2V0U2NyaXB0Q29uZmlnIiwiY29uZmlnIiwicHJvY2VzcyIsInBsYXRmb3JtIiwibWFjIiwic2NyaXB0X3VybCIsInB1c2giLCJzZXR1cCIsImFyZ3MiLCJnZXRVcmwiLCJQcm9taXNlIiwicmFjZSIsInJlc29sdmUiLCJyZXN1bHQiLCJkZWxheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozt1REFzREEsaUJBQXdCQSxRQUF4QixFQUFrQ0MsT0FBbEMsRUFBMkNDLFFBQTNDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQ1VDLGFBRFY7O0FBQUE7O0FBR0lELHVCQUFZQSxRQUFELEdBQWFBLFFBQWIsR0FBd0IsQ0FBbkM7QUFDQUQsc0JBQVdBLE9BQUQsR0FBWUEsT0FBWixHQUFzQixDQUFoQzs7QUFFTUcsc0JBTlYsR0FNdUJDLGFBQWFELFVBTnBDOztBQVFJOztBQUNNRSxjQVRWLEdBU2UsMEJBQU1ELGFBQWFFLEdBQW5CLEVBQXdCSCxVQUF4QixDQVRmOztBQVVJRSxlQUFHRSxNQUFILENBQVVDLFdBQVYsQ0FBc0IsTUFBdEI7O0FBRUE7QUFDQUgsZUFBR0UsTUFBSCxDQUFVRSxFQUFWLENBQWEsTUFB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QUFQO0FBTUQ7QUFoQlksQyIsImZpbGUiOiIxMS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbGVjdHJvbiBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHNwYXduLCBleGVjRmlsZSB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG5pbXBvcnQgZ2NvbmZpZyBmcm9tICcuLi9zaGFyZWQvY29uZmlnJztcbmltcG9ydCAqIGFzIGZzVXRpbCBmcm9tICcuL2ZzVXRpbCc7XG5cbmNvbnN0IHVzZXJEYXRhUGF0aCA9IGVsZWN0cm9uLmFwcC5nZXRQYXRoKCd1c2VyRGF0YScpO1xuXG5jb25zdCBQTEFURk9STSA9IHtcbiAgJ21hYycgOntcbiAgICAnYmluJzogJ3NoJyxcbiAgICAncGFyYW1ldGVycyc6IFtcbiAgICAgIGAke3VzZXJEYXRhUGF0aH0vc2NyaXB0cy9tYWMuc2hgLFxuICAgICAgYCR7dXNlckRhdGFQYXRofS9zY3JpcHRzL3VybFdhdGNoZXIuc2NwdGAsXG4gICAgICAxLCAwXG4gICAgXSxcbiAgfSxcbn07XG5cbmxldCBzZXR1cFByb21pc2UgPSBudWxsO1xuZnVuY3Rpb24gZW5zdXJlU2V0dXAoKSB7XG4gIGlmICghc2V0dXBQcm9taXNlKSB7XG4gICAgc2V0dXBQcm9taXNlID0gZnNVdGlsLmNvcHlUb0RhdGFQYXRoKHBhdGguam9pbihnY29uZmlnLnJ1bnRpbWUuUk9PVCwgJ3ZlbmRvcicsICdzY3JpcHRzJyksICdzY3JpcHRzJykudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBzY3JpcHRzUGF0aCA9IHBhdGguam9pbih1c2VyRGF0YVBhdGgsICdzY3JpcHRzJyk7XG4gICAgfSkudGhlbigoKSA9PiBudWxsKTtcbiAgfVxuICByZXR1cm4gc2V0dXBQcm9taXNlO1xufVxuXG5mdW5jdGlvbiBnZXRTY3JpcHRDb25maWcoKSB7XG4gIGxldCBjb25maWc7XG4gIHN3aXRjaCAocHJvY2Vzcy5wbGF0Zm9ybSkge1xuICAgIGNhc2UgJ2Rhcndpbic6XG4gICAgICBjb25maWcgPSBQTEFURk9STS5tYWM7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgYE9wZXJhdGluZyBTeXN0ZW0gbm90IHN1cHBvcnRlZCB5ZXQuICR7cHJvY2Vzcy5wbGF0Zm9ybX1gO1xuICB9XG5cbiAgLy8gQXBwZW5kIGRpcmVjdG9yeSB0byBzY3JpcHQgdXJsXG4gIGlmIChjb25maWcuc2NyaXB0X3VybCkge1xuICAgIGNvbnN0IHNjcmlwdF91cmwgPSBwYXRoLmpvaW4odXNlckRhdGFQYXRoLCBjb25maWcuc2NyaXB0X3VybCk7XG4gICAgY29uc29sZS5sb2coJ0kgR09UIFRISVM6OicsIGNvbmZpZy5zY3JpcHRfdXJsKTtcbiAgICBjb25maWcucGFyYW1ldGVycy5wdXNoKHNjcmlwdF91cmwpO1xuICB9XG4gIC8vIEFwcGVuZCBkaXJlY3RvcnkgdG8gc3Vic2NyaXB0IHVybCBvbiBPU1hcbiAgLy9pZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcbiAgICAvL2NvbmZpZy5wYXJhbWV0ZXJzLnB1c2gocGF0aC5qb2luKHVzZXJEYXRhUGF0aCwgY29uZmlnLnN1YnNjcmlwdF91cmwpKTtcbiAgLy99XG5cbiAgcmV0dXJuIGNvbmZpZztcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXIoY2FsbGJhY2ssIHJlcGVhdHMsIGludGVydmFsKSB7XG4gICAgYXdhaXQgZW5zdXJlU2V0dXAoKTtcblxuICAgIGludGVydmFsID0gKGludGVydmFsKSA/IGludGVydmFsIDogMDtcbiAgICByZXBlYXRzID0gKHJlcGVhdHMpID8gcmVwZWF0cyA6IDE7XG5cbiAgICBjb25zdCBwYXJhbWV0ZXJzID0gc2NyaXB0Q29uZmlnLnBhcmFtZXRlcnM7XG5cbiAgICAvLyBSdW4gc2NyaXB0XG4gICAgY29uc3QgbHMgPSBzcGF3bihzY3JpcHRDb25maWcuYmluLCBwYXJhbWV0ZXJzKTtcbiAgICBscy5zdGRvdXQuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcblxuICAgIC8vIE9idGFpbiBzdWNjZXNzZnVsIHJlc3BvbnNlIGZyb20gc2NyaXB0XG4gICAgbHMuc3Rkb3V0Lm9uKCdkYXRhJywgZnVuY3Rpb24oc3Rkb3V0KXtcbiAgICAgIGNvbnN0IHN0ciA9IHN0ZG91dC50b1N0cmluZygpO1xuICAgICAgY2FsbGJhY2soc3RyKTtcbiAgICB9KTtcblxuICAgIC8vIE9idGFpbiBlcnJvciByZXNwb25zZSBmcm9tIHNjcmlwdFxuICAgIGxzLnN0ZGVyci5vbignZGF0YScsIGZ1bmN0aW9uKHN0ZGVycil7XG4gICAgICBjb25zb2xlLmxvZygnPz8/OjonLCBzdHIpO1xuICAgICAgdGhyb3cgc3RkZXJyLnRvU3RyaW5nKCk7XG4gICAgfSk7XG5cbiAgICBscy5zdGRpbi5lbmQoKTtcbn1cblxuY29uc3Qgc2NyaXB0Q29uZmlnID0gZ2V0U2NyaXB0Q29uZmlnKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYXN5bmMgc2V0dXAoKSB7XG4gICAgYXdhaXQgZW5zdXJlU2V0dXAoKTtcbiAgfSxcblxuICBhc3luYyByZWdpc3RlciguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHJlZ2lzdGVyKC4uLmFyZ3MpO1xuICB9LFxuXG4gIGdldFVybCgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yYWNlKFtcbiAgICAgIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICByZWdpc3RlcihyZXN1bHQgPT4gcmVzb2x2ZShyZXN1bHQpKTtcbiAgICAgIH0pLFxuICAgICAgUHJvbWlzZS5kZWxheSgyNTAwKS50aGVuKCgpID0+IHt9KSxcbiAgICBdKTtcbiAgfSxcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tYWluanMvbW9uaXRvci5qcyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _electron = __webpack_require__(1);\n\nvar _electron2 = _interopRequireDefault(_electron);\n\nvar _path = __webpack_require__(3);\n\nvar _path2 = _interopRequireDefault(_path);\n\nvar _config = __webpack_require__(2);\n\nvar _config2 = _interopRequireDefault(_config);\n\nvar _message = __webpack_require__(4);\n\nvar _message2 = _interopRequireDefault(_message);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar BrowserWindow = _electron2.default.BrowserWindow,\n    Menu = _electron2.default.Menu,\n    Tray = _electron2.default.Tray,\n    globalShortcut = _electron2.default.globalShortcut,\n    clipboard = _electron2.default.clipboard;\n\n\nvar rendererConfig = _config2.default.renderer;\nvar refs = {};\n\nfunction _getPath(name, rawUrl) {\n  var htmlPath = void 0;\n\n  if (name && rawUrl) {\n    return rawUrl;\n  }\n\n  if (_config2.default.runtime.IS_PROD) {\n    htmlPath = 'file://' + _path2.default.join(__dirname, 'renderer', name + '.html');\n  } else {\n    htmlPath = 'file://' + _path2.default.join(__dirname, name + '.html');\n  }\n\n  return htmlPath;\n}\n\nfunction calculateDim(specDim, screenDim) {\n  if (specDim === 0) {\n    return screenDim;\n  }\n  return specDim < 0 && screenDim + specDim || specDim;\n}\n\nfunction createWindow(refName) {\n  var winConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n\n  if (!refs[refName]) {\n    var _electron$screen$getP = _electron2.default.screen.getPrimaryDisplay(),\n        workAreaSize = _electron$screen$getP.workAreaSize;\n\n    var dimension = {\n      width: calculateDim(winConfig.dimension.width, workAreaSize.width),\n      height: calculateDim(winConfig.dimension.height, workAreaSize.height)\n    };\n\n    refs[refName] = new BrowserWindow(Object.assign({}, dimension, {\n      acceptFirstMouse: true,\n      frame: false,\n      movable: false,\n      resizable: false,\n      show: false,\n      transparent: true,\n      hasShadow: false\n    }, winConfig.window));\n\n    refs[refName].name = refName;\n    refs[refName].setMenu(null);\n    refs[refName].loadURL(_getPath(winConfig.name, winConfig.url));\n\n    refs[refName].on('close', function (evt) {\n      if (!appState.shouldQuit) {\n        evt.preventDefault();\n        refs[refName].hide();\n      }\n    });\n\n    refs[refName].on('closed', function () {\n      refs[refName].removeAllListeners();\n      refs[refName] = null;\n    });\n\n    refs[refName].setVisibleOnAllWorkspaces(true);\n    console.log('Rendering ' + winConfig.name);\n\n    refs[refName].openDevTools({ detach: true });\n  }\n\n  if (winConfig.position) {\n    console.log('Moving ' + refName + ' to ' + JSON.stringify(winConfig.position));\n    refs[refName].setPosition(parseInt(winConfig.position.x, 10), parseInt(winConfig.position.y, 10));\n  }\n}\n\nvar overlay = {\n  _renderState: {\n    rendering: false\n  },\n  inflight: function inflight() {\n    return overlay._renderState.rendering;\n  },\n  render: function render(name) {\n    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n    var warmOnly = options.warmOnly,\n        exclusive = options.exclusive;\n\n    var _electron$screen$getP2 = _electron2.default.screen.getPrimaryDisplay(),\n        workAreaSize = _electron$screen$getP2.workAreaSize;\n\n    createWindow(name, rendererConfig[name], { warmOnly: warmOnly });\n\n    if (warmOnly) return;\n    if (exclusive) {\n      Object.keys(refs).forEach(function (wName) {\n        if (wName !== name) {\n          refs[wName].hide();\n        }\n      });\n    }\n\n    overlay._renderState.rendering = true;\n\n    var p = new Promise(function (resolve, reject) {\n      setImmediate(function () {\n        refs[name].show();\n        refs[name].focus();\n        overlay._renderState.rendering = false;\n        resolve();\n      });\n    });\n\n    return p;\n  },\n  hide: function hide(name) {\n    refs[name].hide();\n  },\n  send: function send(name, msg) {\n    var window = refs[name];\n    window.webContents.send('asynchronous-message', msg);\n  },\n  isVisible: function isVisible(name, props) {\n    var window = refs[name];\n    return window && window.isVisible();\n  },\n  getVisible: function getVisible() {\n    var keys = Object.keys(refs).filter(function (w) {\n      return refs[w].isVisible();\n    });\n    if (keys.length) {\n      return refs[keys[0]];\n    }\n    return {};\n  }\n};\n\nexports.default = overlay;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluanMvb3ZlcmxheS5qcz84YWNhIl0sIm5hbWVzIjpbIkJyb3dzZXJXaW5kb3ciLCJNZW51IiwiVHJheSIsImdsb2JhbFNob3J0Y3V0IiwiY2xpcGJvYXJkIiwicmVuZGVyZXJDb25maWciLCJyZW5kZXJlciIsInJlZnMiLCJfZ2V0UGF0aCIsIm5hbWUiLCJyYXdVcmwiLCJodG1sUGF0aCIsInJ1bnRpbWUiLCJJU19QUk9EIiwiam9pbiIsIl9fZGlybmFtZSIsImNhbGN1bGF0ZURpbSIsInNwZWNEaW0iLCJzY3JlZW5EaW0iLCJjcmVhdGVXaW5kb3ciLCJyZWZOYW1lIiwid2luQ29uZmlnIiwib3B0aW9ucyIsInNjcmVlbiIsImdldFByaW1hcnlEaXNwbGF5Iiwid29ya0FyZWFTaXplIiwiZGltZW5zaW9uIiwid2lkdGgiLCJoZWlnaHQiLCJPYmplY3QiLCJhc3NpZ24iLCJhY2NlcHRGaXJzdE1vdXNlIiwiZnJhbWUiLCJtb3ZhYmxlIiwicmVzaXphYmxlIiwic2hvdyIsInRyYW5zcGFyZW50IiwiaGFzU2hhZG93Iiwid2luZG93Iiwic2V0TWVudSIsImxvYWRVUkwiLCJ1cmwiLCJvbiIsImV2dCIsImFwcFN0YXRlIiwic2hvdWxkUXVpdCIsInByZXZlbnREZWZhdWx0IiwiaGlkZSIsInJlbW92ZUFsbExpc3RlbmVycyIsInNldFZpc2libGVPbkFsbFdvcmtzcGFjZXMiLCJjb25zb2xlIiwibG9nIiwib3BlbkRldlRvb2xzIiwiZGV0YWNoIiwicG9zaXRpb24iLCJKU09OIiwic3RyaW5naWZ5Iiwic2V0UG9zaXRpb24iLCJwYXJzZUludCIsIngiLCJ5Iiwib3ZlcmxheSIsIl9yZW5kZXJTdGF0ZSIsInJlbmRlcmluZyIsImluZmxpZ2h0IiwicmVuZGVyIiwid2FybU9ubHkiLCJleGNsdXNpdmUiLCJrZXlzIiwiZm9yRWFjaCIsIndOYW1lIiwicCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic2V0SW1tZWRpYXRlIiwiZm9jdXMiLCJzZW5kIiwibXNnIiwid2ViQ29udGVudHMiLCJpc1Zpc2libGUiLCJwcm9wcyIsImdldFZpc2libGUiLCJmaWx0ZXIiLCJ3IiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0lBR0VBLGEsc0JBQUFBLGE7SUFDQUMsSSxzQkFBQUEsSTtJQUNBQyxJLHNCQUFBQSxJO0lBQ0FDLGMsc0JBQUFBLGM7SUFDQUMsUyxzQkFBQUEsUzs7O0FBR0YsSUFBTUMsaUJBQWlCLGlCQUFPQyxRQUE5QjtBQUNBLElBQU1DLE9BQU8sRUFBYjs7QUFFQSxTQUFTQyxRQUFULENBQWtCQyxJQUFsQixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFDOUIsTUFBSUMsaUJBQUo7O0FBRUEsTUFBSUYsUUFBUUMsTUFBWixFQUFvQjtBQUNsQixXQUFPQSxNQUFQO0FBQ0Q7O0FBRUQsTUFBSSxpQkFBT0UsT0FBUCxDQUFlQyxPQUFuQixFQUE0QjtBQUMxQkYsZUFBVyxZQUFZLGVBQUtHLElBQUwsQ0FBVUMsU0FBVixFQUFxQixVQUFyQixFQUFpQ04sT0FBTyxPQUF4QyxDQUF2QjtBQUNELEdBRkQsTUFFTztBQUNMRSxlQUFXLFlBQVksZUFBS0csSUFBTCxDQUFVQyxTQUFWLEVBQXFCTixPQUFPLE9BQTVCLENBQXZCO0FBQ0Q7O0FBRUQsU0FBT0UsUUFBUDtBQUNEOztBQUVELFNBQVNLLFlBQVQsQ0FBc0JDLE9BQXRCLEVBQStCQyxTQUEvQixFQUEwQztBQUN4QyxNQUFJRCxZQUFZLENBQWhCLEVBQW1CO0FBQ2pCLFdBQU9DLFNBQVA7QUFDRDtBQUNELFNBQU9ELFVBQVUsQ0FBVixJQUFnQkMsWUFBWUQsT0FBNUIsSUFBd0NBLE9BQS9DO0FBQ0Q7O0FBRUQsU0FBU0UsWUFBVCxDQUFzQkMsT0FBdEIsRUFBeUQ7QUFBQSxNQUExQkMsU0FBMEIsdUVBQWhCLEVBQWdCO0FBQUEsTUFBWkMsT0FBWSx1RUFBSixFQUFJOztBQUN2RCxNQUFJLENBQUNmLEtBQUthLE9BQUwsQ0FBTCxFQUFvQjtBQUFBLGdDQUNLLG1CQUFTRyxNQUFULENBQWdCQyxpQkFBaEIsRUFETDtBQUFBLFFBQ1hDLFlBRFcseUJBQ1hBLFlBRFc7O0FBR2xCLFFBQU1DLFlBQVk7QUFDaEJDLGFBQU9YLGFBQWFLLFVBQVVLLFNBQVYsQ0FBb0JDLEtBQWpDLEVBQXdDRixhQUFhRSxLQUFyRCxDQURTO0FBRWhCQyxjQUFRWixhQUFhSyxVQUFVSyxTQUFWLENBQW9CRSxNQUFqQyxFQUF5Q0gsYUFBYUcsTUFBdEQ7QUFGUSxLQUFsQjs7QUFLQXJCLFNBQUthLE9BQUwsSUFBZ0IsSUFBSXBCLGFBQUosQ0FBa0I2QixPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkosU0FBbEIsRUFBNkI7QUFDN0RLLHdCQUFrQixJQUQyQztBQUU3REMsYUFBTyxLQUZzRDtBQUc3REMsZUFBUyxLQUhvRDtBQUk3REMsaUJBQVcsS0FKa0Q7QUFLN0RDLFlBQU0sS0FMdUQ7QUFNN0RDLG1CQUFhLElBTmdEO0FBTzdEQyxpQkFBVztBQVBrRCxLQUE3QixFQVEvQmhCLFVBQVVpQixNQVJxQixDQUFsQixDQUFoQjs7QUFVQS9CLFNBQUthLE9BQUwsRUFBY1gsSUFBZCxHQUFxQlcsT0FBckI7QUFDQWIsU0FBS2EsT0FBTCxFQUFjbUIsT0FBZCxDQUFzQixJQUF0QjtBQUNBaEMsU0FBS2EsT0FBTCxFQUFjb0IsT0FBZCxDQUFzQmhDLFNBQVNhLFVBQVVaLElBQW5CLEVBQXlCWSxVQUFVb0IsR0FBbkMsQ0FBdEI7O0FBRUFsQyxTQUFLYSxPQUFMLEVBQWNzQixFQUFkLENBQWlCLE9BQWpCLEVBQTBCLFVBQUNDLEdBQUQsRUFBUztBQUNqQyxVQUFJLENBQUNDLFNBQVNDLFVBQWQsRUFBMEI7QUFDeEJGLFlBQUlHLGNBQUo7QUFDQXZDLGFBQUthLE9BQUwsRUFBYzJCLElBQWQ7QUFDRDtBQUNGLEtBTEQ7O0FBT0F4QyxTQUFLYSxPQUFMLEVBQWNzQixFQUFkLENBQWlCLFFBQWpCLEVBQTJCLFlBQU07QUFDL0JuQyxXQUFLYSxPQUFMLEVBQWM0QixrQkFBZDtBQUNBekMsV0FBS2EsT0FBTCxJQUFnQixJQUFoQjtBQUNELEtBSEQ7O0FBS0FiLFNBQUthLE9BQUwsRUFBYzZCLHlCQUFkLENBQXdDLElBQXhDO0FBQ0FDLFlBQVFDLEdBQVIsQ0FBWSxlQUFlOUIsVUFBVVosSUFBckM7O0FBRUFGLFNBQUthLE9BQUwsRUFBY2dDLFlBQWQsQ0FBMkIsRUFBRUMsUUFBUSxJQUFWLEVBQTNCO0FBQ0Q7O0FBRUQsTUFBSWhDLFVBQVVpQyxRQUFkLEVBQXdCO0FBQ3RCSixZQUFRQyxHQUFSLGFBQXNCL0IsT0FBdEIsWUFBb0NtQyxLQUFLQyxTQUFMLENBQWVuQyxVQUFVaUMsUUFBekIsQ0FBcEM7QUFDQS9DLFNBQUthLE9BQUwsRUFBY3FDLFdBQWQsQ0FDRUMsU0FBU3JDLFVBQVVpQyxRQUFWLENBQW1CSyxDQUE1QixFQUErQixFQUEvQixDQURGLEVBRUVELFNBQVNyQyxVQUFVaUMsUUFBVixDQUFtQk0sQ0FBNUIsRUFBK0IsRUFBL0IsQ0FGRjtBQUdEO0FBQ0Y7O0FBRUQsSUFBTUMsVUFBVTtBQUNkQyxnQkFBYztBQUNaQyxlQUFXO0FBREMsR0FEQTtBQUlkQyxVQUpjLHNCQUlIO0FBQ1QsV0FBT0gsUUFBUUMsWUFBUixDQUFxQkMsU0FBNUI7QUFDRCxHQU5hO0FBT2RFLFFBUGMsa0JBT1B4RCxJQVBPLEVBT1c7QUFBQSxRQUFaYSxPQUFZLHVFQUFKLEVBQUk7QUFBQSxRQUNmNEMsUUFEZSxHQUNTNUMsT0FEVCxDQUNmNEMsUUFEZTtBQUFBLFFBQ0xDLFNBREssR0FDUzdDLE9BRFQsQ0FDTDZDLFNBREs7O0FBQUEsaUNBRUEsbUJBQVM1QyxNQUFULENBQWdCQyxpQkFBaEIsRUFGQTtBQUFBLFFBRWhCQyxZQUZnQiwwQkFFaEJBLFlBRmdCOztBQUl2Qk4saUJBQWFWLElBQWIsRUFBbUJKLGVBQWVJLElBQWYsQ0FBbkIsRUFBeUMsRUFBRXlELGtCQUFGLEVBQXpDOztBQUVBLFFBQUlBLFFBQUosRUFBYztBQUNkLFFBQUlDLFNBQUosRUFBZTtBQUNidEMsYUFBT3VDLElBQVAsQ0FBWTdELElBQVosRUFBa0I4RCxPQUFsQixDQUEwQixpQkFBUztBQUNqQyxZQUFJQyxVQUFVN0QsSUFBZCxFQUFvQjtBQUNsQkYsZUFBSytELEtBQUwsRUFBWXZCLElBQVo7QUFDRDtBQUNGLE9BSkQ7QUFLRDs7QUFFRGMsWUFBUUMsWUFBUixDQUFxQkMsU0FBckIsR0FBaUMsSUFBakM7O0FBRUEsUUFBTVEsSUFBSSxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3pDQyxtQkFBYSxZQUFNO0FBQ2pCcEUsYUFBS0UsSUFBTCxFQUFXMEIsSUFBWDtBQUNBNUIsYUFBS0UsSUFBTCxFQUFXbUUsS0FBWDtBQUNBZixnQkFBUUMsWUFBUixDQUFxQkMsU0FBckIsR0FBaUMsS0FBakM7QUFDQVU7QUFDRCxPQUxEO0FBTUQsS0FQUyxDQUFWOztBQVNBLFdBQU9GLENBQVA7QUFDRCxHQWxDYTtBQW1DZHhCLE1BbkNjLGdCQW1DVHRDLElBbkNTLEVBbUNIO0FBQ1RGLFNBQUtFLElBQUwsRUFBV3NDLElBQVg7QUFDRCxHQXJDYTtBQXNDZDhCLE1BdENjLGdCQXNDVHBFLElBdENTLEVBc0NIcUUsR0F0Q0csRUFzQ0U7QUFDZCxRQUFNeEMsU0FBUy9CLEtBQUtFLElBQUwsQ0FBZjtBQUNBNkIsV0FBT3lDLFdBQVAsQ0FBbUJGLElBQW5CLENBQXdCLHNCQUF4QixFQUFnREMsR0FBaEQ7QUFDRCxHQXpDYTtBQTBDZEUsV0ExQ2MscUJBMENKdkUsSUExQ0ksRUEwQ0V3RSxLQTFDRixFQTBDUztBQUNyQixRQUFNM0MsU0FBUy9CLEtBQUtFLElBQUwsQ0FBZjtBQUNBLFdBQU82QixVQUFVQSxPQUFPMEMsU0FBUCxFQUFqQjtBQUNELEdBN0NhO0FBOENkRSxZQTlDYyx3QkE4Q0Q7QUFDWCxRQUFNZCxPQUFPdkMsT0FBT3VDLElBQVAsQ0FBWTdELElBQVosRUFBa0I0RSxNQUFsQixDQUF5QjtBQUFBLGFBQUs1RSxLQUFLNkUsQ0FBTCxFQUFRSixTQUFSLEVBQUw7QUFBQSxLQUF6QixDQUFiO0FBQ0EsUUFBSVosS0FBS2lCLE1BQVQsRUFBaUI7QUFDZixhQUFPOUUsS0FBSzZELEtBQUssQ0FBTCxDQUFMLENBQVA7QUFDRDtBQUNELFdBQU8sRUFBUDtBQUNEO0FBcERhLENBQWhCOztrQkF1RGVQLE8iLCJmaWxlIjoiMTIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZWxlY3Ryb24gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCBjb25maWcgZnJvbSAnLi4vc2hhcmVkL2NvbmZpZyc7XG5pbXBvcnQgbWVzc2FnZSwge3R5cGUgYXMgTWVzc2FnZVR5cGV9IGZyb20gJy4uL3NoYXJlZC9tZXNzYWdlJztcblxuY29uc3Qge1xuICBCcm93c2VyV2luZG93LFxuICBNZW51LFxuICBUcmF5LFxuICBnbG9iYWxTaG9ydGN1dCxcbiAgY2xpcGJvYXJkLFxufSA9IGVsZWN0cm9uO1xuXG5jb25zdCByZW5kZXJlckNvbmZpZyA9IGNvbmZpZy5yZW5kZXJlcjtcbmNvbnN0IHJlZnMgPSB7IH07XG5cbmZ1bmN0aW9uIF9nZXRQYXRoKG5hbWUsIHJhd1VybCkge1xuICBsZXQgaHRtbFBhdGg7XG5cbiAgaWYgKG5hbWUgJiYgcmF3VXJsKSB7XG4gICAgcmV0dXJuIHJhd1VybDtcbiAgfVxuXG4gIGlmIChjb25maWcucnVudGltZS5JU19QUk9EKSB7XG4gICAgaHRtbFBhdGggPSAnZmlsZTovLycgKyBwYXRoLmpvaW4oX19kaXJuYW1lLCAncmVuZGVyZXInLCBuYW1lICsgJy5odG1sJyk7XG4gIH0gZWxzZSB7XG4gICAgaHRtbFBhdGggPSAnZmlsZTovLycgKyBwYXRoLmpvaW4oX19kaXJuYW1lLCBuYW1lICsgJy5odG1sJyk7XG4gIH1cblxuICByZXR1cm4gaHRtbFBhdGg7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZURpbShzcGVjRGltLCBzY3JlZW5EaW0pIHtcbiAgaWYgKHNwZWNEaW0gPT09IDApIHtcbiAgICByZXR1cm4gc2NyZWVuRGltO1xuICB9XG4gIHJldHVybiBzcGVjRGltIDwgMCAmJiAoc2NyZWVuRGltICsgc3BlY0RpbSkgfHwgc3BlY0RpbTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlV2luZG93KHJlZk5hbWUsIHdpbkNvbmZpZz17fSwgb3B0aW9ucz17fSkge1xuICBpZiAoIXJlZnNbcmVmTmFtZV0pIHtcbiAgICBjb25zdCB7d29ya0FyZWFTaXplfSA9IGVsZWN0cm9uLnNjcmVlbi5nZXRQcmltYXJ5RGlzcGxheSgpO1xuXG4gICAgY29uc3QgZGltZW5zaW9uID0ge1xuICAgICAgd2lkdGg6IGNhbGN1bGF0ZURpbSh3aW5Db25maWcuZGltZW5zaW9uLndpZHRoLCB3b3JrQXJlYVNpemUud2lkdGgpLFxuICAgICAgaGVpZ2h0OiBjYWxjdWxhdGVEaW0od2luQ29uZmlnLmRpbWVuc2lvbi5oZWlnaHQsIHdvcmtBcmVhU2l6ZS5oZWlnaHQpLFxuICAgIH07XG5cbiAgICByZWZzW3JlZk5hbWVdID0gbmV3IEJyb3dzZXJXaW5kb3coT2JqZWN0LmFzc2lnbih7fSwgZGltZW5zaW9uLCB7XG4gICAgICBhY2NlcHRGaXJzdE1vdXNlOiB0cnVlLFxuICAgICAgZnJhbWU6IGZhbHNlLFxuICAgICAgbW92YWJsZTogZmFsc2UsXG4gICAgICByZXNpemFibGU6IGZhbHNlLFxuICAgICAgc2hvdzogZmFsc2UsXG4gICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgIGhhc1NoYWRvdzogZmFsc2UsXG4gICAgfSwgd2luQ29uZmlnLndpbmRvdykpO1xuXG4gICAgcmVmc1tyZWZOYW1lXS5uYW1lID0gcmVmTmFtZTtcbiAgICByZWZzW3JlZk5hbWVdLnNldE1lbnUobnVsbCk7XG4gICAgcmVmc1tyZWZOYW1lXS5sb2FkVVJMKF9nZXRQYXRoKHdpbkNvbmZpZy5uYW1lLCB3aW5Db25maWcudXJsKSk7XG5cbiAgICByZWZzW3JlZk5hbWVdLm9uKCdjbG9zZScsIChldnQpID0+IHtcbiAgICAgIGlmICghYXBwU3RhdGUuc2hvdWxkUXVpdCkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmVmc1tyZWZOYW1lXS5oaWRlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZWZzW3JlZk5hbWVdLm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgICByZWZzW3JlZk5hbWVdLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgICAgcmVmc1tyZWZOYW1lXSA9IG51bGw7XG4gICAgfSk7XG5cbiAgICByZWZzW3JlZk5hbWVdLnNldFZpc2libGVPbkFsbFdvcmtzcGFjZXModHJ1ZSk7XG4gICAgY29uc29sZS5sb2coJ1JlbmRlcmluZyAnICsgd2luQ29uZmlnLm5hbWUpO1xuXG4gICAgcmVmc1tyZWZOYW1lXS5vcGVuRGV2VG9vbHMoeyBkZXRhY2g6IHRydWUgfSk7XG4gIH1cblxuICBpZiAod2luQ29uZmlnLnBvc2l0aW9uKSB7XG4gICAgY29uc29sZS5sb2coYE1vdmluZyAke3JlZk5hbWV9IHRvICR7SlNPTi5zdHJpbmdpZnkod2luQ29uZmlnLnBvc2l0aW9uKX1gKTtcbiAgICByZWZzW3JlZk5hbWVdLnNldFBvc2l0aW9uKFxuICAgICAgcGFyc2VJbnQod2luQ29uZmlnLnBvc2l0aW9uLngsIDEwKSxcbiAgICAgIHBhcnNlSW50KHdpbkNvbmZpZy5wb3NpdGlvbi55LCAxMCkpO1xuICB9XG59XG5cbmNvbnN0IG92ZXJsYXkgPSB7XG4gIF9yZW5kZXJTdGF0ZToge1xuICAgIHJlbmRlcmluZzogZmFsc2UsXG4gIH0sXG4gIGluZmxpZ2h0KCkge1xuICAgIHJldHVybiBvdmVybGF5Ll9yZW5kZXJTdGF0ZS5yZW5kZXJpbmc7XG4gIH0sXG4gIHJlbmRlcihuYW1lLCBvcHRpb25zPXt9KSB7XG4gICAgY29uc3QgeyB3YXJtT25seSwgZXhjbHVzaXZlIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IHt3b3JrQXJlYVNpemV9ID0gZWxlY3Ryb24uc2NyZWVuLmdldFByaW1hcnlEaXNwbGF5KCk7XG5cbiAgICBjcmVhdGVXaW5kb3cobmFtZSwgcmVuZGVyZXJDb25maWdbbmFtZV0sIHsgd2FybU9ubHkgfSk7XG5cbiAgICBpZiAod2FybU9ubHkpIHJldHVybjtcbiAgICBpZiAoZXhjbHVzaXZlKSB7XG4gICAgICBPYmplY3Qua2V5cyhyZWZzKS5mb3JFYWNoKHdOYW1lID0+IHtcbiAgICAgICAgaWYgKHdOYW1lICE9PSBuYW1lKSB7XG4gICAgICAgICAgcmVmc1t3TmFtZV0uaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBvdmVybGF5Ll9yZW5kZXJTdGF0ZS5yZW5kZXJpbmcgPSB0cnVlO1xuXG4gICAgY29uc3QgcCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiB7XG4gICAgICAgIHJlZnNbbmFtZV0uc2hvdygpO1xuICAgICAgICByZWZzW25hbWVdLmZvY3VzKCk7XG4gICAgICAgIG92ZXJsYXkuX3JlbmRlclN0YXRlLnJlbmRlcmluZyA9IGZhbHNlO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwO1xuICB9LFxuICBoaWRlKG5hbWUpIHtcbiAgICByZWZzW25hbWVdLmhpZGUoKTtcbiAgfSxcbiAgc2VuZChuYW1lLCBtc2cpIHtcbiAgICBjb25zdCB3aW5kb3cgPSByZWZzW25hbWVdO1xuICAgIHdpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdhc3luY2hyb25vdXMtbWVzc2FnZScsIG1zZyk7XG4gIH0sXG4gIGlzVmlzaWJsZShuYW1lLCBwcm9wcykge1xuICAgIGNvbnN0IHdpbmRvdyA9IHJlZnNbbmFtZV07XG4gICAgcmV0dXJuIHdpbmRvdyAmJiB3aW5kb3cuaXNWaXNpYmxlKCk7XG4gIH0sXG4gIGdldFZpc2libGUoKSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHJlZnMpLmZpbHRlcih3ID0+IHJlZnNbd10uaXNWaXNpYmxlKCkpO1xuICAgIGlmIChrZXlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHJlZnNba2V5c1swXV07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG92ZXJsYXk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tYWluanMvb3ZlcmxheS5qcyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _electron = __webpack_require__(1);\n\nvar _config = __webpack_require__(2);\n\nvar _config2 = _interopRequireDefault(_config);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar menuImg = _electron.nativeImage.createFromPath(_config2.default.icons.menu);\n\nvar trayState = true;\nvar tray = null;\n\nfunction quit() {\n  _electron.app.quit();\n}\n\nfunction getContextMenu(updateAvailable) {\n  var contextMenu = [{ label: 'Quit', type: 'normal', click: quit }];\n  return _electron.Menu.buildFromTemplate(contextMenu);\n}\n\nvar TrayManager = {\n  createTray: function createTray() {\n    if (tray) return;\n    console.log('Trayhere::', _config2.default.icons.menu);\n    tray = new _electron.Tray(menuImg);\n    tray.setToolTip('g');\n    tray.setContextMenu(getContextMenu());\n  }\n};\n\nexports.default = TrayManager;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluanMvdHJheS5qcz84MzZiIl0sIm5hbWVzIjpbIm1lbnVJbWciLCJjcmVhdGVGcm9tUGF0aCIsImljb25zIiwibWVudSIsInRyYXlTdGF0ZSIsInRyYXkiLCJxdWl0IiwiZ2V0Q29udGV4dE1lbnUiLCJ1cGRhdGVBdmFpbGFibGUiLCJjb250ZXh0TWVudSIsImxhYmVsIiwidHlwZSIsImNsaWNrIiwiYnVpbGRGcm9tVGVtcGxhdGUiLCJUcmF5TWFuYWdlciIsImNyZWF0ZVRyYXkiLCJjb25zb2xlIiwibG9nIiwic2V0VG9vbFRpcCIsInNldENvbnRleHRNZW51Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFRQTs7Ozs7O0FBRUEsSUFBTUEsVUFBVSxzQkFBWUMsY0FBWixDQUEyQixpQkFBT0MsS0FBUCxDQUFhQyxJQUF4QyxDQUFoQjs7QUFFQSxJQUFJQyxZQUFZLElBQWhCO0FBQ0EsSUFBSUMsT0FBTyxJQUFYOztBQUVBLFNBQVNDLElBQVQsR0FBZ0I7QUFDZCxnQkFBSUEsSUFBSjtBQUNEOztBQUVELFNBQVNDLGNBQVQsQ0FBd0JDLGVBQXhCLEVBQXlDO0FBQ3ZDLE1BQU1DLGNBQWMsQ0FBRSxFQUFDQyxPQUFPLE1BQVIsRUFBZ0JDLE1BQU0sUUFBdEIsRUFBZ0NDLE9BQU9OLElBQXZDLEVBQUYsQ0FBcEI7QUFDQSxTQUFPLGVBQUtPLGlCQUFMLENBQXVCSixXQUF2QixDQUFQO0FBQ0Q7O0FBRUQsSUFBTUssY0FBYztBQUNsQkMsWUFEa0Isd0JBQ0w7QUFDWCxRQUFJVixJQUFKLEVBQVU7QUFDVlcsWUFBUUMsR0FBUixDQUFZLFlBQVosRUFBMEIsaUJBQU9mLEtBQVAsQ0FBYUMsSUFBdkM7QUFDQUUsV0FBTyxtQkFBU0wsT0FBVCxDQUFQO0FBQ0FLLFNBQUthLFVBQUwsQ0FBZ0IsR0FBaEI7QUFDQWIsU0FBS2MsY0FBTCxDQUFvQlosZ0JBQXBCO0FBQ0Q7QUFQaUIsQ0FBcEI7O2tCQVVlTyxXIiwiZmlsZSI6IjEzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQnJvd3NlcldpbmRvdyxcbiAgTWVudSxcbiAgVHJheSxcbiAgYXBwLFxuICBuYXRpdmVJbWFnZSxcbn0gZnJvbSAnZWxlY3Ryb24nO1xuXG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL3NoYXJlZC9jb25maWcnO1xuXG5jb25zdCBtZW51SW1nID0gbmF0aXZlSW1hZ2UuY3JlYXRlRnJvbVBhdGgoY29uZmlnLmljb25zLm1lbnUpO1xuXG5sZXQgdHJheVN0YXRlID0gdHJ1ZTtcbmxldCB0cmF5ID0gbnVsbDtcblxuZnVuY3Rpb24gcXVpdCgpIHtcbiAgYXBwLnF1aXQoKTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29udGV4dE1lbnUodXBkYXRlQXZhaWxhYmxlKSB7XG4gIGNvbnN0IGNvbnRleHRNZW51ID0gWyB7bGFiZWw6ICdRdWl0JywgdHlwZTogJ25vcm1hbCcsIGNsaWNrOiBxdWl0fSwgXTtcbiAgcmV0dXJuIE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUoY29udGV4dE1lbnUpO1xufVxuXG5jb25zdCBUcmF5TWFuYWdlciA9IHtcbiAgY3JlYXRlVHJheSgpIHtcbiAgICBpZiAodHJheSkgcmV0dXJuO1xuICAgIGNvbnNvbGUubG9nKCdUcmF5aGVyZTo6JywgY29uZmlnLmljb25zLm1lbnUpO1xuICAgIHRyYXkgPSBuZXcgVHJheShtZW51SW1nKTtcbiAgICB0cmF5LnNldFRvb2xUaXAoJ2cnKTtcbiAgICB0cmF5LnNldENvbnRleHRNZW51KGdldENvbnRleHRNZW51KCkpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgVHJheU1hbmFnZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tYWluanMvdHJheS5qcyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 14 */
/***/ function(module, exports) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar WATCH_INTERVAL_MS = 999;\n\nvar Watcher = {\n  _interval: null,\n  _register: {},\n\n  watching: true,\n\n  toggleWatch: function toggleWatch() {\n    Watcher.watching = !Watcher.watching;\n    var _iteratorNormalCompletion = true;\n    var _didIteratorError = false;\n    var _iteratorError = undefined;\n\n    try {\n      for (var _iterator = Object.keys(Watcher._register)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n        var key = _step.value;\n\n        var obj = Watcher._register[key];\n        obj.watchToggle(Watcher.watching);\n      }\n    } catch (err) {\n      _didIteratorError = true;\n      _iteratorError = err;\n    } finally {\n      try {\n        if (!_iteratorNormalCompletion && _iterator.return) {\n          _iterator.return();\n        }\n      } finally {\n        if (_didIteratorError) {\n          throw _iteratorError;\n        }\n      }\n    }\n  },\n  registerWatch: function registerWatch(obj) {\n    Watcher._register[obj.name] = obj;\n  },\n  deregisterWatch: function deregisterWatch(obj) {\n    delete Watcher._register[obj.name];\n  },\n  registerAll: function registerAll(cbs) {\n    cbs.forEach(function (cb) {\n      return Watcher.registerWatch(cb);\n    });\n\n    Watcher._interval = setInterval(function () {\n      var _iteratorNormalCompletion2 = true;\n      var _didIteratorError2 = false;\n      var _iteratorError2 = undefined;\n\n      try {\n        for (var _iterator2 = Object.keys(Watcher._register)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {\n          var key = _step2.value;\n\n          var obj = Watcher._register[key];\n          if (Watcher.watching) {\n            try {\n              obj.watchUpdate();\n            } catch (e) {\n              console.warn(obj.name + \" watchUpdate exception:: \" + e);\n            }\n          }\n        }\n      } catch (err) {\n        _didIteratorError2 = true;\n        _iteratorError2 = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion2 && _iterator2.return) {\n            _iterator2.return();\n          }\n        } finally {\n          if (_didIteratorError2) {\n            throw _iteratorError2;\n          }\n        }\n      }\n    }, WATCH_INTERVAL_MS);\n  }\n};\n\nexports.default = Watcher;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluanMvd2F0Y2hlci5qcz9lMGNmIl0sIm5hbWVzIjpbIldBVENIX0lOVEVSVkFMX01TIiwiV2F0Y2hlciIsIl9pbnRlcnZhbCIsIl9yZWdpc3RlciIsIndhdGNoaW5nIiwidG9nZ2xlV2F0Y2giLCJPYmplY3QiLCJrZXlzIiwia2V5Iiwib2JqIiwid2F0Y2hUb2dnbGUiLCJyZWdpc3RlcldhdGNoIiwibmFtZSIsImRlcmVnaXN0ZXJXYXRjaCIsInJlZ2lzdGVyQWxsIiwiY2JzIiwiZm9yRWFjaCIsImNiIiwic2V0SW50ZXJ2YWwiLCJ3YXRjaFVwZGF0ZSIsImUiLCJjb25zb2xlIiwid2FybiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxvQkFBb0IsR0FBMUI7O0FBRUEsSUFBTUMsVUFBVTtBQUNkQyxhQUFXLElBREc7QUFFZEMsYUFBVyxFQUZHOztBQUlkQyxZQUFVLElBSkk7O0FBTWRDLGFBTmMseUJBTUE7QUFDWkosWUFBUUcsUUFBUixHQUFtQixDQUFDSCxRQUFRRyxRQUE1QjtBQURZO0FBQUE7QUFBQTs7QUFBQTtBQUVaLDJCQUFnQkUsT0FBT0MsSUFBUCxDQUFZTixRQUFRRSxTQUFwQixDQUFoQiw4SEFBZ0Q7QUFBQSxZQUF2Q0ssR0FBdUM7O0FBQzlDLFlBQU1DLE1BQU1SLFFBQVFFLFNBQVIsQ0FBa0JLLEdBQWxCLENBQVo7QUFDQUMsWUFBSUMsV0FBSixDQUFnQlQsUUFBUUcsUUFBeEI7QUFDRDtBQUxXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNYixHQVphO0FBYWRPLGVBYmMseUJBYUFGLEdBYkEsRUFhSztBQUNqQlIsWUFBUUUsU0FBUixDQUFrQk0sSUFBSUcsSUFBdEIsSUFBOEJILEdBQTlCO0FBQ0QsR0FmYTtBQWdCZEksaUJBaEJjLDJCQWdCRUosR0FoQkYsRUFnQk87QUFDbkIsV0FBT1IsUUFBUUUsU0FBUixDQUFrQk0sSUFBSUcsSUFBdEIsQ0FBUDtBQUNELEdBbEJhO0FBbUJkRSxhQW5CYyx1QkFtQkZDLEdBbkJFLEVBbUJHO0FBQ2ZBLFFBQUlDLE9BQUosQ0FBWTtBQUFBLGFBQU1mLFFBQVFVLGFBQVIsQ0FBc0JNLEVBQXRCLENBQU47QUFBQSxLQUFaOztBQUVBaEIsWUFBUUMsU0FBUixHQUFvQmdCLFlBQVksWUFBTTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNwQyw4QkFBZ0JaLE9BQU9DLElBQVAsQ0FBWU4sUUFBUUUsU0FBcEIsQ0FBaEIsbUlBQWdEO0FBQUEsY0FBdkNLLEdBQXVDOztBQUM5QyxjQUFNQyxNQUFNUixRQUFRRSxTQUFSLENBQWtCSyxHQUFsQixDQUFaO0FBQ0EsY0FBSVAsUUFBUUcsUUFBWixFQUFzQjtBQUNwQixnQkFBSTtBQUNGSyxrQkFBSVUsV0FBSjtBQUNELGFBRkQsQ0FFRSxPQUFPQyxDQUFQLEVBQVU7QUFDVkMsc0JBQVFDLElBQVIsQ0FBZ0JiLElBQUlHLElBQXBCLGlDQUFvRFEsQ0FBcEQ7QUFDRDtBQUNGO0FBQ0Y7QUFWbUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdyQyxLQVhtQixFQVdqQnBCLGlCQVhpQixDQUFwQjtBQVlEO0FBbENhLENBQWhCOztrQkFxQ2VDLE8iLCJmaWxlIjoiMTQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBXQVRDSF9JTlRFUlZBTF9NUyA9IDk5OTtcblxuY29uc3QgV2F0Y2hlciA9IHtcbiAgX2ludGVydmFsOiBudWxsLFxuICBfcmVnaXN0ZXI6IHsgfSxcblxuICB3YXRjaGluZzogdHJ1ZSxcblxuICB0b2dnbGVXYXRjaCgpIHtcbiAgICBXYXRjaGVyLndhdGNoaW5nID0gIVdhdGNoZXIud2F0Y2hpbmc7XG4gICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKFdhdGNoZXIuX3JlZ2lzdGVyKSkge1xuICAgICAgY29uc3Qgb2JqID0gV2F0Y2hlci5fcmVnaXN0ZXJba2V5XTtcbiAgICAgIG9iai53YXRjaFRvZ2dsZShXYXRjaGVyLndhdGNoaW5nKTtcbiAgICB9XG4gIH0sXG4gIHJlZ2lzdGVyV2F0Y2gob2JqKSB7XG4gICAgV2F0Y2hlci5fcmVnaXN0ZXJbb2JqLm5hbWVdID0gb2JqO1xuICB9LFxuICBkZXJlZ2lzdGVyV2F0Y2gob2JqKSB7XG4gICAgZGVsZXRlIFdhdGNoZXIuX3JlZ2lzdGVyW29iai5uYW1lXTtcbiAgfSxcbiAgcmVnaXN0ZXJBbGwoY2JzKSB7XG4gICAgY2JzLmZvckVhY2goY2IgPT4gV2F0Y2hlci5yZWdpc3RlcldhdGNoKGNiKSk7XG5cbiAgICBXYXRjaGVyLl9pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhXYXRjaGVyLl9yZWdpc3RlcikpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gV2F0Y2hlci5fcmVnaXN0ZXJba2V5XTtcbiAgICAgICAgaWYgKFdhdGNoZXIud2F0Y2hpbmcpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgb2JqLndhdGNoVXBkYXRlKCk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGAke29iai5uYW1lfSB3YXRjaFVwZGF0ZSBleGNlcHRpb246OiAke2V9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgV0FUQ0hfSU5URVJWQUxfTVMpO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgV2F0Y2hlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21haW5qcy93YXRjaGVyLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 15 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nexports.default = getIpcServer;\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar IpcServer = function () {\n  function IpcServer(ipcObject) {\n    var _this = this;\n\n    _classCallCheck(this, IpcServer);\n\n    this.asyncMsgHandler = {};\n    this.syncMsgHandler = {};\n    this.asyncReplyHandler = {};\n\n    this.handler = {\n      asyncMsgHandler: this.asyncMsgHandler,\n      syncMsgHandler: this.syncMsgHandler,\n      asyncReplyHandler: this.asyncReplyHandler\n    };\n\n    this.ipcObject = ipcObject;\n\n    ['async', 'sync'].forEach(function (type) {\n      _this.ipcObject.on(type + 'hronous-message', function (event, msg) {\n        var action = msg.action,\n            data = msg.data;\n\n        var handlerType = type + 'MsgHandler';\n\n        if (_this.handler[handlerType][action]) {\n          _this.handler[handlerType][action](data, event);\n        } else {\n          console.warn(type + ' message not handled:: ', msg);\n        }\n      });\n    });\n\n    this.ipcObject.on('pingx', function (event, msg) {\n      console.log('ping: ', event, msg);\n      var action = msg.action,\n          data = msg.data;\n\n      if (_this.handler['asyncReplyHandler'][action]) {\n        _this.handler[handlerType][action](data, event);\n      } else {\n        console.warn('async reply not handled:: ', msg);\n      }\n    });\n  }\n\n  _createClass(IpcServer, [{\n    key: 'register',\n    value: function register(type, action, fn) {\n      var handlerType = type + 'MsgHandler';\n      this.handler[handlerType][action] = fn;\n    }\n  }, {\n    key: 'deregister',\n    value: function deregister(type, action) {\n      var handlerType = type + 'MsgHandler';\n      delete this.handler[handlerType][action];\n    }\n  }, {\n    key: 'registerAsyncReply',\n    value: function registerAsyncReply(action, fn) {\n      this.handler['asyncReplyHandler'][action] = fn;\n    }\n  }, {\n    key: 'deregisterAysncReply',\n    value: function deregisterAysncReply(action) {\n      delete this.handler['asyncReplyHandler'][action];\n    }\n  }, {\n    key: 'send',\n    value: function send(type, msg) {\n      console.info('Sending: ', type, msg);\n      this.ipcObject.send(type, msg);\n    }\n  }]);\n\n  return IpcServer;\n}();\n\nfunction getIpcServer(ipcObject) {\n  return new IpcServer(ipcObject);\n}//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zaGFyZWQvZ2V0SXBjU2VydmVyLmpzPzQ4ZmIiXSwibmFtZXMiOlsiZ2V0SXBjU2VydmVyIiwiSXBjU2VydmVyIiwiaXBjT2JqZWN0IiwiYXN5bmNNc2dIYW5kbGVyIiwic3luY01zZ0hhbmRsZXIiLCJhc3luY1JlcGx5SGFuZGxlciIsImhhbmRsZXIiLCJmb3JFYWNoIiwib24iLCJ0eXBlIiwiZXZlbnQiLCJtc2ciLCJhY3Rpb24iLCJkYXRhIiwiaGFuZGxlclR5cGUiLCJjb25zb2xlIiwid2FybiIsImxvZyIsImZuIiwiaW5mbyIsInNlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQThEd0JBLFk7Ozs7SUE5RGxCQyxTO0FBQ0oscUJBQVlDLFNBQVosRUFBdUI7QUFBQTs7QUFBQTs7QUFDckIsU0FBS0MsZUFBTCxHQUF1QixFQUF2QjtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsRUFBdEI7QUFDQSxTQUFLQyxpQkFBTCxHQUF5QixFQUF6Qjs7QUFFQSxTQUFLQyxPQUFMLEdBQWU7QUFDYkgsdUJBQWlCLEtBQUtBLGVBRFQ7QUFFYkMsc0JBQWdCLEtBQUtBLGNBRlI7QUFHYkMseUJBQW1CLEtBQUtBO0FBSFgsS0FBZjs7QUFNQSxTQUFLSCxTQUFMLEdBQWlCQSxTQUFqQjs7QUFFQSxLQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCSyxPQUFsQixDQUEwQixnQkFBUTtBQUNoQyxZQUFLTCxTQUFMLENBQWVNLEVBQWYsQ0FBcUJDLElBQXJCLHNCQUE0QyxVQUFDQyxLQUFELEVBQVFDLEdBQVIsRUFBZ0I7QUFBQSxZQUNsREMsTUFEa0QsR0FDakNELEdBRGlDLENBQ2xEQyxNQURrRDtBQUFBLFlBQzFDQyxJQUQwQyxHQUNqQ0YsR0FEaUMsQ0FDMUNFLElBRDBDOztBQUUxRCxZQUFNQyxjQUFpQkwsSUFBakIsZUFBTjs7QUFFQSxZQUFJLE1BQUtILE9BQUwsQ0FBYVEsV0FBYixFQUEwQkYsTUFBMUIsQ0FBSixFQUF1QztBQUNyQyxnQkFBS04sT0FBTCxDQUFhUSxXQUFiLEVBQTBCRixNQUExQixFQUFrQ0MsSUFBbEMsRUFBd0NILEtBQXhDO0FBQ0QsU0FGRCxNQUVPO0FBQ0xLLGtCQUFRQyxJQUFSLENBQWdCUCxJQUFoQiw4QkFBK0NFLEdBQS9DO0FBQ0Q7QUFDRixPQVREO0FBVUQsS0FYRDs7QUFhQSxTQUFLVCxTQUFMLENBQWVNLEVBQWYsQ0FBa0IsT0FBbEIsRUFBMkIsVUFBQ0UsS0FBRCxFQUFRQyxHQUFSLEVBQWdCO0FBQ3pDSSxjQUFRRSxHQUFSLENBQVksUUFBWixFQUFzQlAsS0FBdEIsRUFBNkJDLEdBQTdCO0FBRHlDLFVBRWpDQyxNQUZpQyxHQUVoQkQsR0FGZ0IsQ0FFakNDLE1BRmlDO0FBQUEsVUFFekJDLElBRnlCLEdBRWhCRixHQUZnQixDQUV6QkUsSUFGeUI7O0FBR3pDLFVBQUksTUFBS1AsT0FBTCxDQUFhLG1CQUFiLEVBQWtDTSxNQUFsQyxDQUFKLEVBQStDO0FBQzdDLGNBQUtOLE9BQUwsQ0FBYVEsV0FBYixFQUEwQkYsTUFBMUIsRUFBa0NDLElBQWxDLEVBQXdDSCxLQUF4QztBQUNELE9BRkQsTUFFTztBQUNMSyxnQkFBUUMsSUFBUixDQUFhLDRCQUFiLEVBQTJDTCxHQUEzQztBQUNEO0FBQ0YsS0FSRDtBQVNEOzs7OzZCQUVRRixJLEVBQU1HLE0sRUFBUU0sRSxFQUFJO0FBQ3pCLFVBQU1KLGNBQWlCTCxJQUFqQixlQUFOO0FBQ0EsV0FBS0gsT0FBTCxDQUFhUSxXQUFiLEVBQTBCRixNQUExQixJQUFvQ00sRUFBcEM7QUFDRDs7OytCQUVVVCxJLEVBQU1HLE0sRUFBUTtBQUN2QixVQUFNRSxjQUFpQkwsSUFBakIsZUFBTjtBQUNBLGFBQU8sS0FBS0gsT0FBTCxDQUFhUSxXQUFiLEVBQTBCRixNQUExQixDQUFQO0FBQ0Q7Ozt1Q0FFa0JBLE0sRUFBUU0sRSxFQUFJO0FBQzdCLFdBQUtaLE9BQUwsQ0FBYSxtQkFBYixFQUFrQ00sTUFBbEMsSUFBNENNLEVBQTVDO0FBQ0Q7Ozt5Q0FFb0JOLE0sRUFBUTtBQUMzQixhQUFPLEtBQUtOLE9BQUwsQ0FBYSxtQkFBYixFQUFrQ00sTUFBbEMsQ0FBUDtBQUNEOzs7eUJBRUlILEksRUFBTUUsRyxFQUFLO0FBQ2RJLGNBQVFJLElBQVIsQ0FBYSxXQUFiLEVBQTBCVixJQUExQixFQUFnQ0UsR0FBaEM7QUFDQSxXQUFLVCxTQUFMLENBQWVrQixJQUFmLENBQW9CWCxJQUFwQixFQUEwQkUsR0FBMUI7QUFDRDs7Ozs7O0FBR1ksU0FBU1gsWUFBVCxDQUFzQkUsU0FBdEIsRUFBaUM7QUFDOUMsU0FBTyxJQUFJRCxTQUFKLENBQWNDLFNBQWQsQ0FBUDtBQUNEIiwiZmlsZSI6IjE1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSXBjU2VydmVyIHtcbiAgY29uc3RydWN0b3IoaXBjT2JqZWN0KSB7XG4gICAgdGhpcy5hc3luY01zZ0hhbmRsZXIgPSB7fTtcbiAgICB0aGlzLnN5bmNNc2dIYW5kbGVyID0ge307XG4gICAgdGhpcy5hc3luY1JlcGx5SGFuZGxlciA9IHt9O1xuXG4gICAgdGhpcy5oYW5kbGVyID0ge1xuICAgICAgYXN5bmNNc2dIYW5kbGVyOiB0aGlzLmFzeW5jTXNnSGFuZGxlcixcbiAgICAgIHN5bmNNc2dIYW5kbGVyOiB0aGlzLnN5bmNNc2dIYW5kbGVyLFxuICAgICAgYXN5bmNSZXBseUhhbmRsZXI6IHRoaXMuYXN5bmNSZXBseUhhbmRsZXIsXG4gICAgfTtcblxuICAgIHRoaXMuaXBjT2JqZWN0ID0gaXBjT2JqZWN0O1xuXG4gICAgWydhc3luYycsICdzeW5jJ10uZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgIHRoaXMuaXBjT2JqZWN0Lm9uKGAke3R5cGV9aHJvbm91cy1tZXNzYWdlYCwgKGV2ZW50LCBtc2cpID0+IHtcbiAgICAgICAgY29uc3QgeyBhY3Rpb24sIGRhdGEgfSA9IG1zZztcbiAgICAgICAgY29uc3QgaGFuZGxlclR5cGUgPSBgJHt0eXBlfU1zZ0hhbmRsZXJgO1xuXG4gICAgICAgIGlmICh0aGlzLmhhbmRsZXJbaGFuZGxlclR5cGVdW2FjdGlvbl0pIHtcbiAgICAgICAgICB0aGlzLmhhbmRsZXJbaGFuZGxlclR5cGVdW2FjdGlvbl0oZGF0YSwgZXZlbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUud2FybihgJHt0eXBlfSBtZXNzYWdlIG5vdCBoYW5kbGVkOjogYCwgbXNnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmlwY09iamVjdC5vbigncGluZ3gnLCAoZXZlbnQsIG1zZykgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3Bpbmc6ICcsIGV2ZW50LCBtc2cpO1xuICAgICAgY29uc3QgeyBhY3Rpb24sIGRhdGEgfSA9IG1zZztcbiAgICAgIGlmICh0aGlzLmhhbmRsZXJbJ2FzeW5jUmVwbHlIYW5kbGVyJ11bYWN0aW9uXSkge1xuICAgICAgICB0aGlzLmhhbmRsZXJbaGFuZGxlclR5cGVdW2FjdGlvbl0oZGF0YSwgZXZlbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdhc3luYyByZXBseSBub3QgaGFuZGxlZDo6ICcsIG1zZyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZWdpc3Rlcih0eXBlLCBhY3Rpb24sIGZuKSB7XG4gICAgY29uc3QgaGFuZGxlclR5cGUgPSBgJHt0eXBlfU1zZ0hhbmRsZXJgO1xuICAgIHRoaXMuaGFuZGxlcltoYW5kbGVyVHlwZV1bYWN0aW9uXSA9IGZuO1xuICB9XG5cbiAgZGVyZWdpc3Rlcih0eXBlLCBhY3Rpb24pIHtcbiAgICBjb25zdCBoYW5kbGVyVHlwZSA9IGAke3R5cGV9TXNnSGFuZGxlcmA7XG4gICAgZGVsZXRlIHRoaXMuaGFuZGxlcltoYW5kbGVyVHlwZV1bYWN0aW9uXTtcbiAgfVxuXG4gIHJlZ2lzdGVyQXN5bmNSZXBseShhY3Rpb24sIGZuKSB7XG4gICAgdGhpcy5oYW5kbGVyWydhc3luY1JlcGx5SGFuZGxlciddW2FjdGlvbl0gPSBmbjtcbiAgfVxuXG4gIGRlcmVnaXN0ZXJBeXNuY1JlcGx5KGFjdGlvbikge1xuICAgIGRlbGV0ZSB0aGlzLmhhbmRsZXJbJ2FzeW5jUmVwbHlIYW5kbGVyJ11bYWN0aW9uXTtcbiAgfVxuXG4gIHNlbmQodHlwZSwgbXNnKSB7XG4gICAgY29uc29sZS5pbmZvKCdTZW5kaW5nOiAnLCB0eXBlLCBtc2cpO1xuICAgIHRoaXMuaXBjT2JqZWN0LnNlbmQodHlwZSwgbXNnKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRJcGNTZXJ2ZXIoaXBjT2JqZWN0KSB7XG4gIHJldHVybiBuZXcgSXBjU2VydmVyKGlwY09iamVjdCk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zaGFyZWQvZ2V0SXBjU2VydmVyLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ },
/* 16 */
/***/ function(module, exports) {

	eval("module.exports = require(\"babel-polyfill\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiYWJlbC1wb2x5ZmlsbFwiP2QwZDYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMTYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiYWJlbC1wb2x5ZmlsbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJhYmVsLXBvbHlmaWxsXCJcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 17 */
/***/ function(module, exports) {

	eval("module.exports = require(\"bluebird\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJibHVlYmlyZFwiP2ZiM2UiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMTcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImJsdWViaXJkXCJcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 18 */
/***/ function(module, exports) {

	eval("module.exports = require(\"child_process\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjaGlsZF9wcm9jZXNzXCI/NDMwOCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiIxOC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNoaWxkX3Byb2Nlc3NcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJjaGlsZF9wcm9jZXNzXCJcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 19 */
/***/ function(module, exports) {

	eval("module.exports = require(\"fs-extra\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmcy1leHRyYVwiPzdjYTYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiMTkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmcy1leHRyYVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImZzLWV4dHJhXCJcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 20 */
/***/ function(module, exports) {

	eval("module.exports = require(\"gfycat-sdk\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJnZnljYXQtc2RrXCI/Y2M5ZCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiIyMC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdmeWNhdC1zZGtcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJnZnljYXQtc2RrXCJcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ },
/* 21 */
/***/ function(module, exports) {

	eval("module.exports = require(\"node-fetch\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJub2RlLWZldGNoXCI/ZTkwNSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiIyMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5vZGUtZmV0Y2hcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJub2RlLWZldGNoXCJcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ }
/******/ ]);