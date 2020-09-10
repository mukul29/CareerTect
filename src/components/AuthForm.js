import React, { useState, useContext } from 'react';

import './AuthForm.css';
import Modal from './UIElements/Modal';
import LoadingSpinner from './UIElements/LoadingSpinner';
import Input from './Input';
import Button from './UIElements/Button';
import { useForm } from '../hooks/form-hook';
import { useHttpClient } from '../hooks/http-hook';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from "../utils/validators";
import { AuthContext } from '../context/auth-context';

const Auth = () => {
    const auth = useContext(AuthContext);
    // console.log(auth);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, clearError, sendRequest } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false,
        },
        password: {
            value: '',
            isValid: false,
        },
    }, false);

    const switchModeHandler = () => {
        if (isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false,
                },
                type: {
                    value: '',
                    isValid: false
                }
            }, false);
        }
        else {
            setFormData({
                ...formState.inputs,
                name: undefined,
                type: undefined,
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        }
        setIsLoginMode(prevState => !prevState);
    }

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    },
                )

                auth.login(responseData.type, responseData.token);
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/api/users/signup',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                        name: formState.inputs.name.value,
                        type: formState.inputs.type.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    },
                )

                auth.login(responseData.type, responseData.token);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <React.Fragment>
            {isLoading && <LoadingSpinner asOverlay />}
            <Modal
                show={!!error}
                closeModal={clearError}
                className="error-modal"
                header="Error"
                headerClass="error-modal-header"
                footer={<Button onClick={clearError} className="secondary round">Okay</Button>}
            >
                {error}
            </Modal>

            <form className="authentication" autoComplete="off" onSubmit={authSubmitHandler}>
                <h2 className="auth-form-heading">{isLoginMode ? "Login Required" : "SignUp"}</h2>
                {!isLoginMode &&
                    <React.Fragment>
                        <Input
                            id="name"
                            element="input"
                            type="text"
                            label="Your Name"
                            onInput={inputHandler}
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a valid name."
                        />
                        <Input
                            id="type"
                            name="type"
                            element="input"
                            type="radio"
                            label="Seeker"
                            label2="Recruiter"
                            onInput={inputHandler}
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a valid type."
                        />
                    </React.Fragment>
                }
                <Input
                    id="email"
                    element="input"
                    type="email"
                    label="Email"
                    onInput={inputHandler}
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter a valid email address."
                />
                <Input
                    id="password"
                    element="input"
                    type="password"
                    label="Password"
                    onInput={inputHandler}
                    validators={[VALIDATOR_MINLENGTH(6)]}
                    errorText="Please enter a valid password (min length required is 6)."
                />
                <div className="auth-form-footer">
                    <Button type="submit" className="primary" disabled={!formState.formIsValid}>
                        {isLoginMode ? "LOGIN" : "SIGNUP"}
                    </Button>
                    OR
                    <Button type="button" className="info" onClick={switchModeHandler}>
                        SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
                    </Button>
                </div>
            </form>
        </React.Fragment>
    );
}

export default Auth;