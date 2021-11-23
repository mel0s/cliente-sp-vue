let ws = "wss://socket.svanesa.online";
let host = 'https://svanesa.online';
let token = "token-prueba";
let tokenApi = "token-svanesa";
//let llave = "L1234567890";
let sistemaOrigenId = "s123456780";
//  Buscando el archivo de configuracion
import init from "../../sp.config.js";

let v = init.variables;

if (v) {
  // if (v.llave)
  //   llave = v.llave;

  if (v.token)
    token = v.token;

  if (v.tokenApi)
    tokenApi = v.tokenApi;

  if (v.sistemaOrigenId)
    tokenApi = v.sistemaOrigenId;
}

// Esportando
export default {
  ws,
  token,
  llave,
  tokenApi,
  sistemaOrigenId,
  host
}