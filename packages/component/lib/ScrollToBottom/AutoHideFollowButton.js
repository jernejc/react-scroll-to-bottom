"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _useScrollToEnd = _interopRequireDefault(require("../hooks/useScrollToEnd"));

var _useSticky3 = _interopRequireDefault(require("../hooks/useSticky"));

var _useStyleToClassName = _interopRequireDefault(require("../hooks/internal/useStyleToClassName"));

var ROOT_STYLE = {
  backgroundColor: 'rgba(0, 0, 0, .2)',
  borderRadius: 10,
  borderWidth: 0,
  bottom: 5,
  cursor: 'pointer',
  height: 20,
  outline: 0,
  position: 'absolute',
  right: 20,
  width: 20,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, .4)'
  },
  '&:active': {
    backgroundColor: 'rgba(0, 0, 0, .6)'
  }
};

var AutoHideFollowButton = function AutoHideFollowButton(_ref) {
  var children = _ref.children,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className;

  var _useSticky = (0, _useSticky3["default"])(),
      _useSticky2 = (0, _slicedToArray2["default"])(_useSticky, 1),
      sticky = _useSticky2[0];

  var rootCSS = (0, _useStyleToClassName["default"])()(ROOT_STYLE);
  var scrollToEnd = (0, _useScrollToEnd["default"])();
  return !sticky && /*#__PURE__*/_react["default"].createElement("button", {
    className: (0, _classnames["default"])(rootCSS, (className || '') + ''),
    onClick: scrollToEnd,
    type: "button"
  }, children);
};

AutoHideFollowButton.propTypes = {
  children: _propTypes["default"].any,
  className: _propTypes["default"].string
};
var _default = AutoHideFollowButton;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9BdXRvSGlkZUZvbGxvd0J1dHRvbi5qcyJdLCJuYW1lcyI6WyJST09UX1NUWUxFIiwiYmFja2dyb3VuZENvbG9yIiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyV2lkdGgiLCJib3R0b20iLCJjdXJzb3IiLCJoZWlnaHQiLCJvdXRsaW5lIiwicG9zaXRpb24iLCJyaWdodCIsIndpZHRoIiwiQXV0b0hpZGVGb2xsb3dCdXR0b24iLCJjaGlsZHJlbiIsImNsYXNzTmFtZSIsInN0aWNreSIsInJvb3RDU1MiLCJzY3JvbGxUb0VuZCIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsImFueSIsInN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFNQSxVQUFVLEdBQUc7QUFDakJDLEVBQUFBLGVBQWUsRUFBRSxtQkFEQTtBQUVqQkMsRUFBQUEsWUFBWSxFQUFFLEVBRkc7QUFHakJDLEVBQUFBLFdBQVcsRUFBRSxDQUhJO0FBSWpCQyxFQUFBQSxNQUFNLEVBQUUsQ0FKUztBQUtqQkMsRUFBQUEsTUFBTSxFQUFFLFNBTFM7QUFNakJDLEVBQUFBLE1BQU0sRUFBRSxFQU5TO0FBT2pCQyxFQUFBQSxPQUFPLEVBQUUsQ0FQUTtBQVFqQkMsRUFBQUEsUUFBUSxFQUFFLFVBUk87QUFTakJDLEVBQUFBLEtBQUssRUFBRSxFQVRVO0FBVWpCQyxFQUFBQSxLQUFLLEVBQUUsRUFWVTtBQVlqQixhQUFXO0FBQ1RULElBQUFBLGVBQWUsRUFBRTtBQURSLEdBWk07QUFnQmpCLGNBQVk7QUFDVkEsSUFBQUEsZUFBZSxFQUFFO0FBRFA7QUFoQkssQ0FBbkI7O0FBcUJBLElBQU1VLG9CQUFvQixHQUFHLFNBQXZCQSxvQkFBdUIsT0FBa0M7QUFBQSxNQUEvQkMsUUFBK0IsUUFBL0JBLFFBQStCO0FBQUEsNEJBQXJCQyxTQUFxQjtBQUFBLE1BQXJCQSxTQUFxQiwrQkFBVCxFQUFTOztBQUM3RCxtQkFBaUIsNkJBQWpCO0FBQUE7QUFBQSxNQUFPQyxNQUFQOztBQUNBLE1BQU1DLE9BQU8sR0FBRyx1Q0FBc0JmLFVBQXRCLENBQWhCO0FBQ0EsTUFBTWdCLFdBQVcsR0FBRyxpQ0FBcEI7QUFFQSxTQUNFLENBQUNGLE1BQUQsaUJBQ0U7QUFBUSxJQUFBLFNBQVMsRUFBRSw0QkFBV0MsT0FBWCxFQUFvQixDQUFDRixTQUFTLElBQUksRUFBZCxJQUFvQixFQUF4QyxDQUFuQjtBQUFnRSxJQUFBLE9BQU8sRUFBRUcsV0FBekU7QUFBc0YsSUFBQSxJQUFJLEVBQUM7QUFBM0YsS0FDR0osUUFESCxDQUZKO0FBT0QsQ0FaRDs7QUFjQUQsb0JBQW9CLENBQUNNLFNBQXJCLEdBQWlDO0FBQy9CTCxFQUFBQSxRQUFRLEVBQUVNLHNCQUFVQyxHQURXO0FBRS9CTixFQUFBQSxTQUFTLEVBQUVLLHNCQUFVRTtBQUZVLENBQWpDO2VBS2VULG9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHVzZVNjcm9sbFRvRW5kIGZyb20gJy4uL2hvb2tzL3VzZVNjcm9sbFRvRW5kJztcbmltcG9ydCB1c2VTdGlja3kgZnJvbSAnLi4vaG9va3MvdXNlU3RpY2t5JztcbmltcG9ydCB1c2VTdHlsZVRvQ2xhc3NOYW1lIGZyb20gJy4uL2hvb2tzL2ludGVybmFsL3VzZVN0eWxlVG9DbGFzc05hbWUnO1xuXG5jb25zdCBST09UX1NUWUxFID0ge1xuICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIC4yKScsXG4gIGJvcmRlclJhZGl1czogMTAsXG4gIGJvcmRlcldpZHRoOiAwLFxuICBib3R0b206IDUsXG4gIGN1cnNvcjogJ3BvaW50ZXInLFxuICBoZWlnaHQ6IDIwLFxuICBvdXRsaW5lOiAwLFxuICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgcmlnaHQ6IDIwLFxuICB3aWR0aDogMjAsXG5cbiAgJyY6aG92ZXInOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCAwLCAwLCAuNCknXG4gIH0sXG5cbiAgJyY6YWN0aXZlJzoge1xuICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwgMCwgMCwgLjYpJ1xuICB9XG59O1xuXG5jb25zdCBBdXRvSGlkZUZvbGxvd0J1dHRvbiA9ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUgPSAnJyB9KSA9PiB7XG4gIGNvbnN0IFtzdGlja3ldID0gdXNlU3RpY2t5KCk7XG4gIGNvbnN0IHJvb3RDU1MgPSB1c2VTdHlsZVRvQ2xhc3NOYW1lKCkoUk9PVF9TVFlMRSk7XG4gIGNvbnN0IHNjcm9sbFRvRW5kID0gdXNlU2Nyb2xsVG9FbmQoKTtcblxuICByZXR1cm4gKFxuICAgICFzdGlja3kgJiYgKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e2NsYXNzTmFtZXMocm9vdENTUywgKGNsYXNzTmFtZSB8fCAnJykgKyAnJyl9IG9uQ2xpY2s9e3Njcm9sbFRvRW5kfSB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvYnV0dG9uPlxuICAgIClcbiAgKTtcbn07XG5cbkF1dG9IaWRlRm9sbG93QnV0dG9uLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5hbnksXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXV0b0hpZGVGb2xsb3dCdXR0b247Il19