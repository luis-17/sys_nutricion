<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PlanAlimentario extends CI_Controller {
	public function __construct(){
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->helper(array('fechas_helper','otros_helper'));
        $this->load->model(array('model_plan_alimentario','model_consulta'));
        $this->load->library('Fpdfext');
    }

	public function registrar_plan_alimentario(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		/*print_r($allInputs);
		exit();*/
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error registrando el plan alimentario.';

		/*validacion duplicado*/
		$consulta = $this->model_consulta->m_consultar_atencion($allInputs['consulta']['idatencion']);
		if(!empty($consulta['tipo_dieta'])){
			$arrData['flag'] = 0;
			$arrData['message'] = 'Ya existe un plan alimentario registrado.Intente editarlo.';
			$this->output
			    ->set_content_type('application/json')
			    ->set_output(json_encode($arrData));
			return;
		}

		/*validaciones dia*/
		$unTurnoLleno = FALSE;
		$unTurnoLlenoCompuesto = FALSE;
		if($allInputs['forma']== 'dia'){
			foreach ($allInputs['planDias'] as $key => $dia) {
				foreach ($dia['turnos'] as $turno) {
					if($turno['hora']['id']!='--' && $turno['minuto']['id'] != '--' && !empty($turno['indicaciones'])){
						$unTurnoLleno = TRUE;
					}

					if($turno['hora']['id']!='--' && $turno['minuto']['id'] != '--' && count($turno['alimentos'])>0){
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
				if($turno['hora']['id']!='--'  && $turno['minuto']['id'] != '--' && !empty($turno['indicaciones'])){
					$unTurnoLleno = TRUE;
				}

				if($turno['hora']['id']!='--'  && $turno['minuto']['id'] != '--' && count($turno['alimentos'])>0){
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

		if($allInputs['tipo']=='compuesto' && $allInputs['forma']== 'general'){
			if(!$unTurnoLlenoCompuesto){
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
						($allInputs['tipo'] == 'simple' && $turno['hora']['value']!='--'  && $turno['minuto']['value'] != '--' && !empty($turno['indicaciones']))
						|| ($allInputs['tipo'] == 'compuesto' && $turno['hora']['value']!='--'  && $turno['minuto']['value'] != '--' && count($turno['alimentos'])>0)
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
					($allInputs['tipo'] == 'simple' && $turno['hora']['value']!='--'  && $turno['minuto']['value'] != '--' && !empty($turno['indicaciones']))
					|| ($allInputs['tipo'] == 'compuesto' && $turno['hora']['value']!='--'  && $turno['minuto']['value'] != '--' && count($turno['alimentos'])>0)
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
									'idalimento' => $alimento['idalimento'],
									'valor' => $alimento['cantidad'],
								);
								if($this->model_plan_alimentario->m_registrar_dieta_turno_alimento($datos)){
									$idalimentomaster = GetLastId('idatenciondietaalim','atencion_dieta_alim');
									foreach ($alimento['alternativos'] as $alt) {
										if(!empty($alt['idalimento'])){
											$data = array(
												'idatenciondietaalim' => $idalimentomaster,
												'idalimento' => $alt['idalimento'],
											);
											if(!$this->model_plan_alimentario->m_registrar_dieta_turno_alimento_alt($data)){
												$errorEnCiclo = TRUE;
											}
										}
									}
								}else{
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

	public function cargar_plan_alimentario(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);		
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error consultando el plan alimentario.';		
		$arrayPlan = $this->genera_estructura_plan($allInputs);	
		$arrData['datos'] = $arrayPlan;
		$arrData['flag'] =1;
		$arrData['message'] = 'Ha sido cargado el plan alimentario.';

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	private function genera_estructura_plan($allInputs){
		$lista = $this->model_plan_alimentario->m_cargar_plan_alimentario($allInputs);
		/*print_r($lista);
		exit();*/
		$arrayPlan =array();
		foreach ($lista as $key => $row) {
			$arrayPlan[$row['iddia']]['id'] = $row['iddia'];
			$arrayPlan[$row['iddia']]['valoresGlobales'] = array();
			$arrayPlan[$row['iddia']]['nombre_dia'] = $row['nombre_dia'];
			$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['id'] = $row['idturno'];
			$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['valoresTurno'] = array();
			$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['descripcion'] = $row['descripcion_tu'];			
			$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['indicaciones'] = $row['indicaciones'];

			if($arrayPlan[$row['iddia']] != 1 && ($allInputs['tipo_dieta'] == 'SG' || $allInputs['tipo_dieta'] == 'CG' )){
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['idatenciondietaturno'] = NULL;
			}else{
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['idatenciondietaturno'] = $row['idatenciondietaturno'];
			}

			if(! empty($row['hora'])){
				$hora_string = darFormatoHora($row['hora']);
				$array = explode(" ", $hora_string);				
				$tiempo_str = $array[1];
				
				$array = explode(':', $array[0]);				
				$hora_str = $array[0];
				$min_str = $array[1];
				
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['tiempo'] = $tiempo_str;
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['hora'] = $hora_str;
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['min'] = $min_str;
			}else{
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['tiempo'] = 'am';
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['hora'] = '--';
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['min'] = '--';
			}

			if(!empty($row['idatenciondietaalim'])){
				if($arrayPlan[$row['iddia']] != 1 && ($allInputs['tipo_dieta'] == 'SG' || $allInputs['tipo_dieta'] == 'CG' )){
					$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['idatenciondietaalim'] = NULL;
				}else{
					$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['idatenciondietaalim'] = $row['idatenciondietaalim'];
				}

				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['cantidad'] = (float)$row['valor'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['idalimento'] = $row['idalimento'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['nombre'] = $row['nombre'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['medida_casera'] = $row['medida_casera'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['nombre_compuesto'] = $row['nombre'] . ' - '. strtoupper($row['medida_casera']);
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['calorias'] = (float)$row['calorias'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['proteinas'] = (float)$row['proteinas'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['grasas'] = (float)$row['grasas'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['carbohidratos'] = (float)$row['carbohidratos'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['gramo'] = (float)$row['gramo'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['ceniza'] = (float)$row['ceniza'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['calcio'] = (float)$row['calcio'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['fosforo'] = (float)$row['fosforo'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['zinc'] = (float)$row['zinc'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['hierro'] = (float)$row['hierro'];
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['fibra'] = (float)$row['fibra'];		
			}

			if(!empty($row['idatenciondietaalimalter'])){
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']]['alternativos'][$row['idatenciondietaalimalter']] = array(
					'idatenciondietaalimalter' => ($arrayPlan[$row['iddia']] != 1 && ($allInputs['tipo_dieta'] == 'SG' || $allInputs['tipo_dieta'] == 'SD' )) ? NULL : $row['idatenciondietaalimalter'],
					'idatenciondietaalim' => $row['idatenciondietaalim'],
					'cantidad' => (float)$row['valor'],
					'idalimento' => $row['idalimento_alter'],
					'nombre' => $row['nombre_alter'],
					'medida_casera' => $row['medida_casera_alter'],
					'nombre_compuesto' => $row['nombre_alter'] . ' - '. strtoupper($row['medida_casera_alter']),
					'calorias' => (float)$row['calorias_alter'],
					'proteinas' => (float)$row['proteinas_alter'],
					'grasas' => (float)$row['grasas_alter'],
					'carbohidratos' => (float)$row['carbohidratos_alter'],
					'gramo' => (float)$row['gramo_alter'],
					'ceniza' => (float)$row['ceniza_alter'],
					'calcio' => (float)$row['calcio_alter'],
					'fosforo' => (float)$row['fosforo_alter'],
					'zinc' => (float)$row['zinc_alter'],
					'hierro' => (float)$row['hierro_alter'],
					'fibra' => (float)$row['fibra_alter'],				
				);
			}					
		}

		$arrayPlan = array_values($arrayPlan);
		return $arrayPlan;
	}

	public function actualizar_plan_alimentario(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);		
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error actualizando el plan alimentario.';

		$unTurnoLleno = FALSE;
		$unTurnoLlenoCompuesto = FALSE;
		if($allInputs['forma']== 'dia'){
			foreach ($allInputs['planDias'] as $key => $dia) {
				foreach ($dia['turnos'] as $turno) {
					if($turno['hora']['id']!='--' && $turno['minuto']['id'] != '--' && !empty($turno['indicaciones'])){
						$unTurnoLleno = TRUE;
					}

					if($turno['hora']['id']!='--' && $turno['minuto']['id'] != '--' && !empty($turno['alimentos']) && count($turno['alimentos'])>0){
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
				if($turno['hora']['id']!='--'  && $turno['minuto']['id'] != '--' && !empty($turno['indicaciones'])){
					$unTurnoLleno = TRUE;
				}

				if($turno['hora']['id']!='--'  && $turno['minuto']['id'] != '--' && !empty($turno['alimentos']) && count($turno['alimentos'])>0){
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

		if($allInputs['tipo']=='compuesto' && $allInputs['forma']== 'general'){
			if(!$unTurnoLlenoCompuesto){
				$arrData['flag'] = 0;
				$arrData['message'] = 'Debe ingresar al menos las indicaciones de un turno.';
				$this->output
				    ->set_content_type('application/json')
				    ->set_output(json_encode($arrData));
				return;
			}
		}

		$consulta = $this->model_consulta->m_consultar_atencion($allInputs['consulta']['idatencion']);

		/*actualizacion de datos*/
		$errorEnCiclo = FALSE;
		$this->db->trans_start();


		$this->model_plan_alimentario->m_anular_todo_dieta_turno($allInputs['consulta']);
		if($allInputs['forma'] == 'dia'){
			foreach ($allInputs['planDias'] as $key => $dia) {				
				foreach ($dia['turnos'] as $turno) {
					if(
						($allInputs['tipo'] == 'simple' && $turno['hora']['value']!='--'  && $turno['minuto']['value'] != '--' && !empty($turno['indicaciones']))
						|| ($allInputs['tipo'] == 'compuesto' && $turno['hora']['value']!='--'  && $turno['minuto']['value'] != '--' && !empty($turno['alimentos']) && count($turno['alimentos'])>0)
					){
						
						if($consulta['tipo_dieta'] == 'CD' || $consulta['tipo_dieta'] == 'CG'){
							if(!empty($turno['idatenciondietaturno'])){
								$this->model_plan_alimentario->m_anular_todo_dieta_alimento($turno);
							}
						}							

						if($turno['tiempo']['value']=='pm'){
							$hora = (((int)$turno['hora']['value']) + 12) .':'.$turno['minuto']['value'].':00';
						}else{
							$hora = $turno['hora']['value'].':'.$turno['minuto']['value'].':00';
						}

						if(empty($turno['idatenciondietaturno'])){
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

							$idatenciondietaturno = GetLastId('idatenciondietaturno','atencion_dieta_turno');
						}else{
							$datos = array(
								'idatenciondietaturno' => $turno['idatenciondietaturno'],
								'idatencion' => $allInputs['consulta']['idatencion'],
								'iddia' => $dia['id'],
								'idturno' => $turno['id'],
								'indicaciones' => empty($turno['indicaciones'])? null : $turno['indicaciones'],
								'hora' => $hora,
							);

							if(!$this->model_plan_alimentario->m_actualizar_dieta_turno($datos)){
								$errorEnCiclo = TRUE;						
							}

							$idatenciondietaturno = $turno['idatenciondietaturno'];
						}
						
						if(!$errorEnCiclo){
							if($allInputs['tipo'] == 'compuesto'){
								//inserto detalle de alimentos
								$datosTurno = array(
									'idatenciondietaturno' => $idatenciondietaturno
								);

								if(!empty($turno['idatenciondietaturno'])){
									$this->model_plan_alimentario->m_anular_todo_dieta_alimento($datosTurno);
								}
								
								foreach ($turno['alimentos'] as $alimento) {
									if(!empty($alimento['idatenciondietaalim']))
										$this->model_plan_alimentario->m_anular_todo_dieta_alimento_alter($alimento); 

									if(empty($alimento['idatenciondietaalim'])){
										$datos = array(
											'idatenciondietaturno' => $idatenciondietaturno,
											'idalimento' => $alimento['idalimento'],
											'valor' => $alimento['cantidad'],
										);
										if(!$this->model_plan_alimentario->m_registrar_dieta_turno_alimento($datos)){
											$errorEnCiclo = TRUE;
										}
									}else{
										$datos = array(
											'idatenciondietaalim' => $alimento['idatenciondietaalim'],
											'idatenciondietaturno' => $idatenciondietaturno,
											'idalimento' => $alimento['idalimento'],
											'valor' => $alimento['cantidad'],
										);
										if(!$this->model_plan_alimentario->m_actualizar_dieta_alimento($datos)){
											$errorEnCiclo = TRUE;
										}
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
					($allInputs['tipo'] == 'simple' && $turno['hora']['value']!='--'  && $turno['minuto']['value'] != '--' && !empty($turno['indicaciones']))
					|| ($allInputs['tipo'] == 'compuesto' && $turno['hora']['value']!='--'  && $turno['minuto']['value'] != '--' && !empty($turno['alimentos']) && count($turno['alimentos'])>0)
				){
					if($consulta['tipo_dieta'] == 'CD' || $consulta['tipo_dieta'] == 'CG'){
						if(!empty($turno['idatenciondietaturno'])){
							$this->model_plan_alimentario->m_anular_todo_dieta_alimento($turno);
						}
					}							

					if($turno['tiempo']['value']=='pm'){
						$hora = (((int)$turno['hora']['value']) + 12) .':'.$turno['minuto']['value'].':00';
					}else{
						$hora = $turno['hora']['value'].':'.$turno['minuto']['value'].':00';
					}

					if(empty($turno['idatenciondietaturno'])){

						$datos = array(
							'idatencion' => $allInputs['consulta']['idatencion'],
							'idturno' => $turno['id'],
							'indicaciones' => empty($turno['indicaciones'])? null : $turno['indicaciones'],
							'hora' => $hora,
						);

						if(!$this->model_plan_alimentario->m_registrar_dieta_turno($datos)){
							$errorEnCiclo = TRUE;						
						}

						$idatenciondietaturno = GetLastId('idatenciondietaturno','atencion_dieta_turno');
					}else{
						$datos = array(
							'idatenciondietaturno' => $turno['idatenciondietaturno'],
							'idatencion' => $allInputs['consulta']['idatencion'],
							'idturno' => $turno['id'],
							'indicaciones' => empty($turno['indicaciones'])? null : $turno['indicaciones'],
							'hora' => $hora,
						);

						if(!$this->model_plan_alimentario->m_actualizar_dieta_turno($datos)){
							$errorEnCiclo = TRUE;						
						}

						$idatenciondietaturno = $turno['idatenciondietaturno'];
					}
					
					if(!$errorEnCiclo){
						if($allInputs['tipo'] == 'compuesto'){
							//inserto detalle de alimentos
							$datosTurno = array(
								'idatenciondietaturno' => $idatenciondietaturno
							);

							if(!empty($turno['idatenciondietaturno'])){
								$this->model_plan_alimentario->m_anular_todo_dieta_alimento($datosTurno);
							}

							foreach ($turno['alimentos'] as $alimento) {
								if(!empty($alimento['idatenciondietaalim']))
									$this->model_plan_alimentario->m_anular_todo_dieta_alimento_alter($alimento); 

								if(empty($alimento['idatenciondietaalim'])){
									$datos = array(
										'idatenciondietaturno' => $idatenciondietaturno,
										'idalimento' => $alimento['idalimento'],
										'valor' => $alimento['cantidad'],
									);
									if($this->model_plan_alimentario->m_registrar_dieta_turno_alimento($datos)){
										$idalimentomaster = GetLastId('idatenciondietaalim','atencion_dieta_alim');
										
									}else{
										$errorEnCiclo = TRUE;
									}
								}else{
									$datos = array(
										'idatenciondietaalim' => $alimento['idatenciondietaalim'],
										'idatenciondietaturno' => $idatenciondietaturno,
										'idalimento' => $alimento['idalimento'],
										'valor' => $alimento['cantidad'],
									);
									if($this->model_plan_alimentario->m_actualizar_dieta_alimento($datos)){
										$idalimentomaster = $alimento['idatenciondietaalim'];
										
									}else{
										$errorEnCiclo = TRUE;
									}
								}

								if(!$errorEnCiclo){
									foreach ($alimento['alternativos'] as $alt) {
										if(!empty($alt['idalimento'])){
											if(empty($alt['idatenciondietaalimalter'])){
												$data = array(
													'idatenciondietaalim' => $idalimentomaster,
													'idalimento' => $alt['idalimento'],
												);
												if(!$this->model_plan_alimentario->m_registrar_dieta_turno_alimento_alt($data)){
													$errorEnCiclo = TRUE;
												}
											}else{
												$data = array(
													'idatenciondietaalimalter' => $alt['idatenciondietaalimalter'],
													'idatenciondietaalim' => $idalimentomaster,
													'idalimento' => $alt['idalimento'],
												);
												if(!$this->model_plan_alimentario->m_actualizar_dieta_turno_alimento_alter($data)){
													$errorEnCiclo = TRUE;
												}
											}												
										}
									}
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
			$arrData['message'] = 'Se ha actualizado el plan alimentario exitosamente.';
		}	
		$this->db->trans_complete();

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));		
	}

	private function headerPlan($allInputs, $consulta){
		$this->pdf->Image('assets/images/dinamic/logo.png',8,8,50);
		$this->pdf->SetFont('Arial','',14);
	    
	    $this->pdf->Cell(0,5,'Nombre: ' . ucwords(strtolower($allInputs['cita']['cliente']['paciente'])),0,1,'R');
	    $this->pdf->Ln(0);
    	
    	$fecha = date('d/m/Y',strtotime($allInputs['consulta']['fecha_atencion']));
	    $this->pdf->Cell(0,5,'Fecha: '.$fecha,0,1,'R');

	    if($consulta['tipo_dieta'] == 'SD' || $consulta['tipo_dieta'] == 'CD'){
	    	$this->pdf->SetFont('Arial','B',14);
	    	$this->pdf->Cell(0,5,'DIETA SEMANAL',0,1,'C');
	    }

	    $this->pdf->Ln(10);
	}

	private function footerPlan($consulta){
		$this->pdf->SetLeftMargin(0);
		$this->pdf->SetRightMargin(0);
		$this->pdf->SetY(-23);

	    $this->pdf->SetTextColor(83,83,83);
		$this->pdf->SetFillColor(204,211,211);
		$this->pdf->SetFont('Arial','I',11);
		$y = $this->pdf->GetY();
		$this->pdf->Rect(0, $y, $this->pdf->GetPageWidth(), 25, 'F');
		$texto = '* Recomendaciones: ' . ucfirst(strtolower($consulta['indicaciones_dieta']));

		$this->pdf->SetLeftMargin(10);
		$this->pdf->SetRightMargin(70);
		$this->pdf->SetXY(10,$y+3);
		//$this->pdf->MultiCell(0, 25, utf8_decode($texto), 0, 'L', false);			    	
		$this->pdf->Write(5, utf8_decode($texto));			    	

		$this->pdf->SetRightMargin(10);
		$this->pdf->SetFont('Arial','',17);
		$this->pdf->SetTextColor(0,0,0);
		$this->pdf->SetXY(155,$y+1);
		$this->pdf->Cell(60, 12, utf8_decode('PRÓXIMA CITA:'), 0, 'C', false);	

		if(empty($consulta['prox_cita'])){
			$this->pdf->SetXY(167,$y+8);
			$this->pdf->Cell(60, 12, 'no tiene', 0, 'C', false);
		}else{
			$this->pdf->SetXY(163,$y+8);
			$this->pdf->Cell(60, 12, utf8_decode(date('d/m/Y',strtotime($consulta['prox_cita']))), 0, 'C', false);
		}		
	}

	public function generar_pdf_plan(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['message'] = '';
    	$arrData['flag'] = 1;    	

    	$arrayPlan = $this->genera_estructura_plan($allInputs['consulta']);
		$consulta = $this->model_consulta->m_consultar_atencion($allInputs['consulta']['idatencion']);

    	$this->pdf = new Fpdfext();
		$this->pdf->AddPage();
    	$this->pdf->SetMargins(0, 10, 10);  
    	$this->pdf->SetAutoPageBreak(false);

    	//header
    	$this->headerPlan($allInputs, $consulta);			    

	    //body 
		if($consulta['tipo_dieta'] == 'SG' || $consulta['tipo_dieta'] == 'CG'){
			$plan = $arrayPlan[1];
			foreach ($plan['turnos'] as $key => $turno) {
				if($turno['id'] % 2 != 0){
					$this->pdf->SetTextColor(255,255,255);
					if($turno['id']==1){
						$this->pdf->SetFillColor(0,156,222);				    		
					}

					if($turno['id']==3){
						$this->pdf->SetFillColor(106,220,0);	
					}
					
					if($turno['id']==5){
						$this->pdf->SetFillColor(255,0,100);	
					}
					$this->pdf->SetFont('Arial','B',14);
			    	$this->pdf->Cell(50,6,utf8_decode('       ' . ucwords(strtolower($turno['descripcion']))),0,1,'L',true);
			    	$this->pdf->Ln(1);
			    	$this->pdf->SetTextColor(83,83,83);
			    	$this->pdf->SetFillColor(255,255,255);
			    	$this->pdf->SetFont('Arial','',12);
					$this->pdf->SetLeftMargin(10);
			    	if($consulta['tipo_dieta'] == 'SG'){
			    		if(!empty($turno['indicaciones'])){
			    			$this->pdf->MultiCell(0,5,utf8_decode('* '.ucfirst(strtolower($turno['indicaciones']))),0,1,'L',true);	
			    		}			    					    		
			    	}

			    	if($consulta['tipo_dieta'] == 'CG'){
			    		if(!empty($turno['alimentos'])){			    			
				    		foreach ($turno['alimentos'] as $ind => $alm) {
				    			$alm_nombre = $alm['medida_casera'] . ' ' . $alm['nombre'];
				    			if(!empty($alm['alternativos'])){
				    				$text = '';
				    				foreach ($alm['alternativos'] as $index => $alm_alter) {
				    					$text .= ' o ' . $alm_alter['medida_casera'] . ' ' . $alm_alter['nombre'];
				    				}
				    				$this->pdf->MultiCell(0,5,utf8_decode('* '.ucfirst(strtolower($alm_nombre . $text))),0,1,'L',true);
				    			}else{
				    				$this->pdf->MultiCell(0,5,utf8_decode('* '.ucfirst(strtolower($alm_nombre))),0,1,'L',true);
				    			}
				    		}
			    		}
			    	}

			    	$this->pdf->SetLeftMargin(0);
			    	$this->pdf->Ln(1);
				}else{
			    	$this->pdf->SetLeftMargin(10);
			    	$this->pdf->SetTextColor(83,83,83);
			    	$this->pdf->SetFillColor(255,255,255);
			    	
			    	if($consulta['tipo_dieta'] == 'SG'){
			    		$this->pdf->MultiCell(0, 5, utf8_decode(strtoupper($turno['descripcion']) . ': ' . ucfirst(strtolower($turno['indicaciones']))));		    		
			    	}

			    	if($consulta['tipo_dieta'] == 'CG'){
			    		if(!empty($turno['alimentos'])){			    			
				    		foreach ($turno['alimentos'] as $ind => $alm) {
				    			$alm_nombre = $alm['medida_casera'] . ' ' . $alm['nombre'];
				    			if(!empty($alm['alternativos'])){
				    				$text = '';
				    				foreach ($alm['alternativos'] as $index => $alm_alter) {
				    					$text .= ' o ' . $alm_alter['medida_casera'] . ' ' . $alm_alter['nombre'];
				    				}
				    				$this->pdf->MultiCell(0,5,utf8_decode(strtoupper($turno['descripcion']) . ': ' . ucfirst(strtolower($alm_nombre . $text))),0,1,'L',true);
				    			}else{
				    				$this->pdf->MultiCell(0,5,utf8_decode(strtoupper($turno['descripcion']) . ': ' . ucfirst(strtolower($alm_nombre))),0,1,'L',true);
				    			}
				    		}
			    		}		    		
			    	}

			    	$this->pdf->Ln(1);
			    	$this->pdf->SetLeftMargin(0);
			    	$this->pdf->Ln(5);
				}
			}
		}	

		if($consulta['tipo_dieta'] == 'SD' || $consulta['tipo_dieta'] == 'CD'){

		}    

		//footer
    	$this->footerPlan($consulta);

    	//salida
		$timestamp = date('YmdHis');
		$result = $this->pdf->Output( 'F','assets/images/dinamic/pdfTemporales/tempPDF_'. $timestamp .'.pdf' );

		$arrData['urlTempPDF'] = 'assets/images/dinamic/pdfTemporales/tempPDF_'. $timestamp .'.pdf';
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
}
