import _defineProperty from "@babel/runtime-corejs3/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime-corejs3/helpers/toConsumableArray";
import _slicedToArray from "@babel/runtime-corejs3/helpers/slicedToArray";

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) { symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context21; _forEachInstanceProperty(_context21 = ownKeys(Object(source), true)).call(_context21, function (key) { _defineProperty(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { var _context22; _forEachInstanceProperty(_context22 = ownKeys(Object(source))).call(_context22, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.replace.js";
import _setInterval from "@babel/runtime-corejs3/core-js-stable/set-interval";
import _indexOfInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/index-of";
import _spliceInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/splice";
import _concatInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/concat";
import _Date$now from "@babel/runtime-corejs3/core-js-stable/date/now";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/for-each";
import _Object$keys from "@babel/runtime-corejs3/core-js-stable/object/keys";
import _Object$getOwnPropertySymbols from "@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols";
import _filterInstanceProperty from "@babel/runtime-corejs3/core-js-stable/instance/filter";
import _Object$getOwnPropertyDescriptor from "@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor";
import _Object$getOwnPropertyDescriptors from "@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors";
import _Object$defineProperties from "@babel/runtime-corejs3/core-js-stable/object/define-properties";
import _Object$defineProperty from "@babel/runtime-corejs3/core-js-stable/object/define-property";
import createEmotion from '@emotion/css/create-instance';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import createCSSKey from '../createCSSKey';
import createDebug from '../utils/debug';
import EventSpy from '../EventSpy';
import FunctionContext from './FunctionContext';
import InternalContext from './InternalContext';
import SpineTo from '../SpineTo';
import State1Context from './State1Context';
import State2Context from './State2Context';
import StateContext from './StateContext';
import styleConsole from '../utils/styleConsole';
import useStateRef from '../hooks/internal/useStateRef';

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
  return _setInterval(fn, ms);
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
  var debug = useMemo(function () {
    return createDebug("<ScrollToBottom>", {
      force: debugFromProp
    });
  }, [debugFromProp]);
  mode = mode === MODE_TOP ? MODE_TOP : MODE_BOTTOM;
  var ignoreScrollEventBeforeRef = useRef(0);
  var initialScrollBehaviorRef = useRef(initialScrollBehavior);

  var _useStateRef = useStateRef(mode === MODE_TOP ? 0 : '100%'),
      _useStateRef2 = _slicedToArray(_useStateRef, 3),
      animateTo = _useStateRef2[0],
      setAnimateTo = _useStateRef2[1],
      animateToRef = _useStateRef2[2];

  var _useStateRef3 = useStateRef(null),
      _useStateRef4 = _slicedToArray(_useStateRef3, 3),
      target = _useStateRef4[0],
      setTarget = _useStateRef4[1],
      targetRef = _useStateRef4[2]; // Internal context


  var animateFromRef = useRef(0);
  var offsetHeightRef = useRef(0);
  var scrollHeightRef = useRef(0); // State context

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      atBottom = _useState2[0],
      setAtBottom = _useState2[1];

  var _useState3 = useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      atEnd = _useState4[0],
      setAtEnd = _useState4[1];

  var _useState5 = useState(true),
      _useState6 = _slicedToArray(_useState5, 2),
      atTop = _useState6[0],
      setAtTop = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      atStart = _useState8[0],
      setAtStart = _useState8[1];

  var _useStateRef5 = useStateRef(true),
      _useStateRef6 = _slicedToArray(_useStateRef5, 3),
      sticky = _useStateRef6[0],
      setSticky = _useStateRef6[1],
      stickyRef = _useStateRef6[2]; // High-rate state context


  var scrollPositionObserversRef = useRef([]);
  var observeScrollPosition = useCallback(function (fn) {
    var target = targetRef.current;
    scrollPositionObserversRef.current.push(fn);
    target && fn({
      scrollTop: target.scrollTop
    });
    return function () {
      var scrollPositionObservers = scrollPositionObserversRef.current;

      var index = _indexOfInstanceProperty(scrollPositionObservers).call(scrollPositionObservers, fn);

      ~index && _spliceInstanceProperty(scrollPositionObservers).call(scrollPositionObservers, index, 1);
    };
  }, [scrollPositionObserversRef, targetRef]);
  var handleSpineToEnd = useCallback(function () {
    var animateTo = animateToRef.current;
    debug(function () {
      var _context;

      return _concatInstanceProperty(_context = ['%cSpineTo%c: %conEnd%c is fired.']).call(_context, _toConsumableArray(styleConsole('magenta')), _toConsumableArray(styleConsole('orange')), [{
        animateTo: animateTo
      }]);
    });
    ignoreScrollEventBeforeRef.current = _Date$now(); // handleScrollEnd may end at a position which should lose stickiness.
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

  var scrollTo = useCallback(function (nextAnimateTo) {
    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        behavior = _ref3.behavior;

    var target = targetRef.current;

    if (typeof nextAnimateTo !== 'number' && nextAnimateTo !== '100%') {
      return console.warn('react-scroll-to-bottom: Arguments passed to scrollTo() must be either number or "100%".');
    } // If it is trying to scroll to a position which is not "atEnd", it should set sticky to false after scroll ended.


    debug(function () {
      var _context2;

      return [_concatInstanceProperty(_context2 = ["%cscrollTo%c: Will scroll to %c".concat(typeof nextAnimateTo === 'number' ? nextAnimateTo + 'px' : nextAnimateTo.replace(/%/g, '%%'), "%c")]).call(_context2, _toConsumableArray(styleConsole('lime', '')), _toConsumableArray(styleConsole('purple'))), {
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

        return [_concatInstanceProperty(_context3 = ["%cscrollTo%c: Scrolling to end, will set sticky to %ctrue%c."]).call(_context3, _toConsumableArray(styleConsole('lime', '')), _toConsumableArray(styleConsole('purple'))), [{
          mode: mode,
          nextAnimateTo: nextAnimateTo
        }]];
      });
      setSticky(true);
    }
  }, [debug, handleSpineToEnd, mode, setAnimateTo, setSticky, targetRef]);
  var scrollToBottom = useCallback(function () {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref4.behavior;

    debug(function () {
      var _context4;

      return _concatInstanceProperty(_context4 = ['%cscrollToBottom%c: Called']).call(_context4, _toConsumableArray(styleConsole('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToBottom". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    scrollTo('100%', {
      behavior: behavior || 'smooth'
    });
  }, [debug, scrollTo]);
  var scrollToTop = useCallback(function () {
    var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref5.behavior;

    debug(function () {
      var _context5;

      return _concatInstanceProperty(_context5 = ['%cscrollToTop%c: Called']).call(_context5, _toConsumableArray(styleConsole('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToTop". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    scrollTo(0, {
      behavior: behavior || 'smooth'
    });
  }, [debug, scrollTo]);
  var scrollToEnd = useCallback(function () {
    var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref6.behavior;

    debug(function () {
      var _context6;

      return _concatInstanceProperty(_context6 = ['%cscrollToEnd%c: Called']).call(_context6, _toConsumableArray(styleConsole('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToEnd". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    var options = {
      behavior: behavior || 'smooth'
    };
    mode === MODE_TOP ? scrollToTop(options) : scrollToBottom(options);
  }, [debug, mode, scrollToBottom, scrollToTop]);
  var scrollToStart = useCallback(function () {
    var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        behavior = _ref7.behavior;

    debug(function () {
      var _context7;

      return _concatInstanceProperty(_context7 = ['%cscrollToStart%c: Called']).call(_context7, _toConsumableArray(styleConsole('yellow', '')));
    });
    behavior !== 'smooth' && console.warn('react-scroll-to-bottom: Please set "behavior" when calling "scrollToStart". In future versions, the default behavior will be changed from smooth scrolling to discrete scrolling to align with HTML Standard.');
    var options = {
      behavior: behavior || 'smooth'
    };
    mode === MODE_TOP ? scrollToBottom(options) : scrollToTop(options);
  }, [debug, mode, scrollToBottom, scrollToTop]);
  var scrollToSticky = useCallback(function () {
    var target = targetRef.current;

    if (target) {
      if (initialScrollBehaviorRef.current === 'auto') {
        debug(function () {
          var _context8;

          return _concatInstanceProperty(_context8 = ["%ctarget changed%c: Initial scroll"]).call(_context8, _toConsumableArray(styleConsole('blue')));
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

        return [_concatInstanceProperty(_context9 = [_concatInstanceProperty(_context10 = _concatInstanceProperty(_context11 = "%cscrollToSticky%c: Will animate from %c".concat(animateFrom, "px%c to %c")).call(_context11, typeof nextAnimateTo === 'number' ? nextAnimateTo + 'px' : nextAnimateTo.replace(/%/g, '%%'), "%c (%c")).call(_context10, (nextAnimateTo === '100%' ? maxValue : nextAnimateTo) + animateFrom, "px%c)")]).call(_context9, _toConsumableArray(styleConsole('orange')), _toConsumableArray(styleConsole('purple')), _toConsumableArray(styleConsole('purple')), _toConsumableArray(styleConsole('purple'))), {
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
  var handleScroll = useCallback(function (_ref8) {
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

          return [_concatInstanceProperty(_context12 = ["%conScroll%c: %csetSticky%c(%c".concat(nextSticky, "%c)")]).call(_context12, _toConsumableArray(styleConsole('red')), _toConsumableArray(styleConsole('red')), _toConsumableArray(styleConsole('purple'))), _concatInstanceProperty(_context13 = [_concatInstanceProperty(_context14 = _concatInstanceProperty(_context15 = "(animating = %c".concat(animating, "%c && isEnd = %c")).call(_context15, isEnd(animateTo, mode), "%c) || atEnd = %c")).call(_context14, atEnd, "%c")]).call(_context13, _toConsumableArray(styleConsole('purple')), _toConsumableArray(styleConsole('purple')), _toConsumableArray(styleConsole('purple')), [{
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

        return [_concatInstanceProperty(_context16 = ["%conScroll%c: Size changed while sticky, calling %cscrollToSticky()%c"]).call(_context16, _toConsumableArray(styleConsole('red')), _toConsumableArray(styleConsole('orange')), [{
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

    _forEachInstanceProperty(_context17 = scrollPositionObserversRef.current).call(_context17, function (observer) {
      return observer({
        scrollTop: actualScrollTop
      });
    });
  }, [animateToRef, debug, ignoreScrollEventBeforeRef, mode, offsetHeightRef, scrollHeightRef, scrollPositionObserversRef, scrollToSticky, setAtBottom, setAtEnd, setAtStart, setAtTop, setSticky, stickyRef, targetRef]);
  useEffect(function () {
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
              stickyButNotAtEndSince = _Date$now();
            } else if (_Date$now() - stickyButNotAtEndSince > SCROLL_DECISION_DURATION) {
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

                  return _concatInstanceProperty(_context18 = ["%cInterval check%c: Should sticky but not at end, calling %cscrollToSticky()%c to scroll"]).call(_context18, _toConsumableArray(styleConsole('navy')), _toConsumableArray(styleConsole('orange')));
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

            return [_concatInstanceProperty(_context19 = ["%cInterval check%c: Container is emptied, setting sticky back to %ctrue%c"]).call(_context19, _toConsumableArray(styleConsole('navy')), _toConsumableArray(styleConsole('purple'))), [{
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
  var styleToClassName = useMemo(function () {
    var emotion = emotionPool[nonce] || (emotionPool[nonce] = createEmotion({
      key: 'react-scroll-to-bottom--css-' + createCSSKey(),
      nonce: nonce
    }));
    return function (style) {
      return emotion.css(style) + '';
    };
  }, [nonce]);
  var internalContext = useMemo(function () {
    return {
      observeScrollPosition: observeScrollPosition,
      setTarget: setTarget,
      styleToClassName: styleToClassName
    };
  }, [observeScrollPosition, setTarget, styleToClassName]);
  var state1Context = useMemo(function () {
    return {
      atBottom: atBottom,
      atEnd: atEnd,
      atStart: atStart,
      atTop: atTop,
      mode: mode
    };
  }, [atBottom, atEnd, atStart, atTop, mode]);
  var state2Context = useMemo(function () {
    var animating = animateTo !== null;
    return {
      animating: animating,
      animatingToEnd: animating && isEnd(animateTo, mode),
      sticky: sticky
    };
  }, [animateTo, mode, sticky]);
  var combinedStateContext = useMemo(function () {
    return _objectSpread(_objectSpread({}, state1Context), state2Context);
  }, [state1Context, state2Context]);
  var functionContext = useMemo(function () {
    return {
      scrollTo: scrollTo,
      scrollToBottom: scrollToBottom,
      scrollToEnd: scrollToEnd,
      scrollToStart: scrollToStart,
      scrollToTop: scrollToTop
    };
  }, [scrollTo, scrollToBottom, scrollToEnd, scrollToStart, scrollToTop]);
  useEffect(function () {
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

    return [_concatInstanceProperty(_context20 = ["%cRender%c: Render"]).call(_context20, _toConsumableArray(styleConsole('cyan', ''))), {
      animateTo: animateTo,
      animating: animateTo !== null,
      sticky: sticky,
      target: target
    }];
  });
  return /*#__PURE__*/React.createElement(InternalContext.Provider, {
    value: internalContext
  }, /*#__PURE__*/React.createElement(FunctionContext.Provider, {
    value: functionContext
  }, /*#__PURE__*/React.createElement(StateContext.Provider, {
    value: combinedStateContext
  }, /*#__PURE__*/React.createElement(State1Context.Provider, {
    value: state1Context
  }, /*#__PURE__*/React.createElement(State2Context.Provider, {
    value: state2Context
  }, children, target && /*#__PURE__*/React.createElement(EventSpy, {
    debounce: debounce,
    name: "scroll",
    onEvent: handleScroll,
    target: target
  }), target && animateTo !== null && /*#__PURE__*/React.createElement(SpineTo, {
    name: "scrollTop",
    onEnd: handleSpineToEnd,
    target: target,
    value: animateTo
  }))))));
};

Composer.propTypes = {
  checkInterval: PropTypes.number,
  children: PropTypes.any,
  debounce: PropTypes.number,
  debug: PropTypes.bool,
  initialScrollBehavior: PropTypes.oneOf(['auto', 'smooth']),
  mode: PropTypes.oneOf(['bottom', 'top']),
  nonce: PropTypes.string,
  scroller: PropTypes.func
};
export default Composer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9Db21wb3Nlci5qcyJdLCJuYW1lcyI6WyJjcmVhdGVFbW90aW9uIiwiUHJvcFR5cGVzIiwiUmVhY3QiLCJ1c2VDYWxsYmFjayIsInVzZUVmZmVjdCIsInVzZU1lbW8iLCJ1c2VSZWYiLCJ1c2VTdGF0ZSIsImNyZWF0ZUNTU0tleSIsImNyZWF0ZURlYnVnIiwiRXZlbnRTcHkiLCJGdW5jdGlvbkNvbnRleHQiLCJJbnRlcm5hbENvbnRleHQiLCJTcGluZVRvIiwiU3RhdGUxQ29udGV4dCIsIlN0YXRlMkNvbnRleHQiLCJTdGF0ZUNvbnRleHQiLCJzdHlsZUNvbnNvbGUiLCJ1c2VTdGF0ZVJlZiIsIkRFRkFVTFRfU0NST0xMRVIiLCJJbmZpbml0eSIsIk1JTl9DSEVDS19JTlRFUlZBTCIsIk1PREVfQk9UVE9NIiwiTU9ERV9UT1AiLCJORUFSX0VORF9USFJFU0hPTEQiLCJTQ1JPTExfREVDSVNJT05fRFVSQVRJT04iLCJlbW90aW9uUG9vbCIsInNldEltbWVkaWF0ZUludGVydmFsIiwiZm4iLCJtcyIsImNvbXB1dGVWaWV3U3RhdGUiLCJtb2RlIiwidGFyZ2V0Iiwib2Zmc2V0SGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0Iiwic2Nyb2xsVG9wIiwiYXRCb3R0b20iLCJhdFRvcCIsImF0RW5kIiwiYXRTdGFydCIsImlzRW5kIiwiYW5pbWF0ZVRvIiwiQ29tcG9zZXIiLCJjaGVja0ludGVydmFsIiwiY2hpbGRyZW4iLCJkZWJvdW5jZSIsImRlYnVnRnJvbVByb3AiLCJkZWJ1ZyIsImluaXRpYWxTY3JvbGxCZWhhdmlvciIsIm5vbmNlIiwic2Nyb2xsZXIiLCJmb3JjZSIsImlnbm9yZVNjcm9sbEV2ZW50QmVmb3JlUmVmIiwiaW5pdGlhbFNjcm9sbEJlaGF2aW9yUmVmIiwic2V0QW5pbWF0ZVRvIiwiYW5pbWF0ZVRvUmVmIiwic2V0VGFyZ2V0IiwidGFyZ2V0UmVmIiwiYW5pbWF0ZUZyb21SZWYiLCJvZmZzZXRIZWlnaHRSZWYiLCJzY3JvbGxIZWlnaHRSZWYiLCJzZXRBdEJvdHRvbSIsInNldEF0RW5kIiwic2V0QXRUb3AiLCJzZXRBdFN0YXJ0Iiwic3RpY2t5Iiwic2V0U3RpY2t5Iiwic3RpY2t5UmVmIiwic2Nyb2xsUG9zaXRpb25PYnNlcnZlcnNSZWYiLCJvYnNlcnZlU2Nyb2xsUG9zaXRpb24iLCJjdXJyZW50IiwicHVzaCIsInNjcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzIiwiaW5kZXgiLCJoYW5kbGVTcGluZVRvRW5kIiwic2Nyb2xsVG8iLCJuZXh0QW5pbWF0ZVRvIiwiYmVoYXZpb3IiLCJjb25zb2xlIiwid2FybiIsInJlcGxhY2UiLCJzY3JvbGxUb0JvdHRvbSIsInNjcm9sbFRvVG9wIiwic2Nyb2xsVG9FbmQiLCJvcHRpb25zIiwic2Nyb2xsVG9TdGFydCIsInNjcm9sbFRvU3RpY2t5IiwiYW5pbWF0ZUZyb20iLCJtYXhWYWx1ZSIsIk1hdGgiLCJtYXgiLCJtaW5WYWx1ZSIsInJhd05leHRWYWx1ZSIsIm5leHRWYWx1ZSIsIm1pbiIsImhhbmRsZVNjcm9sbCIsInRpbWVTdGFtcExvdyIsImFuaW1hdGluZyIsIm5leHRPZmZzZXRIZWlnaHQiLCJuZXh0U2Nyb2xsSGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0Q2hhbmdlZCIsInNjcm9sbEhlaWdodENoYW5nZWQiLCJuZXh0U3RpY2t5IiwicHJldk9mZnNldEhlaWdodCIsInByZXZTY3JvbGxIZWlnaHQiLCJhY3R1YWxTY3JvbGxUb3AiLCJvYnNlcnZlciIsInN0aWNreUJ1dE5vdEF0RW5kU2luY2UiLCJ0aW1lb3V0IiwiY2xlYXJJbnRlcnZhbCIsInN0eWxlVG9DbGFzc05hbWUiLCJlbW90aW9uIiwia2V5Iiwic3R5bGUiLCJjc3MiLCJpbnRlcm5hbENvbnRleHQiLCJzdGF0ZTFDb250ZXh0Iiwic3RhdGUyQ29udGV4dCIsImFuaW1hdGluZ1RvRW5kIiwiY29tYmluZWRTdGF0ZUNvbnRleHQiLCJmdW5jdGlvbkNvbnRleHQiLCJoYW5kbGVGb2N1cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJjYXB0dXJlIiwicGFzc2l2ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJwcm9wVHlwZXMiLCJudW1iZXIiLCJhbnkiLCJib29sIiwib25lT2YiLCJzdHJpbmciLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU9BLGFBQVAsTUFBMEIsOEJBQTFCO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUNBLE9BQU9DLEtBQVAsSUFBZ0JDLFdBQWhCLEVBQTZCQyxTQUE3QixFQUF3Q0MsT0FBeEMsRUFBaURDLE1BQWpELEVBQXlEQyxRQUF6RCxRQUF5RSxPQUF6RTtBQUVBLE9BQU9DLFlBQVAsTUFBeUIsaUJBQXpCO0FBQ0EsT0FBT0MsV0FBUCxNQUF3QixnQkFBeEI7QUFDQSxPQUFPQyxRQUFQLE1BQXFCLGFBQXJCO0FBQ0EsT0FBT0MsZUFBUCxNQUE0QixtQkFBNUI7QUFDQSxPQUFPQyxlQUFQLE1BQTRCLG1CQUE1QjtBQUNBLE9BQU9DLE9BQVAsTUFBb0IsWUFBcEI7QUFDQSxPQUFPQyxhQUFQLE1BQTBCLGlCQUExQjtBQUNBLE9BQU9DLGFBQVAsTUFBMEIsaUJBQTFCO0FBQ0EsT0FBT0MsWUFBUCxNQUF5QixnQkFBekI7QUFDQSxPQUFPQyxZQUFQLE1BQXlCLHVCQUF6QjtBQUNBLE9BQU9DLFdBQVAsTUFBd0IsK0JBQXhCOztBQUVBLElBQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUI7QUFBQSxTQUFNQyxRQUFOO0FBQUEsQ0FBekI7O0FBQ0EsSUFBTUMsa0JBQWtCLEdBQUcsRUFBM0IsQyxDQUErQjs7QUFDL0IsSUFBTUMsV0FBVyxHQUFHLFFBQXBCO0FBQ0EsSUFBTUMsUUFBUSxHQUFHLEtBQWpCO0FBQ0EsSUFBTUMsa0JBQWtCLEdBQUcsQ0FBM0I7QUFDQSxJQUFNQyx3QkFBd0IsR0FBRyxFQUFqQyxDLENBQXFDO0FBRXJDO0FBQ0E7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHLEVBQXBCOztBQUVBLFNBQVNDLG9CQUFULENBQThCQyxFQUE5QixFQUFrQ0MsRUFBbEMsRUFBc0M7QUFDcENELEVBQUFBLEVBQUU7QUFFRixTQUFPLGFBQVlBLEVBQVosRUFBZ0JDLEVBQWhCLENBQVA7QUFDRDs7QUFFRCxTQUFTQyxnQkFBVCxPQUF1RjtBQUFBLE1BQTNEQyxJQUEyRCxRQUEzREEsSUFBMkQ7QUFBQSx5QkFBckRDLE1BQXFEO0FBQUEsTUFBM0NDLFlBQTJDLGVBQTNDQSxZQUEyQztBQUFBLE1BQTdCQyxZQUE2QixlQUE3QkEsWUFBNkI7QUFBQSxNQUFmQyxTQUFlLGVBQWZBLFNBQWU7QUFDckYsTUFBTUMsUUFBUSxHQUFHRixZQUFZLEdBQUdDLFNBQWYsR0FBMkJGLFlBQTNCLEdBQTBDVCxrQkFBM0Q7QUFDQSxNQUFNYSxLQUFLLEdBQUdGLFNBQVMsR0FBR1gsa0JBQTFCO0FBRUEsTUFBTWMsS0FBSyxHQUFHUCxJQUFJLEtBQUtSLFFBQVQsR0FBb0JjLEtBQXBCLEdBQTRCRCxRQUExQztBQUNBLE1BQU1HLE9BQU8sR0FBR1IsSUFBSSxLQUFLUixRQUFULEdBQW9CYyxLQUFwQixHQUE0QkQsUUFBNUM7QUFFQSxTQUFPO0FBQ0xBLElBQUFBLFFBQVEsRUFBUkEsUUFESztBQUVMRSxJQUFBQSxLQUFLLEVBQUxBLEtBRks7QUFHTEMsSUFBQUEsT0FBTyxFQUFQQSxPQUhLO0FBSUxGLElBQUFBLEtBQUssRUFBTEE7QUFKSyxHQUFQO0FBTUQ7O0FBRUQsU0FBU0csS0FBVCxDQUFlQyxTQUFmLEVBQTBCVixJQUExQixFQUFnQztBQUM5QixTQUFPVSxTQUFTLE1BQU1WLElBQUksS0FBS1IsUUFBVCxHQUFvQixDQUFwQixHQUF3QixNQUE5QixDQUFoQjtBQUNEOztBQUVELElBQU1tQixRQUFRLEdBQUcsU0FBWEEsUUFBVyxRQVNYO0FBQUEsa0NBUkpDLGFBUUk7QUFBQSxNQVJKQSxhQVFJLG9DQVJZLEdBUVo7QUFBQSxNQVBKQyxRQU9JLFNBUEpBLFFBT0k7QUFBQSw2QkFOSkMsUUFNSTtBQUFBLE1BTkpBLFFBTUksK0JBTk8sRUFNUDtBQUFBLE1BTEdDLGFBS0gsU0FMSkMsS0FLSTtBQUFBLG9DQUpKQyxxQkFJSTtBQUFBLE1BSkpBLHFCQUlJLHNDQUpvQixRQUlwQjtBQUFBLE1BSEpqQixJQUdJLFNBSEpBLElBR0k7QUFBQSxNQUZKa0IsS0FFSSxTQUZKQSxLQUVJO0FBQUEsNkJBREpDLFFBQ0k7QUFBQSxNQURKQSxRQUNJLCtCQURPL0IsZ0JBQ1A7QUFDSixNQUFNNEIsS0FBSyxHQUFHMUMsT0FBTyxDQUFDO0FBQUEsV0FBTUksV0FBVyxxQkFBcUI7QUFBRTBDLE1BQUFBLEtBQUssRUFBRUw7QUFBVCxLQUFyQixDQUFqQjtBQUFBLEdBQUQsRUFBa0UsQ0FBQ0EsYUFBRCxDQUFsRSxDQUFyQjtBQUVBZixFQUFBQSxJQUFJLEdBQUdBLElBQUksS0FBS1IsUUFBVCxHQUFvQkEsUUFBcEIsR0FBK0JELFdBQXRDO0FBRUEsTUFBTThCLDBCQUEwQixHQUFHOUMsTUFBTSxDQUFDLENBQUQsQ0FBekM7QUFDQSxNQUFNK0Msd0JBQXdCLEdBQUcvQyxNQUFNLENBQUMwQyxxQkFBRCxDQUF2Qzs7QUFDQSxxQkFBZ0Q5QixXQUFXLENBQUNhLElBQUksS0FBS1IsUUFBVCxHQUFvQixDQUFwQixHQUF3QixNQUF6QixDQUEzRDtBQUFBO0FBQUEsTUFBT2tCLFNBQVA7QUFBQSxNQUFrQmEsWUFBbEI7QUFBQSxNQUFnQ0MsWUFBaEM7O0FBQ0Esc0JBQXVDckMsV0FBVyxDQUFDLElBQUQsQ0FBbEQ7QUFBQTtBQUFBLE1BQU9jLE1BQVA7QUFBQSxNQUFld0IsU0FBZjtBQUFBLE1BQTBCQyxTQUExQixvQkFSSSxDQVVKOzs7QUFDQSxNQUFNQyxjQUFjLEdBQUdwRCxNQUFNLENBQUMsQ0FBRCxDQUE3QjtBQUNBLE1BQU1xRCxlQUFlLEdBQUdyRCxNQUFNLENBQUMsQ0FBRCxDQUE5QjtBQUNBLE1BQU1zRCxlQUFlLEdBQUd0RCxNQUFNLENBQUMsQ0FBRCxDQUE5QixDQWJJLENBZUo7O0FBQ0Esa0JBQWdDQyxRQUFRLENBQUMsSUFBRCxDQUF4QztBQUFBO0FBQUEsTUFBTzZCLFFBQVA7QUFBQSxNQUFpQnlCLFdBQWpCOztBQUNBLG1CQUEwQnRELFFBQVEsQ0FBQyxJQUFELENBQWxDO0FBQUE7QUFBQSxNQUFPK0IsS0FBUDtBQUFBLE1BQWN3QixRQUFkOztBQUNBLG1CQUEwQnZELFFBQVEsQ0FBQyxJQUFELENBQWxDO0FBQUE7QUFBQSxNQUFPOEIsS0FBUDtBQUFBLE1BQWMwQixRQUFkOztBQUNBLG1CQUE4QnhELFFBQVEsQ0FBQyxLQUFELENBQXRDO0FBQUE7QUFBQSxNQUFPZ0MsT0FBUDtBQUFBLE1BQWdCeUIsVUFBaEI7O0FBQ0Esc0JBQXVDOUMsV0FBVyxDQUFDLElBQUQsQ0FBbEQ7QUFBQTtBQUFBLE1BQU8rQyxNQUFQO0FBQUEsTUFBZUMsU0FBZjtBQUFBLE1BQTBCQyxTQUExQixvQkFwQkksQ0FzQko7OztBQUNBLE1BQU1DLDBCQUEwQixHQUFHOUQsTUFBTSxDQUFDLEVBQUQsQ0FBekM7QUFDQSxNQUFNK0QscUJBQXFCLEdBQUdsRSxXQUFXLENBQ3ZDLFVBQUF5QixFQUFFLEVBQUk7QUFDSixRQUFpQkksTUFBakIsR0FBNEJ5QixTQUE1QixDQUFRYSxPQUFSO0FBRUFGLElBQUFBLDBCQUEwQixDQUFDRSxPQUEzQixDQUFtQ0MsSUFBbkMsQ0FBd0MzQyxFQUF4QztBQUNBSSxJQUFBQSxNQUFNLElBQUlKLEVBQUUsQ0FBQztBQUFFTyxNQUFBQSxTQUFTLEVBQUVILE1BQU0sQ0FBQ0c7QUFBcEIsS0FBRCxDQUFaO0FBRUEsV0FBTyxZQUFNO0FBQ1gsVUFBaUJxQyx1QkFBakIsR0FBNkNKLDBCQUE3QyxDQUFRRSxPQUFSOztBQUNBLFVBQU1HLEtBQUssR0FBRyx5QkFBQUQsdUJBQXVCLE1BQXZCLENBQUFBLHVCQUF1QixFQUFTNUMsRUFBVCxDQUFyQzs7QUFFQSxPQUFDNkMsS0FBRCxJQUFVLHdCQUFBRCx1QkFBdUIsTUFBdkIsQ0FBQUEsdUJBQXVCLEVBQVFDLEtBQVIsRUFBZSxDQUFmLENBQWpDO0FBQ0QsS0FMRDtBQU1ELEdBYnNDLEVBY3ZDLENBQUNMLDBCQUFELEVBQTZCWCxTQUE3QixDQWR1QyxDQUF6QztBQWlCQSxNQUFNaUIsZ0JBQWdCLEdBQUd2RSxXQUFXLENBQUMsWUFBTTtBQUN6QyxRQUFpQnNDLFNBQWpCLEdBQStCYyxZQUEvQixDQUFRZSxPQUFSO0FBRUF2QixJQUFBQSxLQUFLLENBQUM7QUFBQTs7QUFBQSxpREFDSixrQ0FESSxxQ0FFRDlCLFlBQVksQ0FBQyxTQUFELENBRlgsc0JBR0RBLFlBQVksQ0FBQyxRQUFELENBSFgsSUFJSjtBQUFFd0IsUUFBQUEsU0FBUyxFQUFUQTtBQUFGLE9BSkk7QUFBQSxLQUFELENBQUw7QUFPQVcsSUFBQUEsMEJBQTBCLENBQUNrQixPQUEzQixHQUFxQyxXQUFyQyxDQVZ5QyxDQVl6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOUIsSUFBQUEsS0FBSyxDQUFDQyxTQUFELEVBQVlWLElBQVosQ0FBTCxJQUEwQm1DLFNBQVMsQ0FBQyxLQUFELENBQW5DO0FBQ0FaLElBQUFBLFlBQVksQ0FBQyxJQUFELENBQVo7QUFDRCxHQXZCbUMsRUF1QmpDLENBQUNDLFlBQUQsRUFBZVIsS0FBZixFQUFzQkssMEJBQXRCLEVBQWtEckIsSUFBbEQsRUFBd0R1QixZQUF4RCxFQUFzRVksU0FBdEUsQ0F2QmlDLENBQXBDLENBekNJLENBa0VKOztBQUNBLE1BQU1TLFFBQVEsR0FBR3hFLFdBQVcsQ0FDMUIsVUFBQ3lFLGFBQUQsRUFBc0M7QUFBQSxvRkFBUCxFQUFPO0FBQUEsUUFBcEJDLFFBQW9CLFNBQXBCQSxRQUFvQjs7QUFDcEMsUUFBaUI3QyxNQUFqQixHQUE0QnlCLFNBQTVCLENBQVFhLE9BQVI7O0FBRUEsUUFBSSxPQUFPTSxhQUFQLEtBQXlCLFFBQXpCLElBQXFDQSxhQUFhLEtBQUssTUFBM0QsRUFBbUU7QUFDakUsYUFBT0UsT0FBTyxDQUFDQyxJQUFSLENBQWEseUZBQWIsQ0FBUDtBQUNELEtBTG1DLENBT3BDOzs7QUFFQWhDLElBQUFBLEtBQUssQ0FBQztBQUFBOztBQUFBLGFBQU0sK0VBR04sT0FBTzZCLGFBQVAsS0FBeUIsUUFBekIsR0FBb0NBLGFBQWEsR0FBRyxJQUFwRCxHQUEyREEsYUFBYSxDQUFDSSxPQUFkLENBQXNCLElBQXRCLEVBQTZCLElBQTdCLENBSHJELDZDQUtML0QsWUFBWSxDQUFDLE1BQUQsRUFBUyxFQUFULENBTFAsc0JBTUxBLFlBQVksQ0FBQyxRQUFELENBTlAsSUFRVjtBQUNFNEQsUUFBQUEsUUFBUSxFQUFSQSxRQURGO0FBRUVELFFBQUFBLGFBQWEsRUFBYkEsYUFGRjtBQUdFNUMsUUFBQUEsTUFBTSxFQUFOQTtBQUhGLE9BUlUsQ0FBTjtBQUFBLEtBQUQsQ0FBTDs7QUFlQSxRQUFJNkMsUUFBUSxLQUFLLE1BQWpCLEVBQXlCO0FBQ3ZCO0FBQ0FILE1BQUFBLGdCQUFnQjs7QUFFaEIsVUFBSTFDLE1BQUosRUFBWTtBQUNWO0FBQ0FBLFFBQUFBLE1BQU0sQ0FBQ0csU0FBUCxHQUFtQnlDLGFBQWEsS0FBSyxNQUFsQixHQUEyQjVDLE1BQU0sQ0FBQ0UsWUFBUCxHQUFzQkYsTUFBTSxDQUFDQyxZQUF4RCxHQUF1RTJDLGFBQTFGO0FBQ0Q7QUFDRixLQVJELE1BUU87QUFDTEMsTUFBQUEsUUFBUSxLQUFLLFFBQWIsSUFDRUMsT0FBTyxDQUFDQyxJQUFSLENBQ0UsME1BREYsQ0FERjtBQUtBekIsTUFBQUEsWUFBWSxDQUFDc0IsYUFBRCxDQUFaO0FBQ0QsS0F2Q21DLENBeUNwQzs7O0FBQ0EsUUFBSXBDLEtBQUssQ0FBQ29DLGFBQUQsRUFBZ0I3QyxJQUFoQixDQUFULEVBQWdDO0FBQzlCZ0IsTUFBQUEsS0FBSyxDQUFDO0FBQUE7O0FBQUEsZUFBTSwwSUFHTDlCLFlBQVksQ0FBQyxNQUFELEVBQVMsRUFBVCxDQUhQLHNCQUlMQSxZQUFZLENBQUMsUUFBRCxDQUpQLElBTVYsQ0FBQztBQUFFYyxVQUFBQSxJQUFJLEVBQUpBLElBQUY7QUFBUTZDLFVBQUFBLGFBQWEsRUFBYkE7QUFBUixTQUFELENBTlUsQ0FBTjtBQUFBLE9BQUQsQ0FBTDtBQVNBVixNQUFBQSxTQUFTLENBQUMsSUFBRCxDQUFUO0FBQ0Q7QUFDRixHQXZEeUIsRUF3RDFCLENBQUNuQixLQUFELEVBQVEyQixnQkFBUixFQUEwQjNDLElBQTFCLEVBQWdDdUIsWUFBaEMsRUFBOENZLFNBQTlDLEVBQXlEVCxTQUF6RCxDQXhEMEIsQ0FBNUI7QUEyREEsTUFBTXdCLGNBQWMsR0FBRzlFLFdBQVcsQ0FDaEMsWUFBdUI7QUFBQSxvRkFBUCxFQUFPO0FBQUEsUUFBcEIwRSxRQUFvQixTQUFwQkEsUUFBb0I7O0FBQ3JCOUIsSUFBQUEsS0FBSyxDQUFDO0FBQUE7O0FBQUEsa0RBQU8sNEJBQVAsc0NBQXdDOUIsWUFBWSxDQUFDLFFBQUQsRUFBVyxFQUFYLENBQXBEO0FBQUEsS0FBRCxDQUFMO0FBRUE0RCxJQUFBQSxRQUFRLEtBQUssUUFBYixJQUNFQyxPQUFPLENBQUNDLElBQVIsQ0FDRSxnTkFERixDQURGO0FBS0FKLElBQUFBLFFBQVEsQ0FBQyxNQUFELEVBQVM7QUFBRUUsTUFBQUEsUUFBUSxFQUFFQSxRQUFRLElBQUk7QUFBeEIsS0FBVCxDQUFSO0FBQ0QsR0FWK0IsRUFXaEMsQ0FBQzlCLEtBQUQsRUFBUTRCLFFBQVIsQ0FYZ0MsQ0FBbEM7QUFjQSxNQUFNTyxXQUFXLEdBQUcvRSxXQUFXLENBQzdCLFlBQXVCO0FBQUEsb0ZBQVAsRUFBTztBQUFBLFFBQXBCMEUsUUFBb0IsU0FBcEJBLFFBQW9COztBQUNyQjlCLElBQUFBLEtBQUssQ0FBQztBQUFBOztBQUFBLGtEQUFPLHlCQUFQLHNDQUFxQzlCLFlBQVksQ0FBQyxRQUFELEVBQVcsRUFBWCxDQUFqRDtBQUFBLEtBQUQsQ0FBTDtBQUVBNEQsSUFBQUEsUUFBUSxLQUFLLFFBQWIsSUFDRUMsT0FBTyxDQUFDQyxJQUFSLENBQ0UsNk1BREYsQ0FERjtBQUtBSixJQUFBQSxRQUFRLENBQUMsQ0FBRCxFQUFJO0FBQUVFLE1BQUFBLFFBQVEsRUFBRUEsUUFBUSxJQUFJO0FBQXhCLEtBQUosQ0FBUjtBQUNELEdBVjRCLEVBVzdCLENBQUM5QixLQUFELEVBQVE0QixRQUFSLENBWDZCLENBQS9CO0FBY0EsTUFBTVEsV0FBVyxHQUFHaEYsV0FBVyxDQUM3QixZQUF1QjtBQUFBLG9GQUFQLEVBQU87QUFBQSxRQUFwQjBFLFFBQW9CLFNBQXBCQSxRQUFvQjs7QUFDckI5QixJQUFBQSxLQUFLLENBQUM7QUFBQTs7QUFBQSxrREFBTyx5QkFBUCxzQ0FBcUM5QixZQUFZLENBQUMsUUFBRCxFQUFXLEVBQVgsQ0FBakQ7QUFBQSxLQUFELENBQUw7QUFFQTRELElBQUFBLFFBQVEsS0FBSyxRQUFiLElBQ0VDLE9BQU8sQ0FBQ0MsSUFBUixDQUNFLDZNQURGLENBREY7QUFLQSxRQUFNSyxPQUFPLEdBQUc7QUFBRVAsTUFBQUEsUUFBUSxFQUFFQSxRQUFRLElBQUk7QUFBeEIsS0FBaEI7QUFFQTlDLElBQUFBLElBQUksS0FBS1IsUUFBVCxHQUFvQjJELFdBQVcsQ0FBQ0UsT0FBRCxDQUEvQixHQUEyQ0gsY0FBYyxDQUFDRyxPQUFELENBQXpEO0FBQ0QsR0FaNEIsRUFhN0IsQ0FBQ3JDLEtBQUQsRUFBUWhCLElBQVIsRUFBY2tELGNBQWQsRUFBOEJDLFdBQTlCLENBYjZCLENBQS9CO0FBZ0JBLE1BQU1HLGFBQWEsR0FBR2xGLFdBQVcsQ0FDL0IsWUFBdUI7QUFBQSxvRkFBUCxFQUFPO0FBQUEsUUFBcEIwRSxRQUFvQixTQUFwQkEsUUFBb0I7O0FBQ3JCOUIsSUFBQUEsS0FBSyxDQUFDO0FBQUE7O0FBQUEsa0RBQU8sMkJBQVAsc0NBQXVDOUIsWUFBWSxDQUFDLFFBQUQsRUFBVyxFQUFYLENBQW5EO0FBQUEsS0FBRCxDQUFMO0FBRUE0RCxJQUFBQSxRQUFRLEtBQUssUUFBYixJQUNFQyxPQUFPLENBQUNDLElBQVIsQ0FDRSwrTUFERixDQURGO0FBS0EsUUFBTUssT0FBTyxHQUFHO0FBQUVQLE1BQUFBLFFBQVEsRUFBRUEsUUFBUSxJQUFJO0FBQXhCLEtBQWhCO0FBRUE5QyxJQUFBQSxJQUFJLEtBQUtSLFFBQVQsR0FBb0IwRCxjQUFjLENBQUNHLE9BQUQsQ0FBbEMsR0FBOENGLFdBQVcsQ0FBQ0UsT0FBRCxDQUF6RDtBQUNELEdBWjhCLEVBYS9CLENBQUNyQyxLQUFELEVBQVFoQixJQUFSLEVBQWNrRCxjQUFkLEVBQThCQyxXQUE5QixDQWIrQixDQUFqQztBQWdCQSxNQUFNSSxjQUFjLEdBQUduRixXQUFXLENBQUMsWUFBTTtBQUN2QyxRQUFpQjZCLE1BQWpCLEdBQTRCeUIsU0FBNUIsQ0FBUWEsT0FBUjs7QUFFQSxRQUFJdEMsTUFBSixFQUFZO0FBQ1YsVUFBSXFCLHdCQUF3QixDQUFDaUIsT0FBekIsS0FBcUMsTUFBekMsRUFBaUQ7QUFDL0N2QixRQUFBQSxLQUFLLENBQUM7QUFBQTs7QUFBQSxnSUFBZ0Q5QixZQUFZLENBQUMsTUFBRCxDQUE1RDtBQUFBLFNBQUQsQ0FBTDtBQUVBZSxRQUFBQSxNQUFNLENBQUNHLFNBQVAsR0FBbUJKLElBQUksS0FBS1IsUUFBVCxHQUFvQixDQUFwQixHQUF3QlMsTUFBTSxDQUFDRSxZQUFQLEdBQXNCRixNQUFNLENBQUNDLFlBQXhFO0FBQ0FvQixRQUFBQSx3QkFBd0IsQ0FBQ2lCLE9BQXpCLEdBQW1DLEtBQW5DO0FBRUE7QUFDRCxPQVJTLENBVVY7QUFDQTtBQUNBOzs7QUFFQSxVQUFpQmlCLFdBQWpCLEdBQWlDN0IsY0FBakMsQ0FBUVksT0FBUjtBQUNBLFVBQVFyQyxZQUFSLEdBQWtERCxNQUFsRCxDQUFRQyxZQUFSO0FBQUEsVUFBc0JDLFlBQXRCLEdBQWtERixNQUFsRCxDQUFzQkUsWUFBdEI7QUFBQSxVQUFvQ0MsU0FBcEMsR0FBa0RILE1BQWxELENBQW9DRyxTQUFwQztBQUVBLFVBQU1xRCxRQUFRLEdBQUd6RCxJQUFJLEtBQUtSLFFBQVQsR0FBb0IsQ0FBcEIsR0FBd0JrRSxJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVl4RCxZQUFZLEdBQUdELFlBQWYsR0FBOEJFLFNBQTFDLENBQXpDO0FBQ0EsVUFBTXdELFFBQVEsR0FBR0YsSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZSCxXQUFXLEdBQUdwRCxTQUExQixDQUFqQjtBQUVBLFVBQU15RCxZQUFZLEdBQUcxQyxRQUFRLENBQUM7QUFBRXNDLFFBQUFBLFFBQVEsRUFBUkEsUUFBRjtBQUFZRyxRQUFBQSxRQUFRLEVBQVJBLFFBQVo7QUFBc0IxRCxRQUFBQSxZQUFZLEVBQVpBLFlBQXRCO0FBQW9DQyxRQUFBQSxZQUFZLEVBQVpBLFlBQXBDO0FBQWtEQyxRQUFBQSxTQUFTLEVBQVRBO0FBQWxELE9BQUQsQ0FBN0I7QUFFQSxVQUFNMEQsU0FBUyxHQUFHSixJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVlELElBQUksQ0FBQ0ssR0FBTCxDQUFTTixRQUFULEVBQW1CSSxZQUFuQixDQUFaLENBQWxCO0FBRUEsVUFBSWhCLGFBQUo7O0FBRUEsVUFBSTdDLElBQUksS0FBS1IsUUFBVCxJQUFxQnNFLFNBQVMsS0FBS0wsUUFBdkMsRUFBaUQ7QUFDL0NaLFFBQUFBLGFBQWEsR0FBR3pDLFNBQVMsR0FBRzBELFNBQTVCO0FBQ0QsT0FGRCxNQUVPO0FBQ0w7QUFDQTtBQUNBO0FBQ0FqQixRQUFBQSxhQUFhLEdBQUcsTUFBaEI7QUFDRDs7QUFFRDdCLE1BQUFBLEtBQUssQ0FBQztBQUFBOztBQUFBLGVBQU0sa0tBRW1Dd0MsV0FGbkMsa0NBR04sT0FBT1gsYUFBUCxLQUF5QixRQUF6QixHQUFvQ0EsYUFBYSxHQUFHLElBQXBELEdBQTJEQSxhQUFhLENBQUNJLE9BQWQsQ0FBc0IsSUFBdEIsRUFBNkIsSUFBN0IsQ0FIckQsOEJBSUMsQ0FBQ0osYUFBYSxLQUFLLE1BQWxCLEdBQTJCWSxRQUEzQixHQUFzQ1osYUFBdkMsSUFBd0RXLFdBSnpELGdEQUtMdEUsWUFBWSxDQUFDLFFBQUQsQ0FMUCxzQkFNTEEsWUFBWSxDQUFDLFFBQUQsQ0FOUCxzQkFPTEEsWUFBWSxDQUFDLFFBQUQsQ0FQUCxzQkFRTEEsWUFBWSxDQUFDLFFBQUQsQ0FSUCxJQVVWO0FBQ0VzRSxVQUFBQSxXQUFXLEVBQVhBLFdBREY7QUFFRUMsVUFBQUEsUUFBUSxFQUFSQSxRQUZGO0FBR0VHLFVBQUFBLFFBQVEsRUFBUkEsUUFIRjtBQUlFZixVQUFBQSxhQUFhLEVBQWJBLGFBSkY7QUFLRWlCLFVBQUFBLFNBQVMsRUFBVEEsU0FMRjtBQU1FNUQsVUFBQUEsWUFBWSxFQUFaQSxZQU5GO0FBT0UyRCxVQUFBQSxZQUFZLEVBQVpBLFlBUEY7QUFRRTFELFVBQUFBLFlBQVksRUFBWkEsWUFSRjtBQVNFQyxVQUFBQSxTQUFTLEVBQVRBO0FBVEYsU0FWVSxDQUFOO0FBQUEsT0FBRCxDQUFMO0FBdUJBd0MsTUFBQUEsUUFBUSxDQUFDQyxhQUFELEVBQWdCO0FBQUVDLFFBQUFBLFFBQVEsRUFBRTtBQUFaLE9BQWhCLENBQVI7QUFDRDtBQUNGLEdBL0RpQyxFQStEL0IsQ0FBQ25CLGNBQUQsRUFBaUJYLEtBQWpCLEVBQXdCaEIsSUFBeEIsRUFBOEJtQixRQUE5QixFQUF3Q3lCLFFBQXhDLEVBQWtEbEIsU0FBbEQsQ0EvRCtCLENBQWxDO0FBaUVBLE1BQU1zQyxZQUFZLEdBQUc1RixXQUFXLENBQzlCLGlCQUFzQjtBQUFBOztBQUFBLFFBQW5CNkYsWUFBbUIsU0FBbkJBLFlBQW1CO0FBQ3BCLFFBQWlCdkQsU0FBakIsR0FBK0JjLFlBQS9CLENBQVFlLE9BQVI7QUFDQSxRQUFpQnRDLE1BQWpCLEdBQTRCeUIsU0FBNUIsQ0FBUWEsT0FBUjtBQUVBLFFBQU0yQixTQUFTLEdBQUd4RCxTQUFTLEtBQUssSUFBaEMsQ0FKb0IsQ0FNcEI7QUFDQTtBQUNBOztBQUVBLFFBQUl1RCxZQUFZLElBQUk1QywwQkFBMEIsQ0FBQ2tCLE9BQTNDLElBQXNELENBQUN0QyxNQUEzRCxFQUFtRTtBQUNqRTtBQUNBO0FBQ0E7QUFFQTtBQUNEOztBQUVELDRCQUE0Q0YsZ0JBQWdCLENBQUM7QUFBRUMsTUFBQUEsSUFBSSxFQUFKQSxJQUFGO0FBQVFDLE1BQUFBLE1BQU0sRUFBTkE7QUFBUixLQUFELENBQTVEO0FBQUEsUUFBUUksUUFBUixxQkFBUUEsUUFBUjtBQUFBLFFBQWtCRSxLQUFsQixxQkFBa0JBLEtBQWxCO0FBQUEsUUFBeUJDLE9BQXpCLHFCQUF5QkEsT0FBekI7QUFBQSxRQUFrQ0YsS0FBbEMscUJBQWtDQSxLQUFsQzs7QUFFQXdCLElBQUFBLFdBQVcsQ0FBQ3pCLFFBQUQsQ0FBWDtBQUNBMEIsSUFBQUEsUUFBUSxDQUFDeEIsS0FBRCxDQUFSO0FBQ0EwQixJQUFBQSxVQUFVLENBQUN6QixPQUFELENBQVY7QUFDQXdCLElBQUFBLFFBQVEsQ0FBQzFCLEtBQUQsQ0FBUixDQXZCb0IsQ0F5QnBCO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQXNCNkQsZ0JBQXRCLEdBQTJFbEUsTUFBM0UsQ0FBUUMsWUFBUjtBQUFBLFFBQXNEa0UsZ0JBQXRELEdBQTJFbkUsTUFBM0UsQ0FBd0NFLFlBQXhDO0FBQ0EsUUFBaUJELFlBQWpCLEdBQWtDMEIsZUFBbEMsQ0FBUVcsT0FBUjtBQUNBLFFBQWlCcEMsWUFBakIsR0FBa0MwQixlQUFsQyxDQUFRVSxPQUFSO0FBQ0EsUUFBTThCLG1CQUFtQixHQUFHRixnQkFBZ0IsS0FBS2pFLFlBQWpEO0FBQ0EsUUFBTW9FLG1CQUFtQixHQUFHRixnQkFBZ0IsS0FBS2pFLFlBQWpEOztBQUVBLFFBQUlrRSxtQkFBSixFQUF5QjtBQUN2QnpDLE1BQUFBLGVBQWUsQ0FBQ1csT0FBaEIsR0FBMEI0QixnQkFBMUI7QUFDRDs7QUFFRCxRQUFJRyxtQkFBSixFQUF5QjtBQUN2QnpDLE1BQUFBLGVBQWUsQ0FBQ1UsT0FBaEIsR0FBMEI2QixnQkFBMUI7QUFDRCxLQXpDbUIsQ0EyQ3BCO0FBQ0E7QUFDQTtBQUVBOzs7QUFDQSxRQUFJLENBQUNDLG1CQUFELElBQXdCLENBQUNDLG1CQUE3QixFQUFrRDtBQUNoRDtBQUNBO0FBQ0EsVUFBTUMsVUFBVSxHQUFJTCxTQUFTLElBQUl6RCxLQUFLLENBQUNDLFNBQUQsRUFBWVYsSUFBWixDQUFuQixJQUF5Q08sS0FBNUQ7O0FBRUEsVUFBSTZCLFNBQVMsQ0FBQ0csT0FBVixLQUFzQmdDLFVBQTFCLEVBQXNDO0FBQ3BDdkQsUUFBQUEsS0FBSyxDQUFDO0FBQUE7O0FBQUEsaUJBQU0sK0VBRXlCdUQsVUFGekIsK0NBR0xyRixZQUFZLENBQUMsS0FBRCxDQUhQLHNCQUlMQSxZQUFZLENBQUMsS0FBRCxDQUpQLHNCQUtMQSxZQUFZLENBQUMsUUFBRCxDQUxQLDZJQVFVZ0YsU0FSVix3Q0FRc0N6RCxLQUFLLENBQUNDLFNBQUQsRUFBWVYsSUFBWixDQVIzQyx5Q0FRZ0ZPLEtBUmhGLDhDQVNMckIsWUFBWSxDQUFDLFFBQUQsQ0FUUCxzQkFVTEEsWUFBWSxDQUFDLFFBQUQsQ0FWUCxzQkFXTEEsWUFBWSxDQUFDLFFBQUQsQ0FYUCxJQVlSO0FBQ0VnRixZQUFBQSxTQUFTLEVBQVRBLFNBREY7QUFFRXhELFlBQUFBLFNBQVMsRUFBVEEsU0FGRjtBQUdFSCxZQUFBQSxLQUFLLEVBQUxBLEtBSEY7QUFJRVAsWUFBQUEsSUFBSSxFQUFKQSxJQUpGO0FBS0VFLFlBQUFBLFlBQVksRUFBRUQsTUFBTSxDQUFDQyxZQUx2QjtBQU1FQyxZQUFBQSxZQUFZLEVBQUVGLE1BQU0sQ0FBQ0UsWUFOdkI7QUFPRStCLFlBQUFBLE1BQU0sRUFBRUUsU0FBUyxDQUFDRyxPQVBwQjtBQVFFZ0MsWUFBQUEsVUFBVSxFQUFWQTtBQVJGLFdBWlEsR0FBTjtBQUFBLFNBQUQsQ0FBTDtBQXlCQXBDLFFBQUFBLFNBQVMsQ0FBQ29DLFVBQUQsQ0FBVDtBQUNEO0FBQ0YsS0FqQ0QsTUFpQ08sSUFBSW5DLFNBQVMsQ0FBQ0csT0FBZCxFQUF1QjtBQUM1QnZCLE1BQUFBLEtBQUssQ0FBQztBQUFBOztBQUFBLGVBQU0scUpBR0w5QixZQUFZLENBQUMsS0FBRCxDQUhQLHNCQUlMQSxZQUFZLENBQUMsUUFBRCxDQUpQLElBS1I7QUFDRW1GLFVBQUFBLG1CQUFtQixFQUFuQkEsbUJBREY7QUFFRUMsVUFBQUEsbUJBQW1CLEVBQW5CQTtBQUZGLFNBTFEsSUFVVjtBQUNFSCxVQUFBQSxnQkFBZ0IsRUFBaEJBLGdCQURGO0FBRUVLLFVBQUFBLGdCQUFnQixFQUFFdEUsWUFGcEI7QUFHRWtFLFVBQUFBLGdCQUFnQixFQUFoQkEsZ0JBSEY7QUFJRUssVUFBQUEsZ0JBQWdCLEVBQUV0RTtBQUpwQixTQVZVLENBQU47QUFBQSxPQUFELENBQUw7QUFrQkFvRCxNQUFBQSxjQUFjO0FBQ2Y7O0FBRUQsUUFBbUJtQixlQUFuQixHQUF1Q3pFLE1BQXZDLENBQVFHLFNBQVI7O0FBRUEsMENBQUFpQywwQkFBMEIsQ0FBQ0UsT0FBM0IsbUJBQTJDLFVBQUFvQyxRQUFRO0FBQUEsYUFBSUEsUUFBUSxDQUFDO0FBQUV2RSxRQUFBQSxTQUFTLEVBQUVzRTtBQUFiLE9BQUQsQ0FBWjtBQUFBLEtBQW5EO0FBQ0QsR0EzRzZCLEVBNEc5QixDQUNFbEQsWUFERixFQUVFUixLQUZGLEVBR0VLLDBCQUhGLEVBSUVyQixJQUpGLEVBS0U0QixlQUxGLEVBTUVDLGVBTkYsRUFPRVEsMEJBUEYsRUFRRWtCLGNBUkYsRUFTRXpCLFdBVEYsRUFVRUMsUUFWRixFQVdFRSxVQVhGLEVBWUVELFFBWkYsRUFhRUcsU0FiRixFQWNFQyxTQWRGLEVBZUVWLFNBZkYsQ0E1RzhCLENBQWhDO0FBK0hBckQsRUFBQUEsU0FBUyxDQUFDLFlBQU07QUFDZCxRQUFJNEIsTUFBSixFQUFZO0FBQ1YsVUFBSTJFLHNCQUFzQixHQUFHLEtBQTdCO0FBRUEsVUFBTUMsT0FBTyxHQUFHakYsb0JBQW9CLENBQUMsWUFBTTtBQUN6QyxZQUFpQkssTUFBakIsR0FBNEJ5QixTQUE1QixDQUFRYSxPQUFSO0FBQ0EsWUFBTTJCLFNBQVMsR0FBRzFDLFlBQVksQ0FBQ2UsT0FBYixLQUF5QixJQUEzQzs7QUFFQSxZQUFJSCxTQUFTLENBQUNHLE9BQWQsRUFBdUI7QUFDckIsY0FBSSxDQUFDeEMsZ0JBQWdCLENBQUM7QUFBRUMsWUFBQUEsSUFBSSxFQUFKQSxJQUFGO0FBQVFDLFlBQUFBLE1BQU0sRUFBTkE7QUFBUixXQUFELENBQWhCLENBQW1DTSxLQUF4QyxFQUErQztBQUM3QyxnQkFBSSxDQUFDcUUsc0JBQUwsRUFBNkI7QUFDM0JBLGNBQUFBLHNCQUFzQixHQUFHLFdBQXpCO0FBQ0QsYUFGRCxNQUVPLElBQUksY0FBYUEsc0JBQWIsR0FBc0NsRix3QkFBMUMsRUFBb0U7QUFDekU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQSxrQkFBSSxDQUFDd0UsU0FBTCxFQUFnQjtBQUNkdkMsZ0JBQUFBLGNBQWMsQ0FBQ1ksT0FBZixHQUF5QnRDLE1BQU0sQ0FBQ0csU0FBaEM7QUFFQVksZ0JBQUFBLEtBQUssQ0FBQztBQUFBOztBQUFBLGdNQUVEOUIsWUFBWSxDQUFDLE1BQUQsQ0FGWCxzQkFHREEsWUFBWSxDQUFDLFFBQUQsQ0FIWDtBQUFBLGlCQUFELENBQUw7QUFNQXFFLGdCQUFBQSxjQUFjO0FBQ2Y7O0FBRURxQixjQUFBQSxzQkFBc0IsR0FBRyxLQUF6QjtBQUNEO0FBQ0YsV0ExQkQsTUEwQk87QUFDTEEsWUFBQUEsc0JBQXNCLEdBQUcsS0FBekI7QUFDRDtBQUNGLFNBOUJELE1BOEJPLElBQUkzRSxNQUFNLENBQUNFLFlBQVAsSUFBdUJGLE1BQU0sQ0FBQ0MsWUFBOUIsSUFBOEMsQ0FBQ2tDLFNBQVMsQ0FBQ0csT0FBN0QsRUFBc0U7QUFDM0U7QUFFQXZCLFVBQUFBLEtBQUssQ0FBQztBQUFBOztBQUFBLG1CQUFNLHlKQUdMOUIsWUFBWSxDQUFDLE1BQUQsQ0FIUCxzQkFJTEEsWUFBWSxDQUFDLFFBQUQsQ0FKUCxJQU1WLENBQ0U7QUFDRWdCLGNBQUFBLFlBQVksRUFBRUQsTUFBTSxDQUFDQyxZQUR2QjtBQUVFQyxjQUFBQSxZQUFZLEVBQUVGLE1BQU0sQ0FBQ0UsWUFGdkI7QUFHRStCLGNBQUFBLE1BQU0sRUFBRUUsU0FBUyxDQUFDRztBQUhwQixhQURGLENBTlUsQ0FBTjtBQUFBLFdBQUQsQ0FBTDtBQWVBSixVQUFBQSxTQUFTLENBQUMsSUFBRCxDQUFUO0FBQ0Q7QUFDRixPQXREbUMsRUFzRGpDdUIsSUFBSSxDQUFDQyxHQUFMLENBQVNyRSxrQkFBVCxFQUE2QnNCLGFBQTdCLEtBQStDdEIsa0JBdERkLENBQXBDO0FBd0RBLGFBQU87QUFBQSxlQUFNd0YsYUFBYSxDQUFDRCxPQUFELENBQW5CO0FBQUEsT0FBUDtBQUNEO0FBQ0YsR0E5RFEsRUE4RE4sQ0FBQ3JELFlBQUQsRUFBZVosYUFBZixFQUE4QkksS0FBOUIsRUFBcUNoQixJQUFyQyxFQUEyQ3VELGNBQTNDLEVBQTJEcEIsU0FBM0QsRUFBc0VDLFNBQXRFLEVBQWlGbkMsTUFBakYsRUFBeUZ5QixTQUF6RixDQTlETSxDQUFUO0FBZ0VBLE1BQU1xRCxnQkFBZ0IsR0FBR3pHLE9BQU8sQ0FBQyxZQUFNO0FBQ3JDLFFBQU0wRyxPQUFPLEdBQ1hyRixXQUFXLENBQUN1QixLQUFELENBQVgsS0FDQ3ZCLFdBQVcsQ0FBQ3VCLEtBQUQsQ0FBWCxHQUFxQmpELGFBQWEsQ0FBQztBQUFFZ0gsTUFBQUEsR0FBRyxFQUFFLGlDQUFpQ3hHLFlBQVksRUFBcEQ7QUFBd0R5QyxNQUFBQSxLQUFLLEVBQUxBO0FBQXhELEtBQUQsQ0FEbkMsQ0FERjtBQUlBLFdBQU8sVUFBQWdFLEtBQUs7QUFBQSxhQUFJRixPQUFPLENBQUNHLEdBQVIsQ0FBWUQsS0FBWixJQUFxQixFQUF6QjtBQUFBLEtBQVo7QUFDRCxHQU4rQixFQU03QixDQUFDaEUsS0FBRCxDQU42QixDQUFoQztBQVFBLE1BQU1rRSxlQUFlLEdBQUc5RyxPQUFPLENBQzdCO0FBQUEsV0FBTztBQUNMZ0UsTUFBQUEscUJBQXFCLEVBQXJCQSxxQkFESztBQUVMYixNQUFBQSxTQUFTLEVBQVRBLFNBRks7QUFHTHNELE1BQUFBLGdCQUFnQixFQUFoQkE7QUFISyxLQUFQO0FBQUEsR0FENkIsRUFNN0IsQ0FBQ3pDLHFCQUFELEVBQXdCYixTQUF4QixFQUFtQ3NELGdCQUFuQyxDQU42QixDQUEvQjtBQVNBLE1BQU1NLGFBQWEsR0FBRy9HLE9BQU8sQ0FDM0I7QUFBQSxXQUFPO0FBQ0wrQixNQUFBQSxRQUFRLEVBQVJBLFFBREs7QUFFTEUsTUFBQUEsS0FBSyxFQUFMQSxLQUZLO0FBR0xDLE1BQUFBLE9BQU8sRUFBUEEsT0FISztBQUlMRixNQUFBQSxLQUFLLEVBQUxBLEtBSks7QUFLTE4sTUFBQUEsSUFBSSxFQUFKQTtBQUxLLEtBQVA7QUFBQSxHQUQyQixFQVEzQixDQUFDSyxRQUFELEVBQVdFLEtBQVgsRUFBa0JDLE9BQWxCLEVBQTJCRixLQUEzQixFQUFrQ04sSUFBbEMsQ0FSMkIsQ0FBN0I7QUFXQSxNQUFNc0YsYUFBYSxHQUFHaEgsT0FBTyxDQUFDLFlBQU07QUFDbEMsUUFBTTRGLFNBQVMsR0FBR3hELFNBQVMsS0FBSyxJQUFoQztBQUVBLFdBQU87QUFDTHdELE1BQUFBLFNBQVMsRUFBVEEsU0FESztBQUVMcUIsTUFBQUEsY0FBYyxFQUFFckIsU0FBUyxJQUFJekQsS0FBSyxDQUFDQyxTQUFELEVBQVlWLElBQVosQ0FGN0I7QUFHTGtDLE1BQUFBLE1BQU0sRUFBTkE7QUFISyxLQUFQO0FBS0QsR0FSNEIsRUFRMUIsQ0FBQ3hCLFNBQUQsRUFBWVYsSUFBWixFQUFrQmtDLE1BQWxCLENBUjBCLENBQTdCO0FBVUEsTUFBTXNELG9CQUFvQixHQUFHbEgsT0FBTyxDQUNsQztBQUFBLDJDQUNLK0csYUFETCxHQUVLQyxhQUZMO0FBQUEsR0FEa0MsRUFLbEMsQ0FBQ0QsYUFBRCxFQUFnQkMsYUFBaEIsQ0FMa0MsQ0FBcEM7QUFRQSxNQUFNRyxlQUFlLEdBQUduSCxPQUFPLENBQzdCO0FBQUEsV0FBTztBQUNMc0UsTUFBQUEsUUFBUSxFQUFSQSxRQURLO0FBRUxNLE1BQUFBLGNBQWMsRUFBZEEsY0FGSztBQUdMRSxNQUFBQSxXQUFXLEVBQVhBLFdBSEs7QUFJTEUsTUFBQUEsYUFBYSxFQUFiQSxhQUpLO0FBS0xILE1BQUFBLFdBQVcsRUFBWEE7QUFMSyxLQUFQO0FBQUEsR0FENkIsRUFRN0IsQ0FBQ1AsUUFBRCxFQUFXTSxjQUFYLEVBQTJCRSxXQUEzQixFQUF3Q0UsYUFBeEMsRUFBdURILFdBQXZELENBUjZCLENBQS9CO0FBV0E5RSxFQUFBQSxTQUFTLENBQUMsWUFBTTtBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSTRCLE1BQUosRUFBWTtBQUNWLFVBQU15RixXQUFXLEdBQUcsU0FBZEEsV0FBYyxHQUFNO0FBQ3hCN0QsUUFBQUEsZUFBZSxDQUFDVSxPQUFoQixHQUEwQnRDLE1BQU0sQ0FBQ0UsWUFBakM7QUFDRCxPQUZEOztBQUlBRixNQUFBQSxNQUFNLENBQUMwRixnQkFBUCxDQUF3QixPQUF4QixFQUFpQ0QsV0FBakMsRUFBOEM7QUFBRUUsUUFBQUEsT0FBTyxFQUFFLElBQVg7QUFBaUJDLFFBQUFBLE9BQU8sRUFBRTtBQUExQixPQUE5QztBQUVBLGFBQU87QUFBQSxlQUFNNUYsTUFBTSxDQUFDNkYsbUJBQVAsQ0FBMkIsT0FBM0IsRUFBb0NKLFdBQXBDLENBQU47QUFBQSxPQUFQO0FBQ0Q7QUFDRixHQTdCUSxFQTZCTixDQUFDekYsTUFBRCxDQTdCTSxDQUFUO0FBK0JBZSxFQUFBQSxLQUFLLENBQUM7QUFBQTs7QUFBQSxXQUFNLGtHQUNnQjlCLFlBQVksQ0FBQyxNQUFELEVBQVMsRUFBVCxDQUQ1QixJQUVWO0FBQ0V3QixNQUFBQSxTQUFTLEVBQVRBLFNBREY7QUFFRXdELE1BQUFBLFNBQVMsRUFBRXhELFNBQVMsS0FBSyxJQUYzQjtBQUdFd0IsTUFBQUEsTUFBTSxFQUFOQSxNQUhGO0FBSUVqQyxNQUFBQSxNQUFNLEVBQU5BO0FBSkYsS0FGVSxDQUFOO0FBQUEsR0FBRCxDQUFMO0FBVUEsc0JBQ0Usb0JBQUMsZUFBRCxDQUFpQixRQUFqQjtBQUEwQixJQUFBLEtBQUssRUFBRW1GO0FBQWpDLGtCQUNFLG9CQUFDLGVBQUQsQ0FBaUIsUUFBakI7QUFBMEIsSUFBQSxLQUFLLEVBQUVLO0FBQWpDLGtCQUNFLG9CQUFDLFlBQUQsQ0FBYyxRQUFkO0FBQXVCLElBQUEsS0FBSyxFQUFFRDtBQUE5QixrQkFDRSxvQkFBQyxhQUFELENBQWUsUUFBZjtBQUF3QixJQUFBLEtBQUssRUFBRUg7QUFBL0Isa0JBQ0Usb0JBQUMsYUFBRCxDQUFlLFFBQWY7QUFBd0IsSUFBQSxLQUFLLEVBQUVDO0FBQS9CLEtBQ0d6RSxRQURILEVBRUdaLE1BQU0saUJBQUksb0JBQUMsUUFBRDtBQUFVLElBQUEsUUFBUSxFQUFFYSxRQUFwQjtBQUE4QixJQUFBLElBQUksRUFBQyxRQUFuQztBQUE0QyxJQUFBLE9BQU8sRUFBRWtELFlBQXJEO0FBQW1FLElBQUEsTUFBTSxFQUFFL0Q7QUFBM0UsSUFGYixFQUdHQSxNQUFNLElBQUlTLFNBQVMsS0FBSyxJQUF4QixpQkFDQyxvQkFBQyxPQUFEO0FBQVMsSUFBQSxJQUFJLEVBQUMsV0FBZDtBQUEwQixJQUFBLEtBQUssRUFBRWlDLGdCQUFqQztBQUFtRCxJQUFBLE1BQU0sRUFBRTFDLE1BQTNEO0FBQW1FLElBQUEsS0FBSyxFQUFFUztBQUExRSxJQUpKLENBREYsQ0FERixDQURGLENBREYsQ0FERjtBQWlCRCxDQXRqQkQ7O0FBd2pCQUMsUUFBUSxDQUFDb0YsU0FBVCxHQUFxQjtBQUNuQm5GLEVBQUFBLGFBQWEsRUFBRTFDLFNBQVMsQ0FBQzhILE1BRE47QUFFbkJuRixFQUFBQSxRQUFRLEVBQUUzQyxTQUFTLENBQUMrSCxHQUZEO0FBR25CbkYsRUFBQUEsUUFBUSxFQUFFNUMsU0FBUyxDQUFDOEgsTUFIRDtBQUluQmhGLEVBQUFBLEtBQUssRUFBRTlDLFNBQVMsQ0FBQ2dJLElBSkU7QUFLbkJqRixFQUFBQSxxQkFBcUIsRUFBRS9DLFNBQVMsQ0FBQ2lJLEtBQVYsQ0FBZ0IsQ0FBQyxNQUFELEVBQVMsUUFBVCxDQUFoQixDQUxKO0FBTW5CbkcsRUFBQUEsSUFBSSxFQUFFOUIsU0FBUyxDQUFDaUksS0FBVixDQUFnQixDQUFDLFFBQUQsRUFBVyxLQUFYLENBQWhCLENBTmE7QUFPbkJqRixFQUFBQSxLQUFLLEVBQUVoRCxTQUFTLENBQUNrSSxNQVBFO0FBUW5CakYsRUFBQUEsUUFBUSxFQUFFakQsU0FBUyxDQUFDbUk7QUFSRCxDQUFyQjtBQVdBLGVBQWUxRixRQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZUVtb3Rpb24gZnJvbSAnQGVtb3Rpb24vY3NzL2NyZWF0ZS1pbnN0YW5jZSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBjcmVhdGVDU1NLZXkgZnJvbSAnLi4vY3JlYXRlQ1NTS2V5JztcbmltcG9ydCBjcmVhdGVEZWJ1ZyBmcm9tICcuLi91dGlscy9kZWJ1Zyc7XG5pbXBvcnQgRXZlbnRTcHkgZnJvbSAnLi4vRXZlbnRTcHknO1xuaW1wb3J0IEZ1bmN0aW9uQ29udGV4dCBmcm9tICcuL0Z1bmN0aW9uQ29udGV4dCc7XG5pbXBvcnQgSW50ZXJuYWxDb250ZXh0IGZyb20gJy4vSW50ZXJuYWxDb250ZXh0JztcbmltcG9ydCBTcGluZVRvIGZyb20gJy4uL1NwaW5lVG8nO1xuaW1wb3J0IFN0YXRlMUNvbnRleHQgZnJvbSAnLi9TdGF0ZTFDb250ZXh0JztcbmltcG9ydCBTdGF0ZTJDb250ZXh0IGZyb20gJy4vU3RhdGUyQ29udGV4dCc7XG5pbXBvcnQgU3RhdGVDb250ZXh0IGZyb20gJy4vU3RhdGVDb250ZXh0JztcbmltcG9ydCBzdHlsZUNvbnNvbGUgZnJvbSAnLi4vdXRpbHMvc3R5bGVDb25zb2xlJztcbmltcG9ydCB1c2VTdGF0ZVJlZiBmcm9tICcuLi9ob29rcy9pbnRlcm5hbC91c2VTdGF0ZVJlZic7XG5cbmNvbnN0IERFRkFVTFRfU0NST0xMRVIgPSAoKSA9PiBJbmZpbml0eTtcbmNvbnN0IE1JTl9DSEVDS19JTlRFUlZBTCA9IDE3OyAvLyAxIGZyYW1lXG5jb25zdCBNT0RFX0JPVFRPTSA9ICdib3R0b20nO1xuY29uc3QgTU9ERV9UT1AgPSAndG9wJztcbmNvbnN0IE5FQVJfRU5EX1RIUkVTSE9MRCA9IDE7XG5jb25zdCBTQ1JPTExfREVDSVNJT05fRFVSQVRJT04gPSAzNDsgLy8gMiBmcmFtZXNcblxuLy8gV2UgcG9vbCB0aGUgZW1vdGlvbiBvYmplY3QgYnkgbm9uY2UuXG4vLyBUaGlzIGlzIHRvIG1ha2Ugc3VyZSB3ZSBkb24ndCBnZW5lcmF0ZSB0b28gbWFueSB1bm5lZWRlZCA8c3R5bGU+IHRhZ3MuXG5jb25zdCBlbW90aW9uUG9vbCA9IHt9O1xuXG5mdW5jdGlvbiBzZXRJbW1lZGlhdGVJbnRlcnZhbChmbiwgbXMpIHtcbiAgZm4oKTtcblxuICByZXR1cm4gc2V0SW50ZXJ2YWwoZm4sIG1zKTtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZVZpZXdTdGF0ZSh7IG1vZGUsIHRhcmdldDogeyBvZmZzZXRIZWlnaHQsIHNjcm9sbEhlaWdodCwgc2Nyb2xsVG9wIH0gfSkge1xuICBjb25zdCBhdEJvdHRvbSA9IHNjcm9sbEhlaWdodCAtIHNjcm9sbFRvcCAtIG9mZnNldEhlaWdodCA8IE5FQVJfRU5EX1RIUkVTSE9MRDtcbiAgY29uc3QgYXRUb3AgPSBzY3JvbGxUb3AgPCBORUFSX0VORF9USFJFU0hPTEQ7XG5cbiAgY29uc3QgYXRFbmQgPSBtb2RlID09PSBNT0RFX1RPUCA/IGF0VG9wIDogYXRCb3R0b207XG4gIGNvbnN0IGF0U3RhcnQgPSBtb2RlICE9PSBNT0RFX1RPUCA/IGF0VG9wIDogYXRCb3R0b207XG5cbiAgcmV0dXJuIHtcbiAgICBhdEJvdHRvbSxcbiAgICBhdEVuZCxcbiAgICBhdFN0YXJ0LFxuICAgIGF0VG9wXG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzRW5kKGFuaW1hdGVUbywgbW9kZSkge1xuICByZXR1cm4gYW5pbWF0ZVRvID09PSAobW9kZSA9PT0gTU9ERV9UT1AgPyAwIDogJzEwMCUnKTtcbn1cblxuY29uc3QgQ29tcG9zZXIgPSAoe1xuICBjaGVja0ludGVydmFsID0gMTAwLFxuICBjaGlsZHJlbixcbiAgZGVib3VuY2UgPSAxNyxcbiAgZGVidWc6IGRlYnVnRnJvbVByb3AsXG4gIGluaXRpYWxTY3JvbGxCZWhhdmlvciA9ICdzbW9vdGgnLFxuICBtb2RlLFxuICBub25jZSxcbiAgc2Nyb2xsZXIgPSBERUZBVUxUX1NDUk9MTEVSXG59KSA9PiB7XG4gIGNvbnN0IGRlYnVnID0gdXNlTWVtbygoKSA9PiBjcmVhdGVEZWJ1ZyhgPFNjcm9sbFRvQm90dG9tPmAsIHsgZm9yY2U6IGRlYnVnRnJvbVByb3AgfSksIFtkZWJ1Z0Zyb21Qcm9wXSk7XG5cbiAgbW9kZSA9IG1vZGUgPT09IE1PREVfVE9QID8gTU9ERV9UT1AgOiBNT0RFX0JPVFRPTTtcblxuICBjb25zdCBpZ25vcmVTY3JvbGxFdmVudEJlZm9yZVJlZiA9IHVzZVJlZigwKTtcbiAgY29uc3QgaW5pdGlhbFNjcm9sbEJlaGF2aW9yUmVmID0gdXNlUmVmKGluaXRpYWxTY3JvbGxCZWhhdmlvcik7XG4gIGNvbnN0IFthbmltYXRlVG8sIHNldEFuaW1hdGVUbywgYW5pbWF0ZVRvUmVmXSA9IHVzZVN0YXRlUmVmKG1vZGUgPT09IE1PREVfVE9QID8gMCA6ICcxMDAlJyk7XG4gIGNvbnN0IFt0YXJnZXQsIHNldFRhcmdldCwgdGFyZ2V0UmVmXSA9IHVzZVN0YXRlUmVmKG51bGwpO1xuXG4gIC8vIEludGVybmFsIGNvbnRleHRcbiAgY29uc3QgYW5pbWF0ZUZyb21SZWYgPSB1c2VSZWYoMCk7XG4gIGNvbnN0IG9mZnNldEhlaWdodFJlZiA9IHVzZVJlZigwKTtcbiAgY29uc3Qgc2Nyb2xsSGVpZ2h0UmVmID0gdXNlUmVmKDApO1xuXG4gIC8vIFN0YXRlIGNvbnRleHRcbiAgY29uc3QgW2F0Qm90dG9tLCBzZXRBdEJvdHRvbV0gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW2F0RW5kLCBzZXRBdEVuZF0gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW2F0VG9wLCBzZXRBdFRvcF0gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3QgW2F0U3RhcnQsIHNldEF0U3RhcnRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbc3RpY2t5LCBzZXRTdGlja3ksIHN0aWNreVJlZl0gPSB1c2VTdGF0ZVJlZih0cnVlKTtcblxuICAvLyBIaWdoLXJhdGUgc3RhdGUgY29udGV4dFxuICBjb25zdCBzY3JvbGxQb3NpdGlvbk9ic2VydmVyc1JlZiA9IHVzZVJlZihbXSk7XG4gIGNvbnN0IG9ic2VydmVTY3JvbGxQb3NpdGlvbiA9IHVzZUNhbGxiYWNrKFxuICAgIGZuID0+IHtcbiAgICAgIGNvbnN0IHsgY3VycmVudDogdGFyZ2V0IH0gPSB0YXJnZXRSZWY7XG5cbiAgICAgIHNjcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzUmVmLmN1cnJlbnQucHVzaChmbik7XG4gICAgICB0YXJnZXQgJiYgZm4oeyBzY3JvbGxUb3A6IHRhcmdldC5zY3JvbGxUb3AgfSk7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudDogc2Nyb2xsUG9zaXRpb25PYnNlcnZlcnMgfSA9IHNjcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzUmVmO1xuICAgICAgICBjb25zdCBpbmRleCA9IHNjcm9sbFBvc2l0aW9uT2JzZXJ2ZXJzLmluZGV4T2YoZm4pO1xuXG4gICAgICAgIH5pbmRleCAmJiBzY3JvbGxQb3NpdGlvbk9ic2VydmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfTtcbiAgICB9LFxuICAgIFtzY3JvbGxQb3NpdGlvbk9ic2VydmVyc1JlZiwgdGFyZ2V0UmVmXVxuICApO1xuXG4gIGNvbnN0IGhhbmRsZVNwaW5lVG9FbmQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY29uc3QgeyBjdXJyZW50OiBhbmltYXRlVG8gfSA9IGFuaW1hdGVUb1JlZjtcblxuICAgIGRlYnVnKCgpID0+IFtcbiAgICAgICclY1NwaW5lVG8lYzogJWNvbkVuZCVjIGlzIGZpcmVkLicsXG4gICAgICAuLi5zdHlsZUNvbnNvbGUoJ21hZ2VudGEnKSxcbiAgICAgIC4uLnN0eWxlQ29uc29sZSgnb3JhbmdlJyksXG4gICAgICB7IGFuaW1hdGVUbyB9XG4gICAgXSk7XG5cbiAgICBpZ25vcmVTY3JvbGxFdmVudEJlZm9yZVJlZi5jdXJyZW50ID0gRGF0ZS5ub3coKTtcblxuICAgIC8vIGhhbmRsZVNjcm9sbEVuZCBtYXkgZW5kIGF0IGEgcG9zaXRpb24gd2hpY2ggc2hvdWxkIGxvc2Ugc3RpY2tpbmVzcy5cbiAgICAvLyBJbiB0aGF0IGNhc2UsIHdlIHdpbGwgbmVlZCB0byBzZXQgc3RpY2t5IHRvIGZhbHNlIHRvIHN0b3AgdGhlIGludGVydmFsIGNoZWNrLlxuICAgIC8vIFRlc3QgY2FzZTpcbiAgICAvLyAxLiBBZGQgYSBzY3JvbGxlciB0aGF0IGFsd2F5cyByZXR1cm4gMFxuICAgIC8vIDIuIFNob3cgYSBwYW5lbCB3aXRoIG1vZGUgPT09IE1PREVfQk9UVE9NXG4gICAgLy8gMy4gUHJvZ3JhbW1hdGljYWxseSBzY3JvbGwgdG8gMCAoc2V0IGVsZW1lbnQuc2Nyb2xsVG9wID0gMClcbiAgICAvLyBFeHBlY3RlZDogaXQgc2hvdWxkIG5vdCByZXBldGl0aXZlbHkgY2FsbCBzY3JvbGxUbygwKVxuICAgIC8vICAgICAgICAgICBpdCBzaG91bGQgc2V0IHN0aWNraW5lc3MgdG8gZmFsc2VcblxuICAgIGlzRW5kKGFuaW1hdGVUbywgbW9kZSkgfHwgc2V0U3RpY2t5KGZhbHNlKTtcbiAgICBzZXRBbmltYXRlVG8obnVsbCk7XG4gIH0sIFthbmltYXRlVG9SZWYsIGRlYnVnLCBpZ25vcmVTY3JvbGxFdmVudEJlZm9yZVJlZiwgbW9kZSwgc2V0QW5pbWF0ZVRvLCBzZXRTdGlja3ldKTtcblxuICAvLyBGdW5jdGlvbiBjb250ZXh0XG4gIGNvbnN0IHNjcm9sbFRvID0gdXNlQ2FsbGJhY2soXG4gICAgKG5leHRBbmltYXRlVG8sIHsgYmVoYXZpb3IgfSA9IHt9KSA9PiB7XG4gICAgICBjb25zdCB7IGN1cnJlbnQ6IHRhcmdldCB9ID0gdGFyZ2V0UmVmO1xuXG4gICAgICBpZiAodHlwZW9mIG5leHRBbmltYXRlVG8gIT09ICdudW1iZXInICYmIG5leHRBbmltYXRlVG8gIT09ICcxMDAlJykge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKCdyZWFjdC1zY3JvbGwtdG8tYm90dG9tOiBBcmd1bWVudHMgcGFzc2VkIHRvIHNjcm9sbFRvKCkgbXVzdCBiZSBlaXRoZXIgbnVtYmVyIG9yIFwiMTAwJVwiLicpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBpdCBpcyB0cnlpbmcgdG8gc2Nyb2xsIHRvIGEgcG9zaXRpb24gd2hpY2ggaXMgbm90IFwiYXRFbmRcIiwgaXQgc2hvdWxkIHNldCBzdGlja3kgdG8gZmFsc2UgYWZ0ZXIgc2Nyb2xsIGVuZGVkLlxuXG4gICAgICBkZWJ1ZygoKSA9PiBbXG4gICAgICAgIFtcbiAgICAgICAgICBgJWNzY3JvbGxUbyVjOiBXaWxsIHNjcm9sbCB0byAlYyR7XG4gICAgICAgICAgICB0eXBlb2YgbmV4dEFuaW1hdGVUbyA9PT0gJ251bWJlcicgPyBuZXh0QW5pbWF0ZVRvICsgJ3B4JyA6IG5leHRBbmltYXRlVG8ucmVwbGFjZSgvJS9ndSwgJyUlJylcbiAgICAgICAgICB9JWNgLFxuICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgnbGltZScsICcnKSxcbiAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3B1cnBsZScpXG4gICAgICAgIF0sXG4gICAgICAgIHtcbiAgICAgICAgICBiZWhhdmlvcixcbiAgICAgICAgICBuZXh0QW5pbWF0ZVRvLFxuICAgICAgICAgIHRhcmdldFxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgaWYgKGJlaGF2aW9yID09PSAnYXV0bycpIHtcbiAgICAgICAgLy8gU3RvcCBhbnkgZXhpc3RpbmcgYW5pbWF0aW9uXG4gICAgICAgIGhhbmRsZVNwaW5lVG9FbmQoKTtcblxuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgLy8gSnVtcCB0byB0aGUgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICAgICAgdGFyZ2V0LnNjcm9sbFRvcCA9IG5leHRBbmltYXRlVG8gPT09ICcxMDAlJyA/IHRhcmdldC5zY3JvbGxIZWlnaHQgLSB0YXJnZXQub2Zmc2V0SGVpZ2h0IDogbmV4dEFuaW1hdGVUbztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmVoYXZpb3IgIT09ICdzbW9vdGgnICYmXG4gICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgJ3JlYWN0LXNjcm9sbC10by1ib3R0b206IFBsZWFzZSBzZXQgXCJiZWhhdmlvclwiIHdoZW4gY2FsbGluZyBcInNjcm9sbFRvXCIuIEluIGZ1dHVyZSB2ZXJzaW9ucywgdGhlIGRlZmF1bHQgYmVoYXZpb3Igd2lsbCBiZSBjaGFuZ2VkIGZyb20gc21vb3RoIHNjcm9sbGluZyB0byBkaXNjcmV0ZSBzY3JvbGxpbmcgdG8gYWxpZ24gd2l0aCBIVE1MIFN0YW5kYXJkLidcbiAgICAgICAgICApO1xuXG4gICAgICAgIHNldEFuaW1hdGVUbyhuZXh0QW5pbWF0ZVRvKTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhpcyBpcyBmb3IgaGFuZGxpbmcgYSBjYXNlLiBXaGVuIGNhbGxpbmcgc2Nyb2xsVG8oJzEwMCUnLCB7IGJlaGF2aW9yOiAnYXV0bycgfSkgbXVsdGlwbGUgdGltZXMsIGl0IHdvdWxkIGxvc2Ugc3RpY2tpbmVzcy5cbiAgICAgIGlmIChpc0VuZChuZXh0QW5pbWF0ZVRvLCBtb2RlKSkge1xuICAgICAgICBkZWJ1ZygoKSA9PiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgYCVjc2Nyb2xsVG8lYzogU2Nyb2xsaW5nIHRvIGVuZCwgd2lsbCBzZXQgc3RpY2t5IHRvICVjdHJ1ZSVjLmAsXG4gICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ2xpbWUnLCAnJyksXG4gICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3B1cnBsZScpXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbeyBtb2RlLCBuZXh0QW5pbWF0ZVRvIH1dXG4gICAgICAgIF0pO1xuXG4gICAgICAgIHNldFN0aWNreSh0cnVlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtkZWJ1ZywgaGFuZGxlU3BpbmVUb0VuZCwgbW9kZSwgc2V0QW5pbWF0ZVRvLCBzZXRTdGlja3ksIHRhcmdldFJlZl1cbiAgKTtcblxuICBjb25zdCBzY3JvbGxUb0JvdHRvbSA9IHVzZUNhbGxiYWNrKFxuICAgICh7IGJlaGF2aW9yIH0gPSB7fSkgPT4ge1xuICAgICAgZGVidWcoKCkgPT4gWyclY3Njcm9sbFRvQm90dG9tJWM6IENhbGxlZCcsIC4uLnN0eWxlQ29uc29sZSgneWVsbG93JywgJycpXSk7XG5cbiAgICAgIGJlaGF2aW9yICE9PSAnc21vb3RoJyAmJlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ3JlYWN0LXNjcm9sbC10by1ib3R0b206IFBsZWFzZSBzZXQgXCJiZWhhdmlvclwiIHdoZW4gY2FsbGluZyBcInNjcm9sbFRvQm90dG9tXCIuIEluIGZ1dHVyZSB2ZXJzaW9ucywgdGhlIGRlZmF1bHQgYmVoYXZpb3Igd2lsbCBiZSBjaGFuZ2VkIGZyb20gc21vb3RoIHNjcm9sbGluZyB0byBkaXNjcmV0ZSBzY3JvbGxpbmcgdG8gYWxpZ24gd2l0aCBIVE1MIFN0YW5kYXJkLidcbiAgICAgICAgKTtcblxuICAgICAgc2Nyb2xsVG8oJzEwMCUnLCB7IGJlaGF2aW9yOiBiZWhhdmlvciB8fCAnc21vb3RoJyB9KTtcbiAgICB9LFxuICAgIFtkZWJ1Zywgc2Nyb2xsVG9dXG4gICk7XG5cbiAgY29uc3Qgc2Nyb2xsVG9Ub3AgPSB1c2VDYWxsYmFjayhcbiAgICAoeyBiZWhhdmlvciB9ID0ge30pID0+IHtcbiAgICAgIGRlYnVnKCgpID0+IFsnJWNzY3JvbGxUb1RvcCVjOiBDYWxsZWQnLCAuLi5zdHlsZUNvbnNvbGUoJ3llbGxvdycsICcnKV0pO1xuXG4gICAgICBiZWhhdmlvciAhPT0gJ3Ntb290aCcgJiZcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdyZWFjdC1zY3JvbGwtdG8tYm90dG9tOiBQbGVhc2Ugc2V0IFwiYmVoYXZpb3JcIiB3aGVuIGNhbGxpbmcgXCJzY3JvbGxUb1RvcFwiLiBJbiBmdXR1cmUgdmVyc2lvbnMsIHRoZSBkZWZhdWx0IGJlaGF2aW9yIHdpbGwgYmUgY2hhbmdlZCBmcm9tIHNtb290aCBzY3JvbGxpbmcgdG8gZGlzY3JldGUgc2Nyb2xsaW5nIHRvIGFsaWduIHdpdGggSFRNTCBTdGFuZGFyZC4nXG4gICAgICAgICk7XG5cbiAgICAgIHNjcm9sbFRvKDAsIHsgYmVoYXZpb3I6IGJlaGF2aW9yIHx8ICdzbW9vdGgnIH0pO1xuICAgIH0sXG4gICAgW2RlYnVnLCBzY3JvbGxUb11cbiAgKTtcblxuICBjb25zdCBzY3JvbGxUb0VuZCA9IHVzZUNhbGxiYWNrKFxuICAgICh7IGJlaGF2aW9yIH0gPSB7fSkgPT4ge1xuICAgICAgZGVidWcoKCkgPT4gWyclY3Njcm9sbFRvRW5kJWM6IENhbGxlZCcsIC4uLnN0eWxlQ29uc29sZSgneWVsbG93JywgJycpXSk7XG5cbiAgICAgIGJlaGF2aW9yICE9PSAnc21vb3RoJyAmJlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ3JlYWN0LXNjcm9sbC10by1ib3R0b206IFBsZWFzZSBzZXQgXCJiZWhhdmlvclwiIHdoZW4gY2FsbGluZyBcInNjcm9sbFRvRW5kXCIuIEluIGZ1dHVyZSB2ZXJzaW9ucywgdGhlIGRlZmF1bHQgYmVoYXZpb3Igd2lsbCBiZSBjaGFuZ2VkIGZyb20gc21vb3RoIHNjcm9sbGluZyB0byBkaXNjcmV0ZSBzY3JvbGxpbmcgdG8gYWxpZ24gd2l0aCBIVE1MIFN0YW5kYXJkLidcbiAgICAgICAgKTtcblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgYmVoYXZpb3I6IGJlaGF2aW9yIHx8ICdzbW9vdGgnIH07XG5cbiAgICAgIG1vZGUgPT09IE1PREVfVE9QID8gc2Nyb2xsVG9Ub3Aob3B0aW9ucykgOiBzY3JvbGxUb0JvdHRvbShvcHRpb25zKTtcbiAgICB9LFxuICAgIFtkZWJ1ZywgbW9kZSwgc2Nyb2xsVG9Cb3R0b20sIHNjcm9sbFRvVG9wXVxuICApO1xuXG4gIGNvbnN0IHNjcm9sbFRvU3RhcnQgPSB1c2VDYWxsYmFjayhcbiAgICAoeyBiZWhhdmlvciB9ID0ge30pID0+IHtcbiAgICAgIGRlYnVnKCgpID0+IFsnJWNzY3JvbGxUb1N0YXJ0JWM6IENhbGxlZCcsIC4uLnN0eWxlQ29uc29sZSgneWVsbG93JywgJycpXSk7XG5cbiAgICAgIGJlaGF2aW9yICE9PSAnc21vb3RoJyAmJlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ3JlYWN0LXNjcm9sbC10by1ib3R0b206IFBsZWFzZSBzZXQgXCJiZWhhdmlvclwiIHdoZW4gY2FsbGluZyBcInNjcm9sbFRvU3RhcnRcIi4gSW4gZnV0dXJlIHZlcnNpb25zLCB0aGUgZGVmYXVsdCBiZWhhdmlvciB3aWxsIGJlIGNoYW5nZWQgZnJvbSBzbW9vdGggc2Nyb2xsaW5nIHRvIGRpc2NyZXRlIHNjcm9sbGluZyB0byBhbGlnbiB3aXRoIEhUTUwgU3RhbmRhcmQuJ1xuICAgICAgICApO1xuXG4gICAgICBjb25zdCBvcHRpb25zID0geyBiZWhhdmlvcjogYmVoYXZpb3IgfHwgJ3Ntb290aCcgfTtcblxuICAgICAgbW9kZSA9PT0gTU9ERV9UT1AgPyBzY3JvbGxUb0JvdHRvbShvcHRpb25zKSA6IHNjcm9sbFRvVG9wKG9wdGlvbnMpO1xuICAgIH0sXG4gICAgW2RlYnVnLCBtb2RlLCBzY3JvbGxUb0JvdHRvbSwgc2Nyb2xsVG9Ub3BdXG4gICk7XG5cbiAgY29uc3Qgc2Nyb2xsVG9TdGlja3kgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY29uc3QgeyBjdXJyZW50OiB0YXJnZXQgfSA9IHRhcmdldFJlZjtcblxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIGlmIChpbml0aWFsU2Nyb2xsQmVoYXZpb3JSZWYuY3VycmVudCA9PT0gJ2F1dG8nKSB7XG4gICAgICAgIGRlYnVnKCgpID0+IFtgJWN0YXJnZXQgY2hhbmdlZCVjOiBJbml0aWFsIHNjcm9sbGAsIC4uLnN0eWxlQ29uc29sZSgnYmx1ZScpXSk7XG5cbiAgICAgICAgdGFyZ2V0LnNjcm9sbFRvcCA9IG1vZGUgPT09IE1PREVfVE9QID8gMCA6IHRhcmdldC5zY3JvbGxIZWlnaHQgLSB0YXJnZXQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBpbml0aWFsU2Nyb2xsQmVoYXZpb3JSZWYuY3VycmVudCA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gVGhpcyBpcyB2ZXJ5IHNpbWlsYXIgdG8gc2Nyb2xsVG9FbmQoKS5cbiAgICAgIC8vIEluc3RlYWQgb2Ygc2Nyb2xsaW5nIHRvIGVuZCwgaXQgd2lsbCBjYWxsIHByb3BzLnNjcm9sbGVyKCkgdG8gZGV0ZXJtaW5lcyBob3cgZmFyIGl0IHNob3VsZCBzY3JvbGwuXG4gICAgICAvLyBUaGlzIGZ1bmN0aW9uIGNvdWxkIGJlIGNhbGxlZCB3aGlsZSBpdCBpcyBhdXRvLXNjcm9sbGluZy5cblxuICAgICAgY29uc3QgeyBjdXJyZW50OiBhbmltYXRlRnJvbSB9ID0gYW5pbWF0ZUZyb21SZWY7XG4gICAgICBjb25zdCB7IG9mZnNldEhlaWdodCwgc2Nyb2xsSGVpZ2h0LCBzY3JvbGxUb3AgfSA9IHRhcmdldDtcblxuICAgICAgY29uc3QgbWF4VmFsdWUgPSBtb2RlID09PSBNT0RFX1RPUCA/IDAgOiBNYXRoLm1heCgwLCBzY3JvbGxIZWlnaHQgLSBvZmZzZXRIZWlnaHQgLSBzY3JvbGxUb3ApO1xuICAgICAgY29uc3QgbWluVmFsdWUgPSBNYXRoLm1heCgwLCBhbmltYXRlRnJvbSAtIHNjcm9sbFRvcCk7XG5cbiAgICAgIGNvbnN0IHJhd05leHRWYWx1ZSA9IHNjcm9sbGVyKHsgbWF4VmFsdWUsIG1pblZhbHVlLCBvZmZzZXRIZWlnaHQsIHNjcm9sbEhlaWdodCwgc2Nyb2xsVG9wIH0pO1xuXG4gICAgICBjb25zdCBuZXh0VmFsdWUgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihtYXhWYWx1ZSwgcmF3TmV4dFZhbHVlKSk7XG5cbiAgICAgIGxldCBuZXh0QW5pbWF0ZVRvO1xuXG4gICAgICBpZiAobW9kZSA9PT0gTU9ERV9UT1AgfHwgbmV4dFZhbHVlICE9PSBtYXhWYWx1ZSkge1xuICAgICAgICBuZXh0QW5pbWF0ZVRvID0gc2Nyb2xsVG9wICsgbmV4dFZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2hlbiBzY3JvbGxpbmcgdG8gYm90dG9tLCB3ZSBzaG91bGQgc2Nyb2xsIHRvIFwiMTAwJVwiLlxuICAgICAgICAvLyBPdGhlcndpc2UsIGlmIHdlIHNjcm9sbCB0byBhbnkgbnVtYmVyLCBpdCB3aWxsIGxvc2Ugc3RpY2tpbmVzcyB3aGVuIGVsZW1lbnRzIGFyZSBhZGRpbmcgdG9vIGZhc3QuXG4gICAgICAgIC8vIFwiMTAwJVwiIGlzIGEgc3BlY2lhbCBhcmd1bWVudCBpbnRlbmRlZCB0byBtYWtlIHN1cmUgc3RpY2tpbmVzcyBpcyBub3QgbG9zdCB3aGlsZSBuZXcgZWxlbWVudHMgYXJlIGJlaW5nIGFkZGVkLlxuICAgICAgICBuZXh0QW5pbWF0ZVRvID0gJzEwMCUnO1xuICAgICAgfVxuXG4gICAgICBkZWJ1ZygoKSA9PiBbXG4gICAgICAgIFtcbiAgICAgICAgICBgJWNzY3JvbGxUb1N0aWNreSVjOiBXaWxsIGFuaW1hdGUgZnJvbSAlYyR7YW5pbWF0ZUZyb219cHglYyB0byAlYyR7XG4gICAgICAgICAgICB0eXBlb2YgbmV4dEFuaW1hdGVUbyA9PT0gJ251bWJlcicgPyBuZXh0QW5pbWF0ZVRvICsgJ3B4JyA6IG5leHRBbmltYXRlVG8ucmVwbGFjZSgvJS9ndSwgJyUlJylcbiAgICAgICAgICB9JWMgKCVjJHsobmV4dEFuaW1hdGVUbyA9PT0gJzEwMCUnID8gbWF4VmFsdWUgOiBuZXh0QW5pbWF0ZVRvKSArIGFuaW1hdGVGcm9tfXB4JWMpYCxcbiAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ29yYW5nZScpLFxuICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgncHVycGxlJyksXG4gICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdwdXJwbGUnKSxcbiAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3B1cnBsZScpXG4gICAgICAgIF0sXG4gICAgICAgIHtcbiAgICAgICAgICBhbmltYXRlRnJvbSxcbiAgICAgICAgICBtYXhWYWx1ZSxcbiAgICAgICAgICBtaW5WYWx1ZSxcbiAgICAgICAgICBuZXh0QW5pbWF0ZVRvLFxuICAgICAgICAgIG5leHRWYWx1ZSxcbiAgICAgICAgICBvZmZzZXRIZWlnaHQsXG4gICAgICAgICAgcmF3TmV4dFZhbHVlLFxuICAgICAgICAgIHNjcm9sbEhlaWdodCxcbiAgICAgICAgICBzY3JvbGxUb3BcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIHNjcm9sbFRvKG5leHRBbmltYXRlVG8sIHsgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgIH1cbiAgfSwgW2FuaW1hdGVGcm9tUmVmLCBkZWJ1ZywgbW9kZSwgc2Nyb2xsZXIsIHNjcm9sbFRvLCB0YXJnZXRSZWZdKTtcblxuICBjb25zdCBoYW5kbGVTY3JvbGwgPSB1c2VDYWxsYmFjayhcbiAgICAoeyB0aW1lU3RhbXBMb3cgfSkgPT4ge1xuICAgICAgY29uc3QgeyBjdXJyZW50OiBhbmltYXRlVG8gfSA9IGFuaW1hdGVUb1JlZjtcbiAgICAgIGNvbnN0IHsgY3VycmVudDogdGFyZ2V0IH0gPSB0YXJnZXRSZWY7XG5cbiAgICAgIGNvbnN0IGFuaW1hdGluZyA9IGFuaW1hdGVUbyAhPT0gbnVsbDtcblxuICAgICAgLy8gQ3VycmVudGx5LCB0aGVyZSBhcmUgbm8gcmVsaWFibGUgd2F5IHRvIGNoZWNrIGlmIHRoZSBcInNjcm9sbFwiIGV2ZW50IGlzIHRyaWdnZXIgZHVlIHRvXG4gICAgICAvLyB1c2VyIGdlc3R1cmUsIHByb2dyYW1tYXRpYyBzY3JvbGxpbmcsIG9yIENocm9tZS1zeW50aGVzaXplZCBcInNjcm9sbFwiIGV2ZW50IHRvIGNvbXBlbnNhdGUgc2l6ZSBjaGFuZ2UuXG4gICAgICAvLyBUaHVzLCB3ZSB1c2Ugb3VyIGJlc3QtZWZmb3J0IHRvIGd1ZXNzIGlmIGl0IGlzIHRyaWdnZXJlZCBieSB1c2VyIGdlc3R1cmUsIGFuZCBkaXNhYmxlIHN0aWNreSBpZiBpdCBpcyBoZWFkaW5nIHRvd2FyZHMgdGhlIHN0YXJ0IGRpcmVjdGlvbi5cblxuICAgICAgaWYgKHRpbWVTdGFtcExvdyA8PSBpZ25vcmVTY3JvbGxFdmVudEJlZm9yZVJlZi5jdXJyZW50IHx8ICF0YXJnZXQpIHtcbiAgICAgICAgLy8gU2luY2Ugd2UgZGVib3VuY2UgXCJzY3JvbGxcIiBldmVudCwgdGhpcyBoYW5kbGVyIG1pZ2h0IGJlIGNhbGxlZCBhZnRlciBzcGluZVRvLm9uRW5kIChhLmsuYS4gYXJ0aWZpY2lhbCBzY3JvbGxpbmcpLlxuICAgICAgICAvLyBXZSBzaG91bGQgaWdub3JlIGRlYm91bmNlZCBldmVudCBmaXJlZCBhZnRlciBzY3JvbGxFbmQsIGJlY2F1c2Ugd2l0aG91dCBza2lwcGluZyB0aGVtLCB0aGUgdXNlckluaXRpYXRlZFNjcm9sbCBjYWxjdWxhdGVkIGJlbG93IHdpbGwgbm90IGJlIGFjY3VyYXRlLlxuICAgICAgICAvLyBUaHVzLCBvbiBhIGZhc3QgbWFjaGluZSwgYWRkaW5nIGVsZW1lbnRzIHN1cGVyIGZhc3Qgd2lsbCBsb3NlIHRoZSBcInN0aWNraW5lc3NcIi5cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgYXRCb3R0b20sIGF0RW5kLCBhdFN0YXJ0LCBhdFRvcCB9ID0gY29tcHV0ZVZpZXdTdGF0ZSh7IG1vZGUsIHRhcmdldCB9KTtcblxuICAgICAgc2V0QXRCb3R0b20oYXRCb3R0b20pO1xuICAgICAgc2V0QXRFbmQoYXRFbmQpO1xuICAgICAgc2V0QXRTdGFydChhdFN0YXJ0KTtcbiAgICAgIHNldEF0VG9wKGF0VG9wKTtcblxuICAgICAgLy8gQ2hyb21lIHdpbGwgZW1pdCBcInN5bnRoZXRpY1wiIHNjcm9sbCBldmVudCBpZiB0aGUgY29udGFpbmVyIGlzIHJlc2l6ZWQgb3IgYW4gZWxlbWVudCBpcyBhZGRlZFxuICAgICAgLy8gV2UgbmVlZCB0byBpZ25vcmUgdGhlc2UgXCJzeW50aGV0aWNcIiBldmVudHNcbiAgICAgIC8vIFJlcHJvOiBJbiBwbGF5Z3JvdW5kLCBwcmVzcyA0LTEtNS0xLTEgKHNtYWxsLCBhZGQgb25lLCBub3JtYWwsIGFkZCBvbmUsIGFkZCBvbmUpXG4gICAgICAvLyAgICAgICAgTm9tYXR0ZXIgaG93IGZhc3Qgb3Igc2xvdyB0aGUgc2VxdWVuY2UgaXMgYmVpbmcgcHJlc3NlZCwgaXQgc2hvdWxkIHN0aWxsIHN0aWNrIHRvIHRoZSBib3R0b21cbiAgICAgIGNvbnN0IHsgb2Zmc2V0SGVpZ2h0OiBuZXh0T2Zmc2V0SGVpZ2h0LCBzY3JvbGxIZWlnaHQ6IG5leHRTY3JvbGxIZWlnaHQgfSA9IHRhcmdldDtcbiAgICAgIGNvbnN0IHsgY3VycmVudDogb2Zmc2V0SGVpZ2h0IH0gPSBvZmZzZXRIZWlnaHRSZWY7XG4gICAgICBjb25zdCB7IGN1cnJlbnQ6IHNjcm9sbEhlaWdodCB9ID0gc2Nyb2xsSGVpZ2h0UmVmO1xuICAgICAgY29uc3Qgb2Zmc2V0SGVpZ2h0Q2hhbmdlZCA9IG5leHRPZmZzZXRIZWlnaHQgIT09IG9mZnNldEhlaWdodDtcbiAgICAgIGNvbnN0IHNjcm9sbEhlaWdodENoYW5nZWQgPSBuZXh0U2Nyb2xsSGVpZ2h0ICE9PSBzY3JvbGxIZWlnaHQ7XG5cbiAgICAgIGlmIChvZmZzZXRIZWlnaHRDaGFuZ2VkKSB7XG4gICAgICAgIG9mZnNldEhlaWdodFJlZi5jdXJyZW50ID0gbmV4dE9mZnNldEhlaWdodDtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjcm9sbEhlaWdodENoYW5nZWQpIHtcbiAgICAgICAgc2Nyb2xsSGVpZ2h0UmVmLmN1cnJlbnQgPSBuZXh0U2Nyb2xsSGVpZ2h0O1xuICAgICAgfVxuXG4gICAgICAvLyBTdGlja3kgbWVhbnM6XG4gICAgICAvLyAtIElmIGl0IGlzIHNjcm9sbGVkIHByb2dyYW1hdGljYWxseSwgd2UgYXJlIHN0aWxsIGluIHN0aWNreSBtb2RlXG4gICAgICAvLyAtIElmIGl0IGlzIHNjcm9sbGVkIGJ5IHRoZSB1c2VyLCB0aGVuIHN0aWNreSBtZWFucyBpZiB3ZSBhcmUgYXQgdGhlIGVuZFxuXG4gICAgICAvLyBPbmx5IHVwZGF0ZSBzdGlja2luZXNzIGlmIHRoZSBzY3JvbGwgZXZlbnQgaXMgbm90IGR1ZSB0byBzeW50aGV0aWMgc2Nyb2xsIGRvbmUgYnkgQ2hyb21lXG4gICAgICBpZiAoIW9mZnNldEhlaWdodENoYW5nZWQgJiYgIXNjcm9sbEhlaWdodENoYW5nZWQpIHtcbiAgICAgICAgLy8gV2UgYXJlIHN0aWNreSBpZiB3ZSBhcmUgYW5pbWF0aW5nIHRvIHRoZSBlbmQsIG9yIHdlIGFyZSBhbHJlYWR5IGF0IHRoZSBlbmQuXG4gICAgICAgIC8vIFdlIGNhbiBiZSBcImFuaW1hdGluZyBidXQgbm90IHN0aWNreVwiIGJ5IGNhbGxpbmcgXCJzY3JvbGxUbygxMDApXCIgd2hlcmUgdGhlIGNvbnRhaW5lciBzY3JvbGxIZWlnaHQgaXMgMjAwcHguXG4gICAgICAgIGNvbnN0IG5leHRTdGlja3kgPSAoYW5pbWF0aW5nICYmIGlzRW5kKGFuaW1hdGVUbywgbW9kZSkpIHx8IGF0RW5kO1xuXG4gICAgICAgIGlmIChzdGlja3lSZWYuY3VycmVudCAhPT0gbmV4dFN0aWNreSkge1xuICAgICAgICAgIGRlYnVnKCgpID0+IFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgYCVjb25TY3JvbGwlYzogJWNzZXRTdGlja3klYyglYyR7bmV4dFN0aWNreX0lYylgLFxuICAgICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3JlZCcpLFxuICAgICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3JlZCcpLFxuICAgICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3B1cnBsZScpXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBgKGFuaW1hdGluZyA9ICVjJHthbmltYXRpbmd9JWMgJiYgaXNFbmQgPSAlYyR7aXNFbmQoYW5pbWF0ZVRvLCBtb2RlKX0lYykgfHwgYXRFbmQgPSAlYyR7YXRFbmR9JWNgLFxuICAgICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3B1cnBsZScpLFxuICAgICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3B1cnBsZScpLFxuICAgICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3B1cnBsZScpLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW5nLFxuICAgICAgICAgICAgICAgIGFuaW1hdGVUbyxcbiAgICAgICAgICAgICAgICBhdEVuZCxcbiAgICAgICAgICAgICAgICBtb2RlLFxuICAgICAgICAgICAgICAgIG9mZnNldEhlaWdodDogdGFyZ2V0Lm9mZnNldEhlaWdodCxcbiAgICAgICAgICAgICAgICBzY3JvbGxIZWlnaHQ6IHRhcmdldC5zY3JvbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgc3RpY2t5OiBzdGlja3lSZWYuY3VycmVudCxcbiAgICAgICAgICAgICAgICBuZXh0U3RpY2t5XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdKTtcblxuICAgICAgICAgIHNldFN0aWNreShuZXh0U3RpY2t5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzdGlja3lSZWYuY3VycmVudCkge1xuICAgICAgICBkZWJ1ZygoKSA9PiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgYCVjb25TY3JvbGwlYzogU2l6ZSBjaGFuZ2VkIHdoaWxlIHN0aWNreSwgY2FsbGluZyAlY3Njcm9sbFRvU3RpY2t5KCklY2AsXG4gICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3JlZCcpLFxuICAgICAgICAgICAgLi4uc3R5bGVDb25zb2xlKCdvcmFuZ2UnKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb2Zmc2V0SGVpZ2h0Q2hhbmdlZCxcbiAgICAgICAgICAgICAgc2Nyb2xsSGVpZ2h0Q2hhbmdlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmV4dE9mZnNldEhlaWdodCxcbiAgICAgICAgICAgIHByZXZPZmZzZXRIZWlnaHQ6IG9mZnNldEhlaWdodCxcbiAgICAgICAgICAgIG5leHRTY3JvbGxIZWlnaHQsXG4gICAgICAgICAgICBwcmV2U2Nyb2xsSGVpZ2h0OiBzY3JvbGxIZWlnaHRcbiAgICAgICAgICB9XG4gICAgICAgIF0pO1xuXG4gICAgICAgIHNjcm9sbFRvU3RpY2t5KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgc2Nyb2xsVG9wOiBhY3R1YWxTY3JvbGxUb3AgfSA9IHRhcmdldDtcblxuICAgICAgc2Nyb2xsUG9zaXRpb25PYnNlcnZlcnNSZWYuY3VycmVudC5mb3JFYWNoKG9ic2VydmVyID0+IG9ic2VydmVyKHsgc2Nyb2xsVG9wOiBhY3R1YWxTY3JvbGxUb3AgfSkpO1xuICAgIH0sXG4gICAgW1xuICAgICAgYW5pbWF0ZVRvUmVmLFxuICAgICAgZGVidWcsXG4gICAgICBpZ25vcmVTY3JvbGxFdmVudEJlZm9yZVJlZixcbiAgICAgIG1vZGUsXG4gICAgICBvZmZzZXRIZWlnaHRSZWYsXG4gICAgICBzY3JvbGxIZWlnaHRSZWYsXG4gICAgICBzY3JvbGxQb3NpdGlvbk9ic2VydmVyc1JlZixcbiAgICAgIHNjcm9sbFRvU3RpY2t5LFxuICAgICAgc2V0QXRCb3R0b20sXG4gICAgICBzZXRBdEVuZCxcbiAgICAgIHNldEF0U3RhcnQsXG4gICAgICBzZXRBdFRvcCxcbiAgICAgIHNldFN0aWNreSxcbiAgICAgIHN0aWNreVJlZixcbiAgICAgIHRhcmdldFJlZlxuICAgIF1cbiAgKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIGxldCBzdGlja3lCdXROb3RBdEVuZFNpbmNlID0gZmFsc2U7XG5cbiAgICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRJbW1lZGlhdGVJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudDogdGFyZ2V0IH0gPSB0YXJnZXRSZWY7XG4gICAgICAgIGNvbnN0IGFuaW1hdGluZyA9IGFuaW1hdGVUb1JlZi5jdXJyZW50ICE9PSBudWxsO1xuXG4gICAgICAgIGlmIChzdGlja3lSZWYuY3VycmVudCkge1xuICAgICAgICAgIGlmICghY29tcHV0ZVZpZXdTdGF0ZSh7IG1vZGUsIHRhcmdldCB9KS5hdEVuZCkge1xuICAgICAgICAgICAgaWYgKCFzdGlja3lCdXROb3RBdEVuZFNpbmNlKSB7XG4gICAgICAgICAgICAgIHN0aWNreUJ1dE5vdEF0RW5kU2luY2UgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChEYXRlLm5vdygpIC0gc3RpY2t5QnV0Tm90QXRFbmRTaW5jZSA+IFNDUk9MTF9ERUNJU0lPTl9EVVJBVElPTikge1xuICAgICAgICAgICAgICAvLyBRdWlya3M6IEluIEZpcmVmb3gsIGFmdGVyIHVzZXIgc2Nyb2xsIGRvd24sIEZpcmVmb3ggZG8gdHdvIHRoaW5nczpcbiAgICAgICAgICAgICAgLy8gICAgICAgICAxLiBTZXQgdG8gYSBuZXcgXCJzY3JvbGxUb3BcIlxuICAgICAgICAgICAgICAvLyAgICAgICAgIDIuIEZpcmUgXCJzY3JvbGxcIiBldmVudFxuICAgICAgICAgICAgICAvLyAgICAgICAgIEZvciB3aGF0IHdlIG9ic2VydmVkLCAjMSBpcyBmaXJlZCBhYm91dCAyMG1zIGJlZm9yZSAjMi4gVGhlcmUgaXMgYSBjaGFuY2UgdGhhdCB0aGlzIHN0aWNreUNoZWNrVGltZW91dCBpcyBiZWluZyBzY2hlZHVsZWQgYmV0d2VlbiAxIGFuZCAyLlxuICAgICAgICAgICAgICAvLyAgICAgICAgIFRoYXQgbWVhbnMsIGlmIHdlIGp1c3QgbG9vayBhdCAjMSB0byBkZWNpZGUgaWYgd2Ugc2hvdWxkIHNjcm9sbCwgd2Ugd2lsbCBhbHdheXMgc2Nyb2xsLCBpbiBvcHBvc2UgdG8gdGhlIHVzZXIncyBpbnRlbnRpb24uXG4gICAgICAgICAgICAgIC8vIFJlcHJvOiBPcGVuIEZpcmVmb3gsIHNldCBjaGVja0ludGVydmFsIHRvIGEgbG93ZXIgbnVtYmVyLCBhbmQgdHJ5IHRvIHNjcm9sbCBieSBkcmFnZ2luZyB0aGUgc2Nyb2xsIGhhbmRsZXIuIEl0IHdpbGwganVtcCBiYWNrLlxuXG4gICAgICAgICAgICAgIC8vIFRoZSBcImFuaW1hdGluZ1wiIGNoZWNrIHdpbGwgbWFrZSBzdXJlIHN0aWNraW5lc3MgaXMgbm90IGxvc3Qgd2hlbiBlbGVtZW50cyBhcmUgYWRkaW5nIGF0IGEgdmVyeSBmYXN0IHBhY2UuXG4gICAgICAgICAgICAgIGlmICghYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZUZyb21SZWYuY3VycmVudCA9IHRhcmdldC5zY3JvbGxUb3A7XG5cbiAgICAgICAgICAgICAgICBkZWJ1ZygoKSA9PiBbXG4gICAgICAgICAgICAgICAgICBgJWNJbnRlcnZhbCBjaGVjayVjOiBTaG91bGQgc3RpY2t5IGJ1dCBub3QgYXQgZW5kLCBjYWxsaW5nICVjc2Nyb2xsVG9TdGlja3koKSVjIHRvIHNjcm9sbGAsXG4gICAgICAgICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ25hdnknKSxcbiAgICAgICAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgnb3JhbmdlJylcbiAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgICAgIHNjcm9sbFRvU3RpY2t5KCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzdGlja3lCdXROb3RBdEVuZFNpbmNlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0aWNreUJ1dE5vdEF0RW5kU2luY2UgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LnNjcm9sbEhlaWdodCA8PSB0YXJnZXQub2Zmc2V0SGVpZ2h0ICYmICFzdGlja3lSZWYuY3VycmVudCkge1xuICAgICAgICAgIC8vIFdoZW4gdGhlIGNvbnRhaW5lciBpcyBlbXB0aWVkLCB3ZSB3aWxsIHNldCBzdGlja3kgYmFjayB0byB0cnVlLlxuXG4gICAgICAgICAgZGVidWcoKCkgPT4gW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBgJWNJbnRlcnZhbCBjaGVjayVjOiBDb250YWluZXIgaXMgZW1wdGllZCwgc2V0dGluZyBzdGlja3kgYmFjayB0byAlY3RydWUlY2AsXG4gICAgICAgICAgICAgIC4uLnN0eWxlQ29uc29sZSgnbmF2eScpLFxuICAgICAgICAgICAgICAuLi5zdHlsZUNvbnNvbGUoJ3B1cnBsZScpXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0SGVpZ2h0OiB0YXJnZXQub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgICAgICAgIHNjcm9sbEhlaWdodDogdGFyZ2V0LnNjcm9sbEhlaWdodCxcbiAgICAgICAgICAgICAgICBzdGlja3k6IHN0aWNreVJlZi5jdXJyZW50XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdKTtcblxuICAgICAgICAgIHNldFN0aWNreSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSwgTWF0aC5tYXgoTUlOX0NIRUNLX0lOVEVSVkFMLCBjaGVja0ludGVydmFsKSB8fCBNSU5fQ0hFQ0tfSU5URVJWQUwpO1xuXG4gICAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbCh0aW1lb3V0KTtcbiAgICB9XG4gIH0sIFthbmltYXRlVG9SZWYsIGNoZWNrSW50ZXJ2YWwsIGRlYnVnLCBtb2RlLCBzY3JvbGxUb1N0aWNreSwgc2V0U3RpY2t5LCBzdGlja3lSZWYsIHRhcmdldCwgdGFyZ2V0UmVmXSk7XG5cbiAgY29uc3Qgc3R5bGVUb0NsYXNzTmFtZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGVtb3Rpb24gPVxuICAgICAgZW1vdGlvblBvb2xbbm9uY2VdIHx8XG4gICAgICAoZW1vdGlvblBvb2xbbm9uY2VdID0gY3JlYXRlRW1vdGlvbih7IGtleTogJ3JlYWN0LXNjcm9sbC10by1ib3R0b20tLWNzcy0nICsgY3JlYXRlQ1NTS2V5KCksIG5vbmNlIH0pKTtcblxuICAgIHJldHVybiBzdHlsZSA9PiBlbW90aW9uLmNzcyhzdHlsZSkgKyAnJztcbiAgfSwgW25vbmNlXSk7XG5cbiAgY29uc3QgaW50ZXJuYWxDb250ZXh0ID0gdXNlTWVtbyhcbiAgICAoKSA9PiAoe1xuICAgICAgb2JzZXJ2ZVNjcm9sbFBvc2l0aW9uLFxuICAgICAgc2V0VGFyZ2V0LFxuICAgICAgc3R5bGVUb0NsYXNzTmFtZVxuICAgIH0pLFxuICAgIFtvYnNlcnZlU2Nyb2xsUG9zaXRpb24sIHNldFRhcmdldCwgc3R5bGVUb0NsYXNzTmFtZV1cbiAgKTtcblxuICBjb25zdCBzdGF0ZTFDb250ZXh0ID0gdXNlTWVtbyhcbiAgICAoKSA9PiAoe1xuICAgICAgYXRCb3R0b20sXG4gICAgICBhdEVuZCxcbiAgICAgIGF0U3RhcnQsXG4gICAgICBhdFRvcCxcbiAgICAgIG1vZGVcbiAgICB9KSxcbiAgICBbYXRCb3R0b20sIGF0RW5kLCBhdFN0YXJ0LCBhdFRvcCwgbW9kZV1cbiAgKTtcblxuICBjb25zdCBzdGF0ZTJDb250ZXh0ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgYW5pbWF0aW5nID0gYW5pbWF0ZVRvICE9PSBudWxsO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFuaW1hdGluZyxcbiAgICAgIGFuaW1hdGluZ1RvRW5kOiBhbmltYXRpbmcgJiYgaXNFbmQoYW5pbWF0ZVRvLCBtb2RlKSxcbiAgICAgIHN0aWNreVxuICAgIH07XG4gIH0sIFthbmltYXRlVG8sIG1vZGUsIHN0aWNreV0pO1xuXG4gIGNvbnN0IGNvbWJpbmVkU3RhdGVDb250ZXh0ID0gdXNlTWVtbyhcbiAgICAoKSA9PiAoe1xuICAgICAgLi4uc3RhdGUxQ29udGV4dCxcbiAgICAgIC4uLnN0YXRlMkNvbnRleHRcbiAgICB9KSxcbiAgICBbc3RhdGUxQ29udGV4dCwgc3RhdGUyQ29udGV4dF1cbiAgKTtcblxuICBjb25zdCBmdW5jdGlvbkNvbnRleHQgPSB1c2VNZW1vKFxuICAgICgpID0+ICh7XG4gICAgICBzY3JvbGxUbyxcbiAgICAgIHNjcm9sbFRvQm90dG9tLFxuICAgICAgc2Nyb2xsVG9FbmQsXG4gICAgICBzY3JvbGxUb1N0YXJ0LFxuICAgICAgc2Nyb2xsVG9Ub3BcbiAgICB9KSxcbiAgICBbc2Nyb2xsVG8sIHNjcm9sbFRvQm90dG9tLCBzY3JvbGxUb0VuZCwgc2Nyb2xsVG9TdGFydCwgc2Nyb2xsVG9Ub3BdXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBXZSBuZWVkIHRvIHVwZGF0ZSB0aGUgXCJzY3JvbGxIZWlnaHRcIiB2YWx1ZSB0byBsYXRlc3Qgd2hlbiB0aGUgdXNlciBkbyBhIGZvY3VzIGluc2lkZSB0aGUgYm94LlxuICAgIC8vXG4gICAgLy8gVGhpcyBpcyBiZWNhdXNlOlxuICAgIC8vIC0gSW4gb3VyIGNvZGUgdGhhdCBtaXRpZ2F0ZSBDaHJvbWUgc3ludGhldGljIHNjcm9sbGluZywgdGhhdCBjb2RlIHdpbGwgbG9vayBhdCB3aGV0aGVyIFwic2Nyb2xsSGVpZ2h0XCIgdmFsdWUgaXMgbGF0ZXN0IG9yIG5vdC5cbiAgICAvLyAtIFRoYXQgY29kZSBvbmx5IHJ1biBvbiBcInNjcm9sbFwiIGV2ZW50LlxuICAgIC8vIC0gVGhhdCBtZWFucywgb24gZXZlcnkgXCJzY3JvbGxcIiBldmVudCwgaWYgdGhlIFwic2Nyb2xsSGVpZ2h0XCIgdmFsdWUgaXMgbm90IGxhdGVzdCwgd2Ugd2lsbCBza2lwIG1vZGlmeWluZyB0aGUgc3RpY2tpbmVzcy5cbiAgICAvLyAtIFRoYXQgbWVhbnMsIGlmIHRoZSB1c2VyIFwiZm9jdXNcIiB0byBhbiBlbGVtZW50IHRoYXQgY2F1c2UgdGhlIHNjcm9sbCB2aWV3IHRvIHNjcm9sbCB0byB0aGUgYm90dG9tLCB0aGUgdXNlciBhZ2VudCB3aWxsIGZpcmUgXCJzY3JvbGxcIiBldmVudC5cbiAgICAvLyAgIFNpbmNlIHRoZSBcInNjcm9sbEhlaWdodFwiIGlzIG5vdCBsYXRlc3QgdmFsdWUsIHRoaXMgXCJzY3JvbGxcIiBldmVudCB3aWxsIGJlIGlnbm9yZWQgYW5kIHN0aWNraW5lc3Mgd2lsbCBub3QgYmUgbW9kaWZpZWQuXG4gICAgLy8gLSBUaGF0IG1lYW5zLCBpZiB0aGUgdXNlciBcImZvY3VzXCIgdG8gYSBuZXdseSBhZGRlZCBlbGVtZW50IHRoYXQgaXMgYXQgdGhlIGVuZCBvZiB0aGUgc2Nyb2xsIHZpZXcsIHRoZSBcInNjcm9sbCB0byBib3R0b21cIiBidXR0b24gd2lsbCBjb250aW51ZSB0byBzaG93LlxuICAgIC8vXG4gICAgLy8gUmVwcm8gaW4gQ2hyb21lOlxuICAgIC8vIDEuIEZpbGwgdXAgYSBzY3JvbGwgdmlld1xuICAgIC8vIDIuIFNjcm9sbCB1cCwgdGhlIFwic2Nyb2xsIHRvIGJvdHRvbVwiIGJ1dHRvbiBzaG91bGQgc2hvdyB1cFxuICAgIC8vIDMuIENsaWNrIFwiQWRkIGEgYnV0dG9uXCJcbiAgICAvLyA0LiBDbGljayBvbiB0aGUgc2Nyb2xsIHZpZXcgKHRvIHBzZXVkby1mb2N1cyBvbiBpdClcbiAgICAvLyA1LiBQcmVzcyBUQUIsIHRoZSBzY3JvbGwgdmlldyB3aWxsIGJlIGF0IHRoZSBib3R0b21cbiAgICAvL1xuICAgIC8vIEV4cGVjdDpcbiAgICAvLyAtIFRoZSBcInNjcm9sbCB0byBib3R0b21cIiBidXR0b24gc2hvdWxkIGJlIGdvbmUuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgY29uc3QgaGFuZGxlRm9jdXMgPSAoKSA9PiB7XG4gICAgICAgIHNjcm9sbEhlaWdodFJlZi5jdXJyZW50ID0gdGFyZ2V0LnNjcm9sbEhlaWdodDtcbiAgICAgIH07XG5cbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGhhbmRsZUZvY3VzLCB7IGNhcHR1cmU6IHRydWUsIHBhc3NpdmU6IHRydWUgfSk7XG5cbiAgICAgIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBoYW5kbGVGb2N1cyk7XG4gICAgfVxuICB9LCBbdGFyZ2V0XSk7XG5cbiAgZGVidWcoKCkgPT4gW1xuICAgIFtgJWNSZW5kZXIlYzogUmVuZGVyYCwgLi4uc3R5bGVDb25zb2xlKCdjeWFuJywgJycpXSxcbiAgICB7XG4gICAgICBhbmltYXRlVG8sXG4gICAgICBhbmltYXRpbmc6IGFuaW1hdGVUbyAhPT0gbnVsbCxcbiAgICAgIHN0aWNreSxcbiAgICAgIHRhcmdldFxuICAgIH1cbiAgXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8SW50ZXJuYWxDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtpbnRlcm5hbENvbnRleHR9PlxuICAgICAgPEZ1bmN0aW9uQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17ZnVuY3Rpb25Db250ZXh0fT5cbiAgICAgICAgPFN0YXRlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17Y29tYmluZWRTdGF0ZUNvbnRleHR9PlxuICAgICAgICAgIDxTdGF0ZTFDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdGF0ZTFDb250ZXh0fT5cbiAgICAgICAgICAgIDxTdGF0ZTJDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdGF0ZTJDb250ZXh0fT5cbiAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICB7dGFyZ2V0ICYmIDxFdmVudFNweSBkZWJvdW5jZT17ZGVib3VuY2V9IG5hbWU9XCJzY3JvbGxcIiBvbkV2ZW50PXtoYW5kbGVTY3JvbGx9IHRhcmdldD17dGFyZ2V0fSAvPn1cbiAgICAgICAgICAgICAge3RhcmdldCAmJiBhbmltYXRlVG8gIT09IG51bGwgJiYgKFxuICAgICAgICAgICAgICAgIDxTcGluZVRvIG5hbWU9XCJzY3JvbGxUb3BcIiBvbkVuZD17aGFuZGxlU3BpbmVUb0VuZH0gdGFyZ2V0PXt0YXJnZXR9IHZhbHVlPXthbmltYXRlVG99IC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L1N0YXRlMkNvbnRleHQuUHJvdmlkZXI+XG4gICAgICAgICAgPC9TdGF0ZTFDb250ZXh0LlByb3ZpZGVyPlxuICAgICAgICA8L1N0YXRlQ29udGV4dC5Qcm92aWRlcj5cbiAgICAgIDwvRnVuY3Rpb25Db250ZXh0LlByb3ZpZGVyPlxuICAgIDwvSW50ZXJuYWxDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufTtcblxuQ29tcG9zZXIucHJvcFR5cGVzID0ge1xuICBjaGVja0ludGVydmFsOiBQcm9wVHlwZXMubnVtYmVyLFxuICBjaGlsZHJlbjogUHJvcFR5cGVzLmFueSxcbiAgZGVib3VuY2U6IFByb3BUeXBlcy5udW1iZXIsXG4gIGRlYnVnOiBQcm9wVHlwZXMuYm9vbCxcbiAgaW5pdGlhbFNjcm9sbEJlaGF2aW9yOiBQcm9wVHlwZXMub25lT2YoWydhdXRvJywgJ3Ntb290aCddKSxcbiAgbW9kZTogUHJvcFR5cGVzLm9uZU9mKFsnYm90dG9tJywgJ3RvcCddKSxcbiAgbm9uY2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNjcm9sbGVyOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9zZXI7Il19