import React, { useContext } from "react";

import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";
import { SEEKER, RECRUITER } from "../../values/userTypes";

const NavLinks = (props) => {
    const auth = useContext(AuthContext);

    let navLinks;
    if (auth.isLoggedIn) {
        if (auth.type === SEEKER) {
            navLinks = (
                <React.Fragment>
                    <li>
                        <NavLink to="/" exact>
                            JOBS
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/jobs/applied" exact>
                            APPLIED JOBS
                        </NavLink>
                    </li>
                    <button onClick={auth.logout}>LOGOUT</button>
                </React.Fragment>
            );
        } else if (auth.type === RECRUITER) {
            navLinks = (
                <React.Fragment>
                    <li>
                        <NavLink to="/" exact>
                            MY POSTED JOBS
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/jobs/new" exact>
                            CREATE JOB
                        </NavLink>
                    </li>
                    <button onClick={auth.logout}>LOGOUT</button>
                </React.Fragment>
            )
        }
    } else {
        navLinks = (
            <React.Fragment>
            </React.Fragment>
        )
    }

    return (
        <ul className="nav-links">
            {navLinks}
        </ul>
    );
};

export default NavLinks;
