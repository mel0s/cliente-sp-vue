import axios from "axios";
import errores from "../errores";

/**
 * Clase para el acceso
 */
export default class api {
  constructor(clave, sistemaOrigenId, tokenApi, usuarioId, host) {
    this.sesionToken = "";
    this.clave = clave;
    this.sistemaId = sistemaId;
    this.usuarioId = usuarioId;
    this.host = host;

    axios.defaults.headers.common["access-token"] = tokenApi;
    axios.defaults.headers.common["sistemaorigenid-token"] = sistemaOrigenId;
    axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    //Obtiene 
    this.obtenerAcceso();


  }

  obtenerAcceso() {
    let filtro = {
      clave: this.clave,
      sistemaId: this.sistemaOrigenId,
      usuarioId: this.usuarioId
    };

    axios
      .post(`${this.host}/api/accesoUsuarioToken`, filtro)
      .then((r) => {
        this.sesionToken = r.data.data.sesionToken;

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
        errores(e);
      });

  }

}

