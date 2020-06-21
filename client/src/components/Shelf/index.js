import React from 'react';
import { connect } from 'react-redux';
// import { HashLink } from 'react-router-hash-link'
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const Shelf = ({ authUser, doToggleShelf, shelfVisible }) => 
authUser ? 
<ShelfAuth authUser={authUser} shelfVisible = {shelfVisible} doToggleShelf = {doToggleShelf}/> 
: 
<ShelfNonAuth shelfVisible = {shelfVisible} doToggleShelf = {doToggleShelf}/>;

const ShelfAuth = ({ authUser, shelfVisible, doToggleShelf }) => (
  <div className={'Shelf' + (shelfVisible ? ' shelfVisible' : '')}>
    <ul className="Shelf__list">
      <li className="Shelf__list__item">
        <Link
          to={ROUTES.LANDING}
          onClick={() => doToggleShelf()}
          className="Shelf__list__item__link "
        >
          Landing
        </Link>
      </li>
      <li className="Shelf__list__item">
        <Link
          to={ROUTES.GAME_INSTANCE}
          onClick={() => doToggleShelf()}
          className="Shelf__list__item__link"
        >
          Games
        </Link>
      </li>
      <li className="Shelf__list__item">
        <Link
          to={ROUTES.ACCOUNT}
          onClick={() => doToggleShelf()}
          className="Shelf__list__item__link"
        >
          Account
        </Link>
      </li>
      {!!authUser.roles[ROLES.ADMIN] && (
        <li className="Shelf__list__item">
          <Link
            onClick={() => doToggleShelf()}
            to={ROUTES.ADMIN}
            className="Shelf__list__item__link"
          >
            Admin
          </Link>
        </li>
      )}
      <li className="Shelf__list__item">
        <SignOutButton
          doToggleShelf = {doToggleShelf}
          isShelfButton = {true}
          className="Shelf__list__item__link"
        />
      </li>
    </ul>
  </div>
);

const ShelfNonAuth = ({ authUser, shelfVisible, doToggleShelf }) => (
  <div className={'Shelf' + (shelfVisible ? ' shelfVisible' : '')}>
    <ul className="Shelf__list">
      <li className="Shelf__list__item">
        <Link
          to={ROUTES.LANDING}
          onClick={() => doToggleShelf()}
          className="Shelf__list__item__link "
        >
          Landing
        </Link>
      </li>
      <li className="Shelf__list__item">
        <Link
          to={ROUTES.SIGN_IN}
          onClick={() => doToggleShelf()}
          className="Shelf__list__item__link"
        >
          Sign In
        </Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Shelf);
