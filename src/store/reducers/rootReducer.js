const initialState = {
  users: []
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_USER":
      return { ...state, users: [...state.users, action.data] };
    case "SET_USERS":
      return { ...state, users: action.data };
    case "UPDATE_USER":
      return { ...state, users: action.data };
    case "DELETE_USER":
      return { ...state, users: action.data };
    case "SEARCH":
      return { ...state, users: action.data };
    default:
      return state;
  }
};

export default rootReducer;
