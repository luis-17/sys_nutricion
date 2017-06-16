<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PlanAlimentario extends CI_Controller {
	public function __construct(){
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->helper(array('fechas_helper','otros_helper'));
        $this->load->model(array('model_plan_alimentario','model_consulta'));
    }

	public function registrar_plan_alimentario(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		/*print_r($allInputs);
		exit();*/
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error registrando el plan alimentario.';

		/*validaciones dia*/
		$unTurnoLleno = FALSE;
		$unTurnoLlenoCompuesto = FALSE;
		if($allInputs['forma']== 'dia'){
			foreach ($allInputs['planDias'] as $key => $dia) {
				foreach ($dia['turnos'] as $turno) {
					if($turno['hora']['id']!=0  && $turno['minuto']['id'] != 0 && !empty($turno['indicaciones'])){
						$unTurnoLleno = TRUE;
					}

					if($turno['hora']['id']!=0  && $turno['minuto']['id'] != 0 && count($turno['alimentos'])>0){
						$unTurnoLlenoCompuesto = TRUE;
					}
				}
			}
		}
		

		if($allInputs['tipo']=='simple' && $allInputs['forma']== 'dia'){
			if(!$unTurnoLleno){
				$arrData['flag'] = 0;
				$arrData['message'] = 'Debe ingresar al menos las indicaciones de un turno.';
				$this->output
				    ->set_content_type('application/json')
				    ->set_output(json_encode($arrData));
				return;
			}
		}

		if($allInputs['tipo']=='compuesto' && $allInputs['forma']== 'dia'){
			if(!$unTurnoLlenoCompuesto){
				$arrData['flag'] = 0;
				$arrData['message'] = 'Debe ingresar al menos las indicaciones de un turno.';
				$this->output
				    ->set_content_type('application/json')
				    ->set_output(json_encode($arrData));
				return;
			}
		}		
		
		/*validaciones general*/
		$unTurnoLleno = FALSE;
		$unTurnoLlenoCompuesto = FALSE;
		if($allInputs['forma'] == 'general'){
			foreach ($allInputs['planGeneral']['turnos'] as $turno) {
				if($turno['hora']['id']!=0  && $turno['minuto']['id'] != 0 && !empty($turno['indicaciones'])){
					$unTurnoLleno = TRUE;
				}

				if($turno['hora']['id']!=0  && $turno['minuto']['id'] != 0 && count($turno['alimentos'])>0){
					$unTurnoLlenoCompuesto = TRUE;
				}
				
			}
		}

		if($allInputs['tipo']=='simple' && $allInputs['forma']== 'general'){
			if(!$unTurnoLleno){
				$arrData['flag'] = 0;
				$arrData['message'] = 'Debe ingresar al menos las indicaciones de un turno.';
				$this->output
				    ->set_content_type('application/json')
				    ->set_output(json_encode($arrData));
				return;
			}
		}

		/*print_r($allInputs);
		exit();*/

		/*registro de datos*/
		$errorEnCiclo = FALSE;
		$this->db->trans_start();

		if($allInputs['forma'] == 'dia'){
			foreach ($allInputs['planDias'] as $key => $dia) {
				foreach ($dia['turnos'] as $turno) {
					if(
						($allInputs['tipo'] == 'simple' && $turno['hora']['value']!=0  && $turno['minuto']['value'] != 0 && !empty($turno['indicaciones']))
						|| ($allInputs['tipo'] == 'compuesto' && $turno['hora']['value']!=0  && $turno['minuto']['value'] != 0 && count($turno['alimentos'])>0)
					){
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
						}
						if(!$errorEnCiclo){
							if($allInputs['tipo'] == 'compuesto'){
								$idatenciondietaturno = GetLastId('idatenciondietaturno','atencion_dieta_turno');
								//inserto detalle de alimentos
								foreach ($turno['alimentos'] as $alimento) {
									$datos = array(
										'idatenciondietaturno' => $idatenciondietaturno,
										'iddia' => $dia['id'],
										'idalimento' => $alimento['idalimento'],
										'valor' => $alimento['cantidad'],
									);
									if(!$this->model_plan_alimentario->m_registrar_dieta_turno_alimento($datos)){
										$errorEnCiclo = TRUE;
									}
								}
							}
						}
					}
				}
			}
		}
		if($allInputs['forma'] == 'general'){
			foreach ($allInputs['planGeneral']['turnos'] as $turno) {
				if(
					($allInputs['tipo'] == 'simple' && $turno['hora']['value']!=0  && $turno['minuto']['value'] != 0 && !empty($turno['indicaciones']))
					|| ($allInputs['tipo'] == 'compuesto' && $turno['hora']['value']!=0  && $turno['minuto']['value'] != 0 && count($turno['alimentos'])>0)
				){
					if($turno['tiempo']['value']=='pm'){
						$hora = (((int)$turno['hora']['value']) + 12) .':'.$turno['minuto']['value'].':00';
					}else{
						$hora = $turno['hora']['value'].':'.$turno['minuto']['value'].':00';
					}

					$datos = array(
						'idatencion' => $allInputs['consulta']['idatencion'],
						'idturno' => $turno['id'],
						'indicaciones' => empty($turno['indicaciones'])? null : $turno['indicaciones'],
						'hora' => $hora,
					);

					if(!$this->model_plan_alimentario->m_registrar_dieta_turno($datos)){
						$errorEnCiclo = TRUE;						
					}
					if(!$errorEnCiclo){
						if($allInputs['tipo'] == 'compuesto'){
							$idatenciondietaturno = GetLastId('idatenciondietaturno','atencion_dieta_turno');
							//inserto detalle de alimentos
							foreach ($turno['alimentos'] as $alimento) {
								$datos = array(
									'idatenciondietaturno' => $idatenciondietaturno,
									'iddia' => $dia['id'],
									'idalimento' => $alimento['idalimento'],
									'valor' => $alimento['cantidad'],
								);
								if(!$this->model_plan_alimentario->m_registrar_dieta_turno_alimento($datos)){
									$errorEnCiclo = TRUE;
								}
							}
						}
					}
				}
			}
		}

		$tipo_dieta = '';
		if($allInputs['tipo']=='simple' && $allInputs['forma']== 'general'){
			$tipo_dieta = 'SG';
		}else if($allInputs['tipo']=='simple' && $allInputs['forma']== 'dia'){
			$tipo_dieta = 'SD';
		}else if($allInputs['tipo']=='compuesto' && $allInputs['forma']== 'general'){
			$tipo_dieta = 'CG';
		}else if($allInputs['tipo']=='compuesto' && $allInputs['forma']== 'dia'){
			$tipo_dieta = 'CD';
		}

		$datos = array(
			'tipo_dieta' => $tipo_dieta,
			'indicaciones_dieta' => empty($allInputs['indicaciones']) ? NULL : $allInputs['indicaciones'],
			'idatencion' => $allInputs['consulta']['idatencion']
		);

		if(!$errorEnCiclo && $this->model_consulta->m_actualizar_desde_plan($datos)){
			$arrData['flag'] = 1;
			$arrData['message'] = 'Se ha registrado el plan alimentario exitosamente.';
		}	
		$this->db->trans_complete();	

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

}
