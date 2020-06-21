import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withFirebase } from '../Firebase';

import { withAuthorization, withEmailVerification } from '../Session';

const SAMPLE_SLIPS = [
  {
    author: 'Player One',
    text: 'Elliot Stabler',
  },
  {
    author: 'Player One',
    text: 'Olivia Benson',
  },
  {
    author: 'Player One',
    text: 'Fin Tutuola',
  },
  {
    author: 'Player One',
    text: 'Donald Cragen',
  },
  {
    author: 'Player One',
    text: 'Elliot Stabler',
  },
  {
    author: 'Player Two',
    text: 'Jimmy McNulty',
  },
  {
    author: 'Player Two',
    text: 'Stringer Bell',
  },
  {
    author: 'Player Two',
    text: 'Avon Barksdale',
  },
  {
    author: 'Player Two',
    text: 'Bunk Moreland',
  },
  {
    author: 'Player Two',
    text: 'Lester Freeman',
  },
  {
    author: 'Player Three',
    text: 'Harry Potter',
  },
  {
    author: 'Player Three',
    text: 'Hermione Granger',
  },
  {
    author: 'Player Three',
    text: 'Luna Lovegood',
  },
  {
    author: 'Player Three',
    text: 'Daphne Greengrass',
  },
  {
    author: 'Player Three',
    text: 'Remus Lupin',
  },
];

class GameRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      guess: '',
      players: ['Player One', 'Player Two', 'Player Three'],
      currentPlayer: 'Player One',
      enoughPlayers: true,
      guess: '',
      guesses: [],
      correctGuess: false,
      paperSlips: SAMPLE_SLIPS,
      enoughSlips: false,
      gameMode: false,
      currentPrompt: {
        author: 'butts',
        text: 'butts'
      }
    };
  }

  toggleEnoughPlayers = () => {
    this.setState({ enoughPlayers: !this.state.enoughPlayers });
  };

  toggleEnoughSlips = () => {
    this.setState({ enoughSlips: !this.state.enoughSlips });
  };

  onChangeText = (event) => {
    this.setState({ text: event.target.value });
  };

  onChangeGuess = (event) => {
    this.setState({ guess: event.target.value });
  };

  onSubmitSlip = (event) => {
    event.preventDefault();

    let slipObj = {
      author: this.state.currentPlayer,
      text: this.state.text,
    };

    this.setState({ paperSlips: [...this.state.paperSlips, slipObj] });

    this.setState({ text: '' });
  };

  
  onSubmitGuess = (event) => {
    event.preventDefault();


    // this.setState({ guess: this.state.guess});

    this.setState({ guess: '' });
  };

  getRandomPlayerForFirstTurn = () => {
    let numPlayers = this.state.players.length;

    let ranPlayer = Math.floor(Math.random() * Math.floor(numPlayers));

    this.setState({ currentPlayer: this.state.players[ranPlayer] });
  };

  getNextPlayer = () => {
    let currentPlayerIndex = this.state.players.indexOf(this.state.currentPlayer)
  
    if ((currentPlayerIndex + 1) === this.state.players.length) {

      this.setState({currentPlayer: this.state.players[0]})
    } else {

      this.setState({currentPlayer: this.state.players[currentPlayerIndex + 1]})
    }
  }

  getPrompt = () => {
    let retrievedSlip = false;
    let numSlips = this.state.paperSlips.length

    while (!retrievedSlip) {
      let slip 

      let ranNum = Math.floor(Math.random() * Math.floor(numSlips))

      if (this.state.paperSlips[ranNum].author !== this.state.currentPlayer) {
        console.log(this.state.currentPlayer)
        console.log(this.state.paperSlips[ranNum])

        console.log(this.state.currentPlayer === this.state.paperSlips[ranNum].author)
        slip = this.state.paperSlips[ranNum]
        let newHat = [...this.state.paperSlips]
        newHat.splice(ranNum, 1)
        this.setState({paperSlips: newHat})
        this.setState({currentPrompt: slip})
        retrievedSlip = true;

      }
    }

  }

  render() {
    const { text, guess } = this.state;

    const isInvalid =
      this.state.paperSlips.length <= this.state.players.length * 5 ||
      this.state.players.length < 3;

    return (
      <div className="GameRoom">
        <h1 className="">You must have 3 players to start the game</h1>
        <div className="">
          current player: {this.state.currentPlayer}
          players:{' '}
          <ul>
            {this.state.players.map((player) => (
              <li>{player}</li>
            ))}
          </ul>
          slips of paper:
          <ul>
            {this.state.paperSlips.map((paperSlip) => (
              <li>
                {paperSlip.text} submitted by {paperSlip.author}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => this.toggleEnoughPlayers()}>
          Toggle Enough Players
        </button>
        <button onClick={() => this.toggleEnoughSlips()}>
          Toggle Enough Slips
        </button>
        <button onClick={() => this.setState({ currentPlayer: 'Player One' })}>
          Be Player One
        </button>
        <button onClick={() => this.setState({ currentPlayer: 'Player Two' })}>
          Be Player Two
        </button>
        <button
          onClick={() => this.setState({ currentPlayer: 'Player Three' })}
        >
          Be Player Three
        </button>
        <button
          onClick={() => this.setState({ gameMode: true })}
          disabled={isInvalid}
        >
          Start Game Mode
        </button>

        <form onSubmit={(event) => this.onSubmitSlip(event)}>
          <input type="text" value={text} onChange={this.onChangeText} />
          <button type="submit">Send</button>
        </form>

        {this.state.gameMode ? (
          <div>
            <button onClick={() => this.getRandomPlayerForFirstTurn()}>
              Get First Player
            </button>
            <button onClick={() => this.getNextPlayer()}>
              Get Next Player
            </button>
            <div>
              {this.state.currentPlayer}'s turn
            </div>
            <button onClick={() => this.getPrompt()}>
              Get Prompt
            </button>
            <div>
              {this.state.currentPrompt.text}
            </div>
            <p>Guess:</p>
            <form onSubmit={(event) => this.onSubmitGuess(event)}>
          <input type="text" value={guess} onChange={this.onChangeGuess} />
          <button type="submit">Send</button>
        </form>
          </div>
        ) : (
          <div>not in game mode</div>
        )}
      </div>
    );
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
)(GameRoom);
