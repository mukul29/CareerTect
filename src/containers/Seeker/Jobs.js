import React, { useEffect, useState, useContext } from "react";
import './Jobs.css';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import Modal from '../../components/UIElements/Modal';
import Button from '../../components/UIElements/Button';

import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from "../../context/auth-context";
import JobsList from "../../components/JobsList";

const Jobs = (props) => {
    const [loadedJobs, setLoadedJobs] = useState(null);
    const { isLoading, error, clearError, sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);

    useEffect(() => {
        const getJobs = async () => {
            try {
                const allJobs = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/jobs`, 'GET', undefined, {
                    Authorization: `Bearer ${auth.token}`
                });

                const appliedJobs = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/jobs/applied`, 'GET', undefined, {
                    Authorization: `Bearer ${auth.token}`
                });

                const jobs = allJobs.jobs.map((job) => {
                    if (appliedJobs.jobs.findIndex((appliedJob) => appliedJob.job_id === job.job_id) === -1) {
                        job.applied = false;
                    } else job.applied = true;

                    return job;
                })
                setLoadedJobs(jobs);
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

            {!isLoading && loadedJobs && <JobsList data={loadedJobs} />}
        </React.Fragment>
    )
}

export default Jobs;