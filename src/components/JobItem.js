import React, { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import LoadingSpinner from './UIElements/LoadingSpinner';
import Modal from './UIElements/Modal';
import Button from './UIElements/Button';
import Card from './UIElements/Card';

import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from "../context/auth-context";

const JobItem = props => {
    const auth = useContext(AuthContext);
    const [applied, setApplied] = useState(props.applied);
    const { isLoading, error, clearError, sendRequest } = useHttpClient();
    const history = useHistory();

    const applyHandler = async (jobId) => {
        try {
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/jobs/${jobId}`, 'POST', undefined, {
                Authorization: `Bearer ${auth.token}`
            });

        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    const clickHandler = () => {

        if(props.onClickCard) {
           history.push(`/jobs/${props.id}/applicants`);
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
            <li className="user-list-item">
                <Card onClick={clickHandler} className={props.onClickCard && "pointer"}>
                    <div className="job-list-item">
                        <h3>{props.title}</h3>
                        <p>{props.description}</p>

                        {!props.hideButton &&
                            (applied ?
                                <Button className="success" disabled>Applied</Button>
                                :
                                <Button className="primary"
                                    onClick={() => {
                                        applyHandler(props.id)
                                            .then(setApplied(true))
                                            .catch(err => console.log(err));
                                    }}>
                                    Apply
                            </Button>)
                        }
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
}

export default JobItem;