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
				$className = array('b-l b-2x b-primary');
			}else{
				$className = array('b-l b-2x b-success');
			}
			array_push($arrListado,
				array(
					'id' => $row['idcita'],
					'hora_desde_sql' => $row['hora_desde'],
					'hora_hasta_sql' => $row['hora_hasta'],
					'hora_desde' => strtotime($row['hora_desde']),
					'hora_hasta' => strtotime($row['hora_hasta']),
					'estado_ci' => $row['estado_ci'],
					'fecha' => $row['fecha'],
					'cliente' => array(
							'idcliente' => $row['idcliente'],
							'cod_historia_clinica' => $row['cod_historia_clinica'],
							'nombre' => $row['nombre'],
							'apellidos' => $row['apellidos'],
							'sexo' => $row['sexo'],
						),
					'paciente' => $row['nombre'] . ' ' . $row['apellidos'],
					'profesional' => array(
							'idprofesional' => $row['idprofesional'],
							'profesional' => $row['profesional'],
						),
					'ubicacion' => array(
							'id' => $row['idubicacion'],
							'descripcion' => $row['descripcion_ub'],
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
		$arrData['message'] = 'Ha ocurrido un error registrando la cita.';

		/*aqui van las validaciones*/

		$data = array(
			'idcliente' => $allInputs['paciente']['idcliente'],
			'idubicacion' => $allInputs['ubicacion']['id'],
			'idprofesional' => $this->sessionVP['idprofesional'],
			'fecha' => Date('Y-m-d',strtotime($allInputs['fecha'])),
			'hora_desde' => Date('H:i:s',strtotime($allInputs['hora_desde'])),
			'hora_hasta' => Date('H:i:s',strtotime($allInputs['hora_hasta'])),
			'createdAt' => date('Y-m-d H:i:s'),
			'updatedAt' => date('Y-m-d H:i:s')
			);

		if($this->model_cita->m_registrar($data)){
			$arrData['flag'] = 1;
			$arrData['message'] = 'Cita registrada.';
		}
	
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function drop_cita(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Error';

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function actualizar_cita(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error actualizando la cita.';

		$data = array(
			'idcliente' => $allInputs['cliente']['idcliente'],
			'idubicacion' => $allInputs['ubicacion']['id'],
			'idprofesional' => $this->sessionVP['idprofesional'],
			'fecha' => Date('Y-m-d',strtotime($allInputs['fecha'])),
			'hora_desde' => Date('H:i:s',strtotime($allInputs['hora_desde'])),
			'hora_hasta' => Date('H:i:s',strtotime($allInputs['hora_hasta'])),
			'updatedAt' => date('Y-m-d H:i:s')
			);

		if($this->model_cita->m_actualizar($data, $allInputs['id'])){
			$arrData['flag'] = 1;
			$arrData['message'] = 'Cita actualizada.';
		}
	
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function anular_cita(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error actualizando la cita.';

	
		if($this->model_cita->m_anular($allInputs['id'])){
			$arrData['flag'] = 1;
			$arrData['message'] = 'Cita anulada.';
		}
	
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

}
