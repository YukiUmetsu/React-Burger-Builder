import React, { Component } from "react";
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControl from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import orderAxios from "../../axios/axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/WithErrorHandler/WithErrorHandler";
import { connect } from "react-redux";
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component {

    constructor(props){
        super(props);
        this.state = {
            validForPurchase: false,
            purchasing: false,
            loading: false,
            error: null
        };
    }

    componentDidMount() {
        orderAxios.get('/ingredients.json')
            .then(response => {
                this.props.onIngredientsUpdated(response.data);
                this.setState({validForPurchase: this.props.price > 0});
            })
            .catch(error => this.setState({error: error}));
    }

    updateValidForPurchase(currentIngredients){
        const ingredients = {
          ...currentIngredients
        };
        const sum = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((currentSum, el) => currentSum+el,0);
        return sum > 0;
    };

    purchaseHandler = () => {
        this.setState({purchasing: true})
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    };

    purchaseContinue = () => {
        let queryString = this.queryParamsBuilder(this.props.ing);
        queryString += '&price='+this.props.price;
        this.props.history.push({
                pathname: '/checkout',
                search: '?' + queryString,
            });
    };

    queryParamsBuilder(paramsArray){
        let queryParams = [];
        for (let i in paramsArray) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(paramsArray[i]));
        }
        return queryParams.join('&');
    }

    render(){
        const lessBtnDisabledInfo = {...this.props.ing};
        for (let key in lessBtnDisabledInfo){
            lessBtnDisabledInfo[key] = lessBtnDisabledInfo[key] <= 0;
        }
        let orderSummaryJSX = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded.</p> : <Spinner/>;
        if(this.props.ing){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ing}/>
                    <BuildControl
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        lessBtnDisabled={lessBtnDisabledInfo}
                        price={this.props.price}
                        validForPurchase={this.updateValidForPurchase(this.props.ing)}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            );

            orderSummaryJSX = (<OrderSummary
                ingredients={this.props.ing}
                purchaseCancel={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinue}
                totalPrice={this.props.price}/>);
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

const mapStateToProps = state => {
    return {
        ing: state.ingredients,
        price: state.total,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENTS, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENTS, ingredientName: ingName}),
        onIngredientsUpdated: (newIngredients) => dispatch({type: actionTypes.UPDATE_INGREDIENTS, newIngredients: newIngredients})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, orderAxios));