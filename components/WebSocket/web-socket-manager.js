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
let ws;
let userId = null;

let playerCollision = null;
let birdCollision = null;

export const getUserId = () => userId;

export const connectWebSocket = (router, onMessageCallback) => {
  ws = new WebSocket("ws://10.150.31.76:8080");

  ws.onopen = () => {
    console.log("Connected to server");
    ws.send(JSON.stringify({ type: "join", role: "player" }));
  };

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);

    if (data.type === "assign_id") {
      userId = data.id;
      console.log("Assigned player ID:", userId);
    } else if (data.type === "collision_data") {
      playerCollision = data.playerCollisions;
      birdCollision = data.birdCollisions;

      // ✅ router comes from component
      router.push({
        pathname: "/ThankYou",
        params: {
          playerCollision: JSON.stringify(playerCollision),
          birdCollision: JSON.stringify(birdCollision),
        },
      });

      console.log("Received collision data:", playerCollision, birdCollision);
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
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  } else {
    console.warn("WebSocket not connected");
  }
};

export const disconnectWebSocket = () => {
  if (ws) ws.close();
};
