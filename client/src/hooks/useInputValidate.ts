/* React */
import { useCallback, useReducer } from 'react';

type TInputState = {
  value: string;
  isTouched: boolean;
};

type TAction =
  | {
      type: 'INPUT_CHANGE' | 'SET_VALUE';
      value: string;
    }
  | {
      type: 'INPUT_BLUR';
    };

const inputReducer = (prevState: TInputState, action: TAction) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      return { value: action.value, isTouched: prevState.isTouched };

    case 'INPUT_BLUR':
      return { value: prevState.value, isTouched: true };

    case 'SET_VALUE':
      return { value: action.value, isTouched: true };

    default:
      return prevState;
  }
};

/* //////////////////////////////////////////////////////////////// */
export default function useInputValidate(
  validators: Array<(value: string) => boolean>,
  initialValue: TInputState = { value: '', isTouched: false }
) {
  const [inputState, dispatch] = useReducer(inputReducer, initialValue);

  // Run all validator to check if value is valid
  let valueIsValid = true;
  validators.forEach((validator) => {
    valueIsValid = valueIsValid && validator(inputState.value);
  });
  const hasError = !valueIsValid;

  // Set value
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch({ type: 'INPUT_CHANGE', value: e.target.value });
    },
    []
  );

  // Set isTouched true
  const onBlur = useCallback(() => {
    dispatch({ type: 'INPUT_BLUR' });
  }, []);

  // Set input value
  const setInputValue = useCallback((value: string) => {
    dispatch({ type: 'SET_VALUE', value });
  }, []);

  return {
    value: inputState.value,
    isTouched: inputState.isTouched,
    hasError,
    setInputValue,
    onBlur,
    onChange,
  };
}
