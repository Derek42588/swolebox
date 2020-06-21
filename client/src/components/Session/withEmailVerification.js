import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';

const needsEmailVerification = (authUser) =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map((provider) => provider.providerId)
    .includes('password');

const withEmailVerification = (Component) => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .handleSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return needsEmailVerification(this.props.authUser) ? (
        <div>
          {this.state.isSent ? (
            <p>
              e-mail confirmation sent: Check your e-mails (spam folder as well)
              for a confirmation e-mail. Refresh this page once you confirmed
              your e-mail.
            </p>
          ) : (
            <p>
              Verify your e-mail: Check you e-mails (Spam folder included) for a
              confirmation e-mail or send another confirmation e-mail.
            </p>
          )}

          <button
            type="button"
            onClick={this.onSendEmailVerification}
            disabled={this.state.isSent}
          >
            Send confirmation e-mail
          </button>
        </div>
      ) : (
        <Component {...this.props} />
      );
    }
  }
  const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
  });

  return compose(withFirebase, connect(mapStateToProps))(WithEmailVerification);
};

export default withEmailVerification;
