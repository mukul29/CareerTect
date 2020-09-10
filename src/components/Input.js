import React, { useReducer, useEffect } from 'react';

import './Input.css';
import { validate } from '../utils/validators';
import { SEEKER, RECRUITER } from '../values/userTypes';

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE': return {
            ...state,
            value: action.val,
            isValid: validate(action.val, action.validators),
        }

        case 'TOUCH': return {
            ...state,
            isTouched: true,
        }

        default: return state;
    }
}

const Input = props => {

    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '',
        isValid: props.initialValidity || false,
        isTouched: false,
    });

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
        onInput(id, value, isValid);
    }, [id, value, isValid, onInput]);

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        })
    }

    const changeHandler = (event) => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators,
        })
    }

    const element = props.element === 'input' ?
        props.type === 'radio' ? (
            <div className="user-type">
                <div>
                    <input
                        id={props.label}
                        name={props.name}
                        type={props.type}
                        placeholder={props.placeholder}
                        value={SEEKER}
                        onBlur={touchHandler}
                        onChange={changeHandler}
                    />
                    <label htmlFor={props.label}>{props.label}</label>
                </div>
                <div>
                    <input
                        id={props.label2}
                        name={props.name}
                        type={props.type}
                        placeholder={props.placeholder}
                        value={RECRUITER}
                        onBlur={touchHandler}
                        onChange={changeHandler}
                    />
                    <label htmlFor={props.label2}>{props.label2}</label>
                </div>
            </div>
        ) : (
                <React.Fragment>
                    <label htmlFor={props.id}>{props.label}</label>
                    <input
                        id={props.id}
                        type={props.type}
                        placeholder={props.placeholder}
                        value={inputState.value}
                        onBlur={touchHandler}
                        onChange={changeHandler}
                    />
                </React.Fragment>
            ) : (
            <React.Fragment>
                <label htmlFor={props.id}>{props.label}</label>
                <textarea
                    id={props.id}
                    rows={props.rows || 3}
                    value={inputState.value}
                    onBlur={touchHandler}
                    onChange={changeHandler}
                />
            </React.Fragment>
        );

    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && "form-control__invalid"}`}>
            {element}
            {!inputState.isValid && inputState.isTouched && props.errorText}
        </div>
    );
}

export default Input;