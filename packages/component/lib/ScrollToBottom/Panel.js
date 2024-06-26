"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");

var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _InternalContext = _interopRequireDefault(require("./InternalContext"));

var _useStyleToClassName = _interopRequireDefault(require("../hooks/internal/useStyleToClassName"));

function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ROOT_STYLE = {
  height: '100%',
  overflowY: 'auto',
  width: '100%'
};

var Panel = function Panel(_ref) {
  var children = _ref.children,
      className = _ref.className;

  var _useContext = (0, _react.useContext)(_InternalContext["default"]),
      setTarget = _useContext.setTarget;

  var rootCSS = (0, _useStyleToClassName["default"])()(ROOT_STYLE);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: (0, _classnames["default"])(rootCSS, (className || '') + ''),
    ref: setTarget
  }, children);
};

Panel.propTypes = {
  children: _propTypes["default"].any,
  className: _propTypes["default"].string
};
var _default = Panel;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9QYW5lbC5qcyJdLCJuYW1lcyI6WyJST09UX1NUWUxFIiwiaGVpZ2h0Iiwib3ZlcmZsb3dZIiwid2lkdGgiLCJQYW5lbCIsImNoaWxkcmVuIiwiY2xhc3NOYW1lIiwiSW50ZXJuYWxDb250ZXh0Iiwic2V0VGFyZ2V0Iiwicm9vdENTUyIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsImFueSIsInN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFVBQVUsR0FBRztBQUNqQkMsRUFBQUEsTUFBTSxFQUFFLE1BRFM7QUFFakJDLEVBQUFBLFNBQVMsRUFBRSxNQUZNO0FBR2pCQyxFQUFBQSxLQUFLLEVBQUU7QUFIVSxDQUFuQjs7QUFNQSxJQUFNQyxLQUFLLEdBQUcsU0FBUkEsS0FBUSxPQUE2QjtBQUFBLE1BQTFCQyxRQUEwQixRQUExQkEsUUFBMEI7QUFBQSxNQUFoQkMsU0FBZ0IsUUFBaEJBLFNBQWdCOztBQUN6QyxvQkFBc0IsdUJBQVdDLDJCQUFYLENBQXRCO0FBQUEsTUFBUUMsU0FBUixlQUFRQSxTQUFSOztBQUNBLE1BQU1DLE9BQU8sR0FBRyx1Q0FBc0JULFVBQXRCLENBQWhCO0FBRUEsc0JBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBRSw0QkFBV1MsT0FBWCxFQUFvQixDQUFDSCxTQUFTLElBQUksRUFBZCxJQUFvQixFQUF4QyxDQUFoQjtBQUE2RCxJQUFBLEdBQUcsRUFBRUU7QUFBbEUsS0FDR0gsUUFESCxDQURGO0FBS0QsQ0FURDs7QUFXQUQsS0FBSyxDQUFDTSxTQUFOLEdBQWtCO0FBQ2hCTCxFQUFBQSxRQUFRLEVBQUVNLHNCQUFVQyxHQURKO0FBRWhCTixFQUFBQSxTQUFTLEVBQUVLLHNCQUFVRTtBQUZMLENBQWxCO2VBS2VULEsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IEludGVybmFsQ29udGV4dCBmcm9tICcuL0ludGVybmFsQ29udGV4dCc7XG5pbXBvcnQgdXNlU3R5bGVUb0NsYXNzTmFtZSBmcm9tICcuLi9ob29rcy9pbnRlcm5hbC91c2VTdHlsZVRvQ2xhc3NOYW1lJztcblxuY29uc3QgUk9PVF9TVFlMRSA9IHtcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIG92ZXJmbG93WTogJ2F1dG8nLFxuICB3aWR0aDogJzEwMCUnXG59O1xuXG5jb25zdCBQYW5lbCA9ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUgfSkgPT4ge1xuICBjb25zdCB7IHNldFRhcmdldCB9ID0gdXNlQ29udGV4dChJbnRlcm5hbENvbnRleHQpO1xuICBjb25zdCByb290Q1NTID0gdXNlU3R5bGVUb0NsYXNzTmFtZSgpKFJPT1RfU1RZTEUpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMocm9vdENTUywgKGNsYXNzTmFtZSB8fCAnJykgKyAnJyl9IHJlZj17c2V0VGFyZ2V0fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cblBhbmVsLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5hbnksXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGFuZWw7Il19