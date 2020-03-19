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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/components/rules.tsx":
/*!**********************************!*\
  !*** ./src/components/rules.tsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Rules; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui/button */ "./src/components/ui/button.tsx");
/* harmony import */ var _ui_txt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/txt */ "./src/components/ui/txt.tsx");
var _jsxFileName = "/Users/sarahmamy/Workspace/hanabi/src/components/rules.tsx";
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;




const Title = props => __jsx(_ui_txt__WEBPACK_IMPORTED_MODULE_2__["default"], {
  className: "txt-yellow mt3",
  size: _ui_txt__WEBPACK_IMPORTED_MODULE_2__["TxtSize"].MEDIUM,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 11
  },
  __self: undefined
}, props.children);

const Subtitle = props => __jsx(_ui_txt__WEBPACK_IMPORTED_MODULE_2__["default"], {
  size: _ui_txt__WEBPACK_IMPORTED_MODULE_2__["TxtSize"].MEDIUM,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 17
  },
  __self: undefined
}, props.children);

const Paragraph = props => __jsx(_ui_txt__WEBPACK_IMPORTED_MODULE_2__["default"], {
  className: "mv2",
  __source: {
    fileName: _jsxFileName,
    lineNumber: 21
  },
  __self: undefined
}, props.children);

const GrayTxt = props => __jsx("span", {
  className: "gray",
  __source: {
    fileName: _jsxFileName,
    lineNumber: 25
  },
  __self: undefined
}, props.children);

function Rules(props) {
  const {
    setShowRules
  } = props;
  return __jsx("div", {
    className: "absolute bg-main-dark z-9999 aspect-ratio--object overflow-y-scroll flex justify-center pa4 relative tj lh-copy",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, __jsx("div", {
    className: "w-75-l",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, __jsx(_ui_button__WEBPACK_IMPORTED_MODULE_1__["default"], {
    className: "absolute left-2 top-1",
    size: _ui_button__WEBPACK_IMPORTED_MODULE_1__["ButtonSize"].MEDIUM,
    text: "<",
    onClick: () => setShowRules(false),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }), __jsx("img", {
    alt: "Hanabi cards game online",
    className: "absolute top-0 right-0 mw4 ma4 o-50",
    src: "/static/hanabi.png",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }), __jsx("div", {
    className: "flex flex-column mb5",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }, __jsx(_ui_txt__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: "w-100 tc mt2 dib",
    size: _ui_txt__WEBPACK_IMPORTED_MODULE_2__["TxtSize"].LARGE,
    value: "Hanabi",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: this
  }), __jsx(Title, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, "Objective"), __jsx(Paragraph, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }, "Hanabi is a card game created by Antoine Bauza. It's cooperative, which means that players are not against each other but assemble to reach a common goal. They incarn here distracted pyrotechnists who - by inattention - mixed their powder, wicks and rockets for a large fireworks display. The show will begin soon and the situation is a bit chaotic. They will need to help each other to prevent the show turning to disaster."), __jsx(Paragraph, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, "The goal of the pyrotechnics team is to build 5 fireworks, one of each color (white, red, blue, yellow, green) by combining increasing value cards (1,2,3,4,5) of the same color.", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    },
    __self: this
  }), "With the multicolor option, you need to build a 6th firework."), __jsx(Title, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 76
    },
    __self: this
  }, "Setup"), __jsx(Paragraph, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 78
    },
    __self: this
  }, "The app sets up everything for you, which is handy \uD83D\uDE09. At the beginning of a game, you will have 8 blue tokens - your hints - and 3 red tokens - your strike tokens.", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 82
    },
    __self: this
  }), "The deck is composed of 50 cards, 10 of each color", " ", __jsx(GrayTxt, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 84
    },
    __self: this
  }, "with numbers 1, 1, 1, 2, 2, 3, 3, 4, 4, 5"), ". The multicolor option adds 5 multicolor cards", " ", __jsx(GrayTxt, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 86
    },
    __self: this
  }, "with numbers 1, 2, 3, 4, 5"), ".", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 87
    },
    __self: this
  }), "\xB7 In a 2 or 3 player game, each player will be dealt 5 cards", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88
    },
    __self: this
  }), "\xB7 In a 4 or 5 player game, each player will be dealt 4 cards"), __jsx(Paragraph, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 91
    },
    __self: this
  }, "As you will see, players are not allowed to look at their own cards!"), __jsx(Title, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 95
    },
    __self: this
  }, "Playing the game"), __jsx(Paragraph, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 97
    },
    __self: this
  }, "On each player's turn, they take one (and only one) of the three following actions. You are not allowed to pass.", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: this
  }), "1. Give information to another player.", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 102
    },
    __self: this
  }), "2. Discard a card.", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 104
    },
    __self: this
  }), "3. Play a card", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 106
    },
    __self: this
  }), "Players are not allowed to give hints or suggestions on other player's turns!"), __jsx(Subtitle, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 111
    },
    __self: this
  }, "1. Give information"), __jsx(Paragraph, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 113
    },
    __self: this
  }, "When you give information, it will remove a blue token. Note: If you have no more blue tokens, you cannot choose to give information and must pick a different action.", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 117
    },
    __self: this
  }), "You then give information to a fellow player about the cards in that player's hand by clicking on it. You can tell the player either about one (and only one) color, or one (and only one) value of card."), __jsx(Subtitle, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 123
    },
    __self: this
  }, "2. Discard a card"), __jsx(Paragraph, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 125
    },
    __self: this
  }, "Discarding a card returns a blue token. You discard a card from your hand by tapping it. You then draw a new card from the deck and it will be added to your hand.", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 129
    },
    __self: this
  }), "Note: If you have all 8 blue tokens, you cannot discard cards and must pick a different action.", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 132
    },
    __self: this
  }), "You can consult discarded cards by clicking on the grey deck"), __jsx(Subtitle, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 136
    },
    __self: this
  }, "3. Play a card"), __jsx(Paragraph, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 138
    },
    __self: this
  }, "At your turn, to play a card, take a card from your hand and play it.", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 141
    },
    __self: this
  }), "One of two things happens:", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 143
    },
    __self: this
  }), "\xB7 If the card begins or adds to a firework, it will be added to that firework pile", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 146
    },
    __self: this
  }), "\xB7 If the card does not add to a firework, it will be discarded the card and add a red strike token", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 149
    },
    __self: this
  }), "Then you will draw a replacement card from the deck."), __jsx(Paragraph, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 153
    },
    __self: this
  }, "When a player finishes a firework by playing a value 5 card on it, it will return one blue token to the lid of the box as a bonus. If all the blue tokens are in the box lid, you do not get the bonus."), __jsx(Title, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 159
    },
    __self: this
  }, "End of the Game"), __jsx(Paragraph, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 161
    },
    __self: this
  }, "Hanabi can end in three ways:", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 163
    },
    __self: this
  }), "\xB7 If you get the third red token, you lose the game as the display goes up in flames!", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 166
    },
    __self: this
  }), "\xB7 If the team completes all five colors of firework with a value of 5, the team makes a spectacular victory display and obtains the maximum score of 25 points - 30 with multicolor option!", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 170
    },
    __self: this
  }), "\xB7 If a player draws the last card from deck, the game is almost over. Each player gets one more turn, including the player who drew the last card. Players cannot draw more cards during these final turns.", __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 175
    },
    __self: this
  }), __jsx("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 176
    },
    __self: this
  }), "The players then score their performance based on the fireworks they assembled."))));
}

/***/ }),

/***/ "./src/components/ui/button.tsx":
/*!**************************************!*\
  !*** ./src/components/ui/button.tsx ***!
  \**************************************/
/*! exports provided: ButtonSize, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ButtonSize", function() { return ButtonSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Button; });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "classnames");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _txt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./txt */ "./src/components/ui/txt.tsx");
var _jsxFileName = "/Users/sarahmamy/Workspace/hanabi/src/components/ui/button.tsx";
var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




let ButtonSize;

(function (ButtonSize) {
  ButtonSize[ButtonSize["TINY"] = 0] = "TINY";
  ButtonSize[ButtonSize["SMALL"] = 1] = "SMALL";
  ButtonSize[ButtonSize["MEDIUM"] = 2] = "MEDIUM";
  ButtonSize[ButtonSize["LARGE"] = 3] = "LARGE";
})(ButtonSize || (ButtonSize = {}));

const ButtonSizes = {
  [ButtonSize.TINY]: "ph2 br1 pv1 pa2-l fw1 tracked-none",
  [ButtonSize.SMALL]: "pv1 br2 ph2 fw2",
  [ButtonSize.MEDIUM]: "pv2 br2 ph3 fw2",
  [ButtonSize.LARGE]: "pv3 br4 ph4 fw2"
};
const ButtonTxtSizes = {
  [ButtonSize.TINY]: _txt__WEBPACK_IMPORTED_MODULE_2__["TxtSize"].SMALL,
  [ButtonSize.SMALL]: _txt__WEBPACK_IMPORTED_MODULE_2__["TxtSize"].SMALL,
  [ButtonSize.MEDIUM]: _txt__WEBPACK_IMPORTED_MODULE_2__["TxtSize"].MEDIUM,
  [ButtonSize.LARGE]: _txt__WEBPACK_IMPORTED_MODULE_2__["TxtSize"].MEDIUM
};
function Button(props) {
  const {
    primary = false,
    void: void_,
    size = ButtonSize.MEDIUM,
    onClick,
    className,
    text,
    children,
    disabled
  } = props,
        attributes = _objectWithoutProperties(props, ["primary", "void", "size", "onClick", "className", "text", "children", "disabled"]);

  return __jsx("button", _extends({
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(className, ButtonSizes[size], "bn shadow-2 ttu tracked outline-0 lh-normal", {
      "pointer grow": !disabled
    }, {
      "o-80": disabled
    }, {
      "bg-cta": primary
    }, {
      "main-dark": !disabled && !void_
    }, {
      "bg-transparent near-white": void_
    }),
    disabled: disabled,
    onClick: onClick
  }, attributes, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }), text && __jsx(_txt__WEBPACK_IMPORTED_MODULE_2__["default"], {
    size: ButtonTxtSizes[size],
    value: text,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: this
  }), !text && children);
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

/***/ "./src/pages/index.tsx":
/*!*****************************!*\
  !*** ./src/pages/index.tsx ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Home; });
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/router */ "next/router");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_rules__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/rules */ "./src/components/rules.tsx");
/* harmony import */ var _components_ui_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/ui/button */ "./src/components/ui/button.tsx");
/* harmony import */ var _components_ui_txt__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/ui/txt */ "./src/components/ui/txt.tsx");
var _jsxFileName = "/Users/sarahmamy/Workspace/hanabi/src/pages/index.tsx";
var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;





function Home() {
  const router = Object(next_router__WEBPACK_IMPORTED_MODULE_0__["useRouter"])();
  const {
    0: lastGame,
    1: setLastGame
  } = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(null);
  const {
    0: showRules,
    1: setShowRules
  } = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    if (localStorage.gameId && localStorage.playerId) {
      setLastGame({
        gameId: localStorage.gameId,
        playerId: localStorage.playerId
      });
    }
  }, []);
  return __jsx("div", {
    className: "w-100 h-100 flex flex-column justify-center items-center bg-main-dark pa2 pv4-l ph3-l shadow-5 br3",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, __jsx("div", {
    className: "flex flex-column items-center",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, __jsx("img", {
    alt: "Hanabi cards game online logo",
    className: "mw4 mb4",
    src: "/static/hanabi.png",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }), __jsx(_components_ui_txt__WEBPACK_IMPORTED_MODULE_4__["default"], {
    size: _components_ui_txt__WEBPACK_IMPORTED_MODULE_4__["TxtSize"].LARGE,
    value: "Hanabi",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  })), __jsx("span", {
    className: "tc lavender",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, "Play the Hanabi game online with friends!"), __jsx("div", {
    className: "flex flex-column mt5",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, __jsx(_components_ui_button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "mb4",
    id: "create-room",
    size: _components_ui_button__WEBPACK_IMPORTED_MODULE_3__["ButtonSize"].LARGE,
    text: "Create a room",
    onClick: () => router.push("/new-game"),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }), __jsx(_components_ui_button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "mb4",
    id: "offline",
    size: _components_ui_button__WEBPACK_IMPORTED_MODULE_3__["ButtonSize"].LARGE,
    text: "Pass and play",
    onClick: () => router.push("/new-game?offline=1"),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  }), __jsx(_components_ui_button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "mb4",
    id: "join-room",
    size: _components_ui_button__WEBPACK_IMPORTED_MODULE_3__["ButtonSize"].LARGE,
    text: "Join a room",
    onClick: () => router.push("/join-game"),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: this
  }), lastGame && __jsx(_components_ui_button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "mb4",
    id: "rejoin-game",
    size: _components_ui_button__WEBPACK_IMPORTED_MODULE_3__["ButtonSize"].LARGE,
    text: "Rejoin game",
    onClick: () => router.replace({
      pathname: "/play",
      query: lastGame
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }), __jsx("span", {
    className: "tc pointer",
    onClick: () => setShowRules(true),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: this
  }, "What's Hanabi?"), showRules && __jsx(_components_rules__WEBPACK_IMPORTED_MODULE_2__["default"], {
    setShowRules: setShowRules,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  })));
}

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** multi ./src/pages/index.tsx ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/sarahmamy/Workspace/hanabi/src/pages/index.tsx */"./src/pages/index.tsx");


/***/ }),

/***/ "classnames":
/*!*****************************!*\
  !*** external "classnames" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("classnames");

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("next/router");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map