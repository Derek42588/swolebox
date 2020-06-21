import React from 'react';
 
import { withFirebase } from '../Firebase';
 
const SignOutButton = ({ firebase, isShelfButton, doToggleShelf }) => (
  isShelfButton ? 
    <div 
    className='ShelfSignOutButton'
    onClick={() => {
      doToggleShelf()
      firebase.handleSignOut()
      }}>
      Sign Out
    </div>
    :
    <div 
  className='SignOutButton'
  onClick={() => {
    firebase.handleSignOut()
    }}>
    Sign Out
  </div>
  
);
 
export default withFirebase(SignOutButton);