const INITIAL_STATE = {
    shelfVisible: false
  };

export const doToggleShelf = (shelfState) => {
    return dispatch => {
       dispatch({
           type: 'TOGGLE_SHELF',
           shelfState
       })
      
}
  }
   
  const shelfReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case 'TOGGLE_SHELF': {
        return {
          ...state,
          shelfVisible: !state.shelfVisible
      }
      }
      default:
        return state;
    }
  }
   
  export default shelfReducer;