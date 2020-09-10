import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

const Button = props => {
    if(props.to) {
        return (
            <Link to={props.to} className={`button ${props.className}`}>
                {props.children}
            </Link>
        );
    }
    if(props.href) {
        return (
            <a href={props.href} className={`button ${props.className}`}>
                {props.children}
            </a>
        );
    }

    return (
        <button 
            type={props.type}
            onClick={props.onClick} 
            onBlur={props.onBlur}
            disabled={props.disabled} 
            className={`button ${props.className}`}
        >
            {props.children}
        </button>
    );
}

export default Button;