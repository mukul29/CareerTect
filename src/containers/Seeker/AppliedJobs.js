import React, { useEffect, useState, useContext } from "react";
import './Jobs.css';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import Modal from '../../components/UIElements/Modal';
import Button from '../../components/UIElements/Button';

import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from "../../context/auth-context";
import JobsList from "../../components/JobsList";

const AppliedJobs = (props) => {
    const [loadedJobs, setLoadedJobs] = useState(null);
    const { isLoading, error, clearError, sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);

    useEffect(() => {
        const getJobs = async () => {
            try {
                const appliedJobs = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/jobs/applied`, 'GET', undefined, {
                    Authorization: `Bearer ${auth.token}`
                });

                setLoadedJobs(appliedJobs.jobs);
            }
            catch (err) {
                console.log(err);
            }
        }

        getJobs();
    }, [sendRequest, auth.token])

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

            {!isLoading && loadedJobs && <JobsList data={loadedJobs} hideButton={true} />}
        </React.Fragment>
    )
}

export default AppliedJobs;