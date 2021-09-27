import Vue from "vue";
import Vuex from "vuex";

import {
  SOCKET_ONOPEN,
  SOCKET_ONCLOSE,
  SOCKET_ONERROR,
  SOCKET_ONMESSAGE,
  SOCKET_RECONNECT,
  SOCKET_RECONNECT_ERROR
} from "./mutation-types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      message: "",
      reconnectError: false,
    },
    notificacionesSP: {
      estado: false,
      alertas: [],
      alerta: {}
    }


  },
  mutations: {
    [SOCKET_ONOPEN](state, event) {
      Vue.prototype.$socket = event.currentTarget;
      console.log("conectado");
      state.socket.isConnected = true;
    },
    [SOCKET_ONCLOSE](state, event) {
      console.log("Cerrando la conexion")
      state.socket.isConnected = false;
    },
    [SOCKET_ONERROR](state, event) {
      console.error(state, event);
    },
    // default handler called for all methods
    [SOCKET_ONMESSAGE](state, message) {
      state.socket.message = message;
      //console.log(Vue.prototype.$awn);
      let data = JSON.parse(message.data);

      if (!Vue.prototype.$awn) {
        return;
      }

      if (data.status == "200") {
        let d = data.data;



        if (d.accion === "NOTI_SVANESA_ESTADO") {

          state.notificacionesSP.estado = d.estado;
          // coloque aqui un accion
        }
        // Cuando la accion no tiene nombre se toma por default NOTI_SVANESA_ALERTA
        else if (d.accion === "NOTI_SVANESA_ALERTA") {
          state.notificacionesSP.alertas.push(d);

        }

        state.notificacionesSP.alerta = d;


      }
      else if (data.status == "400") {
        state.notificacionesSP.alerta = {
          tipo:'warning-sp',
          mensaje: data.message
        };
      }
      else if (data.status == "401") {
        state.notificacionesSP.alerta = {
          tipo:'warning-sp',
          mensaje: data.message
        };
      }
      else if (data.status == "409") {
        state.notificacionesSP.alerta = {
          tipo:'warning-sp',
          mensaje: data.message
        };
      }
      else if (data.status == "500") {
        state.notificacionesSP.alerta = {
          tipo:'warning-sp',
          mensaje: data.message
        };
      }
      else {
        state.notificacionesSP.alerta = {
          tipo:'warning-sp',
          mensaje: data.message
        };
      }
    },
    // mutations for reconnect methods
    [SOCKET_RECONNECT](state, count) {
      console.info(state, count);
    },
    [SOCKET_RECONNECT_ERROR](state) {
      state.socket.reconnectError = true;
    },
    MUTATE_NOTIFICACION_SP_ALERTAS(state, alertas) {
      state.notificacionesSP.alertas = [...alertas];
    },
  },
  actions: {
    sendMessage: function (context, message) {
      console.log(message);
    },
    agregarNotificacionAlertas: (context, d) => {
      context.commit('MUTATE_NOTIFICACION_SP_ALERTAS', d);
    },
  },
  getters: {
    notificacionesAlertas: (state) => {
      return state.notificacionesSP.alertas;
    },
    estado: (state) => {
      return state.notificacionesSP.estado;
    },
  }
});
