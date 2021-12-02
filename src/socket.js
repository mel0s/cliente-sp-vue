
import store from "./store";
import init from '../init';

export default class Socket {
  /**
   * Constructor con la referencia de vue-native-websocket
   * @param {Object} ref - Vue-native-websocket
   */

  constructor(ref) {
    this.ref = ref;
  }

  // Conectamos con el servidor push svanesa
  conectarSocket(init) {

    if (!store.state.socket.isConnected) {
      this.ref.$connect(`${init.ws}?id=${store.state.socket.id}&token=${init.token}&dispositivo=${init.dispositivo}`);
    }

  }

  // Envio de la notificacion valida a espera del servidor listo
  enviarNotificacion(noti, interval = 1000) {
    function esperaConexion(callback, interval) {
      // Listo el cliente
      if (this.ref.$socket.readyState === 1) {
        callback();
      } else {
        // Se generan time up paara la espera 
        setTimeout(function () {
          esperaConexion(callback, interval);
        }, interval);
      }
    }

    esperaConexion.call(this, esperar.bind(this), interval);

    function esperar() {
      // Agregamos de manera automatica el token
      if (typeof noti == 'object') {
        noti.token = init.token;
        noti.id = store.state.socket.id;
        this.ref.$socket.send(JSON.stringify(noti))
      }

    }
  }

  // Desconectamos con el servidor push
  desconetarSocket() {
    this.ref.$disconnect();
  }
}





// export default {
//   conectarSocket,
//   enviarNotificacion,
//   desconetarSocket

// }
