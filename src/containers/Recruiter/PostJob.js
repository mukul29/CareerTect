import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from '../../components/UIElements/Modal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import Input from '../../components/Input';
import Button from '../../components/UIElements/Button';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';
import {
    VALIDATOR_REQUIRE
} from "../../utils/validators";
import { AuthContext } from '../../context/auth-context';

const PostJob = () => {
    const auth = useContext(AuthContext);
    // console.log(auth);
    const history = useHistory();
    const { isLoading, error, clearError, sendRequest } = useHttpClient();

    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false,
        },
        description: {
            value: '',
            isValid: false,
        },
    }, false);

    const jobSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/api/jobs',
                'POST',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${auth.token}`
                },
            )

            history.push('/');
        }
        catch (err) {
            console.log(err);
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

            <form className="authentication" autoComplete="off" onSubmit={jobSubmitHandler}>
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Job Title"
                    onInput={inputHandler}
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Title can't be empty."
                />
                <Input
                    id="description"
                    element="textarea"
                    type="text"
                    label="Description"
                    onInput={inputHandler}
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Job description can't be empty."
                />
                <div className="auth-form-footer">
                    <Button type="submit" className="primary" disabled={!formState.formIsValid}>
                        POST
                    </Button>
                </div>
            </form>
        </React.Fragment>
    );
}

export default PostJob;