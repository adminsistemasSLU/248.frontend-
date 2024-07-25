class ValidationUtils {
  static validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };




  static Valida_numeros = (numero) => {
   return numero = (numero+ '').replace(/[^0-9]/g, '');
  }
  
  static Valida_moneda = (moneda) => {
      var v;
      v = (moneda + '').replace(/([^0-9\.]+)/g, '');
      v = v.replace(/^[\.]/, '');
      v = v.replace(/[\.][\.]/g, '');
      v = v.replace(/\.(\d)(\d)(\d)/g, '.$1$2');
      v = v.replace(/\.(\d{1,2})\./g, '.$1');
      v = v.toString().split('').reverse().join('').replace(/(\d{3})/g, '$1');
      return moneda = v.split('').reverse().join('').replace(/^[\,]/, '');
      /*Linea 2. Acepta solo números y el punto.
      Linea 3. Quita punto al inicio.
      Linea 4. Elimina dos puntos juntos.
      Linea 5. Si encuentra el patrón .123 lo cambia por .12.
      Linea 6. Si encuentra el patrón .1. o .12. lo cambia por .1 o .12.
      Linea 7. Pone la cadena al revés Si encuentra el patrón 123 lo cambia por 123,.
      Linea 8. Si inicia con una coma la reemplaza por nada.*/
  }

  static Valida_letras = (letras) => {
    return letras = (letras + '').replace(/[^a-zA-zZñÑáéíóúÁÉÍÓÚ ]/g, '');
  }

  static Valida_mayuscula = (letras) => {
    return letras.toUpperCase();
  }

 




  static toDataURL = (src, callback) => {
    var image = new Image();
    image.crossOrigin = 'Anonymous';

    image.onload = function () {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      context.drawImage(this, 0, 0);
      var dataURL = canvas.toDataURL('image/jpeg');
      callback(dataURL);
    };
    image.src = src;
  }


  static download = (nombre, url) => {
    var link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', nombre);
    link.click();
  }




  static sumarDias = (fecha, dias) => {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  static convertDateFormat = (string) => {
    var info = string.split('-');
    return info[2] + '-' + info[1] + '-' + info[0];
  }

  static ConvertDateActual = (Fecha) => {
    return `${Fecha.getDate()}/${(Fecha.getMonth() + 1)}/${Fecha.getFullYear()} ${Fecha.getHours()}:${Fecha.getMinutes()}:${Fecha.getSeconds()}`;
  }


}

export default ValidationUtils;
