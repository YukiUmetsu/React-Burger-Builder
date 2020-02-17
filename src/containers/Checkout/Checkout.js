import React, { Component } from "react";
import CheckoutSummary from '../../components/Order/CheckoutSummary';
import { Route } from 'react-router-dom';
import ContactData from "./ContactData/ContactData";

class Checkout extends Component {
    constructor(props){
        super(props);
        this.state = {
            ingredients: {
                salad: 1,
                meat: 1,
                cheese: 1,
                bacon: 1
            },
            price: 0
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

    componentWillMount() {
        let newIngredients = this.objectBuilderFromURL();
        let price = newIngredients.price;
        delete newIngredients.price;
        this.setState({ingredients: newIngredients, price: price});
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
                <Route
                    path={this.props.match.path + '/contact-data'}
                    render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.price} {...props}/>)}
                />
            </div>
        );
    }
}

export default Checkout;