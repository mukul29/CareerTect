import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.css';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthForm from './components/AuthForm';
import { AuthContext } from './context/auth-context';
import { useAuth } from './hooks/auth-hook';
import LoadingSpinner from './components/UIElements/LoadingSpinner';
import { SEEKER, RECRUITER } from './values/userTypes';

const AppliedJobs = React.lazy(() => import('./containers/Seeker/AppliedJobs'));
const Jobs = React.lazy(() => import('./containers/Seeker/Jobs'));
const PostedJobs = React.lazy(() => import('./containers/Recruiter/PostedJobs'));
const PostJob = React.lazy(() => import('./containers/Recruiter/PostJob'));
const JobApplicants = React.lazy(() => import('./containers/Recruiter/JobApplicants'));

// const Users = React.lazy(() => import('./users/pages/Users'));

function App() {
    const { token, type, login, logout } = useAuth();

    let routes;
    if (token) {
        if (type === SEEKER) {
            routes = (
                <Switch>
                    <Route path="/" exact>
                        <Jobs />
                    </Route>
                    <Route path="/jobs/applied" exact>
                        <AppliedJobs />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            );
        } else if (type === RECRUITER) {
            routes = (
                <Switch>
                    <Route path="/" exact>
                        <PostedJobs />
                    </Route>
                    <Route path="/jobs/new" exact>
                        <PostJob />
                    </Route>
                    <Route path="/jobs/:jobId/applicants" exact>
                        <JobApplicants />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            )
        }

    }
    else {
        routes = (
            <Switch>
                <Route path="/auth" exact>
                    <AuthForm />
                </Route>
                <Redirect to="/auth" />
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token,
                type,
                login,
                logout
            }}>
            <Router>
                <MainNavigation />
                <main>
                    <Suspense fallback={<LoadingSpinner asOverlay />}>
                        {routes}
                    </Suspense>
                </main>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;