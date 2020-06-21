import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import messageReducer from './message';
import shelfReducer from './shelf';
import gameroomReducer from './gameroom';
 
const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  messageState: messageReducer,
  shelfState: shelfReducer,
  gameRoomState: gameroomReducer
});
 
export default rootReducer;