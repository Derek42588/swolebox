import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.message.text,
    };
  }

  // onToggleEditMode = () => {
  //   this.setState((state) => ({
  //     editMode: !state.editMode,
  //     editText: this.props.message.text,
  //   }));
  // };

  // onChangeEditText = (event) => {
  //   this.setState({ editText: event.target.value });
  // };

  // onSaveEditText = () => {
  //   this.props.onEditMessage(this.props.message, this.state.editText);

  //   this.setState({ editMode: false });
  // };

  render() {
    const {
      message,
      isGameRoom,
      playerList,
      indexOf
    } = this.props;
    const { editMode, editText } = this.state;

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

    let playerColor = 'PlayerZero';

    if (isGameRoom) {
      if (playerList) {
        let playerIndex = 0;
        let player = playerList.find(
          (p) => p.playerUid === message.userId
        );
        if (player) {
          playerIndex = player.colorIndex;
          if (player.colorIndex > 13) {
            playerIndex -= 12;
          }
          playerColor = PLAYER_INDEX[playerIndex]
          
        }
      }
    }

    return (
      <li key = {indexOf}>
          <span className = "Message">
            <span className = {`${isGameRoom ? `${playerColor}` : ''}`}>
            <strong>{message.userName}</strong>
            </span> {message.text}{' '}
            {message.editedAt && <span>(Edited)</span>}
          </span>

      </li>
    );
  }
}
const mapStateToProps = (state, props) => ({
  gameRoomData: (state.gameRoomState.gameroom)
});

export default compose(connect(mapStateToProps))(MessageItem);
