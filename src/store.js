import Axios from "axios";
import init from '../init';
import Socket from "./socket"
import Api from './api';
import AWN from "awesome-notifications";
let options = {
  position: "bottom-right",
  maxNotifications: 5,
  animationDuration: 1000,
  durations: {
    tip: 4000
  },
  labels: {
    success: "Exito",
    info: "Info",
    tip: "Tip",
    alert: "Error"
  }
};
let notifier = new AWN(options);

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
      dispositivo: init.dispositivo,

      mensaje: "",
      // Indentificador del usuario socket
      id: '',
      // 
      isConnected: false,
      reconnectError: false,
      // Identificador del usuario que esta configurando
      usuarioId: init.usuarioId,
      // Referencia de vue-nativenotificacionesAnual
    },
    nudo: {
      alertas: new Array(),
      activos: new Array(),
    },
    notificaciones: {
      alertas: new Array(),
      alerta: {},
      estado: 'inactivo'
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
          state.notificaciones.estado = d.estado;
          // coloque aqui un accion
        }
        else if (d.accion === "NOTI_SP_SVANESA_ALERTA") {

          state.nudo.alertas.splice(0, 0, d);

          let l = state.nudo.alertas.length;

          if (l == 50) {
            state.nudo.alertas.splice(49, 1);

          }


          // coloque aqui un accion
        }
        else if (d.accion === "NOTI_SP_SVANESA_ESTADO") {



          if (d.estado == 'activo') {
            let e = state.nudo.activos.find(x => x.id == d.id);
            if (!e) {
              state.nudo.activos.push(d);
            }
          }
          else {
            let index = state.nudo.activos.findIndex(x => x.id == d.id);

            if (index > -1) {
              state.nudo.activos.splice(index, 1);
            }

          }
          // coloque aqui un accion
        }
        // Cuando la accion no tiene nombre se toma por default NOTI_SVANESA_ALERTA
        else if (d.accion === "NOTI_SVANESA_ALERTA") {


          state.notificaciones.alertas.splice(0, 0, d);

          let tipo = d.tipo;

          if (/(\W|^)(primary|info|warning|success|tip)(\W|$)/.test(tipo)) {
            let opcion = {
              labels: {}
            };
            opcion.labels[d.tipo] = d.titulo;
            notifier[tipo](d.mensaje, opcion);
          }

          // Coloque aqui una accion
        }
        state.notificaciones.alerta = d;
      }
      else if (data.status == "201") {
        ;
      }
      // Alertas error
      else if (data.status == "400") {
        state.notificaciones.alerta = {
          tipo: 'warning-sp',
          mensaje: data.message
        };

        notifier.warning(data.message)

      }
      else if (data.status == "401") {
        state.notificaciones.alerta = {
          tipo: 'warning-sp',
          mensaje: data.message
        };
        notifier.warning(data.message)
      }
      else if (data.status == "409") {
        state.notificaciones.alerta = {
          tipo: 'warning-sp',
          mensaje: data.message
        };
        notifier.warning(data.message)
      }
      else if (data.status == "500") {
        state.notificaciones.alerta = {
          tipo: 'warning-sp',
          mensaje: data.message
        };
        notifier.warning(data.message)
      }
      else {
        state.notificaciones.alerta = {
          tipo: 'warning-sp',
          mensaje: data.message
        };
        notifier.warning(data.message)
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
      // alertas = alertas.sort(function (a, b) {
      //   return new Date(a.fechaMovimiento) - new Date(a.fechaMovimiento);

      // });

      state.notificaciones.alertas = [...alertas];
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
      localStorage.setItem('svanesa.sp.sesion-cliente', sesion);
    },
    // Asigna la sesion para el acceso a la api svanesa
    MUTATE_ESTADO_SP(state, estado) {
      state.notificaciones.estado = estado;
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
    // Conecta con el servidor push
    conectarSocket() {
      socket.conectarSocket(init);
      if (api) {
        api.iniciar();
      }
    },
    // Desconecta con el servidor push
    desconetarSocket(context, cambiarEstado = true) {
      localStorage.removeItem('svanesa.sp.sesion-cliente');

      if (cambiarEstado) {
        let obj = {
          accion: 'NOTI_SVANESA_ESTADO',
          id: context.getters.id,
          token: init.token,
          estado: 'inactivo',
          fechaMovimiento: new Date()
        };

        context.commit('MUTATE_ESTADO_SP', 'inactivo');
        socket.enviarNotificacion(obj, 10000);

      }


      socket.desconetarSocket();

    },
    // Envia el estado del usuario logueado
    enviarEstado: function (context, obj) {
      if (typeof obj == "object") {
        obj.accion = "NOTI_SVANESA_ESTADO";
        obj.id = context.getters.id;
        obj.token = context.getters.token;
        obj.fechaMovimiento = new Date();
        context.commit('MUTATE_ESTADO_SP', obj.estado);
        socket.enviarNotificacion(obj, 10000);
      }
    },
    // Envia una alerta notificacion
    enviarNotificacion: function (context, obj) {
      if (typeof obj == "object") {
        obj.accion = "NOTI_SVANESA_ALERTA";
        obj.id = context.getters.id;
        obj.token = context.getters.token;
        obj.fechaMovimiento = new Date();
        socket.enviarNotificacion(obj, 10000);
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
      if (!socket) {
        socket = new Socket(variables.ref);
      }

      if (!api) {
        api = new Api(init.sistemaOrigenId, init.tokenApi, init.token, variables.id, init.dispositivo, init.usuarioId, init.host, context);
      }

      let sesion = localStorage.getItem('svanesa.sp.sesion-cliente');
      api.obtenerAcceso(init.clave, sesion);

    },
    // Obtiene las notificaciones que esta como no vistas
    obtenerNotificaciones() {
      api.obtenerNotificacionesVigentes();
    }
  },
  getters: {

    // Alerta recibida
    alerta: (state) => {
      return state.notificaciones.alerta;
    },
    // Alertas recibidas
    alertas: (state) => {
      return state.notificaciones.alertas;
    },

    // Estado del usuario.
    estado: (state) => {
      return state.notificaciones.estado;
    },
    id: (state) => {
      return state.socket.id;
    },
    token: (state) => {
      return state.socket.token;
    },

    // Alertas recibidas
    sp_alertas: (state) => {
      return state.nudo.alertas;
    },

    // Estados activos
    sp_activos: (state) => {
      return state.nudo.activos;
    },
  }
}



export default moduloSP;