<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PlanAlimentario extends CI_Controller {
	public function __construct(){
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->helper(array('fechas_helper'));
        $this->load->model(array('model_plan_alimentario'));
    }

	public function registrar_plan_alimentario(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error registrando el plan alimentario.';

		/*validaciones*/
		$horaNoSeleccionada = FALSE;
		$sinIndicaciones = FALSE;
		foreach ($allInputs['plan'] as $key => $dia) {
			foreach ($dia['turnos'] as $turno) {
				if($turno['hora']['value']==0  || $turno['minuto']['value'] == 0){
					$horaNoSeleccionada = TRUE;
				}

				if(empty($turno['indicaciones'])){
					$sinIndicaciones = TRUE;
				}
			}
		}
		
		if($horaNoSeleccionada){
			$arrData['flag'] = 0;
			$arrData['message'] = 'Debe ingresar todas las horas.';
			$this->output
			    ->set_content_type('application/json')
			    ->set_output(json_encode($arrData));
			return;
		}

		if($allInputs['tipo']=='simple'){
			if($sinIndicaciones){
				$arrData['flag'] = 0;
				$arrData['message'] = 'Debe ingresar todas las indicaciones.';
				$this->output
				    ->set_content_type('application/json')
				    ->set_output(json_encode($arrData));
				return;
			}
		}		
		
		/*registro de datos*/
		$errorEnCiclo = FALSE;
		$this->db->trans_start();
		foreach ($allInputs['plan'] as $key => $dia) {
			foreach ($dia['turnos'] as $turno) {
				if($turno['tiempo']['value']=='pm'){
					$hora = (((int)$turno['hora']['value']) + 12) .':'.$turno['minuto']['value'].':00';
				}else{
					$hora = $turno['hora']['value'].':'.$turno['minuto']['value'].':00';
				}

				$datos = array(
					'idatencion' => $allInputs['consulta']['idatencion'],
					'iddia' => $dia['id'],
					'idturno' => $turno['id'],
					'indicaciones' => empty($turno['indicaciones'])? null : $turno['indicaciones'],
					'hora' => $hora,
				);

				if(!$this->model_plan_alimentario->m_registrar_dieta_turno($datos)){
					$errorEnCiclo = TRUE;
					if($allInputs['tipo'] == 'compuesto'){
						//inserto detalle de alimentos
					}
				}
			}
		}

		if(!$errorEnCiclo){
			$arrData['flag'] = 1;
			$arrData['message'] = 'Se ha registrado el plan alimentario exitosamente.';
		}

		$this->db->trans_complete();

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

}
