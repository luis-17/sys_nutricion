<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Consulta extends CI_Controller {
	public function __construct(){
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->helper(array('fechas_helper'));
        $this->load->model(array('model_consulta'));
    }

	public function registrar_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error registrando la consulta.';

		/*aqui van las validaciones*/
		
		/*registro de datos*/
		if($this->model_consulta->m_registrar($allInputs)){
			$arrData['flag'] = 1;
			$arrData['message'] = 'Ha consulta ha sido registrada.';
		}

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function actualizar_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error actualizando la consulta.';


		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	
	public function anular_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error actualizando la consulta.';

	
		if($this->model_consulta->m_anular($allInputs['atencion']['idatencion'])){
			$arrData['flag'] = 1;
			$arrData['message'] = 'Consulta anulada.';
		}
	
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function cargar_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'No se encontro la atencion.';

		$atencion = $this->model_consulta->m_consultar_atencion($allInputs['atencion']['idatencion']);

		if(!empty($atencion['idatencion'])){
			$atencion['si_embarazo'] = $atencion['si_embarazo'] == 2 ? FALSE:TRUE;
			$arrData['flag'] = 0;
			$arrData['message'] = 'No se encontro la atencion.';
			$arrData['datos'] = $atencion;
		}

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
}
