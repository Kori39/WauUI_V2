// import { useRouter } from "expo-router";
// import { sendDisconnectAction } from "../../utils/sendActionMsg";
// let ws;
// let userId = null;
// let playerCollision = null;
// let birdCollision = null
// export const getUserId = () => userId;
 
// export const connectWebSocket = (onMessageCallback) => {
//   const router = useRouter();
//   ws = new WebSocket('ws://10.150.31.76:8080');
//   //rmb to change to your local IP address
 
//   ws.onopen = () => {
//     console.log('Connected to server');
//       ws.send(JSON.stringify({
//     type: 'join',
//     role: 'player'
//   }));
//   };
 
//   ws.onmessage = (e) => {
//     const data = JSON.parse(e.data);
//   if (data.type === 'assign_id') {
//     userId = data.id;
//     console.log('Assigned player ID:', userId);}
 
//   else if (data.type === 'collision_data') {
//     playerCollision = data.playerCollisions,
//     birdCollision = data.birdCollisions
//         router.push({
//           pathname: '/ThankYou',
//           params: {
//           playerCollision: JSON.stringify(playerCollision),
//           birdCollision: JSON.stringify(birdCollision),
//       },
//     });
//     console.log('Received collision data:', playerCollision, birdCollision);
 
//     sendDisconnectAction();
//   }
//     // console.log('Message from server:', e.data);
//     onMessageCallback && onMessageCallback(e.data);
//   };
 
//   ws.onerror = (e) => {
//     console.error('WebSocket error:', e.message);
//   };
 
//   ws.onclose = (e) => {
//     console.log('WebSocket closed:', e.code, e.reason);
//   };
// };
 
// export const sendMessage = (message) => {
//   if (ws && ws.readyState === WebSocket.OPEN) {
//     ws.send(message);
//   } else {
//     console.warn('WebSocket not connected');
//   }
// };
 
 
// export const disconnectWebSocket = () => {
//   if (ws) ws.close();
// };
 
 
// components/WebSocket/web-socket-manager.js

// let ws;
// let userId = null;

// let playerCollision = null;
// let birdCollision = null;

// export const getUserId = () => userId;

// export const connectWebSocket = (router, onMessageCallback) => {
//   ws = new WebSocket("ws://10.150.31.76:8080");

//   ws.onopen = () => {
//     console.log("Connected to server");
//     ws.send(JSON.stringify({ type: "join", role: "player" }));
//   };

//   ws.onmessage = (e) => {
//     const data = JSON.parse(e.data);

//     if (data.type === "assign_id") {
//       userId = data.id;
//       console.log("Assigned player ID:", userId);

//     } else if (data.type === "collision_data") {
//       playerCollision = data.playerCollisions;
//       birdCollision = data.birdCollisions;

//       // ✅ router comes from component
//       router.push({
//         pathname: "/ThankYou",
//         params: {
//           playerCollision: JSON.stringify(playerCollision),
//           birdCollision: JSON.stringify(birdCollision),
//         },
//       });

//       console.log("Received collision data:", playerCollision, birdCollision);
//     }

//     onMessageCallback && onMessageCallback(e.data);
//   };

//   ws.onerror = (e) => {
//     console.error("WebSocket error:", e.message);
//   };

//   ws.onclose = (e) => {
//     console.log("WebSocket closed:", e.code, e.reason);
//   };
// };

// export const sendMessage = (message) => {
//   if (ws && ws.readyState === WebSocket.OPEN) {
//     ws.send(message);
//   } else {
//     console.warn("WebSocket not connected");
//   }
// };

// export const disconnectWebSocket = () => {
//   if (ws) ws.close();
// };

import { router } from "expo-router";

let ws;
let userId = null;

// message queue for sends before connection is ready
let messageQueue = [];

export const getUserId = () => userId;

// internal safe send
const safeSend = (message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  } else {
    console.warn("WebSocket not ready, queueing message");
    messageQueue.push(message);
  }
};

export const connectWebSocket = (onMessageCallback) => {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    console.log("WebSocket already connected/connecting");
    return;
  }

  ws = new WebSocket("ws://10.150.31.76:8080");

  ws.onopen = () => {
    console.log("Connected to server");

    // flush queued messages
    messageQueue.forEach((msg) => ws.send(msg));
    messageQueue = [];

    // now safe to send join
    safeSend(JSON.stringify({ type: "join", role: "player" }));
  };

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);

    if (data.type === "assign_id") {
      userId = data.id;
      console.log("Assigned player ID:", userId);

    } else if (data.type === "collision_data") {
      // server now just sends numbers, e.g. { playerCollisions: 0, birdCollisions: 1 }
      const playerCount = Number(data.playerCollisions) || 0;
      const birdCount = Number(data.birdCollisions) || 0;

      router.push(
        `/ThankYou?playerCount=${playerCount}&birdCount=${birdCount}`
      );

      console.log("Received collision counts:", { playerCount, birdCount });
    }

    onMessageCallback && onMessageCallback(e.data);
  };

  ws.onerror = (e) => {
    console.error("WebSocket error:", e.message);
  };

  ws.onclose = (e) => {
    console.log("WebSocket closed:", e.code, e.reason);
  };
};

export const sendMessage = (message) => {
  safeSend(message);
};

export const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null; // prevent reuse of dead socket
    messageQueue = []; // clear queued messages
  }
};
