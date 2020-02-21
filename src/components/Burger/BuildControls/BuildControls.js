import React from 'react';
import classes from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { label: 'Salad', type: 'salad'},
    { label: 'Bacon', type: 'bacon'},
    { label: 'Cheese', type: 'cheese'},
    { label: 'Meat', type: 'meat'}
];

const buildControls = (props) => {

    let conditionalButton = (props.isAuth) ?
        <button className={classes.OrderButton} disabled={!props.validForPurchase} onClick={props.ordered}>Order Now</button>:
        <button className={classes.OrderButton}  onClick={props.ordered}>Sign up to order</button>;


    return (
        <div className={classes.BuildControls}>
            <p>Current Price: <strong>${Math.round(props.price,2)}</strong></p>
            {controls.map((ctrl) => {
                return <BuildControl
                        key={ctrl.label}
                        label={ctrl.label}
                        added={()=> props.ingredientAdded(ctrl.type)}
                        removed={()=> props.ingredientRemoved(ctrl.type)}
                        lessBtnDisabled={props.lessBtnDisabled[ctrl.type]}
                />
            })}
            {conditionalButton}
        </div>
    );
};

export default buildControls