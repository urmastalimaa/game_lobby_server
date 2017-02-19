const handleNewConnection = (connection) => {

};

const handleConnectionClose = (connection) => {

};

const sendMessage = (connection) => (requestId) => (message) => {
  const payload = `${requestId}/${JSON.stringify(message)}`;
  console.log('Sending payload', payload);
  connection.send(payload);
};

const handleRequest = ({respond, message}) => {
  respond({error: 'unknown_message'});
};

const handleMessage = (connection) => (message) => {
  const match = message.utf8Data.match(/(\d+)\/(.*)/);

  const requestId = match[1];
  const payload = match[2];

  let parsedPayload;
  try {
    parsedPayload = JSON.parse(payload);
    console.log('Received message', parsedPayload);
  } catch (error) {
    console.error('Error parsing websocket message', error, payload);
    return;
  }

  handleRequest({
    respond: sendMessage(connection)(requestId),
    message: parsedPayload
  });
};

module.exports = {
  handleNewConnection: handleNewConnection,
  handleConnectionClose: handleConnectionClose,
  handleMessage: handleMessage
};
