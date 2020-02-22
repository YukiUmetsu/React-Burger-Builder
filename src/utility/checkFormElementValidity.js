const checkFormElementValidity = (element) => {
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

        if(isValid && rules.isEmail){
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            isValid = pattern.test(String(value).toLowerCase());
        }
        if(isValid && rules.isNumeric){
            const pattern = /^\d+$/;
            isValid = pattern.test(value);
        }
        return isValid;
};

export default checkFormElementValidity