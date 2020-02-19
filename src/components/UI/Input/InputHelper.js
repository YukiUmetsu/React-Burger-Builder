const inputHelper = (
    validation = [],
    placeholder='',
    value='',
    elementType='input',
    type='text',
    options=[]
) => {

    let config = {
        elementType: elementType,
        elementConfig: {
            type: type,
            placeholder: placeholder,
        },
        value: '',
        valid: false,
        touched: false,
    };
    if(config.elementType === 'select'){
        config.valid = true;
    }

    if(options.length > 0){
        config.elementConfig['options'] = options;
    }
    if(Object.keys(validation).length > 0){
        config['validation'] = validation
    }

    return config;
};

export default inputHelper;