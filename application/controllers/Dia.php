<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dia extends CI_Controller {
	public function __construct(){
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        // $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->model(array('model_dia'));
    }

    public function listar_dias_cbo(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$lista = $this->model_dia->m_cargar_dia_cbo();
		$arrListado = array();		
		foreach ($lista as $row) {
			array_push($arrListado,
				array(
					'id' => $row['iddia'],
					'nombre_dia' => $row['nombre_dia'],			
				)
			);
		}

    	$arrData['datos'] = $arrListado;
    	$arrData['message'] = '';
    	$arrData['flag'] = 1;
		if(empty($lista)){
			$arrData['flag'] = 0;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
}