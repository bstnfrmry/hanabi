module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ "./node_modules/next/app.js":
/*!**********************************!*\
  !*** ./node_modules/next/app.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./dist/pages/_app */ "./node_modules/next/dist/pages/_app.js")


/***/ }),

/***/ "./node_modules/next/dist/next-server/lib/utils.js":
/*!*********************************************************!*\
  !*** ./node_modules/next/dist/next-server/lib/utils.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const url_1 = __webpack_require__(/*! url */ "url");
/**
 * Utils
 */


function execOnce(fn) {
  let used = false;
  let result = null;
  return (...args) => {
    if (!used) {
      used = true;
      result = fn.apply(this, args);
    }

    return result;
  };
}

exports.execOnce = execOnce;

function getLocationOrigin() {
  const {
    protocol,
    hostname,
    port
  } = window.location;
  return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}

exports.getLocationOrigin = getLocationOrigin;

function getURL() {
  const {
    href
  } = window.location;
  const origin = getLocationOrigin();
  return href.substring(origin.length);
}

exports.getURL = getURL;

function getDisplayName(Component) {
  return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}

exports.getDisplayName = getDisplayName;

function isResSent(res) {
  return res.finished || res.headersSent;
}

exports.isResSent = isResSent;

async function loadGetInitialProps(App, ctx) {
  var _a;

  if (true) {
    if ((_a = App.prototype) === null || _a === void 0 ? void 0 : _a.getInitialProps) {
      const message = `"${getDisplayName(App)}.getInitialProps()" is defined as an instance method - visit https://err.sh/zeit/next.js/get-initial-props-as-an-instance-method for more information.`;
      throw new Error(message);
    }
  } // when called from _app `ctx` is nested in `ctx`


  const res = ctx.res || ctx.ctx && ctx.ctx.res;

  if (!App.getInitialProps) {
    if (ctx.ctx && ctx.Component) {
      // @ts-ignore pageProps default
      return {
        pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
      };
    }

    return {};
  }

  const props = await App.getInitialProps(ctx);

  if (res && isResSent(res)) {
    return props;
  }

  if (!props) {
    const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
    throw new Error(message);
  }

  if (true) {
    if (Object.keys(props).length === 0 && !ctx.ctx) {
      console.warn(`${getDisplayName(App)} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://err.sh/zeit/next.js/empty-object-getInitialProps`);
    }
  }

  return props;
}

exports.loadGetInitialProps = loadGetInitialProps;
exports.urlObjectKeys = ['auth', 'hash', 'host', 'hostname', 'href', 'path', 'pathname', 'port', 'protocol', 'query', 'search', 'slashes'];

function formatWithValidation(url, options) {
  if (true) {
    if (url !== null && typeof url === 'object') {
      Object.keys(url).forEach(key => {
        if (exports.urlObjectKeys.indexOf(key) === -1) {
          console.warn(`Unknown key passed via urlObject into url.format: ${key}`);
        }
      });
    }
  }

  return url_1.format(url, options);
}

exports.formatWithValidation = formatWithValidation;
exports.SP = typeof performance !== 'undefined';
exports.ST = exports.SP && typeof performance.mark === 'function' && typeof performance.measure === 'function';

/***/ }),

/***/ "./node_modules/next/dist/pages/_app.js":
/*!**********************************************!*\
  !*** ./node_modules/next/dist/pages/_app.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js");

exports.__esModule = true;
exports.Container = Container;
exports.createUrl = createUrl;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _utils = __webpack_require__(/*! ../next-server/lib/utils */ "./node_modules/next/dist/next-server/lib/utils.js");

exports.AppInitialProps = _utils.AppInitialProps;
/**
* `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.
* This allows for keeping state between navigation, custom error handling, injecting additional data.
*/

async function appGetInitialProps(_ref) {
  var {
    Component,
    ctx
  } = _ref;
  var pageProps = await (0, _utils.loadGetInitialProps)(Component, ctx);
  return {
    pageProps
  };
}

class App extends _react.default.Component {
  // Kept here for backwards compatibility.
  // When someone ended App they could call `super.componentDidCatch`.
  // @deprecated This method is no longer needed. Errors are caught at the top level
  componentDidCatch(error, _errorInfo) {
    throw error;
  }

  render() {
    var {
      router,
      Component,
      pageProps,
      __N_SSG,
      __N_SSP
    } = this.props;
    return _react.default.createElement(Component, Object.assign({}, pageProps, // we don't add the legacy URL prop if it's using non-legacy
    // methods like getStaticProps and getServerSideProps
    !(__N_SSG || __N_SSP) ? {
      url: createUrl(router)
    } : {}));
  }

}

exports.default = App;
App.origGetInitialProps = appGetInitialProps;
App.getInitialProps = appGetInitialProps;
var warnContainer;
var warnUrl;

if (true) {
  warnContainer = (0, _utils.execOnce)(() => {
    console.warn("Warning: the `Container` in `_app` has been deprecated and should be removed. https://err.sh/zeit/next.js/app-container-deprecated");
  });
  warnUrl = (0, _utils.execOnce)(() => {
    console.error("Warning: the 'url' property is deprecated. https://err.sh/zeit/next.js/url-deprecated");
  });
} // @deprecated noop for now until removal


function Container(p) {
  if (true) warnContainer();
  return p.children;
}

function createUrl(router) {
  // This is to make sure we don't references the router object at call time
  var {
    pathname,
    asPath,
    query
  } = router;
  return {
    get query() {
      if (true) warnUrl();
      return query;
    },

    get pathname() {
      if (true) warnUrl();
      return pathname;
    },

    get asPath() {
      if (true) warnUrl();
      return asPath;
    },

    back: () => {
      if (true) warnUrl();
      router.back();
    },
    push: (url, as) => {
      if (true) warnUrl();
      return router.push(url, as);
    },
    pushTo: (href, as) => {
      if (true) warnUrl();
      var pushRoute = as ? href : '';
      var pushUrl = as || href;
      return router.push(pushRoute, pushUrl);
    },
    replace: (url, as) => {
      if (true) warnUrl();
      return router.replace(url, as);
    },
    replaceTo: (href, as) => {
      if (true) warnUrl();
      var replaceRoute = as ? href : '';
      var replaceUrl = as || href;
      return router.replace(replaceRoute, replaceUrl);
    }
  };
}

/***/ }),

/***/ "./src/components/ui/txt.tsx":
/*!***********************************!*\
  !*** ./src/components/ui/txt.tsx ***!
  \***********************************/
/*! exports provided: TxtSize, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TxtSize", function() { return TxtSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Txt; });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "classnames");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
var _jsxFileName = "/Users/sarahmamy/Workspace/hanabi/src/components/ui/txt.tsx";
var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



let TxtSize;

(function (TxtSize) {
  TxtSize["SMALL"] = "small";
  TxtSize["MEDIUM"] = "medium";
  TxtSize["LARGE"] = "large";
})(TxtSize || (TxtSize = {}));

const TxtSizes = {
  [TxtSize.SMALL]: "f6 f4-l",
  [TxtSize.MEDIUM]: "f4 f3-l",
  [TxtSize.LARGE]: "ttu f2 f1-l tracked"
};
function Txt(props) {
  const {
    size = TxtSize.SMALL,
    italic = false,
    uppercase = false,
    multiline = false,
    value: content,
    children,
    className
  } = props,
        attributes = _objectWithoutProperties(props, ["size", "italic", "uppercase", "multiline", "value", "children", "className"]);

  return __jsx("span", _extends({
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(TxtSizes[size], {
      ttu: uppercase
    }, {
      i: italic
    }, {
      "pre-line": multiline
    }, className)
  }, attributes, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }), content !== undefined ? content : children);
}

/***/ }),

/***/ "./src/game/state.ts":
/*!***************************!*\
  !*** ./src/game/state.ts ***!
  \***************************/
/*! exports provided: GameMode, IGameHintsLevel, IGameStatus, IColor, IHintLevel, fillEmptyValues */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameMode", function() { return GameMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IGameHintsLevel", function() { return IGameHintsLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IGameStatus", function() { return IGameStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IColor", function() { return IColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IHintLevel", function() { return IHintLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fillEmptyValues", function() { return fillEmptyValues; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

/**
 * game state
 */

let GameMode;

(function (GameMode) {
  GameMode["NETWORK"] = "network";
  GameMode["PASS_AND_PLAY"] = "pass_and_play";
})(GameMode || (GameMode = {}));

let IGameHintsLevel;

(function (IGameHintsLevel) {
  IGameHintsLevel["ALL"] = "all";
  IGameHintsLevel["DIRECT"] = "direct";
  IGameHintsLevel["NONE"] = "none";
})(IGameHintsLevel || (IGameHintsLevel = {}));

let IGameStatus;

(function (IGameStatus) {
  IGameStatus["LOBBY"] = "lobby";
  IGameStatus["ONGOING"] = "ongoing";
  IGameStatus["OVER"] = "over";
})(IGameStatus || (IGameStatus = {}));

let IColor;

(function (IColor) {
  IColor["RED"] = "red";
  IColor["GREEN"] = "green";
  IColor["BLUE"] = "blue";
  IColor["WHITE"] = "white";
  IColor["YELLOW"] = "yellow";
  IColor["MULTICOLOR"] = "multicolor";
})(IColor || (IColor = {}));

let IHintLevel; // an array of 2 (direct hint), 1 (still possible), or 0 (impossible)
// e.g. a color hint onto an card turns all but one values to 0, and one value to 2.
// a color hint onto a card give all the other cards in the hand a 0 for that color.
// it's something public, i.e. information that has been given
// to all players

(function (IHintLevel) {
  IHintLevel[IHintLevel["IMPOSSIBLE"] = 0] = "IMPOSSIBLE";
  IHintLevel[IHintLevel["POSSIBLE"] = 1] = "POSSIBLE";
  IHintLevel[IHintLevel["SURE"] = 2] = "SURE";
})(IHintLevel || (IHintLevel = {}));

// empty arrays are returned as null in Firebase, so we fill
// them back to avoid having to type check everywhere
function fillEmptyValues(state) {
  return Object(lodash__WEBPACK_IMPORTED_MODULE_0__["defaults"])(state, {
    playedCards: [],
    drawPile: [],
    discardPile: [],
    players: (state.players || []).map(player => Object(lodash__WEBPACK_IMPORTED_MODULE_0__["defaults"])(player, {
      hand: []
    })),
    turnsHistory: [],
    history: [],
    reactions: []
  });
}

/***/ }),

/***/ "./src/hooks/connectivity.ts":
/*!***********************************!*\
  !*** ./src/hooks/connectivity.ts ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return useConnectivity; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function useConnectivity() {
  const {
    0: online,
    1: setOnline
  } = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(true);

  const onOnline = () => setOnline(true);

  const onOffline = () => setOnline(false);

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);
  return online;
}

/***/ }),

/***/ "./src/hooks/firebase.ts":
/*!*******************************!*\
  !*** ./src/hooks/firebase.ts ***!
  \*******************************/
/*! exports provided: setupFirebase, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setupFirebase", function() { return setupFirebase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FirebaseNetwork; });
/* harmony import */ var firebase_database__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/database */ "firebase/database");
/* harmony import */ var firebase_database__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_database__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/app */ "firebase/app");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _game_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../game/state */ "./src/game/state.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




function setupFirebase() {
  if (!firebase_app__WEBPACK_IMPORTED_MODULE_1___default.a.apps.length) {
    firebase_app__WEBPACK_IMPORTED_MODULE_1___default.a.initializeApp(_objectSpread({},  true && {
      databaseURL: "https://hanabi-df790.firebaseio.com"
    }, {},  true && {
      apiKey: "AIzaSyDeWR7W7kmxe4K7jGx7hqe92zJ4w5xl_DY",
      authDomain: "hanabi-df790.firebaseapp.com",
      databaseURL: "https://hanabi-df790.firebaseio.com",
      projectId: "hanabi-df790",
      storageBucket: "",
      messagingSenderId: "681034034410",
      appId: "1:681034034410:web:c90a77231f6b9f36"
    }));
  }

  return firebase_app__WEBPACK_IMPORTED_MODULE_1___default.a.database();
}

function gameIsPublic(game) {
  return !game.options.private && game.status === _game_state__WEBPACK_IMPORTED_MODULE_2__["IGameStatus"].LOBBY && game.players.length && game.players.length < game.options.playersCount;
}

class FirebaseNetwork {
  constructor(db) {
    _defineProperty(this, "db", void 0);

    this.db = db || setupFirebase();
  }

  subscribeToPublicGames(callback) {
    const ref = this.db.ref("/games") // Only games created less than 10 minutes ago
    .orderByChild("createdAt").startAt(Date.now() - 10 * 60 * 1000);
    ref.on("value", event => {
      const games = Object.values(event.val() || {}).map(_game_state__WEBPACK_IMPORTED_MODULE_2__["fillEmptyValues"]) // Game is public
      .filter(gameIsPublic);
      callback(games);
    });
    return () => ref.off();
  }

  subscribeToGame(gameId, callback) {
    const ref = this.db.ref(`/games/${gameId}`);
    ref.on("value", event => {
      callback(Object(_game_state__WEBPACK_IMPORTED_MODULE_2__["fillEmptyValues"])(event.val()));
    });
    const localGame = JSON.parse(localStorage.getItem(`game.${gameId}`));

    if (localGame) {
      callback(localGame);
    }

    return () => ref.off();
  }

  async updateGame(game) {
    localStorage.setItem(`game.${game.id}`, JSON.stringify(game));
    await this.db.ref(`/games/${game.id}`).set(game);
  }

  async setReaction(game, player, reaction) {
    await this.db.ref(`/games/${game.id}/players/${player.index}/reaction`).set(reaction);
  }

  async setNotification(game, player, notified) {
    await this.db.ref(`/games/${game.id}/players/${player.index}/notified`).set(notified);
  }

}

/***/ }),

/***/ "./src/hooks/network.ts":
/*!******************************!*\
  !*** ./src/hooks/network.ts ***!
  \******************************/
/*! exports provided: NetworkContext, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkContext", function() { return NetworkContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return useNetwork; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const NetworkContext = react__WEBPACK_IMPORTED_MODULE_0___default.a.createContext(null);
function useNetwork() {
  return Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(NetworkContext);
}

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return App; });
/* harmony import */ var _styles_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/style.css */ "./src/styles/style.css");
/* harmony import */ var _styles_style_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_styles_style_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/browser */ "@sentry/browser");
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_sentry_browser__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/app */ "./node_modules/next/app.js");
/* harmony import */ var next_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/head */ "next/head");
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_ui_txt__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/ui/txt */ "./src/components/ui/txt.tsx");
/* harmony import */ var _hooks_connectivity__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../hooks/connectivity */ "./src/hooks/connectivity.ts");
/* harmony import */ var _hooks_firebase__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../hooks/firebase */ "./src/hooks/firebase.ts");
/* harmony import */ var _hooks_network__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../hooks/network */ "./src/hooks/network.ts");
var _jsxFileName = "/Users/sarahmamy/Workspace/hanabi/src/pages/_app.tsx";
var __jsx = react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement;









_sentry_browser__WEBPACK_IMPORTED_MODULE_1__["init"]({
  dsn: process.env.SENTRY_DSN,
  environment: "development"
});
class App extends next_app__WEBPACK_IMPORTED_MODULE_2___default.a {
  componentDidCatch(error, errorInfo) {
    _sentry_browser__WEBPACK_IMPORTED_MODULE_1__["withScope"](scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      _sentry_browser__WEBPACK_IMPORTED_MODULE_1__["captureException"](error);
    });
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    return __jsx(Hanabi, {
      Component: this.props.Component,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 32
      },
      __self: this
    });
  }

}

function Hanabi(props) {
  const {
    Component
  } = props;
  const {
    0: showOffline,
    1: setShowOffline
  } = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(true);
  const online = Object(_hooks_connectivity__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const network = new _hooks_firebase__WEBPACK_IMPORTED_MODULE_7__["default"](Object(_hooks_firebase__WEBPACK_IMPORTED_MODULE_7__["setupFirebase"])());
  return __jsx(react__WEBPACK_IMPORTED_MODULE_4___default.a.Fragment, null, __jsx(next_head__WEBPACK_IMPORTED_MODULE_3___default.a, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, __jsx("link", {
    href: "/static/favicon.ico",
    rel: "shortcut icon",
    type: "image/x-icon",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }), __jsx("link", {
    href: "/static/hanabi-192.png",
    rel: "apple-touch-icon",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }), __jsx("link", {
    href: "/static/manifest.json",
    rel: "manifest",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }), __jsx("link", {
    href: "/static/hanabi-192.png",
    rel: "apple-touch-icon",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }), __jsx("title", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, "Hanabi"), __jsx("meta", {
    content: "#00153f",
    name: "theme-color",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  }), __jsx("meta", {
    content: "Play the hanabi card game online.",
    name: "Description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  })), __jsx(_hooks_network__WEBPACK_IMPORTED_MODULE_8__["NetworkContext"].Provider, {
    value: network,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 60
    },
    __self: this
  }, __jsx("div", {
    className: "aspect-ratio--object",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61
    },
    __self: this
  }, !online && showOffline && __jsx("div", {
    className: "relative flex items-center justify-center bg-red shadow-4 b--red ba pa2 z-99",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: this
  }, __jsx(_components_ui_txt__WEBPACK_IMPORTED_MODULE_5__["default"], {
    uppercase: true,
    size: _components_ui_txt__WEBPACK_IMPORTED_MODULE_5__["TxtSize"].MEDIUM,
    value: "You are offline",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 65
    },
    __self: this
  }), __jsx("a", {
    className: "absolute right-1",
    onClick: () => setShowOffline(false),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }, __jsx(_components_ui_txt__WEBPACK_IMPORTED_MODULE_5__["default"], {
    value: "\xD7",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    },
    __self: this
  }))), __jsx(Component, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 75
    },
    __self: this
  }))));
}

/***/ }),

/***/ "./src/styles/style.css":
/*!******************************!*\
  !*** ./src/styles/style.css ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ 0:
/*!*****************************************!*\
  !*** multi private-next-pages/_app.tsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! private-next-pages/_app.tsx */"./src/pages/_app.tsx");


/***/ }),

/***/ "@sentry/browser":
/*!**********************************!*\
  !*** external "@sentry/browser" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@sentry/browser");

/***/ }),

/***/ "classnames":
/*!*****************************!*\
  !*** external "classnames" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("classnames");

/***/ }),

/***/ "firebase/app":
/*!*******************************!*\
  !*** external "firebase/app" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("firebase/app");

/***/ }),

/***/ "firebase/database":
/*!************************************!*\
  !*** external "firebase/database" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("firebase/database");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ })

/******/ });
//# sourceMappingURL=_app.js.map