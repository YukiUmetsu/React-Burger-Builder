import React, { Component } from "react";
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import orderAxios from "../../../axios/axios-orders";
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import InputConfigBuilder from '../../../components/UI/Input/InputHelper';
import { connect } from 'react-redux';

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
        let zipCodeValidation = {
            required: true,
            minLength: 5,
            maxLength: 7
        };
        this.state = {
            loading: false,
            formIsValid: false,
            orderForm: {
                name: InputConfigBuilder(basicValidation,'your name'),
                street: InputConfigBuilder(basicValidation,'your street'),
                zipCode: InputConfigBuilder(zipCodeValidation,'your zip'),
                country: InputConfigBuilder(basicValidation,'your country'),
                email: InputConfigBuilder(basicValidation,'your email','','email'),
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

        orderAxios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading: false});
                console.log(error);
            });
    };

    checkValidity(element) {
        let value = element.value;
        let rules = element.validation;
        let isValid = true;

        if(element.elementType === 'select'){
            return true;
        }

        if(typeof(rules) == 'undefined'){
            return isValid;
        }

        if(rules.required){
            isValid = value.trim() !== '';
        }

        if(isValid && rules.minLength){
            isValid = value.trim().length >= rules.minLength;
        }

        if(isValid && rules.maxLength){
            isValid = value.trim().length <= rules.maxLength;
        }
        return isValid;
    }

    inputChangedHandler = (event,inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = this.checkValidity(updatedFormElement);
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

        if(this.state.loading){
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
        ing: state.ingredients,
        price: state.total,
    };
};

export default connect(mapStateToProps)(ContactData);