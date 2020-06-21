import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import '../../css/style.css';

import Navigation from '../Navigation';
import Shelf from '../Shelf'
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import GameRoom from '../GameRoom';
import GenerateGameInstance from '../GenerateGameInstance';
import SpecificGameInstance from '../SpecificGameInstance';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';


const App = ({ shelfVisible, doToggleShelf }) => (
  <Router>
    <div className = "FullApp">
      <Navigation />
      <Shelf />
      <div
        className={'backdrop' + (shelfVisible ? ' visible' : '')}
        onClick={() => doToggleShelf()}
      />
 
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.GAME_INSTANCE} component={GenerateGameInstance} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.GAME_ROOM} component={GameRoom} />
      <Route exact path={ROUTES.SPECIFIC_GAME_INSTANCE} component={SpecificGameInstance} />
      <Route
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
    </div>
  </Router>
);
const mapStateToProps = (state) => ({
  shelfVisible: state.shelfState.shelfVisible,
});

const mapDispatchToProps = (dispatch) => ({
  doToggleShelf: () => dispatch({ type: 'TOGGLE_SHELF' }),
});

export default compose(
  withAuthentication,
  connect(mapStateToProps, mapDispatchToProps))(App);
 
// export default withAuthentication(App);