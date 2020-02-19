import React from 'react';
import classes from './Button.module.css';

const button = (props) => {

    let isButtonDisabled = false;
    if(typeof(props.disabled) != 'undefined'){
        isButtonDisabled = props.disabled;
    }

    return <button
        onClick={props.clicked}
        className={[classes.Button, classes[props.btnType]].join((' '))}
        disabled={isButtonDisabled}>
        {props.children}
    </button>;
};

export default button