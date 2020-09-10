import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

const ModalOverlay = props => {
    const content = (
        <div className={`modal-container ${props.className}`}>
            <header className={`modal-header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form
                onSubmit={
                    props.onSubmit ? props.onSubmit : event => event.preventDefault()
                }
            >
                <div className={`modal-content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal-footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    );

    return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
}

const Modal = props => {
    return (
        <React.Fragment>
            {props.show && <Backdrop onClick={props.closeModal}/>}
            <CSSTransition
                in={props.show}
                timeout={300}
                classNames="modal"
                mountOnEnter
                unmountOnExit
            >
                <ModalOverlay {...props}/>
            </CSSTransition>
        </React.Fragment>
    );
}

export default Modal;