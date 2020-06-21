import React, {useEffect, useRef} from 'react';

import MessageItem from './MessageItem';

const MessageList = ({
  authUser,
  messages,
  isGameRoom,
  onEditMessage,
  onRemoveMessage,
  playerList,
  roomId
}) => {

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

return (
  // <ul className = {`${isGameRoom ? 'GameRoom__chatBox' : ''}`}>
  <ul>
    {messages.map((message, indexOf)  => (
      <MessageItem
      key = {indexOf}  
      indexOf = {indexOf}
      playerList = {playerList}
      isGameRoom = {isGameRoom}
        message={message}
      />
    ))}
<div ref={messagesEndRef} />

  </ul>
);
}
export default MessageList;