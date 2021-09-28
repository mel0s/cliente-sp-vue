import Vue from "vue";
import store from "./store";

function conectarSocket(init) {
  if (!store.state.socket.isConnected) {
    Vue.prototype.$connect( `${init.ws}?id=${store.state.socket.id}&token=${init.token}`);
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

export default {
  conectarSocket,
  enviarNotificacion,
  desconetarSocket

}
