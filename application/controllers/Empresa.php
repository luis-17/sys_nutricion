<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Empresa extends CI_Controller {
	public function __construct()
    {
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        // $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        
    }
	public function obtener_fila_demo()
	{
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$fDemo = array(
			'id'=> 1,
			'descripcion'=> 'demo'
		);

    	$arrData['datos'] = $fDemo;
    	$arrData['message'] = '';
    	$arrData['flag'] = 1;
		if(empty($fDemo)){ 
			$arrData['flag'] = 0;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
}
