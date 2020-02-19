import React, { Component } from "react";
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import orderAxios from "../../../axios/axios-orders";
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import InputConfigBuilder from '../../../components/UI/Input/InputHelper';

class ContactData extends Component {

    constructor(props){
        super(props);
        let deliveryOptions = [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'}
        ];
        this.state = {
            loading: false,
            orderForm: {
                name: InputConfigBuilder('your name'),
                street: InputConfigBuilder('your street'),
                zipCode: InputConfigBuilder('your zip'),
                country: InputConfigBuilder('your country'),
                email: InputConfigBuilder('your email','','email'),
                deliveryMethod: InputConfigBuilder('delivery method','','select','', deliveryOptions),
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
            ingredients: this.props.ingredients,
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

    inputChangedHandler = (event,inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        this.setState({orderForm: updatedOrderForm});
    };

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
                    />
                })}
                <Button btnType="Success" clicked={this.orderHandler}>Confirm</Button>
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

export default ContactData;