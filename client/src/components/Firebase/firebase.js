import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const prodConfig = {
  apiKey: process.env.REACT_APP_PROD_API_KEY,
  authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_PROD_DATABASE_URL,
  projectId: process.env.REACT_APP_PROD_PROJECT_ID,
  storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID,
  firebaseId: process.env.REACT_APP_PROD_ID,
  measurementId: process.env.REACT_APP_PROD_MEASUREMENT_ID,
  emailRedirect: process.env.REACT_APP_PROD_CONFIRMATION_EMAIL_REDIRECT,
};

const devConfig = {
  apiKey: process.env.REACT_APP_DEV_API_KEY,
  authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
  projectId: process.env.REACT_APP_DEV_PROJECT_ID,
  storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
  firebaseId: process.env.REACT_APP_DEV_ID,
  measurementId: process.env.REACT_APP_DEV_MEASUREMENT_ID,
  emailRedirect: process.env.REACT_APP_DEV_CONFIRMATION_EMAIL_REDIRECT,
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
    this.googleProvider = new app.auth.GoogleAuthProvider().setCustomParameters(
      { prompt: 'select_account' }
    );
    this.facebookProvider = new app.auth.FacebookAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
    this.githubProvider = new app.auth.GithubAuthProvider();
    this.emailAuthProvider = app.auth.EmailAuthProvider;
    this.serverValue = app.database.ServerValue;
  }

  handleCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  handleSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  handleSignOut = () => this.auth.signOut();

  handlePasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  handlePasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  handleUsernameUpdate = (newName) => {
    console.log('yo?');
    let user = this.auth.currentUser;
    user = {
      ...user,
      displayName: newName,
    };
    this.auth.currentUser.updateProfile({
      ...user,
    });
  };

  user = (uid) => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');

  handleSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  handleSignInWithFacebook = () =>
    this.auth.signInWithPopup(this.facebookProvider);

  handleSignInWithGithub = () => this.auth.signInWithPopup(this.githubProvider);

  handleSignInWithTwitter = () =>
    this.auth.signInWithPopup(this.twitterProvider);

  handleSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: config.emailRedirect,
    });

  // *** Message API ***

  message = (uid) => this.db.ref(`messages/${uid}`);

  messages = () => this.db.ref('messages');

  // ***Game Instance API ***
  gameroom = (uid) => this.db.ref(`gamerooms/${uid}`);

  gamerooms = () => this.db.ref('gamerooms');

  // onJoinGame = (user, gameroom) => {
  //   // let gameroom = this.auth
  //   let ref = this.db.ref("/gamerooms")
  //   let gameRef = ref.child(gameroom)

  //   this.db.ref("gamerooms").child(gameroom).set({

  //   })

  //   console.log(gameRef.child(gameroom))
  //   console.log("in game")
  //   console.log("current user: ", user)
  // }

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then((snapshot) => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });
}

export default Firebase;
