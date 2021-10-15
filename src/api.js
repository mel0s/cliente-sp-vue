import axios from "axios";
import errores from "../errores";

/**
 * Clase para el acceso
 */
export default class api {
  constructor( sistemaOrigenId, tokenApi, tokenSP, dispositivo, usuarioId, host,context) {
    this.sesionToken = "";
    this.notificaciones = [];
    //this.clave = clave;
    this.sistemaId = sistemaId;
    this.usuarioId = usuarioId;
    this.host = host;
    this.tokenSP = tokenSP;
    this.dispositivo = dispositivo;
    this.context = context;


    axios.defaults.headers.common["access-token"] = tokenApi;
    axios.defaults.headers.common["sistemaorigenid-token"] = sistemaOrigenId;
    axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    //Obtiene 



  }

  async iniciar() {
    //await this.obtenerAcceso();
    this.notificaciones = await this.obtenerNotificacionesVigentes();
    
  }
  
  async obtenerAcceso(clave) {
    let filtro = {
      clave: clave,
      sistemaId: this.sistemaOrigenId,
      usuarioId: this.usuarioId
    };

    await axios
      .post(`${this.host}/api/accesoUsuarioToken`, filtro)
      .then((r) => {
        this.sesionToken = r.data.data.sesionToken;
        this.context.commit('MUTATE_SESION_SP', this.sesionToken);
        this.context.commit("MUTATE_CLAVE_SP", "#CLAVEsp")

        function exito(config) {
          config.headers.common["sesion-token"] = this.sesionToken;
          if (usuarioId) {
            config.headers.common["administradorid-token"] = this.usuarioId;
          }
          return config;
        }
        axios.interceptors.request.use(
          exito.bind(this),
          function (error) {
            return Promise.reject(error);
          }
        );
      })
      .catch((e) => {
        this.context.commit("MUTATE_CLAVE_SP", "#CLAVEsp")
        errores(e);
      });
  }

  async obtenerNotificacionesVigentes() {
    let noti = [];
    await axios
      .post(`${this.$hostname}/api/notificacionToken/${this.tokenSP}/${this.usuarioId}/${this.dispositivo}`)
      .then((r) => {
        let res = r.data;
        noti = res.data;

        if(context){
          context.commit('MUTATE_CLAVE_SP', noti)
        }    

      })
      .catch((e) => {
        errores(e);
      });

      return noti;
  }

}

