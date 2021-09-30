# cliente-sp-vue
Conexion al servidor push

## Agregar a tu proyecto

1. Instala el paquete cliente-sp-vue.
 > npm install cliente-sp-vue

2.  Instala vuex en tu proyecto y crea tu store, el cual tendra interacion con las alertas recibidas por el wbsocket.

```
import Vue from "vue";
import Vuex from "vuex";

// Importamos el cliente sp vue que contiene los state y mutation, etc, necesarios para la interacion con el servidor push.
import sp from "cliente-sp-vue"

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
  },
  modules: {
    // Lo agregamos a un modulo
    sp:sp.moduloSP
  }
  
});

```

3. Instala el paquete vue-native-websocket.
 > npm install vue-native-websocket

4. Importa  el paquete cliente-sp-vue junto con vue-native-websocket. [Para mas info.](https://www.npmjs.com/package/vue-native-websocket)


```
.
.
.
// Agrega tu store de vuex
import store from "./store";
import sp from "cliente-sp-vue";
import VueNativeSock from "vue-native-websocket";

Vue.use(VueNativeSock, sp.init.ws, {
  // El store para interacion con el paquete vue-native-websocket
  store: store,
  // Mutations 
  mutations: sp.mutations,
  reconnection: true,
  connectManually: true,
  reconnectionDelay: 3000
});

.
.
.
```

5. Asigna el id de conexión.
```
 this.$store.dispatch("asignarId", "SAPYME_ID");
```

6. Conecta con el servidor push.

```
this.$store.dispatch("conectarSocket");
```

7. Envio de la notificación.  Para mas información ir a [Servidor Push](https://servidorpush.svanesa.online/#/Guia)

```
let noti = {        
        titulo: 'Titulo',        
        para:"ID_A_ENVIAR_NOTIFICACION",
        mensaje: 'Mensaje',
        tipo: 'Info',
        datos:[],
      };
this.$store.dispatch("enviarNotificacion", noti);

 
```


8. Desconectar del servidor push.

```
this.$store.dispatch("desconetarSocket");

```


## Para la configuración del servicio necesitas las siguientes variables.
1. Token de servidor push

> Lo podras obtener en [Servidor Push](https://servidorpush.svanesa.online), en el apartado de sistemas.

2. Un identificador unico

> Cadena string que identifique tu usuario y garantice que sea unico dentro del sistema. Ejemplo TEST-SVANESA

3. El token del api svanesa

> Si tienes una suscripcion vigente de [Servidor Push](https://servidorpush.svanesa.online),  podras ir a [Svanesa](https://svanesa.online/) y en el apartado tokens.

4. El id del sistema svanesa a conectar

> En el mismo modulo anterior existe la eqtiqueta sistema con un idunico.

5. Llave de acceso del token

> Al igual que la variable 3 y 4 en el modulo tokens encuentras la llave.

---
**NOTA**

El archivo de configuracion para el servidor push se encontrara en la raiz del proyecto.

sp.config.js

```
let token = "sp-000000000-00000-000-0000-0000000000";
let tokenApi = "e00000000000000000000000000.000000000000000000000000000000000000000000000000000000000000000000.000000000-00000000000-0000000_0";
let llave = "0100000000+000000000000000000000000000000000000000000000--";
let sistemaOrigenId = "00000000000000000000";


module.exports = {
  variables: {
    tokenApi,
    token,
    llave,
    sistemaOrigenId
  }
}

```





---