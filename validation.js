function validarIdentificacion(valor,type){
    var err="";
    let len=valor.length;
    if (len == 10 && type == 'cedula' ) {
        let validador =validarCedula(valor);
        if (!validador) {
          err='Cédula incorrecta:';
          }

        }
    else if (len == 13 && type == 'ruc' ) {
        if (!(validarRucPersonaNatural(valor)) || (validarRucSociedadPrivada(valor)) || (validarRucSociedadPublica(valor))) {

          err='RUC incorrecto:';
        }
      } //If the length is different, check the error message
    else if (type == 'cedula' ) {

        err='Ingresa una cédula correcta';
      }
    else if ( type == 'ruc' ) {

        err='Ingresa un ruc correcto';
      }
    if (err==''){
        return true;
      }
      else {
        return err;
      }
}
function validarCedula(numero){
  try{
    let validador= validarInicial(numero,10);
    validador = validarCodigoProvincia (numero.substr(0, 2));
    validador =validarTercerDigito (numero,'cedula');
    validador= algoritmoModulo10(numero.substr(0, 9), numero[9]);
    //console.log (validador);
  }
  catch ( e) {
    //console.log (e);
    return false;
  }
  return true;
}
// funcion para validar ruc
function validarRucPersonaNatural(numero)
  {
      // fuerzo parametro de entrada a string


      // borro por si acaso errores de llamadas anteriores.


      // validaciones
      try {
          validarInicial(numero, '13');
          validarCodigoProvincia(numero.substr(0, 2));
          validarTercerDigito(numero, 'ruc_natural');
          validarCodigoEstablecimiento(numero.substr(10, 3));
          algoritmoModulo10(numero.substr(0, 9), numero[9]);
      } catch (e) {
          //console.log (e);
          return false;
      }

      return true;
  }
  function validarRucSociedadPrivada(numero)
    {

        // validaciones
        try {
            validarInicial(numero, '13');
            validarCodigoProvincia(numero.substr(0, 2));
            validarTercerDigito(numero, 'ruc_privada');
            validarCodigoEstablecimiento(numero.substr(10, 3));
            algoritmoModulo11(numero.substr(0, 9), numero[9], 'ruc_privada');
        } catch (e) {
            //console.log (e);
            return false;
        }

        return true;
    }
   function validarRucSociedadPublica(numero)
        {


            // validaciones
            try {
              validarInicial(numero, '13');
                validarCodigoProvincia(numero.substr(0, 2));
                validarTercerDigito(numero, 'ruc_publica');
                validarCodigoEstablecimiento(numero.substr(9, 4));
                algoritmoModulo11(numero.substr(0, 8), numero[8], 'ruc_publica');
            } catch (e) {
                //console.log (e);
                return false;
            }

            return true;
        }
function validarInicial(numero, caracteres)
  {
      if (numero === "") {
          throw ('Valor no puede estar vacio');
      }

      if (isNaN(numero)) {
          throw ('Valor ingresado solo puede tener dígitos');
      }

      if ((numero.length) != caracteres) {
          throw ('Valor ingresado debe tener '+caracteres+' caracteres');
      }

      return true;
  }
  /**
   * Validación de código de provincia (dos primeros dígitos de CI/RUC)
   *
   * @param  string  $numero  Dos primeros dígitos de CI/RUC
   *
   * @return boolean
   *
   * @throws exception Cuando el código de provincia no esta entre 00 y 24
   */
  function validarCodigoProvincia(numero)
    {
        if (numero < 0 || numero > 24) {
            throw  ('Codigo de Provincia (dos primeros dígitos) no deben ser mayor a 24 ni menores a 0');

        }

        return true;
    }

    // /**
    //  * Validación de tercer dígito
    //  *
    //  * Permite validad el tercer dígito del documento. Dependiendo
    //  * del campo tipo (tipo de identificación) se realizan las validaciones.
    //  * Los posibles valores del campo tipo son: cedula, ruc_natural, ruc_privada
    //  *
    //  * Para Cédulas y RUC de personas naturales el terder dígito debe
    //  * estar entre 0 y 5 (0,1,2,3,4,5)
    //  *
    //  * Para RUC de sociedades privadas el terder dígito debe ser
    //  * igual a 9.
    //  *
    //  * Para RUC de sociedades públicas el terder dígito debe ser
    //  * igual a 6.
    //  *
   function validarTercerDigito(numero, tipo)
  {
      let tercer_digito= numero.substr (2,1);
      //console.log ("tercer digito::"+tercer_digito);
      switch (tipo) {
          case 'cedula':
          case 'ruc_natural':
              if (tercer_digito < 0 || tercer_digito > 5) {
                  throw  ('Tercer dígito debe ser mayor o igual a 0 y menor a 6 para cédulas y RUC de persona natural');
              }
              break;
          case 'ruc_privada':
              if (tercer_digito != 9) {
                  throw  ('Tercer dígito debe ser igual a 9 para sociedades privadas');
              }
              break;

          case 'ruc_publica':
              if (tercer_digito != 6) {
                  throw  ('Tercer dígito debe ser igual a 6 para sociedades públicas');
              }
              break;
          default:
              throw  ('Tipo de Identificación no existe.');
              break;
      }

      return true;
  }
  /**
   * Validación de código de establecimiento
   *
   * @param  string $numero  tercer dígito de CI/RUC
   *
   * @return boolean
   *
   * @throws exception Cuando el establecimiento es menor a 1
   */
  function validarCodigoEstablecimiento(numero)
  {
      if (numero < 1) {
          throw ('Código de establecimiento no puede ser 0');
      }

      return true;
  }
  /**
     * Algoritmo Modulo10 para validar si CI y RUC de persona natural son válidos.
     *
     * Los coeficientes usados para verificar el décimo dígito de la cédula,
     * mediante el algoritmo “Módulo 10” son:  2. 1. 2. 1. 2. 1. 2. 1. 2
     *
     * Paso 1: Multiplicar cada dígito de los digitosIniciales por su respectivo
     * coeficiente.
     *
     *  Ejemplo
     *  digitosIniciales posicion 1  x 2
     *  digitosIniciales posicion 2  x 1
     *  digitosIniciales posicion 3  x 2
     *  digitosIniciales posicion 4  x 1
     *  digitosIniciales posicion 5  x 2
     *  digitosIniciales posicion 6  x 1
     *  digitosIniciales posicion 7  x 2
     *  digitosIniciales posicion 8  x 1
     *  digitosIniciales posicion 9  x 2
     *
     * Paso 2: Sí alguno de los resultados de cada multiplicación es mayor a o igual a 10,
     * se suma entre ambos dígitos de dicho resultado. Ex. 12->1+2->3
     *
     * Paso 3: Se suman los resultados y se obtiene total
     *
     * Paso 4: Divido total para 10, se guarda residuo. Se resta 10 menos el residuo.
     * El valor obtenido debe concordar con el digitoVerificador
     *
     * Nota: Cuando el residuo es cero(0) el dígito verificador debe ser 0.
     *
     * @param  string $digitosIniciales   Nueve primeros dígitos de CI/RUC
     * @param  string $digitoVerificador  Décimo dígito de CI/RUC
     *
     * @return boolean
     *
     * @throws exception Cuando los digitosIniciales no concuerdan contra
     * el código verificador.
     */
     function sumArray(arr) {
       return arr.reduce((sum, x) => parseInt(sum) + parseInt(x));
     }
    function algoritmoModulo10(digitosIniciales, digitoVerificador)
    {

        arrayCoeficientes = [2,1,2,1,2,1,2,1,2];

        digitoVerificador = parseInt(digitoVerificador);
        digitosIniciales = digitosIniciales.split("");

        total = 0;
        for(var a=0;a<digitosIniciales.length;a++) {

            valorPosicion = ( parseInt(digitosIniciales[a]) * arrayCoeficientes[a] );

            if (valorPosicion >= 10) {
                valorPosicion = valorPosicion.toString().split("");

                valorPosicion = sumArray(valorPosicion);

                valorPosicion = parseInt(valorPosicion);
            }

            total = total + valorPosicion;

        }

        residuo =  total % 10;

        if (residuo == 0) {
            resultado = 0;
        } else {
            resultado = 10 - residuo;
        }

        if (resultado != digitoVerificador) {
            throw  ('Dígitos iniciales no validan contra Dígito Idenficador');
        }

        return true;
    }

    /**
     * Algoritmo Modulo11 para validar RUC de sociedades privadas y públicas
     *
     * El código verificador es el decimo digito para RUC de empresas privadas
     * y el noveno dígito para RUC de empresas públicas
     *
     * Paso 1: Multiplicar cada dígito de los digitosIniciales por su respectivo
     * coeficiente.
     *
     * Para RUC privadas el coeficiente esta definido y se multiplica con las siguientes
     * posiciones del RUC:
     *
     *  Ejemplo
     *  digitosIniciales posicion 1  x 4
     *  digitosIniciales posicion 2  x 3
     *  digitosIniciales posicion 3  x 2
     *  digitosIniciales posicion 4  x 7
     *  digitosIniciales posicion 5  x 6
     *  digitosIniciales posicion 6  x 5
     *  digitosIniciales posicion 7  x 4
     *  digitosIniciales posicion 8  x 3
     *  digitosIniciales posicion 9  x 2
     *
     * Para RUC privadas el coeficiente esta definido y se multiplica con las siguientes
     * posiciones del RUC:
     *
     *  digitosIniciales posicion 1  x 3
     *  digitosIniciales posicion 2  x 2
     *  digitosIniciales posicion 3  x 7
     *  digitosIniciales posicion 4  x 6
     *  digitosIniciales posicion 5  x 5
     *  digitosIniciales posicion 6  x 4
     *  digitosIniciales posicion 7  x 3
     *  digitosIniciales posicion 8  x 2
     *
     * Paso 2: Se suman los resultados y se obtiene total
     *
     * Paso 3: Divido total para 11, se guarda residuo. Se resta 11 menos el residuo.
     * El valor obtenido debe concordar con el digitoVerificador
     *
     * Nota: Cuando el residuo es cero(0) el dígito verificador debe ser 0.
     *
     * @param  string $digitosIniciales   Nueve primeros dígitos de RUC
     * @param  string $digitoVerificador  Décimo dígito de RUC
     * @param  string $tipo Tipo de identificador
     *
     * @return boolean
     *
     * @throws exception Cuando los digitosIniciales no concuerdan contra
     * el código verificador.
     */
    function algoritmoModulo11(digitosIniciales, digitoVerificador, tipo)
    {
        switch (tipo) {
            case 'ruc_privada':
                arrayCoeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
                break;
            case 'ruc_publica':
                arrayCoeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
                break;
            default:
                throw ('Tipo de Identificación no existe.');
                break;
        }

        digitoVerificador = parseInt(digitoVerificador);
        digitosIniciales = digitosIniciales.split("");

        total = 0;
        for(var a=0;a<digitosIniciales.length;a++) {
            valorPosicion = ( parseInt(digitosIniciales[a]) * arrayCoeficientes[a] );
            total = total + valorPosicion;
            }

        residuo =  total % 11;

        if (residuo == 0) {
            resultado = 0;
        } else {
            resultado = 11 - residuo;
        }

        if (resultado != digitoVerificador) {
            throw ('Dígitos iniciales no validan contra Dígito Idenficador');
        }

        return true;
    }
