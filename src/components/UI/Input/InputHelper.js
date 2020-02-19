const inputHelper = (placeholder='', value='', elementType='input', type='text', options=[]) => {

    let config = {
        elementType: elementType,
        elementConfig: {
            type: type,
            placeholder: placeholder,
        },
        value: '',
    };

    if(options.length > 0){
        config.elementConfig['options'] = options;
    }

    return config;
};

export default inputHelper;