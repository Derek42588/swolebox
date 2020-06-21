import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { connect } from 'react-redux';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const Navigation = ({ authUser, shelfVisible, doToggleShelf }) =>
  authUser ? (
    <NavigationAuth
      authUser={authUser}
      shelfVisible={shelfVisible}
      doToggleShelf={doToggleShelf}
    />
  ) : (
    <NavigationNonAuth
      shelfVisible={shelfVisible}
      doToggleShelf={doToggleShelf}
    />
  );

const NavigationAuth = ({ authUser, shelfVisible, doToggleShelf }) => (
  <div className="Header">
    <ul className="Header__nav">
      <li className="Header__nav__item Header__nav__item--full">
        <Link to={ROUTES.LANDING} className="Header__nav__item__link">
          Landing
        </Link>
      </li>
      <li className="Header__nav__item Header__nav__item--full">
        <Link to={ROUTES.GAME_INSTANCE} className="Header__nav__item__link">
          Games
        </Link>
      </li>
      <li className="Header__nav__item Header__nav__item--full">
        <Link to={ROUTES.ACCOUNT} className="Header__nav__item__link">
          Account
        </Link>
      </li>
      {!!authUser.roles[ROLES.ADMIN] && (
        <li className="Header__nav__item Header__nav__item--full">
          <Link to={ROUTES.ADMIN} className="Header__nav__item__link">
            Admin
          </Link>
        </li>
      )}
      <li className="Header__nav__item Header__nav__item--full">
        <SignOutButton
          doToggleShelf={doToggleShelf}
          className="Header__nav__item__link"
        />
      </li>
      <li
        className="Header__nav__item Header__nav__item--mobile"
        onClick={() => doToggleShelf()}
      >
        <span className="Header__nav__item__icon">&nbsp;</span>
      </li>
    </ul>
  </div>
);

const NavigationNonAuth = ({ shelfVisible, doToggleShelf }) => (
  <div className="Header">
    <ul className="Header__nav">
      <li className="Header__nav__item Header__nav__item--full">
        <Link to={ROUTES.LANDING} className="Header__nav__item__link">
          Landing
        </Link>
      </li>
      <li className="Header__nav__item Header__nav__item--full">
        <Link to={ROUTES.SIGN_IN} className="Header__nav__item__link">
          Sign In
        </Link>
      </li>
      <li
        className="Header__nav__item Header__nav__item--mobile"
        onClick={() => doToggleShelf()}
      >
        <span className="Header__nav__item__icon">&nbsp;</span>
      </li>
    </ul>
  </div>
);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  shelfVisible: state.shelfState.shelfVisible,
});

const mapDispatchToProps = (dispatch) => ({
  doToggleShelf: () => dispatch({ type: 'TOGGLE_SHELF' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
