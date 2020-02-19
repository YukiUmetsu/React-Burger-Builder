import * as actionTypes from './actions';

const INGREDIENT_PRICES = {
    salad: 1,
    meat: 2,
    bacon: 3,
    cheese: 1
};

const initialSate = {
    ingredients: {
        salad: 0,
        bacon: 0,
        cheese: 0,
        meat: 0,
    },
    total: 4,
};

const calculateSum = (ingredients) => {
    let ingTotal = Object.keys(ingredients)
        .map(igKey => ingredients[igKey]*INGREDIENT_PRICES[igKey])
        .reduce((currentSum, el) => currentSum+el,0);
    return initialSate.total + ingTotal;
};

const reducer = (state = initialSate, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName]+1 //override
                },
                total: state.total + INGREDIENT_PRICES[action.ingredientName],
            };

        case actionTypes.REMOVE_INGREDIENTS:
            return{
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName]-1 //override
                },
                total: state.total - INGREDIENT_PRICES[action.ingredientName],
            };

        case actionTypes.UPDATE_INGREDIENTS:
            return {
                ...state,
                ingredients: {
                    ...action.newIngredients
                },
                total: calculateSum(action.newIngredients)
            };

        default:
            return {...state};
    }
};

export default reducer;