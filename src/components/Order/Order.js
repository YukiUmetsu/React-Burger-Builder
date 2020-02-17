import React from 'react';
import classes from './Order.module.css';

const order = (props) => {

    const ingredients = [];
    for( let ingredientName in props.ingredients ) {
        ingredients.push(
            {
                name: ingredientName,
                amount: props.ingredients[ingredientName],
            }
        );
    }

    let igStyle = {
        textTransform: 'capitalize',
        display: 'inline-block',
        margin: '0 8px',
        border: '1px solid #ccc',
    };

    let ingredientOutput = ingredients.map(ig => {
        return <span key={ig.name} style={igStyle}>{ig.name} ({ig.amount}) </span>
    });


    return (
        <div className={classes.Order}>
            Ingredients: {ingredientOutput}
            <p>Price: <strong>${props.price.toFixed(2)}</strong></p>
        </div>
    );
};

export default order