import React, { useEffect, useState, useContext } from "react";
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import Modal from '../../components/UIElements/Modal';
import Button from '../../components/UIElements/Button';

import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from "../../context/auth-context";
import JobsList from "../../components/JobsList";

const PostedJobs = (props) => {
    const [loadedJobs, setLoadedJobs] = useState(null);
    const { isLoading, error, clearError, sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);

    useEffect(() => {
        const getJobs = async () => {
            try {
                const postedJobs = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/jobs/posted`, 'GET', undefined, {
                    Authorization: `Bearer ${auth.token}`
                });

                setLoadedJobs(postedJobs.jobs);
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

            {!isLoading && loadedJobs && <JobsList data={loadedJobs} hideButton={true} onClickCard={true} />}
        </React.Fragment>
    )
}

export default PostedJobs;