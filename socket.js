import Vue from "vue";
import store from "./store";

import init from "~/sp-init.js";
let ws = init.ws;
let token = init. token;
let id = init.id;

function conectarSocket() {
  if (!store.state.socket.isConnected) {
    Vue.prototype.$connect( `${ws}?id=${id}&token=${token}`);
  }

}

function enviarNotificacion(noti, interval = 1000) {
  function waitForConnection(callback, interval) {
    if (Vue.prototype.$socket.readyState === 1) {
      callback();
    } else {
      setTimeout(function () {
        waitForConnection(callback, interval);
      }, interval);
    }
  }
  waitForConnection(function () {
    Vue.prototype.$socket.send(JSON.stringify(noti))
    console.log("Enviar notificacion");
  },interval);
}

function desconetarSocket() {
  Vue.prototype.$disconnect();
}

export {
  conectarSocket,
  enviarNotificacion,
  desconetarSocket

}
