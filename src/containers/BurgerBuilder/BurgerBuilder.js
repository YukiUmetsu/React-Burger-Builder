import React, { Component } from "react";
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControl from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import orderAxios from "../../axios/axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/WithErrorHandler/WithErrorHandler";

const INGREDIENT_PRICES = {
    salad: 1,
    meat: 2,
    bacon: 3,
    cheese: 1
};

const BASE_PRICE = 4;

class BurgerBuilder extends Component {

    constructor(props){
        super(props);
        this.state = {
            ingredients: null,
            total: BASE_PRICE,
            validForPurchase: false,
            purchasing: false,
            loading: false,
            error: null
        };
    }

    calculateSum = (ingredients) => {
        let ingTotal = Object.keys(ingredients)
            .map(igKey => ingredients[igKey]*INGREDIENT_PRICES[igKey])
            .reduce((currentSum, el) => currentSum+el,0);
        return BASE_PRICE + ingTotal;
    };

    componentDidMount() {
        orderAxios.get('/ingredients.json')
            .then(response => {
                let currentSum = this.calculateSum(response.data);
                this.setState({
                    ingredients: response.data,
                    total: currentSum,
                    validForPurchase: currentSum > 0
                });
            })
            .catch(error => this.setState({error: error}));
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

        // reduce total
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
        //alert('You continue!');
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.total,
            customer: {
                name: 'Test user',
                address: {
                    street: 'test street',
                    zipCode: '345532',
                    country: 'USA'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'UPS',
        };
        orderAxios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false, purchasing: false});
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false});
                console.log(error);
            });
    };

    render(){
        const lessBtnDisabledInfo = {...this.state.ingredients};
        for (let key in lessBtnDisabledInfo){
            lessBtnDisabledInfo[key] = lessBtnDisabledInfo[key] <= 0;
        }
        let orderSummaryJSX = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded.</p> : <Spinner/>;
        if(this.state.ingredients){
            burger = (
                <Aux>
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

            orderSummaryJSX = (<OrderSummary
                ingredients={this.state.ingredients}
                purchaseCancel={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinue}
                totalPrice={this.state.total}/>);
        }

        if(this.state.loading){
            orderSummaryJSX = <Spinner/>
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummaryJSX}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, orderAxios);