import axios from "axios";
import errores from "../errores";

/**
 * Clase para el acceso
 */
export default class Api {
  constructor(sistemaOrigenId, tokenApi, tokenSP, id, dispositivo, usuarioId, host, context) {
    // Token de sesion de acceso
    this.sesionToken = "";
    // Notificaciones generadas
    this.notificaciones = [];
    // Identificador del sistema
    this.sistemaId = sistemaOrigenId;
    // Identificador del usuario que esta logueando
    this.usuarioId = usuarioId;
    // Id del usuario que esta conectando con el servidor push.
    this.id = id;
    // Ruta del servicio.
    this.host = host;
    // Token de acceso al servidor push.
    this.tokenSP = tokenSP;
    // Nombre del dispositivo
    this.dispositivo = dispositivo;
    // Referencia del store
    this.context = context;
    // Referencia de axios para peticiones de api rest
    this.axios = axios.create({
      baseURL: this.host,
      timeout: 3000,
    });

    this.axios.defaults.headers.common["access-token"] = tokenApi;
    this.axios.defaults.headers.common["sistemaorigenid-token"] = sistemaOrigenId;
    this.axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";


  }

  /**
   * Obtiene los datos del servidor push
   */
  async iniciar() {
    //await this.obtenerAcceso();
    this.notificaciones = await this.obtenerNotificacionesVigentes();
  }

  /**
   * Obtiene el token de acceso.
   * @param {String} clave  -  Cadena con la clave de acceso para obtener la sesion 
   */
  async obtenerAcceso(clave) {
    // Parametros de la consulta.
    let filtro = {
      clave: clave,
      sistemaId: this.sistemaId,
      usuarioId: this.usuarioId
    };

    // Petecion de sesion token
    await this.axios
      .post(`${this.host}/api/accesoUsuarioToken`, filtro)
      .then(success.bind(this))
      .catch((e) => {
        this.context.commit("MUTATE_CLAVE_SP", "#CLAVEsp")
        errores(e);
      });

    function success(r) {
      this.sesionToken = r.data.data.sesionToken;

      // Agregamos las variables de sesion iniciada
      this.axios.defaults.headers.common["sesion-token"] = this.sesionToken;
      this.axios.defaults.headers.common["administradorid-token"] = this.usuarioId;

      // Guardamos la variable de sesion
      this.context.commit('MUTATE_SESION_SP', this.sesionToken);

      // Quitamos la clave 
      this.context.commit("MUTATE_CLAVE_SP", "#CLAVEsp");

      // Conectamos con el servidor push nudo
      this.context.dispatch('conectarSocket');


    }
  }

  /**
   * Peticion para obtener el listado de notificaciones registradas
   * @returns Lista de notificaciones encoladas y no vistas.
   */
  async obtenerNotificacionesVigentes() {
    let noti = [];
    await this.axios
      .get(`${this.host}/api/sp/notificacionId/${this.tokenSP}/${this.id}/${this.dispositivo}`)
      .then((r) => {
        let res = r.data;
        noti = res.data;
        if (this.context) {
          this.context.commit('MUTATE_NOTIFICACION_SP_ALERTAS', noti)
        }
      })
      .catch((e) => {
        errores(e);
      });

    return noti;
  }

}

