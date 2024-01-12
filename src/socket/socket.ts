import { io } from 'socket.io-client';

const process = {
  env: {
    NODE_ENV: "development"
  }
}
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? "http://localhost:3000" : 'http://localhost:3000';

export const socket = io(URL, {

  withCredentials: true,
  transports: ['websocket'],
  extraHeaders: {
    "Access-Control-Allow-Origin": "*"
  }

});
