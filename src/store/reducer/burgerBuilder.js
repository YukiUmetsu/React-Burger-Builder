import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from "../../utility/utility";

const INGREDIENT_PRICES = {
    salad: 1,
    meat: 2,
    bacon: 3,
    cheese: 1
};

const initialSate = {
    ingredients: null,
    total: 4,
    error: false,
    building: false,
};

const addIngredient = (state, action) => {
    const updatedIngredient = {[action.ingredientName]: state.ingredients[action.ingredientName]+1};
    const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
    const updatedState = {
        ingredients: updatedIngredients,
        total: state.total + INGREDIENT_PRICES[action.ingredientName],
        building: true,
    };
    return updateObject(state, updatedState);
};

const removeIngredient = (state, action) => {
    const updatedIngredientRemove = {[action.ingredientName]: state.ingredients[action.ingredientName]-1};
    const updatedIngredientsRemove = updateObject(state.ingredients, updatedIngredientRemove);
    const updatedStateRemove = {
        ingredients: updatedIngredientsRemove,
        total: state.total - INGREDIENT_PRICES[action.ingredientName],
        building: true,
    };
    return updateObject(state, updatedStateRemove);
};

const setIngredients = (state, action) => {
    const updatedStateSet = {
        ingredients: action.ingredients,
        total: calculateSum(action.ingredients),
        error: false,
        building: false,
    };
    return updateObject(state, updatedStateSet);
};

const calculateSum = (ingredients) => {
    let ingTotal = Object.keys(ingredients)
        .map(igKey => ingredients[igKey]*INGREDIENT_PRICES[igKey])
        .reduce((currentSum, el) => currentSum+el,0);
    return initialSate.total + ingTotal;
};

const burgerBuilder = (state = initialSate, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENTS: return addIngredient(state, action);
        case actionTypes.REMOVE_INGREDIENTS: return removeIngredient(state, action);
        case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
        case actionTypes.FETCH_INGREDIENTS_FAILED: return updateObject(state, {error: true});
        default: return {...state};
    }
};

export default burgerBuilder;