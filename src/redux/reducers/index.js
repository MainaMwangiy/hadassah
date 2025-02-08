import { actions } from "../actions";

const initialState = {
    user: {}
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.LOAD_USER:
            return { ...state, user: action.payload };
        default:
            return state;
    }
};

export default appReducer;
