import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';

import Countdown, {zeroPad} from 'react-countdown';
import { withAuthorization, withEmailVerification  } from '../Session';



import { withFirebase } from '../Firebase';

import ScrollToBottom from 'react-scroll-to-bottom';


const PLAYER_INDEX = [
  'PlayerZero',
  'PlayerOne',
  'PlayerTwo',
  'PlayerThree',
  'PlayerFour',
  'PlayerFive',
  'PlayerSix',
  'PlayerSeven',
  'PlayerEight',
  'PlayerNine',
  'PlayerTen',
  'PlayerEleven',
  'PlayerTwelve',
];

const GameMode = ({
  gameRoomData,
  authUser,
  guessText,
  toggleGameMode,
  slipText,
  submitSlip,
  onChangeSlipText,
  playerSlips,
  removeSlip,
  submitGuess,
  onChangeGuessText,
  submitSlips,
  handleWrong,
  nextTurn,
  resetGame
}) => {
  const { gameMode, creator } = gameRoomData;

  let hasSubmitted = gameRoomData.submittedSlips.includes(authUser.uid)
  let playerListArray = Object.values(gameRoomData.playerList)

  if (gameRoomData.createdAt === '1') {
    return null
  }
  else if (gameMode === 'pregame') {

    return (
      <div className = "GameRoom__gameBox GameRoom__gameBox--pregame">
        <ul className = "GameRoom__gameBox__list GameRoom__gameBox__list--pregame">
          <li className = "GameRoom__gameBox__list__item GameRoom__gameBox__list__item--pregame">You must have at least 3 players to start the game</li>
          <li className = "GameRoom__gameBox__list__item GameRoom__gameBox__list__item--pregame">Only the game creator, {creator.username}, may start the game</li>
        </ul>
        <button
        className = "GameRoom__gameBox__button GameRoom__gameBox__button--pregame"
          disabled={
            authUser.uid !== gameRoomData.creator.uid ||
            playerListArray.length < 4
          }
          onClick={() => toggleGameMode('submission')}
        >
          Start Game
        </button>
        
       
      </div>
    );
  } else if (gameMode === 'submission') {
    return (
      <div className = "GameRoom__gameBox GameRoom__gameBox--submission">
        <ul className = "GameRoom__gameBox__list GameRoom__gameBox__list--submission">
          <li className = "GameRoom__gameBox__list__item GameRoom__gameBox__list__item--submission"> Each player must submit 5 slips each</li>
          <li className = "GameRoom__gameBox__list__item GameRoom__gameBox__list__item--submission">Once all players have, {creator.username} may start the round</li>
          {
        (gameRoomData.creator.uid === authUser.uid) ? 
        <li className = "GameRoom__gameBox__list__item GameRoom__gameBox__list__item--submission">
            <button className = "GameRoom__gameBox__button GameRoom__gameBox__button--submission"

            disabled = {
              gameRoomData.playerSlips.length < ((playerListArray.length - 1) * 5) ||
              playerListArray.length < 4
            }
            onClick = {() => toggleGameMode('game')}
            >Begin Round</button>
            <form 
            className ="GameRoom__gameBox__submissionsBox__submitForm"
            onSubmit={(event) => submitSlips(event)}>
              <button 
              type="submit"
              disabled = {
                playerSlips.length < 5 ||
                hasSubmitted
              }
              >Submit Slips</button>
            </form>
            </li>
            :
            <li className = "GameRoom__gameBox__list__item GameRoom__gameBox__list__item--submission">
            <form 
            className ="GameRoom__gameBox__submissionsBox__submitForm"
            onSubmit={(event) => submitSlips(event)}>
              <button 
              type="submit"
              disabled = {
                playerSlips.length < 5 ||
                hasSubmitted
              }
              >Submit Slips</button>
            </form>
            </li>
              }
        </ul>
        
        {hasSubmitted ? 
        
        <div className ="GameRoom__gameBox--submission__info">
          Awaiting other player's submissions and the round to begin!
          </div>
         : 
        <div className ="GameRoom__gameBox__submissionsBox">
        {
          playerSlips.length  ? 
         (
          <ul className = "GameRoom__gameBox__list GameRoom__gameBox__list--submission-slips">
            {playerSlips.map(slip => 
              <li className = "GameRoom__gameBox__list__item GameRoom__gameBox__list__item--submission-slip" key = {slip}>
                <span className = "GameRoom__gameBox__list__item--submission-slip__slip">{slip}</span>
                <span className="GameRoom__gameBox__button GameRoom__gameBox__button--remove-slip" onClick = {() => removeSlip(slip)}>X</span>
              </li>)}
            </ul>
          )
          :
          <div className = "GameRoom__gameBox__list GameRoom__gameBox__list--submission-slips">
            &nbsp;
            </div>
        }
        <div className="GameRoom__gameBox__submissionsBox__inputBox">
          <form 

           onSubmit={(event) => submitSlip(event)}>
          <input 
          className="GameRoom__gameBox__submissionsBox__inputBox__input"
          type="text" value={slipText} onChange={onChangeSlipText} />
          <button 
          className = "GameRoom__gameBox__button GameRoom__gameBox__button--submit-slip"
          type="submit"
          disabled = {
            playerSlips.length >= 5
          }
          >Submit Slip</button>
        </form>

        </div>
          </div>}
      
      </div>
    );
  } else if (gameMode === 'game') {
    let timer = new Date(gameRoomData.gameState.roundTimeLeft + 300000)

    return (
      <div className = "GameRoom__gameBox GameRoom__gameBox--promptcard">
        <span>
       {gameRoomData.gameState.turnOrder[gameRoomData.gameState.playerTurnIndex].playerName}'s turn!
       </span>
      <Countdown date = {timer} 
      zeroPadTime = {2}
          renderer={props => <div>{props.minutes}:{zeroPad(props.seconds)}</div>}
      onComplete = {() => handleWrong()
    }/>
      {/* 
      conditionally render either the prompt or nothing depending on the turn
      */}
       {
       gameRoomData.gameState.turnOrder[gameRoomData.gameState.playerTurnIndex].playerUid === authUser.uid ?
       <div className = "GameRoom__gameBox__promptGuessInput">
          <form onSubmit={(event) => submitGuess(event)}>
          <input type="text" value={guessText} onChange={onChangeGuessText} />

          <button 
          type="submit"
          
        
          >Make Guess</button>
        </form>
       </div>
       :
       <div className = "GameRoom__gameBox__prompt">
        {gameRoomData.gameState.prompt.text}
       </div>
      }
        <div>
          Guesses:
          <ul className = "GameRoom__gameBox__list GameRoom__gameBox__list--wrong-guesses">
          {gameRoomData.gameState.wrongGuessesMade.map(guess =>
            <li className = "GameRoom__gameBox__list__item GameRoom__gameBox__list__item--wrong-guess" key = {guess}>{guess}</li>)}
          </ul>
        </div>

      
      </div>
    );
  } else if (gameMode === 'wrongguess') {

    return (
      <div className = "GameRoom__gameBox GameRoom__gameBox--wrongguess"> 
       <span className = "GameRoom__gameBox__wrongGuessCard">The answer was: {gameRoomData.gameState.prompt.text} ! </span>
       {
        (gameRoomData.creator.uid === authUser.uid) ? 
            <button className ="GameRoom__gameBox__button GameRoom__gameBox__button--wrongguess"
           
            onClick = {() => nextTurn()}
            >Continue</button> 
            :
              null
              }

      
      </div>
    );
  }else if (gameMode === 'gameover') {

    return (
      <div className = "GameRoom__gameBox GameRoom__gameBox--game-over">
       Scores: 
       <ul>
       {gameRoomData.gameState.turnOrder.filter(player => player.playerName !== "SwoleBot").map(player =>
       <li key = {player.playerUid}>{player.playerName}: {player.score ? player.score : 0}</li>
        )}
        </ul>
       {
        (gameRoomData.creator.uid === authUser.uid) ? 
            <button 
           
            onClick = {() => resetGame()}
            >Play Again</button> 
            :
              null
              }

      
      </div>
    );
  }
  else {
    return (
      <div className = "GameRoom__gameBox">
  
      </div>
    );
  }
};

class SpecificGameInstance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatText: '',
      slipText: '',
      guessText: '',
      loading: true,
      submittedSlips: false,
      playerSlips: [],
    };
    
  }
  componentDidMount() {
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();
      this.playerLeaving();
    });
    console.log("inside component did mount")
    // if (!this.props.gameRoomData) {
    //   this.setState({ loading: true });
    // }


    // .then(
    //   console.log("butts")
    // )
    console.log("calling player list")

    this.checkPlayerList();
    // console.log("calling message listener")

    // this.onListenForMessages();

    console.log("calling listen to game room")


    this.onListenToGameroom();


  
  }



  toggleGameMode = (gameMode) => {
    let currentRoom = this.props.gameRoomData;
    let currentPlayers = Object.values(this.props.gameRoomData.playerList)

    let currentPlayerSlips = this.props.gameRoomData.playerSlips.slice()

    if (gameMode === 'game') {
      
    let firstPrompt = currentPlayerSlips.find(slip => slip.writtenBy === currentPlayers[(currentPlayers.length - 1)].playerUid)

    let newSlips = currentPlayerSlips.filter(slip => slip !== firstPrompt)

      currentRoom = {
        ...currentRoom,
        playerSlips: newSlips,
        gameMode: gameMode,
        gameState: {
          prompt: firstPrompt,
          wrongGuessesMade: [''],
          turnOrder: currentPlayers,
          playerTurnIndex: 1,
          roundTimeLeft: (this.props.firebase.serverValue.TIMESTAMP)

        }
      };
    } else {

    currentRoom = {
      ...currentRoom,
      gameMode: gameMode,
    };
  }
    this.props.firebase.gameroom(this.props.match.params.id).update({
      ...currentRoom,
    });
  };


  checkPlayerList() {
    let playerListRef = this.props.firebase.db.ref(`gamerooms/${this.props.match.params.id}/playerList/${this.props.authUser.uid}`)
    let authUser = this.props.authUser
    let playerListArray = Object.values(this.props.gameRoomData.playerList)

    let playerList = this.props.gameRoomData.playerList
    let numPlayers = 0

    for (let key in playerList) {
      numPlayers++
    }
    console.log(numPlayers)
    console.log(playerListArray.length)
    
    playerListRef.transaction(function(playerOnList) {
      if (playerOnList === null) {
       return {
         colorIndex: numPlayers,
         playerName: authUser.username,
         playerUid: authUser.uid
       }
      } else {
         return
      }
    }, function(error, committed, snapshot) {
      if (error) {
        console.log('transaction failed abnormally!', error);
      } else if (!committed) {
        console.log("Aborted because player list already exists")
      } else {
        console.log('plaeyr list added')
      }

      console.log("snapshot val is: ", snapshot.val())
    }
    )
    

//     this.props.firebase.gameroom(this.props.match.params.id).transaction(room => {
//       console.log("inside transaction")
//       console.log(room)
//       if (room) {
//         let currentPlayerList = room.playerList
//         for (var i in currentPlayerList) {
//           if (currentPlayerList[i].playerUid === this.props.authUser.uid) {
//             containsPlayer = true;
//           }
//         }
//         if (!containsPlayer) {
//           console.log('u aint here dawg');
//         room.playerList.push({
//   playerName: this.props.authUser.username,
//   playerUid: this.props.authuser.uid,
//   colorIndex: ((room.playerList[room.playerList.length -1].colorIndex) + 1 )
// })

// }
// } 
// })

    // try {
    // this.props.firebase
    //   .gameroom(this.props.match.params.id)
    //   .once('value')
    //   .then(snapshot => {
    //     let currentSnap = snapshot.val();
    //     let containsPlayer = false;

    //     for (var i in currentSnap.playerList) {
    //       if (currentSnap.playerList[i].playerUid === this.props.authUser.uid) {
    //         containsPlayer = true;
    //       }
    //     }

    //     if (!containsPlayer) {
    //       console.log('u aint here dawg');
    //       currentSnap.playerList.push({
    //         playerName: this.props.authUser.username,
    //         playerUid: this.props.authUser.uid,
    //         colorIndex: ((currentSnap.playerList[currentSnap.playerList.length -1].colorIndex) + 1 )
    //       });

    //       this.props.firebase.gameroom(this.props.match.params.id).update({
    //         ...currentSnap,
    //       });
    //     }
    //   })
    // } catch (err) {
    //   console.log(err)
    // }
    
  }


  // onListenForMessages = () => {
  //   try {
  //   this.props.firebase
  //     .gameroom(this.props.match.params.id)
  //     .child('messages')
  //     .on('value', (snapshot) => {
  //       if (snapshot.val()) {
  //         this.props.onSetMessages(snapshot.val());
  //       } else {
  //         console.log("danger will robisnon")
  //       }
  //       });
  
  //     } catch(err) {
  //       console.log(err)
  //     }
  // };

  onListenToGameroom = () => {
    try {
    this.props.firebase
    
      .gamerooms()
      .child(this.props.match.params.id)
      .on('value', (snapshot) => {
        if (snapshot.val()) {
        this.props.onSetGameroom(snapshot.val());
        // this.props.onSetMessages(snapshot.val().messages);
      //   if (snapshot.val().messages) {
      //   this.props.onSetMessages(snapshot.val().messages)
      // } else {
      //   this.props.onSetMessages([{
      //     createdAt: "1",
      //     text: "Welcome to the game room!",
      //     userId: "1",
      //     userName: "SwoleBot"
      //   }])
      // }
        this.setState({loading: false})
      } else {
        console.log("danger will robisnon")
      }
      });

    } catch(err) {
      console.log(err)
    }

   
  }

  playerLeaving() {

    if (this.props.gameRoomData.createdAt !== '1') {
      if (this.props.gameRoomData.playerList[`${this.props.authUser.uid}`]){
        console.log('yea bitch')
      }
      let playerListRef = this.props.firebase.db.ref(`gamerooms/${this.props.match.params.id}/playerList/${this.props.authUser.uid}`)
       playerListRef.transaction(function(playerOnList) {
      if (playerOnList === null) {
       return 
      } else {
         return {

         }
      }
    }, function(error, committed, snapshot) {
      if (error) {
        console.log('transaction failed abnormally!', error);
      } else if (!committed) {
        console.log("Aborted remove because player isnt there")
      } else {
        console.log('player removed')
      }

    }
    )
    }
  //   if (this.props.gameRoomData.createdAt !== '1'){
  //   let currentPlayerList = this.props.gameRoomData.playerList;
  //   const filteredPlayers = currentPlayerList.filter(
  //     (player) => player.playerUid !== this.props.authUser.uid
  //   );

  //   console.log(filteredPlayers);

  //   // let x = {
  //   //   ...this.props.gameRoomData,
  //   //   playerList: filteredPlayers
  //   // }

  //   // console.log(x)
  //   let currentRoom = this.props.gameRoomData;
  //     console.log(currentRoom)
  //   currentRoom = {
  //     ...currentRoom,
  //     playerList: filteredPlayers,
  //   };
  //   this.props.firebase.gameroom(this.props.match.params.id).update({
  //     ...currentRoom,
  //   });
  // } else {
  //   console.log("hasn't returned yet")
  // }
  }

  onChangeText = (event) => {
    this.setState({ chatText: event.target.value });
  };
  onChangeSlipText = (event) => {
    this.setState({ slipText: event.target.value });
  };
  onChangeGuessText = (event) => {
    this.setState({ guessText: event.target.value });
  };

  handleWrong = () => {
    let currentRoom = this.props.gameRoomData
    // let currentRoomState = this.props.gameRoomData.gameState
    // let currentPlayerIndex = this.props.gameRoomData.gameState.playerTurnIndex
    // let gamePlayers = this.props.gameRoomData.gameState.turnOrder.slice() 

  
    // let nextPlayerIndex

    // let currentSlips = []
    // if (this.props.gameRoomData.playerSlips) 
    //  { currentSlips = this.props.gameRoomData.playerSlips.slice()}

    // if ((currentPlayerIndex + 1) === gamePlayers.length) {
    //   nextPlayerIndex = 1
    // } else {
    //   nextPlayerIndex = currentPlayerIndex + 1
    // }

    // let nextPrompt = currentSlips.find(slip => slip.writtenBy === gamePlayers[currentPlayerIndex].playerUid)

    // if (!nextPrompt) {
    //   currentRoomState = {
    //     ...currentRoomState,
    //     wrongGuessesMade: [''],
    //     turnOrder: gamePlayers,
    //     prompt: '',
    //     playerTurnIndex: nextPlayerIndex,
    //     roundTimeLeft: this.props.firebase.serverValue.TIMESTAMP
    //   }
    //   currentRoom = {
    //     ...currentRoom,
    //     gameMode: "gameover",
    //     gameState: currentRoomState
    //   }
    // }else {
    //   let newSlips = currentSlips.filter(slip => slip !== nextPrompt)

    //   currentRoom = {
    //     ...currentRoom,
    //     playerSlips: newSlips
    //   }

    //   currentRoomState = {
    //     ...currentRoomState,
    //     wrongGuessesMade: [''],
    //             prompt: nextPrompt,
    //     playerTurnIndex: nextPlayerIndex,
    //     roundTimeLeft: this.props.firebase.serverValue.TIMESTAMP
    //   }
    // }

    

    currentRoom = {
      ...currentRoom,
      gameMode: "wrongguess"
    }
    this.props.firebase.gameroom(this.props.match.params.id).update({
      ...currentRoom
    });
    this.setState({guessText: ''})

    

  }

  nextTurn = () => {
    let currentRoom = this.props.gameRoomData
    let currentRoomState = this.props.gameRoomData.gameState
    let currentPlayerIndex = this.props.gameRoomData.gameState.playerTurnIndex
    let gamePlayers = this.props.gameRoomData.gameState.turnOrder.slice() 

  
    let nextPlayerIndex

    let currentSlips = []
    if (this.props.gameRoomData.playerSlips) 
     { currentSlips = this.props.gameRoomData.playerSlips.slice()}

    if ((currentPlayerIndex + 1) === gamePlayers.length) {
      nextPlayerIndex = 1
    } else {
      nextPlayerIndex = currentPlayerIndex + 1
    }

    let nextPrompt = currentSlips.find(slip => slip.writtenBy === gamePlayers[currentPlayerIndex].playerUid)

    if (!nextPrompt) {
      currentRoomState = {
        ...currentRoomState,
        wrongGuessesMade: [''],
        turnOrder: gamePlayers,
        prompt: '',
        playerTurnIndex: nextPlayerIndex,
        roundTimeLeft: this.props.firebase.serverValue.TIMESTAMP
      }
      currentRoom = {
        ...currentRoom,
        gameMode: "gameover",
        gameState: currentRoomState
      }
    }else {
      let newSlips = currentSlips.filter(slip => slip !== nextPrompt)

      currentRoom = {
        ...currentRoom,
        gameMode: "game",
        playerSlips: newSlips
      }

      currentRoomState = {
        ...currentRoomState,
        wrongGuessesMade: [''],
        prompt: nextPrompt,
        playerTurnIndex: nextPlayerIndex,
        roundTimeLeft: this.props.firebase.serverValue.TIMESTAMP
      }
    }

    

    currentRoom = {
      ...currentRoom,
      gameState: currentRoomState
    }
    this.props.firebase.gameroom(this.props.match.params.id).update({
      ...currentRoom
    });
    this.setState({guessText: ''})
  }

  submitGuess = (event) => {
    event.preventDefault();

    let currentRoom = this.props.gameRoomData
    let currentRoomState = this.props.gameRoomData.gameState
    let currentGuesses = this.props.gameRoomData.gameState.wrongGuessesMade.slice()
    let gamePlayers = this.props.gameRoomData.gameState.turnOrder.slice() 
    let currentPlayerIndex = this.props.gameRoomData.gameState.playerTurnIndex

    let currentSlips = []
    if (this.props.gameRoomData.playerSlips) 
     { currentSlips = this.props.gameRoomData.playerSlips.slice()}
  


    if (currentGuesses[0] === '') {
      currentGuesses = []
    }

    if(this.props.gameRoomData.gameState.prompt.text.toUpperCase() !== this.state.guessText.toUpperCase()) {
      currentGuesses.push(this.state.guessText)
      currentRoomState = {
        ...currentRoomState,
        wrongGuessesMade: [...currentGuesses]
      }
    } else {
      let nextPlayerIndex

      if (gamePlayers[currentPlayerIndex].score){
        gamePlayers[currentPlayerIndex].score += 1
      } else {
        gamePlayers[currentPlayerIndex].score = 1
      }

      if ((currentPlayerIndex + 1) === gamePlayers.length) {
        nextPlayerIndex = 1
      } else {
        nextPlayerIndex = currentPlayerIndex + 1
      }
      currentRoomState = {
        ...currentRoomState,
        wrongGuessesMade: ['']
      }

      let nextPrompt = currentSlips.find(slip => slip.writtenBy === gamePlayers[currentPlayerIndex].playerUid)


      if (!nextPrompt) {
        currentRoomState = {
          ...currentRoomState,
          wrongGuessesMade: [''],
          turnOrder: gamePlayers,
          prompt: '',
          playerTurnIndex: nextPlayerIndex,
          roundTimeLeft: this.props.firebase.serverValue.TIMESTAMP
        }
        currentRoom = {
          ...currentRoom,
          gameMode: "gameover",
          gameState: currentRoomState
        }
      }

      else {
        let newSlips = currentSlips.filter(slip => slip !== nextPrompt)

        currentRoom = {
          ...currentRoom,
          playerSlips: newSlips
        }
  
        currentRoomState = {
          ...currentRoomState,
          wrongGuessesMade: [''],
          turnOrder: gamePlayers,
          prompt: nextPrompt,
          playerTurnIndex: nextPlayerIndex,
          roundTimeLeft: this.props.firebase.serverValue.TIMESTAMP
        }
      }
   
    }

        this.setState({guessText: ''})


    this.props.firebase.gameroom(this.props.match.params.id).update({
      ...currentRoom,
      gameState: currentRoomState
    });
    


  };
  submitSlip = (event) => {
    event.preventDefault();

    let currentSlips = this.state.playerSlips;

    let slip = this.state.slipText.trim()
    
    currentSlips.push(slip);
    this.setState({ slipText: '' });
    this.setState({ playerSlips: currentSlips });
  };

  submitSlips = (event) => {
    event.preventDefault();

    let currentSlips = this.state.playerSlips;
    let slipObjs = []

    currentSlips.forEach(slip => {
      slipObjs.push({


        writtenBy: this.props.authUser.uid,
        text: slip
      })
    })
    let allSlips = this.props.gameRoomData.playerSlips
    
    if (allSlips.length === 1) {
      allSlips = slipObjs
    } else {
      allSlips = [
        ...allSlips,
        ...slipObjs
       ]
    }
    let currentRoom = this.props.gameRoomData;

    let submissions = this.props.gameRoomData.submittedSlips.slice()
    let playerHasSubmitted = submissions.includes(this.props.authUser.uid)

    if (!playerHasSubmitted) {
      submissions.push(this.props.authUser.uid)
    }

    this.props.firebase.gameroom(this.props.match.params.id).update({
      ...currentRoom,
      playerSlips: allSlips,
      submittedSlips: submissions,
    });
    
    this.setState({ submittedSlips: true})
  };

  onCreateMessage = (event, authUser) => {
    event.preventDefault();

    let currentMessages = this.props.gameRoomData.messages || [];
    let currentRoom = this.props.gameRoomData;

    // console.log(currentMessages)
    currentMessages.push({
      text: this.state.chatText,
      userId: authUser.uid,
      userName: authUser.username,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    console.log(currentMessages);

    this.props.firebase.gameroom(this.props.match.params.id).update({
      ...currentRoom,
      messages: currentMessages,
    });

    this.setState({ chatText: '' });
  };

  // onEditMessage = (message, text) => {
  //   // this.props.firebase.message(message.uid).set({
  //   //   ...message,
  //   //   text,
  //   //   editedAt: this.props.firebase.serverValue.TIMESTAMP,
  //   // });
  //   console.log('edit the message bihh');
  // };

  // onRemoveMessage = (uid) => {
  //   // this.props.firebase
  //   //   .gameroom(this.props.match.params.id)
  //   //   .child('messages')
  //   //   .remove(uid);
  //   console.log('remove the message bihh');
  // };

  removeSlip = (slip) => {
    let filteredSlips = this.state.playerSlips.filter(s => s !== slip)
    this.setState({playerSlips: filteredSlips})
  }

  componentWillUnmount() {
       this.playerLeaving()

    this.props.firebase.gameroom().child(this.props.match.params.id).off();
    this.props.firebase
    .gameroom(this.props.match.params.id)
    .child('messages')
    .off()

  }

  resetGame = () => {

    this.props.firebase.gameroom(this.props.match.params.id).update({
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
      creator: this.props.authUser,
      playerList: this.props.gameRoomData.playerList,
    enoughPlayers: false,
    enoughSlips: false,
    correctGuess: false,
    gameMode: "pregame",
    currentPlayer: this.props.authUser.uid,
    roomName: this.props.gameRoomData.roomName,
    playerSlips: [
      {
        writtenBy: "SwoleBot",
        text: ''
      }
    ],
    submittedSlips: ["1"],
    gameState: {}


    })
  }

  consoleGame() {
    console.log(this.props.gameRoomData)
  }

  returnNum(id) {
    let playerListArray = Object.values(this.props.gameRoomData.playerList)
    let playerObj = playerListArray.find(player => player.playerUid === id)

    let indexOfPlayer = playerListArray.indexOf(playerObj)

        
      return PLAYER_INDEX[indexOfPlayer + 1]
  }
  render() {
    const { gameRoomData, authUser } = this.props;
    const { loading, chatText } = this.state;

    // if (!loading && (gameRoomData.createdAt !== '1')) {
    // return (
    //   <div>after return?</div>
    // )} else {
    //   return (
    //     <div>before</div>
    //   )
    // }

    let playerListArray = []

    if(!loading) {
      playerListArray = Object.values(gameRoomData.playerList)
    return (
      <div className = "GameRoom">     
          <GameMode
          guessText = {this.state.guessText}
            gameRoomData={gameRoomData}
            authUser={authUser}
            startGame={this.startGame}
            toggleGameMode={this.toggleGameMode}
            slipText={this.state.slipText}
            submitSlip={this.submitSlip}
            onChangeSlipText={this.onChangeSlipText}
            playerSlips={this.state.playerSlips}
            removeSlip = {this.removeSlip}
            submitSlips = {this.submitSlips}
            submitGuess = {this.submitGuess}
            onChangeGuessText = {this.onChangeGuessText}
            handleWrong = {this.handleWrong}
            nextTurn = {this.nextTurn}
            resetGame = {this.resetGame}
          />

        <div className = "GameRoom__lobbyBox">


        <div className = "GameRoom__lobbyBox__title">
          <h4>In Lobby</h4>
          <Link to = {`/games/${this.props.match.params.id}`}>{gameRoomData.roomName}</Link>
          </div>


          
          <ul className = "GameRoom__lobbyBox__playerList__list">
            {playerListArray
              .filter((player) => player.playerName !== 'SwoleBot')
              .map((player, index) => (
                <li className = {`GameRoom__lobbyBox__playerList__list__item ${this.returnNum(player.playerUid)}`} key={player.playerUid}>{player.playerName}</li>
              ))}
          </ul>

        </div>

        <ScrollToBottom className = "GameRoom__chatBox">

    {gameRoomData.messages.map((message, indexOf)  => (
     
     <span key = {indexOf} className = "Message">
            <span className = {`${this.returnNum(message.userId)}`}>
            <strong>{message.userName}</strong>
            </span> {message.text}{' '}
            {message.editedAt && <span>(Edited)</span>}
          </span>
    ))}

  </ScrollToBottom>
{/* {gameRoomData.messages ? 

        <div className = "GameRoom__chatBox">
      <MessageList
        isGameRoom={true}
        playerList = {playerListArray}
        messages={gameRoomData.messages}
      />
      </div>
      :
      <div>loading chat...</div>
      }   */}
        <form className = "GameRoom__chatInput"
          onSubmit={(event) => this.onCreateMessage(event, this.props.authUser)}
        >
          <input className = "GameRoom__chatInput__input"type="text" value={chatText} onChange={this.onChangeText} />
          <button className = "GameRoom__chatInput__button"type="submit">Send</button>
        </form>
      </div>
    )
  } else {
    return <div>
      loading...
    </div>
  }
}
}

const mapStateToProps = (state, props) => ({
  authUser: state.sessionState.authUser,
  // messages: Object.keys(state.messageState.messages || {}).map((key) => ({
  //   ...state.messageState.messages[key],
  //   uid: key,
  // })),
  gameRoomData: (state.gameRoomState.gameroom),
});

const mapDispatchToProps = (dispatch) => ({
  onSetGameroom: (gameroom) =>
    dispatch({ type: 'GAMEROOM_SET', gameroom}),
  // onSetMessages: (messages) => dispatch({ type: 'MESSAGES_SET', messages }),
  // onSetMessagesLimit: (limit) =>
  //   dispatch({ type: 'MESSAGES_LIMIT_SET', limit }),
});

const condition = authUser => !!authUser

export default compose(
  withEmailVerification,
  withAuthorization(condition),
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(SpecificGameInstance);
