<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PlanAlimentario extends CI_Controller {
	public function __construct(){
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->helper(array('fechas_helper','otros_helper'));
        $this->load->model(array('model_plan_alimentario','model_consulta'));
        $this->load->library('fpdfext');
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

		$lista = $this->model_plan_alimentario->m_cargar_plan_alimentario($allInputs);

		$arrayPlan =array();
		foreach ($lista as $key => $row) {
			$arrayPlan[$row['iddia']]['id'] = $row['iddia'];
			$arrayPlan[$row['iddia']]['nombre_dia'] = $row['nombre_dia'];
			$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['id'] = $row['idturno'];
			$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['descripcion'] = $row['descripcion_tu'];
			$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['idatenciondietaturno'] = $row['idatenciondietaturno'];
			$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['indicaciones'] = $row['indicaciones'];

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
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['hora'] = 0;
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['min'] = 0;
			}

			$alimento = array(
				'idatenciondietaalim' => $row['idatenciondietaalim'],
				'cantidad' => $row['valor'],
				'idalimento' => $row['idalimento'],
				'nombre' => $row['nombre'],
				'medida_casera' => $row['medida_casera'],
				'nombre_compuesto' => $row['nombre'] . ' - '. strtoupper($row['medida_casera']),
				'calorias' => (float)$row['calorias'],
				'proteinas' => (float)$row['proteinas'],
				'grasas' => (float)$row['grasas'],
				'carbohidratos' => (float)$row['carbohidratos'],
				'gramo' => (float)$row['gramo'],
				'ceniza' => (float)$row['ceniza'],
				'calcio' => (float)$row['calcio'],
				'fosforo' => (float)$row['fosforo'],
				'zinc' => (float)$row['zinc'],
				'hierro' => (float)$row['hierro'],
				'fibra' => (float)$row['fibra'],				
			);

			$alternativo = array(
				'idatenciondietaalimalter' => $row['idatenciondietaalimalter'],
				'idatenciondietaalim' => $row['idatenciondietaalim'],
				'cantidad' => $row['valor'],
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

			if(!empty($row['idatenciondietaalimalter'])){
				$alimento['alternativos'][$row['idatenciondietaalimalter']] = $alternativo;
			}			

			$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'] = array();
			if(!empty($row['idatenciondietaalim'])){
				$arrayPlan[$row['iddia']]['turnos'][$row['idturno']]['alimentos'][$row['idatenciondietaalim']] = $alimento;
			}			
		}

		$arrayPlan = array_values($arrayPlan);
		$arrData['datos'] = $arrayPlan;
		$arrData['flag'] =1;
		$arrData['message'] = 'Ha sido cargado el plan alimentario.';

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function actualizar_plan_alimentario(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);		
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error consultando el plan alimentario.';

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));		
	}

	public function generar_pdf_plan(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData = array();
		$arrData['message'] = '';
    	$arrData['flag'] = 1;
    	// var_dump($allInputs); exit();
    	$this->pdf = new Fpdfext();
    	$this->pdf->AddPage();
		$this->pdf->SetFont('Arial','B',16);

		$this->pdf->Cell(40,10,utf8_decode('¡Hola, Mundo!'),1);
		// if($this->model_paciente->m_anular($allInputs)){
		// 	$arrData['message'] = 'Se anularon los datos correctamente';
  		//  $arrData['flag'] = 1;
		// }
		$timestamp = date('YmdHis');
		$result = $this->pdf->Output( 'F','assets/images/dinamic/pdfTemporales/tempPDF_'. $timestamp .'.pdf' );

		$arrData['urlTempPDF'] = 'assets/images/dinamic/pdfTemporales/tempPDF_'. $timestamp .'.pdf';
	    // $arrData = array(
	    //   'urlTempPDF'=> 'assets/images/dinamic/pdfTemporales/tempPDF_'. $timestamp .'.pdf'
	    // );

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
}
