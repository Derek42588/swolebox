import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';

const GAME_ROOM_BASES = [
  'jimmy-mcnulty',
  'stringer-bell',
  'avon-barksdale',
  'bunk-moreland',
  'lester-freeman',
  'bubbles',
  'poot',
  'william-rawls',
  'cedric-daniels',
  'bodie',
  'omar-little',
  'rhonda-pearlman',
  'kima-greggs',
  'nicky-sobotka',
];

class GenerateGameInstance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      gameRoomLink: '',
    };
  }

  createGameRoom = async () => {
    let ranNum = Math.floor(100000 + Math.random() * 900000);

    let roomName =
      this.props.authUser.username.split(' ').join('-') + '-' + ranNum;
    console.log(roomName);
    let gameroom = await this.props.firebase.gamerooms().push({
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
      creator: this.props.authUser,
      playerList: {
        1:{
          playerName: 'SwoleBot',
          playerUid: '1',
          colorIndex: 0,
        }}
      ,
      messages: [{
            createdAt: "1",
            text: "Welcome to the game room!",
            userId: "1",
            userName: "SwoleBot"
          }],
      gameMode: 'pregame',
      roomName: roomName,
      playerSlips: [
        {
          writtenBy: 'SwoleBot',
          text: '',
        },
      ],
      submittedSlips: ['1'],
    });

    this.setState({ gameRoomLink: gameroom });
  };

  componentDidMount() {
    if (!this.props.gameRoomList.length) {
      this.setState({ loading: true });
    }

    this.onListenForGameRooms();
  }

  onListenForGameRooms = () => {
    this.props.firebase
      .gamerooms()
      .orderByChild('createdAt')
      .on('value', (snapshot) => {
        this.props.onSetGamerooms(snapshot.val());

        this.setState({ loading: false });
      });
  };

  onListenForPlayers = () => {
    this.props.firebase
      .gameroom('-M9sn2RYLQbiIrl7J_pj')
      .orderByChild('createdAt')
      .on('value', (snapshot) => {
        this.props.onSetGamerooms(snapshot.val());

        this.setState({ loading: false });
      });
  };

  render() {
    const { loading } = this.state;
    const { gameRoomList } = this.props;

    let filteredRooms
    if (gameRoomList) {
      filteredRooms = gameRoomList.filter(r => r.roomName !=='roomy')
    }
    return (
      <div className="GamesPage">
        <button className="CustomButton" onClick={() => this.createGameRoom()}>
          Create a game room
        </button>
        {/* <button onClick = {() => this.generateRoomName()}>get a room name my dawg</button> */}

        <div className = "GamesPage__main">
          <h3 className = "GamesPage__main__title">Open Games</h3>
          {loading && <div>Loading ...</div>}

          <ul className = "GamesPage__main__list">
            {/* {(filteredRooms.length > 1) ? */}
              {filteredRooms.map((gameRoom) => (
                <li className = "GamesPage__main__list__item" key={gameRoom.uid}>
                  <a className = "GamesPage__main__list__item__link"
                    href={`/games/${gameRoom.uid}`}
                  >{`${gameRoom.roomName}`}</a>
                  <button className = "CustomButton" onClick ={() => {navigator.clipboard.writeText(`https://swolebox-e2710.web.app/games/${gameRoom.uid}`)}} >Copy Link</button>
                </li>
              ))
              }
            {/* // :
            // null
            // } */}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  gameRoomList: Object.keys(state.gameRoomState.gamerooms || {}).map((key) => ({
    ...state.gameRoomState.gamerooms[key],
    uid: key,
  })),
  limit: state.messageState.limit,
});

const mapDispatchToProps = (dispatch) => ({
  onSetGamerooms: (gamerooms) => dispatch({ type: 'GAMEROOMS_SET', gamerooms }),
});


export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(GenerateGameInstance);
