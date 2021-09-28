"strict mode"
import Vue from "vue";
import VueNativeSock from "vue-native-websocket";
import store from './src/store.js'
import init from "./init"
import {
  SOCKET_ONOPEN,
  SOCKET_ONCLOSE,
  SOCKET_ONERROR,
  SOCKET_ONMESSAGE,
  SOCKET_RECONNECT,
  SOCKET_RECONNECT_ERROR
} from './src/mutation-types'

const mutations = {
  SOCKET_ONOPEN,
  SOCKET_ONCLOSE,
  SOCKET_ONERROR,
  SOCKET_ONMESSAGE,
  SOCKET_RECONNECT,
  SOCKET_RECONNECT_ERROR
};


Vue.use(VueNativeSock, init.ws, {
  store: store,
  mutations: mutations,
  reconnection: true,
  connectManually: true,
  reconnectionDelay: 3000
});

export default{
  store
}