const sendRequestResponse = ({connection, delay}) => (requestId) => (message) => {
  const payload = `${requestId}/${JSON.stringify(message)}`;
  console.log('Sending request response', payload);
  setTimeout(() => {
    connection.send(payload);
  }, delay);
};

const sendPushMessage = ({connection, delay}) => (message) => {
  const payload = JSON.stringify(message);
  console.log('Sending push message', payload);
  setTimeout(() => {
    connection.send(payload);
  }, delay);
};

const websocketInterface = ({delay}) => (connection) => {
  const notify = sendPushMessage({connection, delay});

  const buildRequest = (message) => {
    const match = message.utf8Data.match(/(\d+)\/(.*)/);

    if (!match) {
      throw new Error('Invalid message format');
    }

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
      respond: sendRequestResponse({connection, delay})(requestId),
      message: parsedPayload
    };
  };

  return {
    buildRequest,
    notify
  };
};

module.exports = websocketInterface;
