"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");

var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");

var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");

var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");

var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");

var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");

var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _setInterval2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-interval"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _createInstance = _interopRequireDefault(require("@emotion/css/create-instance"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _createCSSKey = _interopRequireDefault(require("../createCSSKey"));

var _debug = _interopRequireDefault(require("../utils/debug"));

var _EventSpy = _interopRequireDefault(require("../EventSpy"));

var _FunctionContext = _interopRequireDefault(require("./FunctionContext"));

var _InternalContext = _interopRequireDefault(require("./InternalContext"));

var _SpineTo = _interopRequireDefault(require("../SpineTo"));

var _State1Context = _interopRequireDefault(require("./State1Context"));

var _State2Context = _interopRequireDefault(require("./State2Context"));

var _StateContext = _interopRequireDefault(require("./StateContext"));

var _styleConsole = _interopRequireDefault(require("../utils/styleConsole"));

var _useStateRef7 = _interopRequireDefault(require("../hooks/internal/useStateRef"));

function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) { symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context21; _forEachInstanceProperty2(_context21 = ownKeys(Object(source), true)).call(_context21, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context22; _forEachInstanceProperty2(_context22 = ownKeys(Object(source))).call(_context22, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DEFAULT_SCROLLER = function DEFAULT_SCROLLER() {
  return Infinity;
};

var MIN_CHECK_INTERVAL = 17; // 1 frame

var MODE_BOTTOM = 'bottom';
var MODE_TOP = 'top';
var NEAR_END_THRESHOLD = 1;
var SCROLL_DECISION_DURATION = 34; // 2 frames
// We pool the emotion object by nonce.
// This is to make sure we don't generate too many unneeded <style> tags.

var emotionPool = {};

function setImmediateInterval(fn, ms) {
  fn();
  return (0, _setInterval2["default"])(fn, ms);
}

function computeViewState(_ref) {
  var mode = _ref.mode,
      _ref$target = _ref.target,
      offsetHeight = _ref$target.offsetHeight,
      scrollHeight = _ref$target.scrollHeight,
      scrollTop = _ref$target.scrollTop;
  var atBottom = scrollHeight - scrollTop - offsetHeight < NEAR_END_THRESHOLD;
  var atTop = scrollTop < NEAR_END_THRESHOLD;
  var atEnd = mode === MODE_TOP ? atTop : atBottom;
  var atStart = mode !== MODE_TOP ? atTop : atBottom;
  return {
    atBottom: atBottom,
    atEnd: atEnd,
    atStart: atStart,
    atTop: atTop
  };
}

function isEnd(animateTo, mode) {
  return animateTo === (mode === MODE_TOP ? 0 : '100%');
}

var Composer = function Composer(_ref2) {
  var _ref2$checkInterval = _ref2.checkInterval,
      checkInterval = _ref2$checkInterval === void 0 ? 100 : _ref2$checkInterval,
      children = _ref2.children,
      _ref2$debounce = _ref2.debounce,
      debounce = _ref2$debounce === void 0 ? 17 : _ref2$debounce,
      debugFromProp = _ref2.debug,
      _ref2$initialScrollBe = _ref2.initialScrollBehavior,
      initialScrollBehavior = _ref2$initialScrollBe === void 0 ? 'smooth' : _ref2$initialScrollBe,
      mode = _ref2.mode,
      nonce = _ref2.nonce,
      _ref2$scroller = _ref2.scroller,
      scroller = _ref2$scroller === void 0 ? DEFAULT_SCROLLER : _ref2$scroller;
  var debug = (0, _react.useMemo)(function () {
    return (0, _debug["default"])("<ScrollToBottom>", {
      force: debugFromProp
    });
  }, [debugFromProp]);
  mode = mode === MODE_TOP ? MODE_TOP : MODE_BOTTOM;
  var ignoreScrollEventBeforeRef = (0, _react.useRef)(0);
  var initialScrollBehaviorRef = (0, _react.useRef)(initialScrollBehavior);

  var _useStateRef = (0, _useStateRef7["default"])(mode === MODE_TOP ? 0 : '100%'),
      _useStateRef2 = (0, _slicedToArray2["default"])(_useStateRef, 3),
      animateTo = _useStateRef2[0],
      setAnimateTo = _useStateRef2[1],
      animateToRef = _useStateRef2[2];

  var _useStateRef3 = (0, _useStateRef7["default"])(null),
      _useStateRef4 = (0, _slicedToArray2["default"])(_useStateRef3, 3),
      target = _useStateRef4[0],
      setTarget = _useStateRef4[1],
      targetRef = _useStateRef4[2]; // Internal context


  var animateFromRef = (0, _react.useRef)(0);
  var offsetHeightRef = (0, _react.useRef)(0);
  var scrollHeightRef = (0, _react.useRef)(0); // State context

  var _useState = (0, _react.useState)(true),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      atBottom = _useState2[0],
      setAtBottom = _useState2[1];

  var _useState3 = (0, _react.useState)(true),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      atEnd = _useState4[0],
      setAtEnd = _useState4[1];

  var _useState5 = (0, _react.useState)(true),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      atTop = _useState6[0],
      setAtTop = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      atStart = _useState8[0],
      setAtStart = _useState8[1];

  var _useStateRef5 = (0, _useStateRef7["default"])(true),
      _useStateRef6 = (0, _slicedToArray2["default"])(_useStateRef5, 3),
      sticky = _useStateRef6[0],
      setSticky = _useStateRef6[1],
      stickyRef = _useStateRef6[2]; // High-rate state context


  var scrollPositionObserversRef = (0, _react.useRef)([]);
  var observeScrollPosition = (0, _react.useCallback)(function (fn) {
    var target = targetRef.current;
    scrollPositionObserversRef.current.push(fn);
    target && fn({
      scrollTop: target.scrollTop
    });
    return function () {
      var scrollPositionObservers = scrollPositionObserversRef.current;
      var index = (0, _indexOf["default"])(scrollPositionObservers).call(scrollPositionObservers, fn);
      ~index && (0, _splice["default"])(scrollPositionObservers).call(scrollPositionObservers, index, 1);
    };
  }, [scrollPositionObserversRef, targetRef]);
  var handleSpineToEnd = (0, _react.useCallback)(function () {
    var animateTo = animateToRef.current;
    debug(function () {
      var _context;

      return (0, _concat["default"])(_context = ['%cSpineTo%c: %conEnd%c is fired.']).call(_context, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('magenta')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('orange')), [{
        animateTo: animateTo
      }]);
    });
    ignoreScrollEventBeforeRef.current = (0, _now["default"])(); // handleScrollEnd may end at a position which should lose stickiness.
    // In that case, we will need to set sticky to false to stop the interval check.
    // Test case:
    // 1. Add a scroller that always return 0
    // 2. Show a panel with mode === MODE_BOTTOM
    // 3. Programmatically scroll to 0 (set element.scrollTop = 0)
    // Expected: it should not repetitively call scrollTo(0)
    //           it should set stickiness to false

    isEnd(animateTo, mode) || setSticky(false);
    setAnimateTo(null);
  }, [animateToRef, debug, ignoreScrollEventBeforeRef, mode, setAnimateTo, setSticky]); // Function context

  var scrollTo = (0, _react.useCallback)(function (nextAnimateTo) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        behavior = _ref3.behavior;

    var target = targetRef.current;

    if (typeof nextAnimateTo !== 'number' && nextAnimateTo !== '100%') {
      return console.warn('react-scroll-to-bottom: Arguments passed to scrollTo() must be either number or "100%".');
    } // If it is trying to scroll to a position which is not "atEnd", it should set sticky to false after scroll ended.


    debug(function () {
      var _context2;

      return [(0, _concat["default"])(_context2 = ["%cscrollTo%c: Will scroll to %c".concat(typeof nextAnimateTo === 'number' ? nextAnimateTo + 'px' : nextAnimateTo.replace(/%/g, '%%'), "%c")]).call(_context2, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('lime', '')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('purple'))), {
        behavior: behavior,
        nextAnimateTo: nextAnimateTo,
        target: target
      }];
    });

    if (behavior === 'auto') {
      // Stop any existing animation
      handleSpineToEnd();

      if (target) {
        // Jump to the scroll position
        target.scrollTop = nextAnimateTo === '100%' ? target.scrollHeight - target.offsetHeight : nextAnimateTo;
      }
    } else {
      behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollTo". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
      setAnimateTo(nextAnimateTo);
    } // This is for handling a case. When calling scrollTo('100%', { behavior: 'auto' }) multiple times, it would lose stickiness.


    if (isEnd(nextAnimateTo, mode)) {
      debug(function () {
        var _context3;

        return [(0, _concat["default"])(_context3 = ["%cscrollTo%c: Scrolling to end, will set sticky to %ctrue%c."]).call(_context3, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('lime', '')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('purple'))), [{
          mode: mode,
          nextAnimateTo: nextAnimateTo
        }]];
      });
      setSticky(true);
    }
  }, [debug, handleSpineToEnd, mode, setAnimateTo, setSticky, targetRef]);
  var scrollToBottom = (0, _react.useCallback)(function () {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref4.behavior;

    debug(function () {
      var _context4;

      return (0, _concat["default"])(_context4 = ['%cscrollToBottom%c: Called']).call(_context4, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToBottom". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    scrollTo('100%', {
      behavior: behavior || 'smooth'
    });
  }, [debug, scrollTo]);
  var scrollToTop = (0, _react.useCallback)(function () {
    var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref5.behavior;

    debug(function () {
      var _context5;

      return (0, _concat["default"])(_context5 = ['%cscrollToTop%c: Called']).call(_context5, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToTop". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    scrollTo(0, {
      behavior: behavior || 'smooth'
    });
  }, [debug, scrollTo]);
  var scrollToEnd = (0, _react.useCallback)(function () {
    var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref6.behavior;

    debug(function () {
      var _context6;

      return (0, _concat["default"])(_context6 = ['%cscrollToEnd%c: Called']).call(_context6, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToEnd". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    var options = {
      behavior: behavior || 'smooth'
    };
    mode === MODE_TOP ? scrollToTop(options) : scrollToBottom(options);
  }, [debug, mode, scrollToBottom, scrollToTop]);
  var scrollToStart = (0, _react.useCallback)(function () {
    var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref7.behavior;

    debug(function () {
      var _context7;

      return (0, _concat["default"])(_context7 = ['%cscrollToStart%c: Called']).call(_context7, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToStart". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    var options = {
      behavior: behavior || 'smooth'
    };
    mode === MODE_TOP ? scrollToBottom(options) : scrollToTop(options);
  }, [debug, mode, scrollToBottom, scrollToTop]);
  var scrollToSticky = (0, _react.useCallback)(function () {
    var target = targetRef.current;

    if (target) {
      if (initialScrollBehaviorRef.current === 'auto') {
        debug(function () {
          var _context8;

          return (0, _concat["default"])(_context8 = ["%ctarget changed%c: Initial scroll"]).call(_context8, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('blue')));
        });
        target.scrollTop = mode === MODE_TOP ? 0 : target.scrollHeight - target.offsetHeight;
        initialScrollBehaviorRef.current = false;
        return;
      } // This is very similar to scrollToEnd().
      // Instead of scrolling to end, it will call props.scroller() to determines how far it should scroll.
      // This function could be called while it is auto-scrolling.


      var animateFrom = animateFromRef.current;
      var offsetHeight = target.offsetHeight,
          scrollHeight = target.scrollHeight,
          scrollTop = target.scrollTop;
      var maxValue = mode === MODE_TOP ? 0 : Math.max(0, scrollHeight - offsetHeight - scrollTop);
      var minValue = Math.max(0, animateFrom - scrollTop);
      var rawNextValue = scroller({
        maxValue: maxValue,
        minValue: minValue,
        offsetHeight: offsetHeight,
        scrollHeight: scrollHeight,
        scrollTop: scrollTop
      });
      var nextValue = Math.max(0, Math.min(maxValue, rawNextValue));
      var nextAnimateTo;

      if (mode === MODE_TOP || nextValue !== maxValue) {
        nextAnimateTo = scrollTop + nextValue;
      } else {
        // When scrolling to bottom, we should scroll to "100%".
        // Otherwise, if we scroll to any number, it will lose stickiness when elements are adding too fast.
        // "100%" is a special argument intended to make sure stickiness is not lost while new elements are being added.
        nextAnimateTo = '100%';
      }

      debug(function () {
        var _context9, _context10, _context11;

        return [(0, _concat["default"])(_context9 = [(0, _concat["default"])(_context10 = (0, _concat["default"])(_context11 = "%cscrollToSticky%c: Will animate from %c".concat(animateFrom, "px%c to %c")).call(_context11, typeof nextAnimateTo === 'number' ? nextAnimateTo + 'px' : nextAnimateTo.replace(/%/g, '%%'), "%c (%c")).call(_context10, (nextAnimateTo === '100%' ? maxValue : nextAnimateTo) + animateFrom, "px%c)")]).call(_context9, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('orange')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('purple')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('purple')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('purple'))), {
          animateFrom: animateFrom,
          maxValue: maxValue,
          minValue: minValue,
          nextAnimateTo: nextAnimateTo,
          nextValue: nextValue,
          offsetHeight: offsetHeight,
          rawNextValue: rawNextValue,
          scrollHeight: scrollHeight,
          scrollTop: scrollTop
        }];
      });
      scrollTo(nextAnimateTo, {
        behavior: 'smooth'
      });
    }
  }, [animateFromRef, debug, mode, scroller, scrollTo, targetRef]);
  var handleScroll = (0, _react.useCallback)(function (_ref8) {
    var _context17;

    var timeStampLow = _ref8.timeStampLow;
    var animateTo = animateToRef.current;
    var target = targetRef.current;
    var animating = animateTo !== null; // Currently, there are no reliable way to check if the "scroll" event is trigger due to
    // user gesture, programmatic scrolling, or Chrome-synthesized "scroll" event to compensate size change.
    // Thus, we use our best-effort to guess if it is triggered by user gesture, and disable sticky if it is heading towards the start direction.

    if (timeStampLow <= ignoreScrollEventBeforeRef.current || !target) {
      // Since we debounce "scroll" event, this handler might be called after spineTo.onEnd (a.k.a. artificial scrolling).
      // We should ignore debounced event fired after scrollEnd, because without skipping them, the userInitiatedScroll calculated below will not be accurate.
      // Thus, on a fast machine, adding elements super fast will lose the "stickiness".
      return;
    }

    var _computeViewState = computeViewState({
      mode: mode,
      target: target
    }),
        atBottom = _computeViewState.atBottom,
        atEnd = _computeViewState.atEnd,
        atStart = _computeViewState.atStart,
        atTop = _computeViewState.atTop;

    setAtBottom(atBottom);
    setAtEnd(atEnd);
    setAtStart(atStart);
    setAtTop(atTop); // Chrome will emit "synthetic" scroll event if the container is resized or an element is added
    // We need to ignore these "synthetic" events
    // Repro: In playground, press 4-1-5-1-1 (small, add one, normal, add one, add one)
    //        Nomatter how fast or slow the sequence is being pressed, it should still stick to the bottom

    var nextOffsetHeight = target.offsetHeight,
        nextScrollHeight = target.scrollHeight;
    var offsetHeight = offsetHeightRef.current;
    var scrollHeight = scrollHeightRef.current;
    var offsetHeightChanged = nextOffsetHeight !== offsetHeight;
    var scrollHeightChanged = nextScrollHeight !== scrollHeight;

    if (offsetHeightChanged) {
      offsetHeightRef.current = nextOffsetHeight;
    }

    if (scrollHeightChanged) {
      scrollHeightRef.current = nextScrollHeight;
    } // Sticky means:
    // - If it is scrolled programatically, we are still in sticky mode
    // - If it is scrolled by the user, then sticky means if we are at the end
    // Only update stickiness if the scroll event is not due to synthetic scroll done by Chrome


    if (!offsetHeightChanged && !scrollHeightChanged) {
      // We are sticky if we are animating to the end, or we are already at the end.
      // We can be "animating but not sticky" by calling "scrollTo(100)" where the container scrollHeight is 200px.
      var nextSticky = animating && isEnd(animateTo, mode) || atEnd;

      if (stickyRef.current !== nextSticky) {
        debug(function () {
          var _context12, _context13, _context14, _context15;

          return [(0, _concat["default"])(_context12 = ["%conScroll%c: %csetSticky%c(%c".concat(nextSticky, "%c)")]).call(_context12, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('red')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('red')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('purple'))), (0, _concat["default"])(_context13 = [(0, _concat["default"])(_context14 = (0, _concat["default"])(_context15 = "(animating = %c".concat(animating, "%c && isEnd = %c")).call(_context15, isEnd(animateTo, mode), "%c) || atEnd = %c")).call(_context14, atEnd, "%c")]).call(_context13, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('purple')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('purple')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('purple')), [{
            animating: animating,
            animateTo: animateTo,
            atEnd: atEnd,
            mode: mode,
            offsetHeight: target.offsetHeight,
            scrollHeight: target.scrollHeight,
            sticky: stickyRef.current,
            nextSticky: nextSticky
          }])];
        });
        setSticky(nextSticky);
      }
    } else if (stickyRef.current) {
      debug(function () {
        var _context16;

        return [(0, _concat["default"])(_context16 = ["%conScroll%c: Size changed while sticky, calling %cscrollToSticky()%c"]).call(_context16, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('red')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('orange')), [{
          offsetHeightChanged: offsetHeightChanged,
          scrollHeightChanged: scrollHeightChanged
        }]), {
          nextOffsetHeight: nextOffsetHeight,
          prevOffsetHeight: offsetHeight,
          nextScrollHeight: nextScrollHeight,
          prevScrollHeight: scrollHeight
        }];
      });
      scrollToSticky();
    }

    var actualScrollTop = target.scrollTop;
    (0, _forEach["default"])(_context17 = scrollPositionObserversRef.current).call(_context17, function (observer) {
      return observer({
        scrollTop: actualScrollTop
      });
    });
  }, [animateToRef, debug, ignoreScrollEventBeforeRef, mode, offsetHeightRef, scrollHeightRef, scrollPositionObserversRef, scrollToSticky, setAtBottom, setAtEnd, setAtStart, setAtTop, setSticky, stickyRef, targetRef]);
  (0, _react.useEffect)(function () {
    if (target) {
      var stickyButNotAtEndSince = false;
      var timeout = setImmediateInterval(function () {
        var target = targetRef.current;
        var animating = animateToRef.current !== null;

        if (stickyRef.current) {
          if (!computeViewState({
            mode: mode,
            target: target
          }).atEnd) {
            if (!stickyButNotAtEndSince) {
              stickyButNotAtEndSince = (0, _now["default"])();
            } else if ((0, _now["default"])() - stickyButNotAtEndSince > SCROLL_DECISION_DURATION) {
              // Quirks: In Firefox, after user scroll down, Firefox do two things:
              //         1. Set to a new "scrollTop"
              //         2. Fire "scroll" event
              //         For what we observed, #1 is fired about 20ms before #2. There is a chance that this stickyCheckTimeout is being scheduled between 1 and 2.
              //         That means, if we just look at #1 to decide if we should scroll, we will always scroll, in oppose to the user's intention.
              // Repro: Open Firefox, set checkInterval to a lower number, and try to scroll by dragging the scroll handler. It will jump back.
              // The "animating" check will make sure stickiness is not lost when elements are adding at a very fast pace.
              if (!animating) {
                animateFromRef.current = target.scrollTop;
                debug(function () {
                  var _context18;

                  return (0, _concat["default"])(_context18 = ["%cInterval check%c: Should sticky but not at end, calling %cscrollToSticky()%c to scroll"]).call(_context18, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('navy')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('orange')));
                });
                scrollToSticky();
              }

              stickyButNotAtEndSince = false;
            }
          } else {
            stickyButNotAtEndSince = false;
          }
        } else if (target.scrollHeight <= target.offsetHeight && !stickyRef.current) {
          // When the container is emptied, we will set sticky back to true.
          debug(function () {
            var _context19;

            return [(0, _concat["default"])(_context19 = ["%cInterval check%c: Container is emptied, setting sticky back to %ctrue%c"]).call(_context19, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('navy')), (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('purple'))), [{
              offsetHeight: target.offsetHeight,
              scrollHeight: target.scrollHeight,
              sticky: stickyRef.current
            }]];
          });
          setSticky(true);
        }
      }, Math.max(MIN_CHECK_INTERVAL, checkInterval) || MIN_CHECK_INTERVAL);
      return function () {
        return clearInterval(timeout);
      };
    }
  }, [animateToRef, checkInterval, debug, mode, scrollToSticky, setSticky, stickyRef, target, targetRef]);
  var styleToClassName = (0, _react.useMemo)(function () {
    var emotion = emotionPool[nonce] || (emotionPool[nonce] = (0, _createInstance["default"])({
      key: 'react-scroll-to-bottom--css-' + (0, _createCSSKey["default"])(),
      nonce: nonce
    }));
    return function (style) {
      return emotion.css(style) + '';
    };
  }, [nonce]);
  var internalContext = (0, _react.useMemo)(function () {
    return {
      observeScrollPosition: observeScrollPosition,
      setTarget: setTarget,
      styleToClassName: styleToClassName
    };
  }, [observeScrollPosition, setTarget, styleToClassName]);
  var state1Context = (0, _react.useMemo)(function () {
    return {
      atBottom: atBottom,
      atEnd: atEnd,
      atStart: atStart,
      atTop: atTop,
      mode: mode
    };
  }, [atBottom, atEnd, atStart, atTop, mode]);
  var state2Context = (0, _react.useMemo)(function () {
    var animating = animateTo !== null;
    return {
      animating: animating,
      animatingToEnd: animating && isEnd(animateTo, mode),
      sticky: sticky
    };
  }, [animateTo, mode, sticky]);
  var combinedStateContext = (0, _react.useMemo)(function () {
    return _objectSpread(_objectSpread({}, state1Context), state2Context);
  }, [state1Context, state2Context]);
  var functionContext = (0, _react.useMemo)(function () {
    return {
      scrollTo: scrollTo,
      scrollToBottom: scrollToBottom,
      scrollToEnd: scrollToEnd,
      scrollToStart: scrollToStart,
      scrollToTop: scrollToTop
    };
  }, [scrollTo, scrollToBottom, scrollToEnd, scrollToStart, scrollToTop]);
  (0, _react.useEffect)(function () {
    // We need to update the "scrollHeight" value to latest when the user do a focus inside the box.
    //
    // This is because:
    // - In our code that mitigate Chrome synthetic scrolling, that code will look at whether "scrollHeight" value is latest or not.
    // - That code only run on "scroll" event.
    // - That means, on every "scroll" event, if the "scrollHeight" value is not latest, we will skip modifying the stickiness.
    // - That means, if the user "focus" to an element that cause the scroll view to scroll to the bottom, the user agent will fire "scroll" event.
    //   Since the "scrollHeight" is not latest value, this "scroll" event will be ignored and stickiness will not be modified.
    // - That means, if the user "focus" to a newly added element that is at the end of the scroll view, the "scroll to bottom" button will continue to show.
    //
    // Repro in Chrome:
    // 1. Fill up a scroll view
    // 2. Scroll up, the "scroll to bottom" button should show up
    // 3. Click "Add a button"
    // 4. Click on the scroll view (to pseudo-focus on it)
    // 5. Press TAB, the scroll view will be at the bottom
    //
    // Expect:
    // - The "scroll to bottom" button should be gone.
    if (target) {
      var handleFocus = function handleFocus() {
        scrollHeightRef.current = target.scrollHeight;
      };

      target.addEventListener('focus', handleFocus, {
        capture: true,
        passive: true
      });
      return function () {
        return target.removeEventListener('focus', handleFocus);
      };
    }
  }, [target]);
  debug(function () {
    var _context20;

    return [(0, _concat["default"])(_context20 = ["%cRender%c: Render"]).call(_context20, (0, _toConsumableArray2["default"])((0, _styleConsole["default"])('cyan', ''))), {
      animateTo: animateTo,
      animating: animateTo !== null,
      sticky: sticky,
      target: target
    }];
  });
  return /*#__PURE__*/_react["default"].createElement(_InternalContext["default"].Provider, {
    value: internalContext
  }, /*#__PURE__*/_react["default"].createElement(_FunctionContext["default"].Provider, {
    value: functionContext
  }, /*#__PURE__*/_react["default"].createElement(_StateContext["default"].Provider, {
    value: combinedStateContext
  }, /*#__PURE__*/_react["default"].createElement(_State1Context["default"].Provider, {
    value: state1Context
  }, /*#__PURE__*/_react["default"].createElement(_State2Context["default"].Provider, {
    value: state2Context
  }, children, target && /*#__PURE__*/_react["default"].createElement(_EventSpy["default"], {
    debounce: debounce,
    name: "scroll",
    onEvent: handleScroll,
    target: target
  }), target && animateTo !== null && /*#__PURE__*/_react["default"].createElement(_SpineTo["default"], {
    name: "scrollTop",
    onEnd: handleSpineToEnd,
    target: target,
    value: animateTo
  }))))));
};

Composer.propTypes = {
  checkInterval: _propTypes["default"].number,
  children: _propTypes["default"].any,
  debounce: _propTypes["default"].number,
  debug: _propTypes["default"].bool,
  initialScrollBehavior: _propTypes["default"].oneOf(['auto', 'smooth']),
  mode: _propTypes["default"].oneOf(['bottom', 'top']),
  nonce: _propTypes["default"].string,
  scroller: _propTypes["default"].func
};
var _default = Composer;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9Db21wb3Nlci5qcyJdLCJuYW1lcyI6WyJERUZBVUxUX1NDUk9MTEVSIiwiSW5maW5pdHkiLCJNSU5fQ0hFQ0tfSU5URVJWQUwiLCJNT0RFX0JPVFRPTSIsIk1PREVfVE9QIiwiTkVBUl9FTkRfVEhSRVNIT0xEIiwiU0NST0xMX0RFQ0lTSU9OX0RVUkFUSU9OIiwiZW1vdGlvblBvb2wiLCJzZXRJbW1lZGlhdGVJbnRlcnZhbCIsImZuIiwibXMiLCJjb21wdXRlVmlld1N0YXRlIiwibW9kZSIsInRhcmdldCIsIm9mZnNldEhlaWdodCIsInNjcm9sbEhlaWdodCIsInNjcm9sbFRvcCIsImF0Qm90dG9tIiwiYXRUb3AiLCJhdEVuZCIsImF0U3RhcnQiLCJpc0VuZCIsImFuaW1hdGVUbyIsIkNvbXBvc2VyIiwiY2hlY2tJbnRlcnZhbCIsImNoaWxkcmVuIiwiZGVib3VuY2UiLCJkZWJ1Z0Zyb21Qcm9wIiwiZGVidWciLCJpbml0aWFsU2Nyb2xsQmVoYXZpb3IiLCJub25jZSIsInNjcm9sbGVyIiwiZm9yY2UiLCJpZ25vcmVTY3JvbGxFdmVudEJlZm9yZVJlZiIsImluaXRpYWxTY3JvbGxCZWhhdmlvclJlZiIsInNldEFuaW1hdGVUbyIsImFuaW1hdGVUb1JlZiIsInNldFRhcmdldCIsInRhcmdldFJlZiIsImFuaW1hdGVGcm9tUmVmIiwib2Zmc2V0SGVpZ2h0UmVmIiwic2Nyb2xsSGVpZ2h0UmVmIiwic2V0QXRCb3R0b20iLCJzZXRBdEVuZCIsInNldEF0VG9wIiwic2V0QXRTdGFydCIsInN0aWNreSIsInNldFN0aWNreSIsInN0aWNreVJlZiIsInNjcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzUmVmIiwib2JzZXJ2ZVNjcm9sbFBvc2l0aW9uIiwiY3VycmVudCIsInB1c2giLCJzY3JvbGxQb3NpdGlvbk9ic2VydmVycyIsImluZGV4IiwiaGFuZGxlU3BpbmVUb0VuZCIsInNjcm9sbFRvIiwibmV4dEFuaW1hdGVUbyIsImJlaGF2aW9yIiwiY29uc29sZSIsIndhcm4iLCJyZXBsYWNlIiwic2Nyb2xsVG9Cb3R0b20iLCJzY3JvbGxUb1RvcCIsInNjcm9sbFRvRW5kIiwib3B0aW9ucyIsInNjcm9sbFRvU3RhcnQiLCJzY3JvbGxUb1N0aWNreSIsImFuaW1hdGVGcm9tIiwibWF4VmFsdWUiLCJNYXRoIiwibWF4IiwibWluVmFsdWUiLCJyYXdOZXh0VmFsdWUiLCJuZXh0VmFsdWUiLCJtaW4iLCJoYW5kbGVTY3JvbGwiLCJ0aW1lU3RhbXBMb3ciLCJhbmltYXRpbmciLCJuZXh0T2Zmc2V0SGVpZ2h0IiwibmV4dFNjcm9sbEhlaWdodCIsIm9mZnNldEhlaWdodENoYW5nZWQiLCJzY3JvbGxIZWlnaHRDaGFuZ2VkIiwibmV4dFN0aWNreSIsInByZXZPZmZzZXRIZWlnaHQiLCJwcmV2U2Nyb2xsSGVpZ2h0IiwiYWN0dWFsU2Nyb2xsVG9wIiwib2JzZXJ2ZXIiLCJzdGlja3lCdXROb3RBdEVuZFNpbmNlIiwidGltZW91dCIsImNsZWFySW50ZXJ2YWwiLCJzdHlsZVRvQ2xhc3NOYW1lIiwiZW1vdGlvbiIsImtleSIsInN0eWxlIiwiY3NzIiwiaW50ZXJuYWxDb250ZXh0Iiwic3RhdGUxQ29udGV4dCIsInN0YXRlMkNvbnRleHQiLCJhbmltYXRpbmdUb0VuZCIsImNvbWJpbmVkU3RhdGVDb250ZXh0IiwiZnVuY3Rpb25Db250ZXh0IiwiaGFuZGxlRm9jdXMiLCJhZGRFdmVudExpc3RlbmVyIiwiY2FwdHVyZSIsInBhc3NpdmUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwibnVtYmVyIiwiYW55IiwiYm9vbCIsIm9uZU9mIiwic3RyaW5nIiwiZnVuYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztB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QUFBLElBQUksRUFBQyxRQUFuQztBQUE0QyxJQUFBLE9BQU8sRUFBRWtELFlBQXJEO0FBQW1FLElBQUEsTUFBTSxFQUFFL0Q7QUFBM0UsSUFGYixFQUdHQSxNQUFNLElBQUlTLFNBQVMsS0FBSyxJQUF4QixpQkFDQyxnQ0FBQyxtQkFBRDtBQUFTLElBQUEsSUFBSSxFQUFDLFdBQWQ7QUFBMEIsSUFBQSxLQUFLLEVBQUVpQyxnQkFBakM7QUFBbUQsSUFBQSxNQUFNLEVBQUUxQyxNQUEzRDtBQUFtRSxJQUFBLEtBQUssRUFBRVM7QUFBMUUsSUFKSixDQURGLENBREYsQ0FERixDQURGLENBREY7QUFpQkQsQ0F0akJEOztBQXdqQkFDLFFBQVEsQ0FBQ29GLFNBQVQsR0FBcUI7QUFDbkJuRixFQUFBQSxhQUFhLEVBQUVvRixzQkFBVUMsTUFETjtBQUVuQnBGLEVBQUFBLFFBQVEsRUFBRW1GLHNCQUFVRSxHQUZEO0FBR25CcEYsRUFBQUEsUUFBUSxFQUFFa0Ysc0JBQVVDLE1BSEQ7QUFJbkJqRixFQUFBQSxLQUFLLEVBQUVnRixzQkFBVUcsSUFKRTtBQUtuQmxGLEVBQUFBLHFCQUFxQixFQUFFK0Usc0JBQVVJLEtBQVYsQ0FBZ0IsQ0FBQyxNQUFELEVBQVMsUUFBVCxDQUFoQixDQUxKO0FBTW5CcEcsRUFBQUEsSUFBSSxFQUFFZ0csc0JBQVVJLEtBQVYsQ0FBZ0IsQ0FBQyxRQUFELEVBQVcsS0FBWCxDQUFoQixDQU5hO0FBT25CbEYsRUFBQUEsS0FBSyxFQUFFOEUsc0JBQVVLLE1BUEU7QUFRbkJsRixFQUFBQSxRQUFRLEVBQUU2RSxzQkFBVU07QUFSRCxDQUFyQjtlQVdlM0YsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVFbW90aW9uIGZyb20gJ0BlbW90aW9uL2Nzcy9jcmVhdGUtaW5zdGFuY2UnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgY3JlYXRlQ1NTS2V5IGZyb20gJy4uL2NyZWF0ZUNTU0tleSc7XG5pbXBvcnQgY3JlYXRlRGVidWcgZnJvbSAnLi4vdXRpbHMvZGVidWcnO1xuaW1wb3J0IEV2ZW50U3B5IGZyb20gJy4uL0V2ZW50U3B5JztcbmltcG9ydCBGdW5jdGlvbkNvbnRleHQgZnJvbSAnLi9GdW5jdGlvbkNvbnRleHQnO1xuaW1wb3J0IEludGVybmFsQ29udGV4dCBmcm9tICcuL0ludGVybmFsQ29udGV4dCc7XG5pbXBvcnQgU3BpbmVUbyBmcm9tICcuLi9TcGluZVRvJztcbmltcG9ydCBTdGF0ZTFDb250ZXh0IGZyb20gJy4vU3RhdGUxQ29udGV4dCc7XG5pbXBvcnQgU3RhdGUyQ29udGV4dCBmcm9tICcuL1N0YXRlMkNvbnRleHQnO1xuaW1wb3J0IFN0YXRlQ29udGV4dCBmcm9tICcuL1N0YXRlQ29udGV4dCc7XG5pbXBvcnQgc3R5bGVDb25zb2xlIGZyb20gJy4uL3V0aWxzL3N0eWxlQ29uc29sZSc7XG5pbXBvcnQgdXNlU3RhdGVSZWYgZnJvbSAnLi4vaG9va3MvaW50ZXJuYWwvdXNlU3RhdGVSZWYnO1xuXG5jb25zdCBERUZBVUxUX1NDUk9MTEVSID0gKCkgPT4gSW5maW5pdHk7XG5jb25zdCBNSU5fQ0hFQ0tfSU5URVJWQUwgPSAxNzsgLy8gMSBmcmFtZVxuY29uc3QgTU9ERV9CT1RUT00gPSAnYm90dG9tJztcbmNvbnN0IE1PREVfVE9QID0gJ3RvcCc7XG5jb25zdCBORUFSX0VORF9USFJFU0hPTEQgPSAxO1xuY29uc3QgU0NST0xMX0RFQ0lTSU9OX0RVUkFUSU9OID0gMzQ7IC8vIDIgZnJhbWVzXG5cbi8vIFdlIHBvb2wgdGhlIGVtb3Rpb24gb2JqZWN0IGJ5IG5vbmNlLlxuLy8gVGhpcyBpcyB0byBtYWtlIHN1cmUgd2UgZG9uJ3QgZ2VuZXJhdGUgdG9vIG1hbnkgdW5uZWVkZWQgPHN0eWxlPiB0YWdzLlxuY29uc3QgZW1vdGlvblBvb2wgPSB7fTtcblxuZnVuY3Rpb24gc2V0SW1tZWRpYXRlSW50ZXJ2YWwoZm4sIG1zKSB7XG4gIGZuKCk7XG5cbiAgcmV0dXJuIHNldEludGVydmFsKGZuLCBtcyk7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVWaWV3U3RhdGUoeyBtb2RlLCB0YXJnZXQ6IHsgb2Zmc2V0SGVpZ2h0LCBzY3JvbGxIZWlnaHQsIHNjcm9sbFRvcCB9IH0pIHtcbiAgY29uc3QgYXRCb3R0b20gPSBzY3JvbGxIZWlnaHQgLSBzY3JvbGxUb3AgLSBvZmZzZXRIZWlnaHQgPCBORUFSX0VORF9USFJFU0hPTEQ7XG4gIGNvbnN0IGF0VG9wID0gc2Nyb2xsVG9wIDwgTkVBUl9FTkRfVEhSRVNIT0xEO1xuXG4gIGNvbnN0IGF0RW5kID0gbW9kZSA9PT0gTU9ERV9UT1AgPyBhdFRvcCA6IGF0Qm90dG9tO1xuICBjb25zdCBhdFN0YXJ0ID0gbW9kZSAhPT0gTU9ERV9UT1AgPyBhdFRvcCA6IGF0Qm90dG9tO1xuXG4gIHJldHVybiB7XG4gICAgYXRCb3R0b20sXG4gICAgYXRFbmQsXG4gICAgYXRTdGFydCxcbiAgICBhdFRvcFxuICB9O1xufVxuXG5mdW5jdGlvbiBpc0VuZChhbmltYXRlVG8sIG1vZGUpIHtcbiAgcmV0dXJuIGFuaW1hdGVUbyA9PT0gKG1vZGUgPT09IE1PREVfVE9QID8gMCA6ICcxMDAlJyk7XG59XG5cbmNvbnN0IENvbXBvc2VyID0gKHtcbiAgY2hlY2tJbnRlcnZhbCA9IDEwMCxcbiAgY2hpbGRyZW4sXG4gIGRlYm91bmNlID0gMTcsXG4gIGRlYnVnOiBkZWJ1Z0Zyb21Qcm9wLFxuICBpbml0aWFsU2Nyb2xsQmVoYXZpb3IgPSAnc21vb3RoJyxcbiAgbW9kZSxcbiAgbm9uY2UsXG4gIHNjcm9sbGVyID0gREVGQVVMVF9TQ1JPTExFUlxufSkgPT4ge1xuICBjb25zdCBkZWJ1ZyA9IHVzZU1lbW8oKCkgPT4gY3JlYXRlRGVidWcoYDxTY3JvbGxUb0JvdHRvbT5gLCB7IGZvcmNlOiBkZWJ1Z0Zyb21Qcm9wIH0pLCBbZGVidWdGcm9tUHJvcF0pO1xuXG4gIG1vZGUgPSBtb2RlID09PSBNT0RFX1RPUCA/IE1PREVfVE9QIDogTU9ERV9CT1RUT007XG5cbiAgY29uc3QgaWdub3JlU2Nyb2xsRXZlbnRCZWZvcmVSZWYgPSB1c2VSZWYoMCk7XG4gIGNvbnN0IGluaXRpYWxTY3JvbGxCZWhhdmlvclJlZiA9IHVzZVJlZihpbml0aWFsU2Nyb2xsQmVoYXZpb3IpO1xuICBjb25zdCBbYW5pbWF0ZVRvLCBzZXRBbmltYXRlVG8sIGFuaW1hdGVUb1JlZl0gPSB1c2VTdGF0ZVJlZihtb2RlID09PSBNT0RFX1RPUCA/IDAgOiAnMTAwJScpO1xuICBjb25zdCBbdGFyZ2V0LCBzZXRUYXJnZXQsIHRhcmdldFJlZl0gPSB1c2VTdGF0ZVJlZihudWxsKTtcblxuICAvLyBJbnRlcm5hbCBjb250ZXh0XG4gIGNvbnN0IGFuaW1hdGVGcm9tUmVmID0gdXNlUmVmKDApO1xuICBjb25zdCBvZmZzZXRIZWlnaHRSZWYgPSB1c2VSZWYoMCk7XG4gIGNvbnN0IHNjcm9sbEhlaWdodFJlZiA9IHVzZVJlZigwKTtcblxuICAvLyBTdGF0ZSBjb250ZXh0XG4gIGNvbnN0IFthdEJvdHRvbSwgc2V0QXRCb3R0b21dID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFthdEVuZCwgc2V0QXRFbmRdID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFthdFRvcCwgc2V0QXRUb3BdID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFthdFN0YXJ0LCBzZXRBdFN0YXJ0XSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3N0aWNreSwgc2V0U3RpY2t5LCBzdGlja3lSZWZdID0gdXNlU3RhdGVSZWYodHJ1ZSk7XG5cbiAgLy8gSGlnaC1yYXRlIHN0YXRlIGNvbnRleHRcbiAgY29uc3Qgc2Nyb2xsUG9zaXRpb25PYnNlcnZlcnNSZWYgPSB1c2VSZWYoW10pO1xuICBjb25zdCBvYnNlcnZlU2Nyb2xsUG9zaXRpb24gPSB1c2VDYWxsYmFjayhcbiAgICBmbiA9PiB7XG4gICAgICBjb25zdCB7IGN1cnJlbnQ6IHRhcmdldCB9ID0gdGFyZ2V0UmVmO1xuXG4gICAgICBzY3JvbGxQb3NpdGlvbk9ic2VydmVyc1JlZi5jdXJyZW50LnB1c2goZm4pO1xuICAgICAgdGFyZ2V0ICYmIGZuKHsgc2Nyb2xsVG9wOiB0YXJnZXQuc2Nyb2xsVG9wIH0pO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnQ6IHNjcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzIH0gPSBzY3JvbGxQb3NpdGlvbk9ic2VydmVyc1JlZjtcbiAgICAgICAgY29uc3QgaW5kZXggPSBzY3JvbGxQb3NpdGlvbk9ic2VydmVycy5pbmRleE9mKGZuKTtcblxuICAgICAgICB+aW5kZXggJiYgc2Nyb2xsUG9zaXRpb25PYnNlcnZlcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH07XG4gICAgfSxcbiAgICBbc2Nyb2xsUG9zaXRpb25PYnNlcnZlcnNSZWYsIHRhcmdldFJlZl1cbiAgKTtcblxuICBjb25zdCBoYW5kbGVTcGluZVRvRW5kID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNvbnN0IHsgY3VycmVudDogYW5pbWF0ZVRvIH0gPSBhbmltYXRlVG9SZWY7XG5cbiAgICBkZWJ1ZygoKSA9PiBbXG4gICAgICAnJWNTcGluZVRvJWM6ICVjb25FbmQlYyBpcyBmaXJlZC4nLFxuICAgICAgLi4uc3R5bGVDb25zb2xlKCdtYWdlbnRhJyksXG4gICAgICAuLi5zdHlsZUNvbnNvbGUoJ29yYW5nZScpLFxuICAgICAgeyBhbmltYXRlVG8gfVxuICAgIF0pO1xuXG4gICAgaWdub3JlU2Nyb2xsRXZlbnRCZWZvcmVSZWYuY3VycmVudCA9IERhdGUubm93KCk7XG5cbiAgICAvLyBoYW5kbGVTY3JvbGxFbmQgbWF5IGVuZCBhdCBhIHBvc2l0aW9uIHdoaWNoIHNob3VsZCBsb3NlIHN0aWNraW5lc3MuXG4gICAgLy8gSW4gdGhhdCBjYXNlLCB3ZSB3aWxsIG5lZWQgdG8gc2V0IHN0aWNreSB0byBmYWxzZSB0byBzdG9wIHRoZSBpbnRlcnZhbCBjaGVjay5cbiAgICAvLyBUZXN0IGNhc2U6XG4gICAgLy8gMS4gQWRkIGEgc2Nyb2xsZXIgdGhhdCBhbHdheXMgcmV0dXJuIDBcbiAgICAvLyAyLiBTaG93IGEgcGFuZWwgd2l0aCBtb2RlID09PSBNT0RFX0JPVFRPTVxuICAgIC8vIDMuIFByb2dyYW1tYXRpY2FsbHkgc2Nyb2xsIHRvIDAgKHNldCBlbGVtZW50LnNjcm9sbFRvcCA9IDApXG4gICAgLy8gRXhwZWN0ZWQ6IGl0IHNob3VsZCBub3QgcmVwZXRpdGl2ZWx5IGNhbGwgc2Nyb2xsVG8oMClcbiAgICAvLyAgICAgICAgICAgaXQgc2hvdWxkIHNldCBzdGlja2luZXNzIHRvIGZhbHNlXG5cbiAgICBpc0VuZChhbmltYXRlVG8sIG1vZGUpIHx8IHNldFN0aWNreShmYWxzZSk7XG4gICAgc2V0QW5pbWF0ZVRvKG51bGwpO1xuICB9LCBbYW5pbWF0ZVRvUmVmLCBkZWJ1ZywgaWdub3JlU2Nyb2xsRXZlbnRCZWZvcmVSZWYsIG1vZGUsIHNldEFuaW1hdGVUbywgc2V0U3RpY2t5XSk7XG5cbiAgLy8gRnVuY3Rpb24gY29udGV4dFxuICBjb25zdCBzY3JvbGxUbyA9IHVzZUNhbGxiYWNrKFxuICAgIChuZXh0QW5pbWF0ZVRvLCB7IGJlaGF2aW9yIH0gPSB7fSkgPT4ge1xuICAgICAgY29uc3QgeyBjdXJyZW50OiB0YXJnZXQgfSA9IHRhcmdldFJlZjtcblxuICAgICAgaWYgKHR5cGVvZiBuZXh0QW5pbWF0ZVRvICE9PSAnbnVtYmVyJyAmJiBuZXh0QW5pbWF0ZVRvICE9PSAnMTAwJScpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybigncmVhY3Qtc2Nyb2xsLXRvLWJvdHRvbTogQXJndW1lbnRzIHBhc3NlZCB0byBzY3JvbGxUbygpIG11c3QgYmUgZWl0aGVyIG51bWJlciBvciBcIjEwMCVcIi4nKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgaXQgaXMgdHJ5aW5nIHRvIHNjcm9sbCB0byBhIHBvc2l0aW9uIHdoaWNoIGlzIG5vdCBcImF0RW5kXCIsIGl0IHNob3VsZCBzZXQgc3RpY2t5IHRvIGZhbHNlIGFmdGVyIHNjcm9sbCBlbmRlZC5cblxuICAgICAgZGVidWcoKCkgPT4gW1xuICAgICAgICBbXG4gICAgICAgICAgYCVjc2Nyb2xsVG8lYzogV2lsbCBzY3JvbGwgdG8gJWMke1xuICAgICAgICAgICAgdHlwZW9mIG5leHRBbmltYXRlVG8gPT09ICdudW1iZXInID8gbmV4dEFuaW1hdGVUbyArICdweCcgOiBuZXh0QW5pbWF0ZVRvLnJlcGxhY2UoLyUvZ3UsICclJScpXG4gICAgICAgICAgfSVjYCxcbiAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ2xpbWUnLCAnJyksXG4gICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdwdXJwbGUnKVxuICAgICAgICBdLFxuICAgICAgICB7XG4gICAgICAgICAgYmVoYXZpb3IsXG4gICAgICAgICAgbmV4dEFuaW1hdGVUbyxcbiAgICAgICAgICB0YXJnZXRcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGlmIChiZWhhdmlvciA9PT0gJ2F1dG8nKSB7XG4gICAgICAgIC8vIFN0b3AgYW55IGV4aXN0aW5nIGFuaW1hdGlvblxuICAgICAgICBoYW5kbGVTcGluZVRvRW5kKCk7XG5cbiAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgIC8vIEp1bXAgdG8gdGhlIHNjcm9sbCBwb3NpdGlvblxuICAgICAgICAgIHRhcmdldC5zY3JvbGxUb3AgPSBuZXh0QW5pbWF0ZVRvID09PSAnMTAwJScgPyB0YXJnZXQuc2Nyb2xsSGVpZ2h0IC0gdGFyZ2V0Lm9mZnNldEhlaWdodCA6IG5leHRBbmltYXRlVG87XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJlaGF2aW9yICE9PSAnc21vb3RoJyAmJlxuICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICdyZWFjdC1zY3JvbGwtdG8tYm90dG9tOiBQbGVhc2Ugc2V0IFwiYmVoYXZpb3JcIiB3aGVuIGNhbGxpbmcgXCJzY3JvbGxUb1wiLiBJbiBmdXR1cmUgdmVyc2lvbnMsIHRoZSBkZWZhdWx0IGJlaGF2aW9yIHdpbGwgYmUgY2hhbmdlZCBmcm9tIHNtb290aCBzY3JvbGxpbmcgdG8gZGlzY3JldGUgc2Nyb2xsaW5nIHRvIGFsaWduIHdpdGggSFRNTCBTdGFuZGFyZC4nXG4gICAgICAgICAgKTtcblxuICAgICAgICBzZXRBbmltYXRlVG8obmV4dEFuaW1hdGVUbyk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaXMgaXMgZm9yIGhhbmRsaW5nIGEgY2FzZS4gV2hlbiBjYWxsaW5nIHNjcm9sbFRvKCcxMDAlJywgeyBiZWhhdmlvcjogJ2F1dG8nIH0pIG11bHRpcGxlIHRpbWVzLCBpdCB3b3VsZCBsb3NlIHN0aWNraW5lc3MuXG4gICAgICBpZiAoaXNFbmQobmV4dEFuaW1hdGVUbywgbW9kZSkpIHtcbiAgICAgICAgZGVidWcoKCkgPT4gW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIGAlY3Njcm9sbFRvJWM6IFNjcm9sbGluZyB0byBlbmQsIHdpbGwgc2V0IHN0aWNreSB0byAlY3RydWUlYy5gLFxuICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdsaW1lJywgJycpLFxuICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdwdXJwbGUnKVxuICAgICAgICAgIF0sXG4gICAgICAgICAgW3sgbW9kZSwgbmV4dEFuaW1hdGVUbyB9XVxuICAgICAgICBdKTtcblxuICAgICAgICBzZXRTdGlja3kodHJ1ZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBbZGVidWcsIGhhbmRsZVNwaW5lVG9FbmQsIG1vZGUsIHNldEFuaW1hdGVUbywgc2V0U3RpY2t5LCB0YXJnZXRSZWZdXG4gICk7XG5cbiAgY29uc3Qgc2Nyb2xsVG9Cb3R0b20gPSB1c2VDYWxsYmFjayhcbiAgICAoeyBiZWhhdmlvciB9ID0ge30pID0+IHtcbiAgICAgIGRlYnVnKCgpID0+IFsnJWNzY3JvbGxUb0JvdHRvbSVjOiBDYWxsZWQnLCAuLi5zdHlsZUNvbnNvbGUoJ3llbGxvdycsICcnKV0pO1xuXG4gICAgICBiZWhhdmlvciAhPT0gJ3Ntb290aCcgJiZcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdyZWFjdC1zY3JvbGwtdG8tYm90dG9tOiBQbGVhc2Ugc2V0IFwiYmVoYXZpb3JcIiB3aGVuIGNhbGxpbmcgXCJzY3JvbGxUb0JvdHRvbVwiLiBJbiBmdXR1cmUgdmVyc2lvbnMsIHRoZSBkZWZhdWx0IGJlaGF2aW9yIHdpbGwgYmUgY2hhbmdlZCBmcm9tIHNtb290aCBzY3JvbGxpbmcgdG8gZGlzY3JldGUgc2Nyb2xsaW5nIHRvIGFsaWduIHdpdGggSFRNTCBTdGFuZGFyZC4nXG4gICAgICAgICk7XG5cbiAgICAgIHNjcm9sbFRvKCcxMDAlJywgeyBiZWhhdmlvcjogYmVoYXZpb3IgfHwgJ3Ntb290aCcgfSk7XG4gICAgfSxcbiAgICBbZGVidWcsIHNjcm9sbFRvXVxuICApO1xuXG4gIGNvbnN0IHNjcm9sbFRvVG9wID0gdXNlQ2FsbGJhY2soXG4gICAgKHsgYmVoYXZpb3IgfSA9IHt9KSA9PiB7XG4gICAgICBkZWJ1ZygoKSA9PiBbJyVjc2Nyb2xsVG9Ub3AlYzogQ2FsbGVkJywgLi4uc3R5bGVDb25zb2xlKCd5ZWxsb3cnLCAnJyldKTtcblxuICAgICAgYmVoYXZpb3IgIT09ICdzbW9vdGgnICYmXG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAncmVhY3Qtc2Nyb2xsLXRvLWJvdHRvbTogUGxlYXNlIHNldCBcImJlaGF2aW9yXCIgd2hlbiBjYWxsaW5nIFwic2Nyb2xsVG9Ub3BcIi4gSW4gZnV0dXJlIHZlcnNpb25zLCB0aGUgZGVmYXVsdCBiZWhhdmlvciB3aWxsIGJlIGNoYW5nZWQgZnJvbSBzbW9vdGggc2Nyb2xsaW5nIHRvIGRpc2NyZXRlIHNjcm9sbGluZyB0byBhbGlnbiB3aXRoIEhUTUwgU3RhbmRhcmQuJ1xuICAgICAgICApO1xuXG4gICAgICBzY3JvbGxUbygwLCB7IGJlaGF2aW9yOiBiZWhhdmlvciB8fCAnc21vb3RoJyB9KTtcbiAgICB9LFxuICAgIFtkZWJ1Zywgc2Nyb2xsVG9dXG4gICk7XG5cbiAgY29uc3Qgc2Nyb2xsVG9FbmQgPSB1c2VDYWxsYmFjayhcbiAgICAoeyBiZWhhdmlvciB9ID0ge30pID0+IHtcbiAgICAgIGRlYnVnKCgpID0+IFsnJWNzY3JvbGxUb0VuZCVjOiBDYWxsZWQnLCAuLi5zdHlsZUNvbnNvbGUoJ3llbGxvdycsICcnKV0pO1xuXG4gICAgICBiZWhhdmlvciAhPT0gJ3Ntb290aCcgJiZcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdyZWFjdC1zY3JvbGwtdG8tYm90dG9tOiBQbGVhc2Ugc2V0IFwiYmVoYXZpb3JcIiB3aGVuIGNhbGxpbmcgXCJzY3JvbGxUb0VuZFwiLiBJbiBmdXR1cmUgdmVyc2lvbnMsIHRoZSBkZWZhdWx0IGJlaGF2aW9yIHdpbGwgYmUgY2hhbmdlZCBmcm9tIHNtb290aCBzY3JvbGxpbmcgdG8gZGlzY3JldGUgc2Nyb2xsaW5nIHRvIGFsaWduIHdpdGggSFRNTCBTdGFuZGFyZC4nXG4gICAgICAgICk7XG5cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGJlaGF2aW9yOiBiZWhhdmlvciB8fCAnc21vb3RoJyB9O1xuXG4gICAgICBtb2RlID09PSBNT0RFX1RPUCA/IHNjcm9sbFRvVG9wKG9wdGlvbnMpIDogc2Nyb2xsVG9Cb3R0b20ob3B0aW9ucyk7XG4gICAgfSxcbiAgICBbZGVidWcsIG1vZGUsIHNjcm9sbFRvQm90dG9tLCBzY3JvbGxUb1RvcF1cbiAgKTtcblxuICBjb25zdCBzY3JvbGxUb1N0YXJ0ID0gdXNlQ2FsbGJhY2soXG4gICAgKHsgYmVoYXZpb3IgfSA9IHt9KSA9PiB7XG4gICAgICBkZWJ1ZygoKSA9PiBbJyVjc2Nyb2xsVG9TdGFydCVjOiBDYWxsZWQnLCAuLi5zdHlsZUNvbnNvbGUoJ3llbGxvdycsICcnKV0pO1xuXG4gICAgICBiZWhhdmlvciAhPT0gJ3Ntb290aCcgJiZcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdyZWFjdC1zY3JvbGwtdG8tYm90dG9tOiBQbGVhc2Ugc2V0IFwiYmVoYXZpb3JcIiB3aGVuIGNhbGxpbmcgXCJzY3JvbGxUb1N0YXJ0XCIuIEluIGZ1dHVyZSB2ZXJzaW9ucywgdGhlIGRlZmF1bHQgYmVoYXZpb3Igd2lsbCBiZSBjaGFuZ2VkIGZyb20gc21vb3RoIHNjcm9sbGluZyB0byBkaXNjcmV0ZSBzY3JvbGxpbmcgdG8gYWxpZ24gd2l0aCBIVE1MIFN0YW5kYXJkLidcbiAgICAgICAgKTtcblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgYmVoYXZpb3I6IGJlaGF2aW9yIHx8ICdzbW9vdGgnIH07XG5cbiAgICAgIG1vZGUgPT09IE1PREVfVE9QID8gc2Nyb2xsVG9Cb3R0b20ob3B0aW9ucykgOiBzY3JvbGxUb1RvcChvcHRpb25zKTtcbiAgICB9LFxuICAgIFtkZWJ1ZywgbW9kZSwgc2Nyb2xsVG9Cb3R0b20sIHNjcm9sbFRvVG9wXVxuICApO1xuXG4gIGNvbnN0IHNjcm9sbFRvU3RpY2t5ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNvbnN0IHsgY3VycmVudDogdGFyZ2V0IH0gPSB0YXJnZXRSZWY7XG5cbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICBpZiAoaW5pdGlhbFNjcm9sbEJlaGF2aW9yUmVmLmN1cnJlbnQgPT09ICdhdXRvJykge1xuICAgICAgICBkZWJ1ZygoKSA9PiBbYCVjdGFyZ2V0IGNoYW5nZWQlYzogSW5pdGlhbCBzY3JvbGxgLCAuLi5zdHlsZUNvbnNvbGUoJ2JsdWUnKV0pO1xuXG4gICAgICAgIHRhcmdldC5zY3JvbGxUb3AgPSBtb2RlID09PSBNT0RFX1RPUCA/IDAgOiB0YXJnZXQuc2Nyb2xsSGVpZ2h0IC0gdGFyZ2V0Lm9mZnNldEhlaWdodDtcbiAgICAgICAgaW5pdGlhbFNjcm9sbEJlaGF2aW9yUmVmLmN1cnJlbnQgPSBmYWxzZTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaXMgaXMgdmVyeSBzaW1pbGFyIHRvIHNjcm9sbFRvRW5kKCkuXG4gICAgICAvLyBJbnN0ZWFkIG9mIHNjcm9sbGluZyB0byBlbmQsIGl0IHdpbGwgY2FsbCBwcm9wcy5zY3JvbGxlcigpIHRvIGRldGVybWluZXMgaG93IGZhciBpdCBzaG91bGQgc2Nyb2xsLlxuICAgICAgLy8gVGhpcyBmdW5jdGlvbiBjb3VsZCBiZSBjYWxsZWQgd2hpbGUgaXQgaXMgYXV0by1zY3JvbGxpbmcuXG5cbiAgICAgIGNvbnN0IHsgY3VycmVudDogYW5pbWF0ZUZyb20gfSA9IGFuaW1hdGVGcm9tUmVmO1xuICAgICAgY29uc3QgeyBvZmZzZXRIZWlnaHQsIHNjcm9sbEhlaWdodCwgc2Nyb2xsVG9wIH0gPSB0YXJnZXQ7XG5cbiAgICAgIGNvbnN0IG1heFZhbHVlID0gbW9kZSA9PT0gTU9ERV9UT1AgPyAwIDogTWF0aC5tYXgoMCwgc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0SGVpZ2h0IC0gc2Nyb2xsVG9wKTtcbiAgICAgIGNvbnN0IG1pblZhbHVlID0gTWF0aC5tYXgoMCwgYW5pbWF0ZUZyb20gLSBzY3JvbGxUb3ApO1xuXG4gICAgICBjb25zdCByYXdOZXh0VmFsdWUgPSBzY3JvbGxlcih7IG1heFZhbHVlLCBtaW5WYWx1ZSwgb2Zmc2V0SGVpZ2h0LCBzY3JvbGxIZWlnaHQsIHNjcm9sbFRvcCB9KTtcblxuICAgICAgY29uc3QgbmV4dFZhbHVlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obWF4VmFsdWUsIHJhd05leHRWYWx1ZSkpO1xuXG4gICAgICBsZXQgbmV4dEFuaW1hdGVUbztcblxuICAgICAgaWYgKG1vZGUgPT09IE1PREVfVE9QIHx8IG5leHRWYWx1ZSAhPT0gbWF4VmFsdWUpIHtcbiAgICAgICAgbmV4dEFuaW1hdGVUbyA9IHNjcm9sbFRvcCArIG5leHRWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdoZW4gc2Nyb2xsaW5nIHRvIGJvdHRvbSwgd2Ugc2hvdWxkIHNjcm9sbCB0byBcIjEwMCVcIi5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBpZiB3ZSBzY3JvbGwgdG8gYW55IG51bWJlciwgaXQgd2lsbCBsb3NlIHN0aWNraW5lc3Mgd2hlbiBlbGVtZW50cyBhcmUgYWRkaW5nIHRvbyBmYXN0LlxuICAgICAgICAvLyBcIjEwMCVcIiBpcyBhIHNwZWNpYWwgYXJndW1lbnQgaW50ZW5kZWQgdG8gbWFrZSBzdXJlIHN0aWNraW5lc3MgaXMgbm90IGxvc3Qgd2hpbGUgbmV3IGVsZW1lbnRzIGFyZSBiZWluZyBhZGRlZC5cbiAgICAgICAgbmV4dEFuaW1hdGVUbyA9ICcxMDAlJztcbiAgICAgIH1cblxuICAgICAgZGVidWcoKCkgPT4gW1xuICAgICAgICBbXG4gICAgICAgICAgYCVjc2Nyb2xsVG9TdGlja3klYzogV2lsbCBhbmltYXRlIGZyb20gJWMke2FuaW1hdGVGcm9tfXB4JWMgdG8gJWMke1xuICAgICAgICAgICAgdHlwZW9mIG5leHRBbmltYXRlVG8gPT09ICdudW1iZXInID8gbmV4dEFuaW1hdGVUbyArICdweCcgOiBuZXh0QW5pbWF0ZVRvLnJlcGxhY2UoLyUvZ3UsICclJScpXG4gICAgICAgICAgfSVjICglYyR7KG5leHRBbmltYXRlVG8gPT09ICcxMDAlJyA/IG1heFZhbHVlIDogbmV4dEFuaW1hdGVUbykgKyBhbmltYXRlRnJvbX1weCVjKWAsXG4gICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdvcmFuZ2UnKSxcbiAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3B1cnBsZScpLFxuICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncHVycGxlJyksXG4gICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdwdXJwbGUnKVxuICAgICAgICBdLFxuICAgICAgICB7XG4gICAgICAgICAgYW5pbWF0ZUZyb20sXG4gICAgICAgICAgbWF4VmFsdWUsXG4gICAgICAgICAgbWluVmFsdWUsXG4gICAgICAgICAgbmV4dEFuaW1hdGVUbyxcbiAgICAgICAgICBuZXh0VmFsdWUsXG4gICAgICAgICAgb2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgIHJhd05leHRWYWx1ZSxcbiAgICAgICAgICBzY3JvbGxIZWlnaHQsXG4gICAgICAgICAgc2Nyb2xsVG9wXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBzY3JvbGxUbyhuZXh0QW5pbWF0ZVRvLCB7IGJlaGF2aW9yOiAnc21vb3RoJyB9KTtcbiAgICB9XG4gIH0sIFthbmltYXRlRnJvbVJlZiwgZGVidWcsIG1vZGUsIHNjcm9sbGVyLCBzY3JvbGxUbywgdGFyZ2V0UmVmXSk7XG5cbiAgY29uc3QgaGFuZGxlU2Nyb2xsID0gdXNlQ2FsbGJhY2soXG4gICAgKHsgdGltZVN0YW1wTG93IH0pID0+IHtcbiAgICAgIGNvbnN0IHsgY3VycmVudDogYW5pbWF0ZVRvIH0gPSBhbmltYXRlVG9SZWY7XG4gICAgICBjb25zdCB7IGN1cnJlbnQ6IHRhcmdldCB9ID0gdGFyZ2V0UmVmO1xuXG4gICAgICBjb25zdCBhbmltYXRpbmcgPSBhbmltYXRlVG8gIT09IG51bGw7XG5cbiAgICAgIC8vIEN1cnJlbnRseSwgdGhlcmUgYXJlIG5vIHJlbGlhYmxlIHdheSB0byBjaGVjayBpZiB0aGUgXCJzY3JvbGxcIiBldmVudCBpcyB0cmlnZ2VyIGR1ZSB0b1xuICAgICAgLy8gdXNlciBnZXN0dXJlLCBwcm9ncmFtbWF0aWMgc2Nyb2xsaW5nLCBvciBDaHJvbWUtc3ludGhlc2l6ZWQgXCJzY3JvbGxcIiBldmVudCB0byBjb21wZW5zYXRlIHNpemUgY2hhbmdlLlxuICAgICAgLy8gVGh1cywgd2UgdXNlIG91ciBiZXN0LWVmZm9ydCB0byBndWVzcyBpZiBpdCBpcyB0cmlnZ2VyZWQgYnkgdXNlciBnZXN0dXJlLCBhbmQgZGlzYWJsZSBzdGlja3kgaWYgaXQgaXMgaGVhZGluZyB0b3dhcmRzIHRoZSBzdGFydCBkaXJlY3Rpb24uXG5cbiAgICAgIGlmICh0aW1lU3RhbXBMb3cgPD0gaWdub3JlU2Nyb2xsRXZlbnRCZWZvcmVSZWYuY3VycmVudCB8fCAhdGFyZ2V0KSB7XG4gICAgICAgIC8vIFNpbmNlIHdlIGRlYm91bmNlIFwic2Nyb2xsXCIgZXZlbnQsIHRoaXMgaGFuZGxlciBtaWdodCBiZSBjYWxsZWQgYWZ0ZXIgc3BpbmVUby5vbkVuZCAoYS5rLmEuIGFydGlmaWNpYWwgc2Nyb2xsaW5nKS5cbiAgICAgICAgLy8gV2Ugc2hvdWxkIGlnbm9yZSBkZWJvdW5jZWQgZXZlbnQgZmlyZWQgYWZ0ZXIgc2Nyb2xsRW5kLCBiZWNhdXNlIHdpdGhvdXQgc2tpcHBpbmcgdGhlbSwgdGhlIHVzZXJJbml0aWF0ZWRTY3JvbGwgY2FsY3VsYXRlZCBiZWxvdyB3aWxsIG5vdCBiZSBhY2N1cmF0ZS5cbiAgICAgICAgLy8gVGh1cywgb24gYSBmYXN0IG1hY2hpbmUsIGFkZGluZyBlbGVtZW50cyBzdXBlciBmYXN0IHdpbGwgbG9zZSB0aGUgXCJzdGlja2luZXNzXCIuXG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGF0Qm90dG9tLCBhdEVuZCwgYXRTdGFydCwgYXRUb3AgfSA9IGNvbXB1dGVWaWV3U3RhdGUoeyBtb2RlLCB0YXJnZXQgfSk7XG5cbiAgICAgIHNldEF0Qm90dG9tKGF0Qm90dG9tKTtcbiAgICAgIHNldEF0RW5kKGF0RW5kKTtcbiAgICAgIHNldEF0U3RhcnQoYXRTdGFydCk7XG4gICAgICBzZXRBdFRvcChhdFRvcCk7XG5cbiAgICAgIC8vIENocm9tZSB3aWxsIGVtaXQgXCJzeW50aGV0aWNcIiBzY3JvbGwgZXZlbnQgaWYgdGhlIGNvbnRhaW5lciBpcyByZXNpemVkIG9yIGFuIGVsZW1lbnQgaXMgYWRkZWRcbiAgICAgIC8vIFdlIG5lZWQgdG8gaWdub3JlIHRoZXNlIFwic3ludGhldGljXCIgZXZlbnRzXG4gICAgICAvLyBSZXBybzogSW4gcGxheWdyb3VuZCwgcHJlc3MgNC0xLTUtMS0xIChzbWFsbCwgYWRkIG9uZSwgbm9ybWFsLCBhZGQgb25lLCBhZGQgb25lKVxuICAgICAgLy8gICAgICAgIE5vbWF0dGVyIGhvdyBmYXN0IG9yIHNsb3cgdGhlIHNlcXVlbmNlIGlzIGJlaW5nIHByZXNzZWQsIGl0IHNob3VsZCBzdGlsbCBzdGljayB0byB0aGUgYm90dG9tXG4gICAgICBjb25zdCB7IG9mZnNldEhlaWdodDogbmV4dE9mZnNldEhlaWdodCwgc2Nyb2xsSGVpZ2h0OiBuZXh0U2Nyb2xsSGVpZ2h0IH0gPSB0YXJnZXQ7XG4gICAgICBjb25zdCB7IGN1cnJlbnQ6IG9mZnNldEhlaWdodCB9ID0gb2Zmc2V0SGVpZ2h0UmVmO1xuICAgICAgY29uc3QgeyBjdXJyZW50OiBzY3JvbGxIZWlnaHQgfSA9IHNjcm9sbEhlaWdodFJlZjtcbiAgICAgIGNvbnN0IG9mZnNldEhlaWdodENoYW5nZWQgPSBuZXh0T2Zmc2V0SGVpZ2h0ICE9PSBvZmZzZXRIZWlnaHQ7XG4gICAgICBjb25zdCBzY3JvbGxIZWlnaHRDaGFuZ2VkID0gbmV4dFNjcm9sbEhlaWdodCAhPT0gc2Nyb2xsSGVpZ2h0O1xuXG4gICAgICBpZiAob2Zmc2V0SGVpZ2h0Q2hhbmdlZCkge1xuICAgICAgICBvZmZzZXRIZWlnaHRSZWYuY3VycmVudCA9IG5leHRPZmZzZXRIZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxIZWlnaHRDaGFuZ2VkKSB7XG4gICAgICAgIHNjcm9sbEhlaWdodFJlZi5jdXJyZW50ID0gbmV4dFNjcm9sbEhlaWdodDtcbiAgICAgIH1cblxuICAgICAgLy8gU3RpY2t5IG1lYW5zOlxuICAgICAgLy8gLSBJZiBpdCBpcyBzY3JvbGxlZCBwcm9ncmFtYXRpY2FsbHksIHdlIGFyZSBzdGlsbCBpbiBzdGlja3kgbW9kZVxuICAgICAgLy8gLSBJZiBpdCBpcyBzY3JvbGxlZCBieSB0aGUgdXNlciwgdGhlbiBzdGlja3kgbWVhbnMgaWYgd2UgYXJlIGF0IHRoZSBlbmRcblxuICAgICAgLy8gT25seSB1cGRhdGUgc3RpY2tpbmVzcyBpZiB0aGUgc2Nyb2xsIGV2ZW50IGlzIG5vdCBkdWUgdG8gc3ludGhldGljIHNjcm9sbCBkb25lIGJ5IENocm9tZVxuICAgICAgaWYgKCFvZmZzZXRIZWlnaHRDaGFuZ2VkICYmICFzY3JvbGxIZWlnaHRDaGFuZ2VkKSB7XG4gICAgICAgIC8vIFdlIGFyZSBzdGlja3kgaWYgd2UgYXJlIGFuaW1hdGluZyB0byB0aGUgZW5kLCBvciB3ZSBhcmUgYWxyZWFkeSBhdCB0aGUgZW5kLlxuICAgICAgICAvLyBXZSBjYW4gYmUgXCJhbmltYXRpbmcgYnV0IG5vdCBzdGlja3lcIiBieSBjYWxsaW5nIFwic2Nyb2xsVG8oMTAwKVwiIHdoZXJlIHRoZSBjb250YWluZXIgc2Nyb2xsSGVpZ2h0IGlzIDIwMHB4LlxuICAgICAgICBjb25zdCBuZXh0U3RpY2t5ID0gKGFuaW1hdGluZyAmJiBpc0VuZChhbmltYXRlVG8sIG1vZGUpKSB8fCBhdEVuZDtcblxuICAgICAgICBpZiAoc3RpY2t5UmVmLmN1cnJlbnQgIT09IG5leHRTdGlja3kpIHtcbiAgICAgICAgICBkZWJ1ZygoKSA9PiBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIGAlY29uU2Nyb2xsJWM6ICVjc2V0U3RpY2t5JWMoJWMke25leHRTdGlja3l9JWMpYCxcbiAgICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdyZWQnKSxcbiAgICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdyZWQnKSxcbiAgICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdwdXJwbGUnKVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgYChhbmltYXRpbmcgPSAlYyR7YW5pbWF0aW5nfSVjICYmIGlzRW5kID0gJWMke2lzRW5kKGFuaW1hdGVUbywgbW9kZSl9JWMpIHx8IGF0RW5kID0gJWMke2F0RW5kfSVjYCxcbiAgICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdwdXJwbGUnKSxcbiAgICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdwdXJwbGUnKSxcbiAgICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdwdXJwbGUnKSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFuaW1hdGluZyxcbiAgICAgICAgICAgICAgICBhbmltYXRlVG8sXG4gICAgICAgICAgICAgICAgYXRFbmQsXG4gICAgICAgICAgICAgICAgbW9kZSxcbiAgICAgICAgICAgICAgICBvZmZzZXRIZWlnaHQ6IHRhcmdldC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICAgICAgc2Nyb2xsSGVpZ2h0OiB0YXJnZXQuc2Nyb2xsSGVpZ2h0LFxuICAgICAgICAgICAgICAgIHN0aWNreTogc3RpY2t5UmVmLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgbmV4dFN0aWNreVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgXSk7XG5cbiAgICAgICAgICBzZXRTdGlja3kobmV4dFN0aWNreSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc3RpY2t5UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgZGVidWcoKCkgPT4gW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIGAlY29uU2Nyb2xsJWM6IFNpemUgY2hhbmdlZCB3aGlsZSBzdGlja3ksIGNhbGxpbmcgJWNzY3JvbGxUb1N0aWNreSgpJWNgLFxuICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdyZWQnKSxcbiAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgnb3JhbmdlJyksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG9mZnNldEhlaWdodENoYW5nZWQsXG4gICAgICAgICAgICAgIHNjcm9sbEhlaWdodENoYW5nZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5leHRPZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICBwcmV2T2Zmc2V0SGVpZ2h0OiBvZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICBuZXh0U2Nyb2xsSGVpZ2h0LFxuICAgICAgICAgICAgcHJldlNjcm9sbEhlaWdodDogc2Nyb2xsSGVpZ2h0XG4gICAgICAgICAgfVxuICAgICAgICBdKTtcblxuICAgICAgICBzY3JvbGxUb1N0aWNreSgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB7IHNjcm9sbFRvcDogYWN0dWFsU2Nyb2xsVG9wIH0gPSB0YXJnZXQ7XG5cbiAgICAgIHNjcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzUmVmLmN1cnJlbnQuZm9yRWFjaChvYnNlcnZlciA9PiBvYnNlcnZlcih7IHNjcm9sbFRvcDogYWN0dWFsU2Nyb2xsVG9wIH0pKTtcbiAgICB9LFxuICAgIFtcbiAgICAgIGFuaW1hdGVUb1JlZixcbiAgICAgIGRlYnVnLFxuICAgICAgaWdub3JlU2Nyb2xsRXZlbnRCZWZvcmVSZWYsXG4gICAgICBtb2RlLFxuICAgICAgb2Zmc2V0SGVpZ2h0UmVmLFxuICAgICAgc2Nyb2xsSGVpZ2h0UmVmLFxuICAgICAgc2Nyb2xsUG9zaXRpb25PYnNlcnZlcnNSZWYsXG4gICAgICBzY3JvbGxUb1N0aWNreSxcbiAgICAgIHNldEF0Qm90dG9tLFxuICAgICAgc2V0QXRFbmQsXG4gICAgICBzZXRBdFN0YXJ0LFxuICAgICAgc2V0QXRUb3AsXG4gICAgICBzZXRTdGlja3ksXG4gICAgICBzdGlja3lSZWYsXG4gICAgICB0YXJnZXRSZWZcbiAgICBdXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICBsZXQgc3RpY2t5QnV0Tm90QXRFbmRTaW5jZSA9IGZhbHNlO1xuXG4gICAgICBjb25zdCB0aW1lb3V0ID0gc2V0SW1tZWRpYXRlSW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnQ6IHRhcmdldCB9ID0gdGFyZ2V0UmVmO1xuICAgICAgICBjb25zdCBhbmltYXRpbmcgPSBhbmltYXRlVG9SZWYuY3VycmVudCAhPT0gbnVsbDtcblxuICAgICAgICBpZiAoc3RpY2t5UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICBpZiAoIWNvbXB1dGVWaWV3U3RhdGUoeyBtb2RlLCB0YXJnZXQgfSkuYXRFbmQpIHtcbiAgICAgICAgICAgIGlmICghc3RpY2t5QnV0Tm90QXRFbmRTaW5jZSkge1xuICAgICAgICAgICAgICBzdGlja3lCdXROb3RBdEVuZFNpbmNlID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoRGF0ZS5ub3coKSAtIHN0aWNreUJ1dE5vdEF0RW5kU2luY2UgPiBTQ1JPTExfREVDSVNJT05fRFVSQVRJT04pIHtcbiAgICAgICAgICAgICAgLy8gUXVpcmtzOiBJbiBGaXJlZm94LCBhZnRlciB1c2VyIHNjcm9sbCBkb3duLCBGaXJlZm94IGRvIHR3byB0aGluZ3M6XG4gICAgICAgICAgICAgIC8vICAgICAgICAgMS4gU2V0IHRvIGEgbmV3IFwic2Nyb2xsVG9wXCJcbiAgICAgICAgICAgICAgLy8gICAgICAgICAyLiBGaXJlIFwic2Nyb2xsXCIgZXZlbnRcbiAgICAgICAgICAgICAgLy8gICAgICAgICBGb3Igd2hhdCB3ZSBvYnNlcnZlZCwgIzEgaXMgZmlyZWQgYWJvdXQgMjBtcyBiZWZvcmUgIzIuIFRoZXJlIGlzIGEgY2hhbmNlIHRoYXQgdGhpcyBzdGlja3lDaGVja1RpbWVvdXQgaXMgYmVpbmcgc2NoZWR1bGVkIGJldHdlZW4gMSBhbmQgMi5cbiAgICAgICAgICAgICAgLy8gICAgICAgICBUaGF0IG1lYW5zLCBpZiB3ZSBqdXN0IGxvb2sgYXQgIzEgdG8gZGVjaWRlIGlmIHdlIHNob3VsZCBzY3JvbGwsIHdlIHdpbGwgYWx3YXlzIHNjcm9sbCwgaW4gb3Bwb3NlIHRvIHRoZSB1c2VyJ3MgaW50ZW50aW9uLlxuICAgICAgICAgICAgICAvLyBSZXBybzogT3BlbiBGaXJlZm94LCBzZXQgY2hlY2tJbnRlcnZhbCB0byBhIGxvd2VyIG51bWJlciwgYW5kIHRyeSB0byBzY3JvbGwgYnkgZHJhZ2dpbmcgdGhlIHNjcm9sbCBoYW5kbGVyLiBJdCB3aWxsIGp1bXAgYmFjay5cblxuICAgICAgICAgICAgICAvLyBUaGUgXCJhbmltYXRpbmdcIiBjaGVjayB3aWxsIG1ha2Ugc3VyZSBzdGlja2luZXNzIGlzIG5vdCBsb3N0IHdoZW4gZWxlbWVudHMgYXJlIGFkZGluZyBhdCBhIHZlcnkgZmFzdCBwYWNlLlxuICAgICAgICAgICAgICBpZiAoIWFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgIGFuaW1hdGVGcm9tUmVmLmN1cnJlbnQgPSB0YXJnZXQuc2Nyb2xsVG9wO1xuXG4gICAgICAgICAgICAgICAgZGVidWcoKCkgPT4gW1xuICAgICAgICAgICAgICAgICAgYCVjSW50ZXJ2YWwgY2hlY2slYzogU2hvdWxkIHN0aWNreSBidXQgbm90IGF0IGVuZCwgY2FsbGluZyAlY3Njcm9sbFRvU3RpY2t5KCklYyB0byBzY3JvbGxgLFxuICAgICAgICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCduYXZ5JyksXG4gICAgICAgICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ29yYW5nZScpXG4gICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgICAgICBzY3JvbGxUb1N0aWNreSgpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgc3RpY2t5QnV0Tm90QXRFbmRTaW5jZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGlja3lCdXROb3RBdEVuZFNpbmNlID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldC5zY3JvbGxIZWlnaHQgPD0gdGFyZ2V0Lm9mZnNldEhlaWdodCAmJiAhc3RpY2t5UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAvLyBXaGVuIHRoZSBjb250YWluZXIgaXMgZW1wdGllZCwgd2Ugd2lsbCBzZXQgc3RpY2t5IGJhY2sgdG8gdHJ1ZS5cblxuICAgICAgICAgIGRlYnVnKCgpID0+IFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgYCVjSW50ZXJ2YWwgY2hlY2slYzogQ29udGFpbmVyIGlzIGVtcHRpZWQsIHNldHRpbmcgc3RpY2t5IGJhY2sgdG8gJWN0cnVlJWNgLFxuICAgICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ25hdnknKSxcbiAgICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdwdXJwbGUnKVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG9mZnNldEhlaWdodDogdGFyZ2V0Lm9mZnNldEhlaWdodCxcbiAgICAgICAgICAgICAgICBzY3JvbGxIZWlnaHQ6IHRhcmdldC5zY3JvbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgc3RpY2t5OiBzdGlja3lSZWYuY3VycmVudFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgXSk7XG5cbiAgICAgICAgICBzZXRTdGlja3kodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIE1hdGgubWF4KE1JTl9DSEVDS19JTlRFUlZBTCwgY2hlY2tJbnRlcnZhbCkgfHwgTUlOX0NIRUNLX0lOVEVSVkFMKTtcblxuICAgICAgcmV0dXJuICgpID0+IGNsZWFySW50ZXJ2YWwodGltZW91dCk7XG4gICAgfVxuICB9LCBbYW5pbWF0ZVRvUmVmLCBjaGVja0ludGVydmFsLCBkZWJ1ZywgbW9kZSwgc2Nyb2xsVG9TdGlja3ksIHNldFN0aWNreSwgc3RpY2t5UmVmLCB0YXJnZXQsIHRhcmdldFJlZl0pO1xuXG4gIGNvbnN0IHN0eWxlVG9DbGFzc05hbWUgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBlbW90aW9uID1cbiAgICAgIGVtb3Rpb25Qb29sW25vbmNlXSB8fFxuICAgICAgKGVtb3Rpb25Qb29sW25vbmNlXSA9IGNyZWF0ZUVtb3Rpb24oeyBrZXk6ICdyZWFjdC1zY3JvbGwtdG8tYm90dG9tLS1jc3MtJyArIGNyZWF0ZUNTU0tleSgpLCBub25jZSB9KSk7XG5cbiAgICByZXR1cm4gc3R5bGUgPT4gZW1vdGlvbi5jc3Moc3R5bGUpICsgJyc7XG4gIH0sIFtub25jZV0pO1xuXG4gIGNvbnN0IGludGVybmFsQ29udGV4dCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIG9ic2VydmVTY3JvbGxQb3NpdGlvbixcbiAgICAgIHNldFRhcmdldCxcbiAgICAgIHN0eWxlVG9DbGFzc05hbWVcbiAgICB9KSxcbiAgICBbb2JzZXJ2ZVNjcm9sbFBvc2l0aW9uLCBzZXRUYXJnZXQsIHN0eWxlVG9DbGFzc05hbWVdXG4gICk7XG5cbiAgY29uc3Qgc3RhdGUxQ29udGV4dCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIGF0Qm90dG9tLFxuICAgICAgYXRFbmQsXG4gICAgICBhdFN0YXJ0LFxuICAgICAgYXRUb3AsXG4gICAgICBtb2RlXG4gICAgfSksXG4gICAgW2F0Qm90dG9tLCBhdEVuZCwgYXRTdGFydCwgYXRUb3AsIG1vZGVdXG4gICk7XG5cbiAgY29uc3Qgc3RhdGUyQ29udGV4dCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGFuaW1hdGluZyA9IGFuaW1hdGVUbyAhPT0gbnVsbDtcblxuICAgIHJldHVybiB7XG4gICAgICBhbmltYXRpbmcsXG4gICAgICBhbmltYXRpbmdUb0VuZDogYW5pbWF0aW5nICYmIGlzRW5kKGFuaW1hdGVUbywgbW9kZSksXG4gICAgICBzdGlja3lcbiAgICB9O1xuICB9LCBbYW5pbWF0ZVRvLCBtb2RlLCBzdGlja3ldKTtcblxuICBjb25zdCBjb21iaW5lZFN0YXRlQ29udGV4dCA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIC4uLnN0YXRlMUNvbnRleHQsXG4gICAgICAuLi5zdGF0ZTJDb250ZXh0XG4gICAgfSksXG4gICAgW3N0YXRlMUNvbnRleHQsIHN0YXRlMkNvbnRleHRdXG4gICk7XG5cbiAgY29uc3QgZnVuY3Rpb25Db250ZXh0ID0gdXNlTWVtbyhcbiAgICAoKSA9PiAoe1xuICAgICAgc2Nyb2xsVG8sXG4gICAgICBzY3JvbGxUb0JvdHRvbSxcbiAgICAgIHNjcm9sbFRvRW5kLFxuICAgICAgc2Nyb2xsVG9TdGFydCxcbiAgICAgIHNjcm9sbFRvVG9wXG4gICAgfSksXG4gICAgW3Njcm9sbFRvLCBzY3JvbGxUb0JvdHRvbSwgc2Nyb2xsVG9FbmQsIHNjcm9sbFRvU3RhcnQsIHNjcm9sbFRvVG9wXVxuICApO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gV2UgbmVlZCB0byB1cGRhdGUgdGhlIFwic2Nyb2xsSGVpZ2h0XCIgdmFsdWUgdG8gbGF0ZXN0IHdoZW4gdGhlIHVzZXIgZG8gYSBmb2N1cyBpbnNpZGUgdGhlIGJveC5cbiAgICAvL1xuICAgIC8vIFRoaXMgaXMgYmVjYXVzZTpcbiAgICAvLyAtIEluIG91ciBjb2RlIHRoYXQgbWl0aWdhdGUgQ2hyb21lIHN5bnRoZXRpYyBzY3JvbGxpbmcsIHRoYXQgY29kZSB3aWxsIGxvb2sgYXQgd2hldGhlciBcInNjcm9sbEhlaWdodFwiIHZhbHVlIGlzIGxhdGVzdCBvciBub3QuXG4gICAgLy8gLSBUaGF0IGNvZGUgb25seSBydW4gb24gXCJzY3JvbGxcIiBldmVudC5cbiAgICAvLyAtIFRoYXQgbWVhbnMsIG9uIGV2ZXJ5IFwic2Nyb2xsXCIgZXZlbnQsIGlmIHRoZSBcInNjcm9sbEhlaWdodFwiIHZhbHVlIGlzIG5vdCBsYXRlc3QsIHdlIHdpbGwgc2tpcCBtb2RpZnlpbmcgdGhlIHN0aWNraW5lc3MuXG4gICAgLy8gLSBUaGF0IG1lYW5zLCBpZiB0aGUgdXNlciBcImZvY3VzXCIgdG8gYW4gZWxlbWVudCB0aGF0IGNhdXNlIHRoZSBzY3JvbGwgdmlldyB0byBzY3JvbGwgdG8gdGhlIGJvdHRvbSwgdGhlIHVzZXIgYWdlbnQgd2lsbCBmaXJlIFwic2Nyb2xsXCIgZXZlbnQuXG4gICAgLy8gICBTaW5jZSB0aGUgXCJzY3JvbGxIZWlnaHRcIiBpcyBub3QgbGF0ZXN0IHZhbHVlLCB0aGlzIFwic2Nyb2xsXCIgZXZlbnQgd2lsbCBiZSBpZ25vcmVkIGFuZCBzdGlja2luZXNzIHdpbGwgbm90IGJlIG1vZGlmaWVkLlxuICAgIC8vIC0gVGhhdCBtZWFucywgaWYgdGhlIHVzZXIgXCJmb2N1c1wiIHRvIGEgbmV3bHkgYWRkZWQgZWxlbWVudCB0aGF0IGlzIGF0IHRoZSBlbmQgb2YgdGhlIHNjcm9sbCB2aWV3LCB0aGUgXCJzY3JvbGwgdG8gYm90dG9tXCIgYnV0dG9uIHdpbGwgY29udGludWUgdG8gc2hvdy5cbiAgICAvL1xuICAgIC8vIFJlcHJvIGluIENocm9tZTpcbiAgICAvLyAxLiBGaWxsIHVwIGEgc2Nyb2xsIHZpZXdcbiAgICAvLyAyLiBTY3JvbGwgdXAsIHRoZSBcInNjcm9sbCB0byBib3R0b21cIiBidXR0b24gc2hvdWxkIHNob3cgdXBcbiAgICAvLyAzLiBDbGljayBcIkFkZCBhIGJ1dHRvblwiXG4gICAgLy8gNC4gQ2xpY2sgb24gdGhlIHNjcm9sbCB2aWV3ICh0byBwc2V1ZG8tZm9jdXMgb24gaXQpXG4gICAgLy8gNS4gUHJlc3MgVEFCLCB0aGUgc2Nyb2xsIHZpZXcgd2lsbCBiZSBhdCB0aGUgYm90dG9tXG4gICAgLy9cbiAgICAvLyBFeHBlY3Q6XG4gICAgLy8gLSBUaGUgXCJzY3JvbGwgdG8gYm90dG9tXCIgYnV0dG9uIHNob3VsZCBiZSBnb25lLlxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIGNvbnN0IGhhbmRsZUZvY3VzID0gKCkgPT4ge1xuICAgICAgICBzY3JvbGxIZWlnaHRSZWYuY3VycmVudCA9IHRhcmdldC5zY3JvbGxIZWlnaHQ7XG4gICAgICB9O1xuXG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBoYW5kbGVGb2N1cywgeyBjYXB0dXJlOiB0cnVlLCBwYXNzaXZlOiB0cnVlIH0pO1xuXG4gICAgICByZXR1cm4gKCkgPT4gdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgaGFuZGxlRm9jdXMpO1xuICAgIH1cbiAgfSwgW3RhcmdldF0pO1xuXG4gIGRlYnVnKCgpID0+IFtcbiAgICBbYCVjUmVuZGVyJWM6IFJlbmRlcmAsIC4uLnN0eWxlQ29uc29sZSgnY3lhbicsICcnKV0sXG4gICAge1xuICAgICAgYW5pbWF0ZVRvLFxuICAgICAgYW5pbWF0aW5nOiBhbmltYXRlVG8gIT09IG51bGwsXG4gICAgICBzdGlja3ksXG4gICAgICB0YXJnZXRcbiAgICB9XG4gIF0pO1xuXG4gIHJldHVybiAoXG4gICAgPEludGVybmFsQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17aW50ZXJuYWxDb250ZXh0fT5cbiAgICAgIDxGdW5jdGlvbkNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e2Z1bmN0aW9uQ29udGV4dH0+XG4gICAgICAgIDxTdGF0ZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e2NvbWJpbmVkU3RhdGVDb250ZXh0fT5cbiAgICAgICAgICA8U3RhdGUxQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17c3RhdGUxQ29udGV4dH0+XG4gICAgICAgICAgICA8U3RhdGUyQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17c3RhdGUyQ29udGV4dH0+XG4gICAgICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgICAgICAge3RhcmdldCAmJiA8RXZlbnRTcHkgZGVib3VuY2U9e2RlYm91bmNlfSBuYW1lPVwic2Nyb2xsXCIgb25FdmVudD17aGFuZGxlU2Nyb2xsfSB0YXJnZXQ9e3RhcmdldH0gLz59XG4gICAgICAgICAgICAgIHt0YXJnZXQgJiYgYW5pbWF0ZVRvICE9PSBudWxsICYmIChcbiAgICAgICAgICAgICAgICA8U3BpbmVUbyBuYW1lPVwic2Nyb2xsVG9wXCIgb25FbmQ9e2hhbmRsZVNwaW5lVG9FbmR9IHRhcmdldD17dGFyZ2V0fSB2YWx1ZT17YW5pbWF0ZVRvfSAvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9TdGF0ZTJDb250ZXh0LlByb3ZpZGVyPlxuICAgICAgICAgIDwvU3RhdGUxQ29udGV4dC5Qcm92aWRlcj5cbiAgICAgICAgPC9TdGF0ZUNvbnRleHQuUHJvdmlkZXI+XG4gICAgICA8L0Z1bmN0aW9uQ29udGV4dC5Qcm92aWRlcj5cbiAgICA8L0ludGVybmFsQ29udGV4dC5Qcm92aWRlcj5cbiAgKTtcbn07XG5cbkNvbXBvc2VyLnByb3BUeXBlcyA9IHtcbiAgY2hlY2tJbnRlcnZhbDogUHJvcFR5cGVzLm51bWJlcixcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5hbnksXG4gIGRlYm91bmNlOiBQcm9wVHlwZXMubnVtYmVyLFxuICBkZWJ1ZzogUHJvcFR5cGVzLmJvb2wsXG4gIGluaXRpYWxTY3JvbGxCZWhhdmlvcjogUHJvcFR5cGVzLm9uZU9mKFsnYXV0bycsICdzbW9vdGgnXSksXG4gIG1vZGU6IFByb3BUeXBlcy5vbmVPZihbJ2JvdHRvbScsICd0b3AnXSksXG4gIG5vbmNlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzY3JvbGxlcjogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvc2VyOyJdfQ==