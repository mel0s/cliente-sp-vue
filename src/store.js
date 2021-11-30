import Axios from "axios";
import init from '../init';
import Socket from "./socket"
import Api from './api';
console.log(init)

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

let socket;
let api;

const moduloSP = {
  state: {
    socket: {
      // Numero 
      clave: '',
      // Nombre del dispositivo
      dispositivo: '',

      mensaje: "",
      // Indentificador del usuario socket
      id: '',
      // 
      isConnected: false,
      reconnectError: false,
      // Identificador del usuario que esta configurando
      usuarioId: '',
      // Referencia de vue-native
      ref: '',
      // Variable de sesion de acceso
      sesion: ''
    },
    // Datos del servidor push
    notificacionesSP: {
      estado: false,
      alertas: new Array(),
      alerta: {}
    }
  },
  mutations: {
    // Socket abierto
    [SOCKET_ONOPEN](state, event) {
      state.socket.ref.$socket = event.currentTarget;
      console.log("conectado");
      state.socket.isConnected = true;
    },
    // Socket cerrado
    [SOCKET_ONCLOSE](state) {
      console.log("Cerrando la conexion")
      state.socket.isConnected = false;
    },
    // Socket con error
    [SOCKET_ONERROR](state, event) {
      console.error(state, event);
    },
    // Mensaje recibido
    [SOCKET_ONMESSAGE](state, mensaje) {
      state.socket.mensaje = mensaje;
      let data = JSON.parse(mensaje.data);
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
    // Lista de alertas
    MUTATE_NOTIFICACION_SP_ALERTAS(state, alertas) {
      state.notificacionesSP.alertas = [...alertas];
    },
    // Asigna las variables de acceso a api de svanesa
    MUTATE_VARIABLES_SP(state, variables) {
      state.socket.id = variables.id;
      state.socket.ref = variables.ref;
    },
    // Asigna la clave de acceso para el login de api svanesa
    MUTATE_CLAVE_SP(state, clave) {
      state.socket.clave = clave;
    },
    // Asigna la sesion para el acceso a la api svanesa
    MUTATE_SESION_SP(state, sesion) {
      state.socket.sesion = sesion;
    }
  },
  actions: {
    // Agregar la lista de notificaciones alertas
    agregarNotificacionAlertas: (context, d) => {
      context.commit('MUTATE_NOTIFICACION_SP_ALERTAS', d);
    },
    // Asigna la variable de sesion 
    asignarSesion(context, sesion) {
      context.commit('MUTATE_SESION_SP', sesion);
    },
    // Cambia el estado del usuario id
    cambiarEstado: function (context, obj) {
      if (typeof obj == "object") {
        obj.accion = "NOTI_SVANESA_ESTADO";
        socket.enviarNotificacion(obj, 1000);
      }
    },
    // Conecta con el servidor push
    conectarSocket() {
      socket.conectarSocket(init);
      if (api) {
        api.iniciar();
      }
    },
    // Desconecta con el servidor push
    desconetarSocket() {
      socket.desconetarSocket();
    },
    // Envia una alerta notificacion
    enviarNotificacion: function ({ context, obj }) {
      if (typeof obj == "object") {
        obj.accion = "NOTI_SVANESA_ALERTA";
        obj.id = context.state
        socket.enviarNotificacion(obj, 1000);
      }
    },
    // Envio de notificaciones a todos los usuarios de un token.
    enviarNotificacionSistema: function (context, obj) {
      if (typeof obj == "object") {
        obj.accion = "NOTI_SVANESA_SISTEMA_TODOS";
        socket.enviarNotificacion(obj, 1000);
      }
    },
    // Inicia el servidor push y acceso a la api svanesa.
    iniciarSP(context, variables) {
      context.commit('MUTATE_VARIABLES_SP', variables);
      socket = new Socket(variables.ref);
      api = new Api(init.sistemaOrigenId, init.tokenApi, init.token, variables.id, init.dispositivo, init.usuarioId, init.host, context);
      api.obtenerAcceso(init.clave);
    },
    // Obtiene las notificaciones que esta como no vistas
    obtenerNotificaciones() {
      api.obtenerNotificacionesVigentes();
    }
  },
  getters: {
    // Alertas recibidas
    alertas: (state) => {
      return state.notificacionesSP.alertas;
    },
    // Alerta recibida
    alerta: (state) => {
      return state.notificacionesSP.alerta;
    },
    // Estado del usuario.
    estado: (state) => {
      return state.notificacionesSP.estado;
    }
  }
}



export default moduloSP;