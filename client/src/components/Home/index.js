import React from 'react'
import { compose } from 'recompose';
import Messages from '../Messages'

import { withAuthorization, withEmailVerification  } from '../Session';

const HomePage = () => (
    <div className = "Homepage">
        The home page is accessible when you are signed in.
        
        <Messages />
    </div>
)

const condition = authUser => !!authUser
//checks that authUser is not null

 
export default compose(
    withEmailVerification,
    withAuthorization(condition),
  )(HomePage);