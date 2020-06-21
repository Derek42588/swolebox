import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { PasswordForgetLink } from '../PasswordForget';

import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import SignInGoogle from './SignInSocials/SignInGoogle';
import SignInFacebook from './SignInSocials/SignInFacebook';
import SignInTwitter from './SignInSocials/SignInTwitter';
import SignInGithub from './SignInSocials/SignInGithub';

const SignInPage = () => (
  <div className="SignInPage">
    <h1 className="SignInPage__title">Sign In</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />

    <SignInGoogle />
    <SignInFacebook />
    <SignInTwitter />
    <SignInGithub />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email, password } = this.state;

    this.props.firebase
      .handleSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.GAME_INSTANCE);
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form className="SignInPage__form" onSubmit={this.onSubmit}>
        <input
          className="SignInPage__input"
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          className="SignInPage__input"
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <button
          className="CustomButton CustomButton--SignInPage"
          disabled={isInvalid}
          type="submit"
        >
          Sign In
        </button>

        {error && <p className="SignInPage__error-blurb">{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignInPage;

export { SignInForm };
