const initialState = {
  users: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.data };
    case "CREATE_USER":
      return { ...state, users: [...state.users, action.data] };
    default:
      return state;
  }
};

export default rootReducer;
