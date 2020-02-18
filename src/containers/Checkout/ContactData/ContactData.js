import React, { Component } from "react";
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import orderAxios from "../../../axios/axios-orders";
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {

    constructor(props){
        super(props);
        this.state ={
            name: '',
            email: '',
            address: {
                street: '',
                zipCode: ''
            },
            loading: false,
        };
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'test-user',
                address: {
                    street: 'teststreet 1',
                    zipCode: '4534224',
                    country: 'USA'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'USPS',
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

    render(){
        let form = (
            <form action="">
                <Input inputtype="input" type="text" name="name" placeholder="your name"/>
                <Input inputtype="input" type="text" name="email" placeholder="your email"/>
                <Input inputtype="input" type="text" name="street" placeholder="your street"/>
                <Input inputtype="input" type="text" name="zipcode" placeholder="your zipcode"/>
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