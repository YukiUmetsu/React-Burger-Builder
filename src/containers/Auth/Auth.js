import React, { Component } from "react";
import Button from '../../components/UI/Button/Button';
import InputConfigBuilder from '../../components/UI/Input/InputHelper';
import * as actions from '../../store/actions/index';
import checkFormElementValidity from "../../components/Utility/checkFormElementValidity";
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';
import { connect } from 'react-redux';
import classes from './Auth.module.css';

class Auth extends Component {
    constructor(props){
        super(props);

        let emailValidation = {
            required: true,
            isEmail: true,
        };
        let passwordValidation = {
            required: true,
            minLength: 6,
        };

        this.state = {
            formIsValid: false,
            controls: {
                email: InputConfigBuilder(emailValidation,'your email','',null,'email'),
                password: InputConfigBuilder(passwordValidation,'','',null,'password'),
            }
        };
    }

    checkFormValidity(form){
        let formIsValid = true;
        for (let inputIdentifier in form){
            if(!form[inputIdentifier].valid){
                formIsValid = false;
            }
        }
        return formIsValid;
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
        };
        const updatedFormElement = {
            ...updatedControls[controlName]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = checkFormElementValidity(updatedFormElement);
        updatedControls[controlName] = updatedFormElement;

        this.setState({controls: updatedControls, formIsValid: this.checkFormValidity(updatedControls)});
    };

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value);
    };

    render(){

        const formElementArray = [];
        for (let key in this.state.controls){
            formElementArray.push({
                id: key,
                config: this.state.controls[key],
            });
        }

        let form = (
            <form onSubmit={this.submitHandler}>
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
                    // clicked={this.orderHandler}
                    disabled={!this.state.formIsValid}>
                    Submit
                </Button>
            </form>);

        return (
            <div className={classes.Auth}>
                <h4>Enter your login data</h4>
                {form}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email,password) => dispatch(actions.auth(email, password)),
    }
};

export default connect(null, mapDispatchToProps)(Auth);