import { useReducer, useCallback } from 'react';

const formReducer = (state, action) => {
    switch(action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for(const inputId in state.inputs) {
                if(state.inputs[inputId] === undefined) {
                    continue;
                }
                if(inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                }
                else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }

            return {
                ...state,
                inputs:{
                    ...state.inputs,
                    [action.inputId] : {
                        value: action.value,
                        isValid: action.isValid
                    }
                },
                formIsValid,
            };

        case 'SET_DATA': return ({
            inputs: action.formInputs,
            formIsValid: action.formValidity,
        });

        default: return state;
    }
}

export const useForm = (initialFormInputs, initialFormValidity) => {
    const [fromState, dispatch] = useReducer(formReducer, {
        inputs: initialFormInputs,
        formIsValid: initialFormValidity,
    });

    const inputHandler = useCallback((inputId, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            inputId,
            value,
            isValid,
        });
    }, []);

    const setFormData = useCallback((formInputs, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            formInputs,
            formValidity,
        });
    }, []);
    
    return [fromState, inputHandler, setFormData];
}