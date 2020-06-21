const INITIAL_STATE = {
    gamerooms: null,
    gameroom: {
      createdAt: '1',
      creator: {
        email: 'x@x.com',
        uid: '1',
        username: 'testy boy'
      },
      gameMode: 'pregame',
      messages: [''],
      playerList: [{colorIndex: 0, playerName: 'SwoleBot', playerUid: '1'}],
      playerSlips: [''],
      roomName: 'roomy',
      submittedSlips:['1']
    },
  
  };
   
  const applySetGamerooms = (state, action) => ({
    ...state,
    gamerooms: action.gamerooms,
  });
   
   
  const applySetGameroom = (state, action) => (
    {
    ...state,
    gameroom: action.gameroom
  });
  // const applySetGameroom = (state, action) => (
  //   {
  //   ...state,
  //   gamerooms: {
  //     ...state.gamerooms,
  //     [action.uid]: action.gameroom,
  //   },
  // });
  function gameroomReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'GAMEROOMS_SET': {
        return applySetGamerooms(state, action);
      }
      case 'GAMEROOM_SET': {
        return applySetGameroom(state, action);
      }
      default:
        return state;
    }
  }
   
  export default gameroomReducer;