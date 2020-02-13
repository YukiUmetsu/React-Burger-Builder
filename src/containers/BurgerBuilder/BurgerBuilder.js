import React, { Component } from "react";
import Aux from "../../hoc/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControl from "../../components/Burger/BuildControls/BuildControls";

const INGREDIENT_PRICES = {
    salad: 1,
    meat: 2,
    bacon: 3,
    cheese: 1
};

class BurgerBuilder extends Component {


    constructor(props){
        super(props);
        this.state = {
            ingredients: {
                salad: 0,
                bacon: 0,
                cheese: 0,
                meat: 0,
            },
            total: 4
        };
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const newCount = oldCount + 1;
        const updatedIngredients = {
          ...this.state.ingredients
        };
        updatedIngredients[type] = newCount;

        // add total
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.total;
        const newPrice = oldPrice + priceAddition;

        this.setState({total: newPrice, ingredients: updatedIngredients});
    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const newCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = newCount;

        // add total
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.total;
        const newPrice = oldPrice - priceDeduction;

        this.setState({total: newPrice, ingredients: updatedIngredients});
    };

    render(){
        const lessBtnDisabledInfo = {...this.state.ingredients};
        for (let key in lessBtnDisabledInfo){
            lessBtnDisabledInfo[key] = lessBtnDisabledInfo[key] <= 0;
        }

        return (
            <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControl
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    lessBtnDisabled={lessBtnDisabledInfo}
                    price={this.state.total}
                />
            </Aux>
        );
    }
}

export default BurgerBuilder;