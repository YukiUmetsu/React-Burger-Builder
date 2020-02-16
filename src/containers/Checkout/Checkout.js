import React, { Component } from "react";
import CheckoutSummary from '../../components/Order/CheckoutSummary';

class Checkout extends Component {
    constructor(props){
        super(props);
        this.state = {
            ingredients: {
                salad: 1,
                meat: 1,
                cheese: 1,
                bacon: 1
            }
        };
    }

    objectBuilderFromURL = () => {
        const query = new URLSearchParams(this.props.location.search);
        const obj = {};
        for (let param of query.entries()) {
            obj[param[0]] = +param[1];
        }
        return obj;
    }

    componentDidMount() {
        let newIngredients = this.objectBuilderFromURL();
        this.setState({ingredients: newIngredients});
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('checkout/contact-data');
    }

    render(){
        return (
            <div>
                <CheckoutSummary
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}
                />
            </div>
        );
    }
}

export default Checkout;