<?php 
class Checkpay {
  var $CI; 
  function __construct() {
    $this->CI =& get_instance();  
  }          

  function pay_check() { 
    $fCheck = $this->CI->model_usuario->m_verificar_usuario_check_pago();
    if($this->CI->uri->uri_string != 'acceso' && $this->CI->uri->uri_string != 'Acceso/getSessionCI' ){ 
      if( $fCheck['mostrar_info_cobro'] == 3 ){
        $arrData['flag'] = 'pay_expired';
        $arrData['message'] = '<span class="text-danger">Tiene deuda vencida por servicios de infraestructura de servidor en la nube y mantenimiento del sistema informático.</span> <br /><br /> <b>CONTACTO </b>:  <br /> Luis Ricardo Luna Soto <br /> Freelancer - Desarrollador Web y Móvil <br /> CEL: 992566985 <br /> E-MAIL: luisls1717@gmail.com';
        echo json_encode($arrData);
        exit;
      }
    }
  } 
}
