const sendMessage = ({connection, delay}) => (requestId) => (message) => {
  const payload = `${requestId}/${JSON.stringify(message)}`;
  console.log('Sending payload', payload);
  setTimeout(() => {
    connection.send(payload);
  }, delay);
};

const buildRequest = ({delay}) => (connection) => (message) => {
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

  return {
    respond: sendMessage({connection, delay})(requestId),
    message: parsedPayload
  };
};

module.exports = {buildRequest};
