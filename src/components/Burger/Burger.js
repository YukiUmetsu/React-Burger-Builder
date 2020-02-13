import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let IngredientsJSX = Object.keys(props.ingredients).map((igKey) => {
        let ingredientCount = props.ingredients[igKey];
        let emptyArraysOfIngredientCount = [...Array(ingredientCount)];
        return emptyArraysOfIngredientCount.map((_, i)=>{
            return <BurgerIngredient type={igKey} key={igKey+i}/>
        });
    });

    let ingredientsCheckArr = IngredientsJSX.reduce((arr, element) => {
       return arr.concat(element);
    });
    if (ingredientsCheckArr.length === 0){
        IngredientsJSX = <p>Please start adding ingredients!</p>;
    }


    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {IngredientsJSX}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger