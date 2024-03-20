import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import InternalContext from './InternalContext';
import useStyleToClassName from '../hooks/internal/useStyleToClassName';
var ROOT_STYLE = {
  height: '100%',
  overflowY: 'auto',
  width: '100%'
};

var Panel = function Panel(_ref) {
  var children = _ref.children,
      className = _ref.className;

  var _useContext = useContext(InternalContext),
      setTarget = _useContext.setTarget;

  var rootCSS = useStyleToClassName()(ROOT_STYLE);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(rootCSS, (className || '') + ''),
    ref: setTarget
  }, children);
};

Panel.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};
export default Panel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TY3JvbGxUb0JvdHRvbS9QYW5lbC5qcyJdLCJuYW1lcyI6WyJjbGFzc05hbWVzIiwiUHJvcFR5cGVzIiwiUmVhY3QiLCJ1c2VDb250ZXh0IiwiSW50ZXJuYWxDb250ZXh0IiwidXNlU3R5bGVUb0NsYXNzTmFtZSIsIlJPT1RfU1RZTEUiLCJoZWlnaHQiLCJvdmVyZmxvd1kiLCJ3aWR0aCIsIlBhbmVsIiwiY2hpbGRyZW4iLCJjbGFzc05hbWUiLCJzZXRUYXJnZXQiLCJyb290Q1NTIiwicHJvcFR5cGVzIiwiYW55Iiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiQUFBQSxPQUFPQSxVQUFQLE1BQXVCLFlBQXZCO0FBQ0EsT0FBT0MsU0FBUCxNQUFzQixZQUF0QjtBQUNBLE9BQU9DLEtBQVAsSUFBZ0JDLFVBQWhCLFFBQWtDLE9BQWxDO0FBRUEsT0FBT0MsZUFBUCxNQUE0QixtQkFBNUI7QUFDQSxPQUFPQyxtQkFBUCxNQUFnQyx1Q0FBaEM7QUFFQSxJQUFNQyxVQUFVLEdBQUc7QUFDakJDLEVBQUFBLE1BQU0sRUFBRSxNQURTO0FBRWpCQyxFQUFBQSxTQUFTLEVBQUUsTUFGTTtBQUdqQkMsRUFBQUEsS0FBSyxFQUFFO0FBSFUsQ0FBbkI7O0FBTUEsSUFBTUMsS0FBSyxHQUFHLFNBQVJBLEtBQVEsT0FBNkI7QUFBQSxNQUExQkMsUUFBMEIsUUFBMUJBLFFBQTBCO0FBQUEsTUFBaEJDLFNBQWdCLFFBQWhCQSxTQUFnQjs7QUFDekMsb0JBQXNCVCxVQUFVLENBQUNDLGVBQUQsQ0FBaEM7QUFBQSxNQUFRUyxTQUFSLGVBQVFBLFNBQVI7O0FBQ0EsTUFBTUMsT0FBTyxHQUFHVCxtQkFBbUIsR0FBR0MsVUFBSCxDQUFuQztBQUVBLHNCQUNFO0FBQUssSUFBQSxTQUFTLEVBQUVOLFVBQVUsQ0FBQ2MsT0FBRCxFQUFVLENBQUNGLFNBQVMsSUFBSSxFQUFkLElBQW9CLEVBQTlCLENBQTFCO0FBQTZELElBQUEsR0FBRyxFQUFFQztBQUFsRSxLQUNHRixRQURILENBREY7QUFLRCxDQVREOztBQVdBRCxLQUFLLENBQUNLLFNBQU4sR0FBa0I7QUFDaEJKLEVBQUFBLFFBQVEsRUFBRVYsU0FBUyxDQUFDZSxHQURKO0FBRWhCSixFQUFBQSxTQUFTLEVBQUVYLFNBQVMsQ0FBQ2dCO0FBRkwsQ0FBbEI7QUFLQSxlQUFlUCxLQUFmIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBJbnRlcm5hbENvbnRleHQgZnJvbSAnLi9JbnRlcm5hbENvbnRleHQnO1xuaW1wb3J0IHVzZVN0eWxlVG9DbGFzc05hbWUgZnJvbSAnLi4vaG9va3MvaW50ZXJuYWwvdXNlU3R5bGVUb0NsYXNzTmFtZSc7XG5cbmNvbnN0IFJPT1RfU1RZTEUgPSB7XG4gIGhlaWdodDogJzEwMCUnLFxuICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgd2lkdGg6ICcxMDAlJ1xufTtcblxuY29uc3QgUGFuZWwgPSAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lIH0pID0+IHtcbiAgY29uc3QgeyBzZXRUYXJnZXQgfSA9IHVzZUNvbnRleHQoSW50ZXJuYWxDb250ZXh0KTtcbiAgY29uc3Qgcm9vdENTUyA9IHVzZVN0eWxlVG9DbGFzc05hbWUoKShST09UX1NUWUxFKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKHJvb3RDU1MsIChjbGFzc05hbWUgfHwgJycpICsgJycpfSByZWY9e3NldFRhcmdldH0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5QYW5lbC5wcm9wVHlwZXMgPSB7XG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuYW55LFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsOyJdfQ==