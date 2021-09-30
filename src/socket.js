import Vue from "vue";
import store from "./store";

// Conectamos con el servidor push svanesa
function conectarSocket(init) {
  if (!store.state.socket.isConnected) {
    Vue.prototype.$connect(`${init.ws}?id=${store.state.socket.id}&token=${init.token}`);
  }

}

// Envio de la notificacion valida a espera del servidor listo
function enviarNotificacion(noti, interval = 1000) {
  function esperaConexion(callback, interval) {
    // Listo el cliente
    if (Vue.prototype.$socket.readyState === 1) {
      callback();
    } else {
      // Se generan time up paara la espera 
      setTimeout(function () {
        esperaConexion(callback, interval);
      }, interval);
    }
  }
  esperaConexion(function () {
    // Agregamos de manera automatica el token
    if (typeof noti == 'object') {      
      noti.token = init.token;
      noti.id = store.state.socket.id;
      Vue.prototype.$socket.send(JSON.stringify(noti))
    }

  }, interval);
}

// Desconectamos con el servidor push
function desconetarSocket() {
  Vue.prototype.$disconnect();
}

export default {
  conectarSocket,
  enviarNotificacion,
  desconetarSocket

}
