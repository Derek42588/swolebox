import React, { Component } from 'react'
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as SOCIAL_AUTH_ERRORS from '../../../constants/socialAuthErrors';
import { ReactComponent as IconTwitter } from '../../../assets/twitterSvgIcon.svg';

import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

class SignInTwitterBase extends Component {
    constructor(props) {
      super(props);
   
      this.state = { error: null };
    }
   
    onSubmit = event => {
      this.props.firebase
        .handleSignInWithTwitter()
        .then(socialAuthUser => {
          if (socialAuthUser.additionalUserInfo.isNewUser) {
            // Create a user in your Firebase Realtime Database too
          return this.props.firebase
            .user(socialAuthUser.user.uid)
            .set({
              username: socialAuthUser.additionalUserInfo.profile.name,
              email: socialAuthUser.additionalUserInfo.profile.email,
              roles: {},
            });
          }
        })
        .then(socialAuthUser => {
          this.setState({ error: null });
          this.props.history.push(ROUTES.GAME_INSTANCE);
        })
        .catch(error => {
          if (error.code === SOCIAL_AUTH_ERRORS.ERROR_CODE_ACCOUNT_EXISTS) {
            error.message = SOCIAL_AUTH_ERRORS.ERROR_MSG_ACCOUNT_EXISTS;
          }
          this.setState({ error });
        });
   
      event.preventDefault();
    };
   
    render() {
      const { error } = this.state;
   
      return (
        <form className = "SignInPage__socialBox" onSubmit={this.onSubmit}>
          <button className ="CustomButton CustomButton--socialSignIns" type="submit">
          <IconTwitter className="CustomIcon TwitterIcon" />
          <span className = "CustomButton__text">Sign In with Twitter</span>
        </button>
   
          {error && <p className="SignInPage__error-blurb">{error.message}</p>}
        </form>
      );
    }
  }

  const SignInTwitter = compose(
    withRouter,
    withFirebase
  )(SignInTwitterBase)
   
  export default SignInTwitter