/***
 * @param e {Object} - Objeto con la respuesta del tipo error
 */
export default function errores(e) {
  if (e.response && e.response.status == "400") {
    console.log(e.response.message);
  }
  else if (e.response && e.response.status == "409") {
    console.log(e.response.message);
  }
  else if (e.response && e.response.status == "401") {
    console.log(e.response.data.message);
  }
  else if (e.response && e.response.status == "511") {
    console.log(e.response.data.message);
  }
  else if (e.response && e.response.status == "500") {
    console.log(e.response.data.message);
  }
  else {
    console.log(e.message);
  }

};