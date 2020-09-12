import React, { useEffect, useState, useContext } from "react";
import LoadingSpinner from "../../components/UIElements/LoadingSpinner";
import Modal from "../../components/UIElements/Modal";
import Button from "../../components/UIElements/Button";

import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import { useParams } from "react-router-dom";
import Card from "../../components/UIElements/Card";

const ApplicantItem = (props) => {
    const auth = useContext(AuthContext);
    const [accepted, setAccepted] = useState(props.accepted);
    const { isLoading, error, clearError, sendRequest } = useHttpClient();

    const acceptHandler = async (jobId) => {
        console.log(jobId);
        console.log(parseInt(props.id));
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/api/jobs/${jobId}/accept`,
                "POST",
                JSON.stringify({
                    seekerId: props.id
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.token}`,
                }
            );

        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    return (
        <React.Fragment>
            {isLoading && <LoadingSpinner asOverlay />}
            <Modal
                show={!!error}
                closeModal={clearError}
                className="error-modal"
                header="Error"
                headerClass="error-modal-header"
                footer={
                    <Button onClick={clearError} className="secondary round">
                        Okay
                    </Button>
                }
            >
                {error}
            </Modal>
            <li className="user-list-item">
                <Card>
                    <div className="job-list-item">
                        <h3>{props.name}</h3>
                        <p>{props.email}</p>

                        {!props.hideButton &&
                            (accepted ? (
                                <Button className="success" disabled>
                                    Accepted
                                </Button>
                            ) : (
                                <Button
                                    className="primary"
                                    onClick={() => {
                                        acceptHandler(props.jobId)
                                            .then(setAccepted(true))
                                            .catch(err => console.log(err));
                                    }}
                                >
                                    Accept
                                </Button>
                            ))}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
};

const ApplicantsList = (props) => {
    if (props.data.length === 0) {
        return <h2 className="no-users-text">No Applicants Found.</h2>;
    }

    return (
        <ul className="user-list">
            {props.data.map((applicant) => {
                return (
                    <ApplicantItem
                        key={applicant.applicant_id}
                        id={applicant.applicant_id}
                        name={applicant.fullname}
                        email={applicant.email}
                        accepted={applicant.accepted}
                        hideButton={props.hideButton}
                        onClickCard={props.onClickCard}
                        jobId={props.jobId}
                    />
                );
            })}
        </ul>
    );
};

const JobApplicants = (props) => {
    const [loadedApplicants, setLoadedApplicants] = useState(null);
    const { isLoading, error, clearError, sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);
    const jobId = useParams().jobId;

    useEffect(() => {
        const getApplicants = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/api/jobs/${jobId}/applicants`,
                    "GET",
                    undefined,
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );

                setLoadedApplicants(responseData.applicants);
            } catch (err) {
                console.log(err);
            }
        };

        getApplicants();
    }, [sendRequest, auth.token, jobId]);

    return (
        <React.Fragment>
            {isLoading && <LoadingSpinner asOverlay />}
            <Modal
                show={!!error}
                closeModal={clearError}
                className="error-modal"
                header="Error"
                headerClass="error-modal-header"
                footer={
                    <Button onClick={clearError} className="secondary round">
                        Okay
                    </Button>
                }
            >
                {error}
            </Modal>

            {!isLoading && loadedApplicants && <ApplicantsList data={loadedApplicants} jobId={jobId} />}
        </React.Fragment>
    );
};

export default JobApplicants;
