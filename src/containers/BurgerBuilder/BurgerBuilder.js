import React, { Component } from "react";
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControl from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";

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
            total: 4,
            validForPurchase: false,
            purchasing: false
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
        this.updateValidForPurchase(updatedIngredients);
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
        this.updateValidForPurchase(updatedIngredients);
    };

    updateValidForPurchase(currentIngredients){
        const ingredients = {
          ...currentIngredients
        };
        const sum = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((currentSum, el) => currentSum+el,0);
        this.setState({validForPurchase: sum > 0});
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinue = () => {
        alert('You continue!');
    }

    render(){
        const lessBtnDisabledInfo = {...this.state.ingredients};
        for (let key in lessBtnDisabledInfo){
            lessBtnDisabledInfo[key] = lessBtnDisabledInfo[key] <= 0;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary
                        ingredients={this.state.ingredients}
                        purchaseCancel={this.purchaseCancelHandler}
                        purchaseContinue={this.purchaseContinue}
                        totalPrice={this.state.total}
                    />
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControl
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    lessBtnDisabled={lessBtnDisabledInfo}
                    price={this.state.total}
                    validForPurchase={this.state.validForPurchase}
                    ordered={this.purchaseHandler}
                />
            </Aux>
        );
    }
}

export default BurgerBuilder;