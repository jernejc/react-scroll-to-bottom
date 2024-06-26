"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

require("core-js/modules/es.function.name.js");

var _react = require("react");

var _debounce = _interopRequireDefault(require("./debounce"));

var EventSpy = function EventSpy(_ref) {
  var _ref$debounce = _ref.debounce,
      debounce = _ref$debounce === void 0 ? 200 : _ref$debounce,
      name = _ref.name,
      onEvent = _ref.onEvent,
      target = _ref.target;
  // We need to save the "onEvent" to ref.
  // This is because "onEvent" may change from time to time, but debounce may still fire to the older callback.
  var onEventRef = (0, _react.useRef)();
  onEventRef.current = onEvent;
  var debouncer = (0, _react.useMemo)(function () {
    return (0, _debounce["default"])(function (event) {
      var current = onEventRef.current;
      current && current(event);
    }, debounce);
  }, [debounce, onEventRef]);
  var handleEvent = (0, _react.useCallback)(function (event) {
    event.timeStampLow = (0, _now["default"])();
    debouncer(event);
  }, [debouncer]);
  (0, _react.useLayoutEffect)(function () {
    target.addEventListener(name, handleEvent, {
      passive: true
    });
    handleEvent({
      target: target,
      type: name
    });
    return function () {
      return target.removeEventListener(name, handleEvent);
    };
  }, [name, handleEvent, target]);
  return false;
};

var _default = EventSpy;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FdmVudFNweS5qcyJdLCJuYW1lcyI6WyJFdmVudFNweSIsImRlYm91bmNlIiwibmFtZSIsIm9uRXZlbnQiLCJ0YXJnZXQiLCJvbkV2ZW50UmVmIiwiY3VycmVudCIsImRlYm91bmNlciIsImV2ZW50IiwiaGFuZGxlRXZlbnQiLCJ0aW1lU3RhbXBMb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicGFzc2l2ZSIsInR5cGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7O0FBRUEsSUFBTUEsUUFBUSxHQUFHLFNBQVhBLFFBQVcsT0FBK0M7QUFBQSwyQkFBNUNDLFFBQTRDO0FBQUEsTUFBNUNBLFFBQTRDLDhCQUFqQyxHQUFpQztBQUFBLE1BQTVCQyxJQUE0QixRQUE1QkEsSUFBNEI7QUFBQSxNQUF0QkMsT0FBc0IsUUFBdEJBLE9BQXNCO0FBQUEsTUFBYkMsTUFBYSxRQUFiQSxNQUFhO0FBQzlEO0FBQ0E7QUFDQSxNQUFNQyxVQUFVLEdBQUcsb0JBQW5CO0FBRUFBLEVBQUFBLFVBQVUsQ0FBQ0MsT0FBWCxHQUFxQkgsT0FBckI7QUFFQSxNQUFNSSxTQUFTLEdBQUcsb0JBQ2hCO0FBQUEsV0FDRSwwQkFBVyxVQUFBQyxLQUFLLEVBQUk7QUFDbEIsVUFBUUYsT0FBUixHQUFvQkQsVUFBcEIsQ0FBUUMsT0FBUjtBQUVBQSxNQUFBQSxPQUFPLElBQUlBLE9BQU8sQ0FBQ0UsS0FBRCxDQUFsQjtBQUNELEtBSkQsRUFJR1AsUUFKSCxDQURGO0FBQUEsR0FEZ0IsRUFPaEIsQ0FBQ0EsUUFBRCxFQUFXSSxVQUFYLENBUGdCLENBQWxCO0FBVUEsTUFBTUksV0FBVyxHQUFHLHdCQUNsQixVQUFBRCxLQUFLLEVBQUk7QUFDUEEsSUFBQUEsS0FBSyxDQUFDRSxZQUFOLEdBQXFCLHNCQUFyQjtBQUVBSCxJQUFBQSxTQUFTLENBQUNDLEtBQUQsQ0FBVDtBQUNELEdBTGlCLEVBTWxCLENBQUNELFNBQUQsQ0FOa0IsQ0FBcEI7QUFTQSw4QkFBZ0IsWUFBTTtBQUNwQkgsSUFBQUEsTUFBTSxDQUFDTyxnQkFBUCxDQUF3QlQsSUFBeEIsRUFBOEJPLFdBQTlCLEVBQTJDO0FBQUVHLE1BQUFBLE9BQU8sRUFBRTtBQUFYLEtBQTNDO0FBQ0FILElBQUFBLFdBQVcsQ0FBQztBQUFFTCxNQUFBQSxNQUFNLEVBQU5BLE1BQUY7QUFBVVMsTUFBQUEsSUFBSSxFQUFFWDtBQUFoQixLQUFELENBQVg7QUFFQSxXQUFPO0FBQUEsYUFBTUUsTUFBTSxDQUFDVSxtQkFBUCxDQUEyQlosSUFBM0IsRUFBaUNPLFdBQWpDLENBQU47QUFBQSxLQUFQO0FBQ0QsR0FMRCxFQUtHLENBQUNQLElBQUQsRUFBT08sV0FBUCxFQUFvQkwsTUFBcEIsQ0FMSDtBQU9BLFNBQU8sS0FBUDtBQUNELENBbENEOztlQW9DZUosUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VMYXlvdXRFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IGRlYm91bmNlRm4gZnJvbSAnLi9kZWJvdW5jZSc7XG5cbmNvbnN0IEV2ZW50U3B5ID0gKHsgZGVib3VuY2UgPSAyMDAsIG5hbWUsIG9uRXZlbnQsIHRhcmdldCB9KSA9PiB7XG4gIC8vIFdlIG5lZWQgdG8gc2F2ZSB0aGUgXCJvbkV2ZW50XCIgdG8gcmVmLlxuICAvLyBUaGlzIGlzIGJlY2F1c2UgXCJvbkV2ZW50XCIgbWF5IGNoYW5nZSBmcm9tIHRpbWUgdG8gdGltZSwgYnV0IGRlYm91bmNlIG1heSBzdGlsbCBmaXJlIHRvIHRoZSBvbGRlciBjYWxsYmFjay5cbiAgY29uc3Qgb25FdmVudFJlZiA9IHVzZVJlZigpO1xuXG4gIG9uRXZlbnRSZWYuY3VycmVudCA9IG9uRXZlbnQ7XG5cbiAgY29uc3QgZGVib3VuY2VyID0gdXNlTWVtbyhcbiAgICAoKSA9PlxuICAgICAgZGVib3VuY2VGbihldmVudCA9PiB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudCB9ID0gb25FdmVudFJlZjtcblxuICAgICAgICBjdXJyZW50ICYmIGN1cnJlbnQoZXZlbnQpO1xuICAgICAgfSwgZGVib3VuY2UpLFxuICAgIFtkZWJvdW5jZSwgb25FdmVudFJlZl1cbiAgKTtcblxuICBjb25zdCBoYW5kbGVFdmVudCA9IHVzZUNhbGxiYWNrKFxuICAgIGV2ZW50ID0+IHtcbiAgICAgIGV2ZW50LnRpbWVTdGFtcExvdyA9IERhdGUubm93KCk7XG5cbiAgICAgIGRlYm91bmNlcihldmVudCk7XG4gICAgfSxcbiAgICBbZGVib3VuY2VyXVxuICApO1xuXG4gIHVzZUxheW91dEVmZmVjdCgoKSA9PiB7XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgaGFuZGxlRXZlbnQsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICBoYW5kbGVFdmVudCh7IHRhcmdldCwgdHlwZTogbmFtZSB9KTtcblxuICAgIHJldHVybiAoKSA9PiB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBoYW5kbGVFdmVudCk7XG4gIH0sIFtuYW1lLCBoYW5kbGVFdmVudCwgdGFyZ2V0XSk7XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRTcHk7Il19