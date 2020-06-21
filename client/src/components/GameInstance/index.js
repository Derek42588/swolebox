import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';

import { withAuthorization, withEmailVerification } from '../Session';

class GameInstance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      butts: ''
      }
    };


    componentDidMount() {

    }
    
    render () {
        return (
            <h1>butts</h1>
        )
    }
  }


const condition = (authUser) => !!authUser;
//checks that authUser is not null

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

export default compose(
  withEmailVerification,
  withAuthorization(condition),
  withFirebase,
  connect(mapStateToProps)
)(GameInstance);
