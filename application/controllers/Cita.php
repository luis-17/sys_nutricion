<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cita extends CI_Controller {
	public function __construct(){
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->helper(array('fechas_helper'));
        $this->load->model(array('model_cita'));
    }

    public function listar_citas(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$lista = $this->model_cita->m_cargar_citas();
		$arrListado = array();		
		foreach ($lista as $row) {
			if(empty($row['idatencion'])){
				$className = array('bg-info');
			}else{
				$className = array('bg-success');
			}
			array_push($arrListado,
				array(
					'id' => $row['idcita'],
					'hora_desde' => $row['hora_desde'],
					'hora_hasta' => $row['hora_hasta'],
					'estado_ci' => $row['estado_ci'],
					'fecha' => $row['fecha'],
					'cliente' => array(
							'idcliente' => $row['idcliente'],
							'cod_historia_clinica' => $row['cod_historia_clinica'],
							'nombre' => $row['nombre'],
							'apellidos' => $row['apellidos'],
							'sexo' => $row['sexo'],
						),
					'profesional' => array(
							'idprofesional' => $row['idprofesional'],
							'profesional' => $row['profesional'],
						),
					'ubicacion' => array(
							'idubicacion' => $row['idubicacion'],
							'descripcion_ub' => $row['descripcion_ub'],
						),
					'atencion' => array(
							'idatencion' => $row['idatencion'],
							'fecha_atencion' => $row['fecha_atencion'],
							'diagnostico_notas' => $row['diagnostico_notas']
						),
					'className' => $className,
					'start' => $row['fecha'] .' '. $row['hora_desde'],
					'title' => darFormatoHora($row['hora_desde']). ' - ' . darFormatoHora($row['hora_hasta']),
					'allDay' => FALSE,
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

	public function ver_popup_formulario(){
		$this->load->view('cita/cita_formView');
	}

	public function registrar_cita(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = '';

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function drop_cita(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = '';

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}


	public function actualizar_cita(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = '';

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));	
	}
}
