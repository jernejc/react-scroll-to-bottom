import _slicedToArray from "@babel/runtime-corejs3/helpers/slicedToArray";
import { useCallback, useRef, useState } from 'react';
export default function useStateRef(initialState) {
  var _useState = useState(initialState),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var ref = useRef();
  var setValue = useCallback(function (nextValue) {
    if (typeof nextValue === 'function') {
      setValue(function (state) {
        nextValue = nextValue(state);
        ref.current = nextValue;
        return nextValue;
      });
    } else {
      ref.current = nextValue;
      setValue(nextValue);
    }
  }, [ref]);
  ref.current = state;
  return [state, setState, ref];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ob29rcy9pbnRlcm5hbC91c2VTdGF0ZVJlZi5qcyJdLCJuYW1lcyI6WyJ1c2VDYWxsYmFjayIsInVzZVJlZiIsInVzZVN0YXRlIiwidXNlU3RhdGVSZWYiLCJpbml0aWFsU3RhdGUiLCJzdGF0ZSIsInNldFN0YXRlIiwicmVmIiwic2V0VmFsdWUiLCJuZXh0VmFsdWUiLCJjdXJyZW50Il0sIm1hcHBpbmdzIjoiO0FBQUEsU0FBU0EsV0FBVCxFQUFzQkMsTUFBdEIsRUFBOEJDLFFBQTlCLFFBQThDLE9BQTlDO0FBRUEsZUFBZSxTQUFTQyxXQUFULENBQXFCQyxZQUFyQixFQUFtQztBQUNoRCxrQkFBMEJGLFFBQVEsQ0FBQ0UsWUFBRCxDQUFsQztBQUFBO0FBQUEsTUFBT0MsS0FBUDtBQUFBLE1BQWNDLFFBQWQ7O0FBQ0EsTUFBTUMsR0FBRyxHQUFHTixNQUFNLEVBQWxCO0FBQ0EsTUFBTU8sUUFBUSxHQUFHUixXQUFXLENBQzFCLFVBQUFTLFNBQVMsRUFBSTtBQUNYLFFBQUksT0FBT0EsU0FBUCxLQUFxQixVQUF6QixFQUFxQztBQUNuQ0QsTUFBQUEsUUFBUSxDQUFDLFVBQUFILEtBQUssRUFBSTtBQUNoQkksUUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNKLEtBQUQsQ0FBckI7QUFFQUUsUUFBQUEsR0FBRyxDQUFDRyxPQUFKLEdBQWNELFNBQWQ7QUFFQSxlQUFPQSxTQUFQO0FBQ0QsT0FOTyxDQUFSO0FBT0QsS0FSRCxNQVFPO0FBQ0xGLE1BQUFBLEdBQUcsQ0FBQ0csT0FBSixHQUFjRCxTQUFkO0FBRUFELE1BQUFBLFFBQVEsQ0FBQ0MsU0FBRCxDQUFSO0FBQ0Q7QUFDRixHQWZ5QixFQWdCMUIsQ0FBQ0YsR0FBRCxDQWhCMEIsQ0FBNUI7QUFtQkFBLEVBQUFBLEdBQUcsQ0FBQ0csT0FBSixHQUFjTCxLQUFkO0FBRUEsU0FBTyxDQUFDQSxLQUFELEVBQVFDLFFBQVIsRUFBa0JDLEdBQWxCLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VTdGF0ZVJlZihpbml0aWFsU3RhdGUpIHtcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZShpbml0aWFsU3RhdGUpO1xuICBjb25zdCByZWYgPSB1c2VSZWYoKTtcbiAgY29uc3Qgc2V0VmFsdWUgPSB1c2VDYWxsYmFjayhcbiAgICBuZXh0VmFsdWUgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBuZXh0VmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgc2V0VmFsdWUoc3RhdGUgPT4ge1xuICAgICAgICAgIG5leHRWYWx1ZSA9IG5leHRWYWx1ZShzdGF0ZSk7XG5cbiAgICAgICAgICByZWYuY3VycmVudCA9IG5leHRWYWx1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0VmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVmLmN1cnJlbnQgPSBuZXh0VmFsdWU7XG5cbiAgICAgICAgc2V0VmFsdWUobmV4dFZhbHVlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFtyZWZdXG4gICk7XG5cbiAgcmVmLmN1cnJlbnQgPSBzdGF0ZTtcblxuICByZXR1cm4gW3N0YXRlLCBzZXRTdGF0ZSwgcmVmXTtcbn1cbiJdfQ==