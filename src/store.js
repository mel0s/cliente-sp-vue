import Vue from "vue";
import Axios from "axios";
import init from "../init.js";
import socket from "./socket"

import {
  SOCKET_ONOPEN,
  SOCKET_ONCLOSE,
  SOCKET_ONERROR,
  SOCKET_ONMESSAGE,
  SOCKET_RECONNECT,
  SOCKET_RECONNECT_ERROR
} from "./mutation-types.js";



Axios.defaults.headers.common["access-token"] = init.tokenApi;
Axios.defaults.headers.common["sistemaorigenid-token"] = init.sistemaOrigenId;
Axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
Axios.defaults.headers.common["tipo-token"] = "llave";
Axios.defaults.headers.common["llave-token"] = init.llave;

const  moduloSP = {
  state: {
    socket: {
      isConnected: false,
      message: "",
      reconnectError: false,
      id: ''
    },
    notificacionesSP: {
      estado: false,
      alertas: new Array(),
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

      // Alerta correcta
      if (data.status == "200") {
        let d = data.data;
        // Cambia el estado del usuario en ejecucion.
        if (d.accion === "NOTI_SVANESA_ESTADO") {
          state.notificacionesSP.estado = d.estado;
          // coloque aqui un accion
        }
        // Cuando la accion no tiene nombre se toma por default NOTI_SVANESA_ALERTA
        else if (d.accion === "NOTI_SVANESA_ALERTA") {
          state.notificacionesSP.alertas.push(d);
          // Coloque aqui una accion
        }
        state.notificacionesSP.alerta = d;
      }
      // Alertas error
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
    asignarId(context, id) {
      context.commit('MUTATE_ID_SP', id);
    },
    agregarNotificacionAlertas: (context, d) => {
      context.commit('MUTATE_NOTIFICACION_SP_ALERTAS', d);
    },
    enviarNotificacion: function (context, obj) {
      if (typeof obj == "object") {
        obj.accion = "NOTI_SVANESA_ALERTA";
        socket.enviarNotificacion(obj, 1000);
      }
    },
    cambiarEstado: function (context, obj) {
      if (typeof obj == "object") {
        obj.accion = "NOTI_SVANESA_ESTADO";
        socket.enviarNotificacion(obj, 1000);
      }
    },
   
    conectarSocket() {
      socket.conectarSocket(init);
    },
    desconetarSocket() {
      socket.desconetarSocket();
    },
    
  },
  getters: {
    alertas: (state) => {
      return state.notificacionesSP.alertas;
    },
    alerta: (state) => {
      return state.notificacionesSP.alerta;
    },
    estado: (state) => {
      return state.notificacionesSP.estado;
    },
  }

}

export default  moduloSP ;