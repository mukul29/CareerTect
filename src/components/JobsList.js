import React from "react";
import JobItem from "./JobItem";


const JobsList = props => {
    // console.log(props.data);
    if (props.data.length === 0) {
        return <h2 className="no-users-text">No Jobs Found.</h2>
    }

    return (
        <ul className="user-list">
            {
                props.data.map((job) => {
                    return (
                        <JobItem
                            key={job.job_id}
                            id={job.job_id}
                            title={job.title}
                            description={job.description}
                            applied={job.applied}
                            hideButton={props.hideButton}
                            onClickCard={props.onClickCard}
                        />
                    );
                })
            }
        </ul>
    );
}

export default JobsList;