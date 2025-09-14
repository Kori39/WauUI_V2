import { getUserId, sendMessage } from '../components/WebSocket/web-socket-manager';

/**
 * Send a directional action (used for D-pad)
 * @param {string} id - the user ID of the player
 * @param {string} direction - e.g. "Left", "Right"
 * @param {string} phase - "down" or "up"
 */
export const sendDirectionalAction = (direction, phase) => {
  const id = getUserId();
  const actionMessage = {
    type: 'action',
    id,
    action: `${direction}_${phase}`, // e.g., "Left_down"
  };
  console.log('Sending directional:', actionMessage);
  sendMessage(JSON.stringify(actionMessage));
};

export const sendDisconnectAction = () => {
  const id = getUserId();
  const disconnectMessage = {
    type: 'disconnect',
    id,
  };
  console.log('Sending disconnect action:', disconnectMessage);
  sendMessage(JSON.stringify(disconnectMessage));
};

export const sendCollisionRequest = () => {
  const id = getUserId();
  const message = {
    type: 'collision',
    id,
  }
  console.log('Requesting collision data:', message);
  sendMessage(JSON.stringify(message));
}

/**
 * Send a custom action (e.g., "launch_wau") with optional wauDesign info
 * @param {object} wauDesign - optional, e.g. { shape: 'wauShape_A', pattern: 'patternA1', color1: 'red', color2: 'red' }
 */
export const sendCustomAction = (action, wauDesign = null) => {
  const id = getUserId();
  const message = {
    type: action,
    id,
    wauDesign,
  };

  console.log(wauDesign);

  if (wauDesign) {
    // You can format the wauDesign string however you want, or send as object
    message.wauDesign = wauDesign;
  }

  console.log('Sending custom action:', message);
  sendMessage(JSON.stringify(message));
};
