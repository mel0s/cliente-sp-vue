import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";
import init from "../init.js";

import {
  SOCKET_ONOPEN,
  SOCKET_ONCLOSE,
  SOCKET_ONERROR,
  SOCKET_ONMESSAGE,
  SOCKET_RECONNECT,
  SOCKET_RECONNECT_ERROR
} from "./mutation-types.js";

Vue.use(Vuex);

import socket from "./socket"

Axios.defaults.headers.common["access-token"] = init.tokenApi;
Axios.defaults.headers.common["sistemaorigenid-token"] = init.sistemaOrigenId;
Axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
Axios.defaults.headers.common["tipo-token"] = "llave";
Axios.defaults.headers.common["llave-token"] = init.llave;

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      message: "",
      reconnectError: false,
      id:''
    },
    notificacionesSP: {
      estado: false,
      alertas:  new Array() ,
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
          tipo: 'warning-sp',
          mensaje: data.message
        };
      }
      else if (data.status == "401") {
        state.notificacionesSP.alerta = {
          tipo: 'warning-sp',
          mensaje: data.message
        };
      }
      else if (data.status == "409") {
        state.notificacionesSP.alerta = {
          tipo: 'warning-sp',
          mensaje: data.message
        };
      }
      else if (data.status == "500") {
        state.notificacionesSP.alerta = {
          tipo: 'warning-sp',
          mensaje: data.message
        };
      }
      else {
        state.notificacionesSP.alerta = {
          tipo: 'warning-sp',
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
    MUTATE_ID_SP(state, id) {
      state.socket.id = id;
    },
  },
  actions: {
    enviarNotificacion: function (context, obj) {
      if (typeof obj == "object") {
        obj.accion = "NOTI_SVANESA_ALERTA";
        socket.enviarNotificacion(obj, 1000);
      }
    },
    asignarId(context, id) {
      
      context.commit('MUTATE_ID_SP', id);
      
    },
    conectarSocket(context) {
      socket.conectarSocket(init);
      
    },
    desconetarSocket() {
      socket.desconetarSocket();
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
