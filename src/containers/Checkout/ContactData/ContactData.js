import React, { Component } from "react";
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import orderAxios from "../../../axios/axios-orders";
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import InputConfigBuilder from '../../../components/UI/Input/InputHelper';
import { connect } from 'react-redux';
import withErrorHandler from "../../../hoc/WithErrorHandler/WithErrorHandler";
import * as actions from '../../../store/actions/index';
import checkFormElementValidity from "../../../components/Utility/checkFormElementValidity";

class ContactData extends Component {

    constructor(props){
        super(props);
        let deliveryOptions = [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
        ];
        let basicValidation = {
          required: true,
        };
        let emailValidation = {
          required: true,
          isEmail: true,
        };
        let zipCodeValidation = {
            required: true,
            minLength: 5,
            maxLength: 7
        };

        this.state = {
            formIsValid: false,
            orderForm: {
                name: InputConfigBuilder(basicValidation,'your name'),
                street: InputConfigBuilder(basicValidation,'your street'),
                zipCode: InputConfigBuilder(zipCodeValidation,'your zip'),
                country: InputConfigBuilder(basicValidation,'your country'),
                email: InputConfigBuilder(emailValidation,'your email','','email'),
                deliveryMethod: InputConfigBuilder({},'delivery method','fastest','select','', deliveryOptions),
            }
        };
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});

        // get form data
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: this.props.ing,
            price: this.props.price,
            orderData: formData,
            datetime: new Date().toLocaleString(),
        };

        this.props.onOrderBurger(order);
    };

    inputChangedHandler = (event,inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = checkFormElementValidity(updatedFormElement);
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        this.setState({orderForm: updatedOrderForm, formIsValid: this.checkFormValidity(updatedOrderForm)});
    };

    checkFormValidity(orderForm){
        let formIsValid = true;
        for (let inputIdentifier in orderForm){
            if(!orderForm[inputIdentifier].valid){
                formIsValid = false;
            }
        }
        return formIsValid;
    }

    render(){
        const formElementArray = [];
        for (let key in this.state.orderForm){
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key],
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementArray.map(formElement => {
                    return <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event)=>{this.inputChangedHandler(event,formElement.id)}}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                    />
                })}
                <Button
                    btnType="Success"
                    clicked={this.orderHandler}
                    disabled={!this.state.formIsValid}>
                    Confirm
                </Button>
            </form>);

        if(this.props.loading){
            form = <Spinner/>
        }
        return (
            <div className={classes.ContactData} >
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ing: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.total,
        loading: state.order.loading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, orderAxios));