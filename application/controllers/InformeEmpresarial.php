<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class InformeEmpresarial extends CI_Controller {
	public function __construct(){
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        // $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->helper(array('fechas_helper'));
        $this->load->model(array('model_informe_empresarial'));
    }

    public function listar_informe_empresarial(){

    	ini_set('xdebug.var_display_max_depth', 5);
  		ini_set('xdebug.var_display_max_children', 256);
		ini_set('xdebug.var_display_max_data', 1024);

		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		// $lista = $this->model_informe_empresarial->m_cargar_informe_empresarial($allInputs);
		$arrListado = array();

		// PACIENTES ATENDIDOS 
		$fPacAte = $this->model_informe_empresarial->cargar_total_pacientes_atendidos($allInputs); 
		if( empty($fPacAte) ){
			$fPacAte['contador'] = 0;
		}
		$arrListado['pac_atendidos'] = array( 
			'cantidad'=> $fPacAte['contador']
		);

		// PACIENTES ATENDIDOS POR GENERO 
		$arrPacienteSexoGraph = array();
		$listaPacSexo = $this->model_informe_empresarial->cargar_pacientes_por_sexo_atendidos($allInputs); 
		foreach ($listaPacSexo as $key => $row) { 
			$rowSexo = NULL;
			$rowSliced = FALSE;
			$rowSelected = FALSE;
			if($row['sexo'] == 'M'){ 
				$rowSexo = 'MASCULINO';
				$rowSliced = TRUE;
				$rowSelected = TRUE;
			}
			if($row['sexo'] == 'F'){ 
				$rowSexo = 'FEMENINO';
			}
			$arrPacienteSexoGraph[] = array( 
				'name'=> $rowSexo,
				'y'=> (float)$row['contador'],
				'sliced'=> $rowSliced,
                'selected'=> $rowSelected
			);
		}
		$arrListado['pac_sexo_graph'] = $arrPacienteSexoGraph;
		
		// PACIENTES ATENDIDOS POR EDAD
		$arrPacienteEdadGraph = array();
		$listaPacEdad = $this->model_informe_empresarial->cargar_pacientes_por_edad_atendidos($allInputs); 

		$arrGroupEdad = array();
		foreach ($listaPacEdad as $key => $row) { 
			$rowSliced = FALSE;
			$rowSelected = FALSE;
			$rowEtareo = NULL;
			if($row['etareo'] == 'J'){ 
				$rowEtareo = 'DE 18 A 29';
				$rowSliced = TRUE;
				$rowSelected = TRUE;
			}
			if($row['etareo'] == 'A'){ 
				$rowEtareo = 'DE 30 A 59';
			}
			if($row['etareo'] == 'AD'){ 
				$rowEtareo = 'DE 60 A + ';
			}
			$arrGroupEdad[$row['etareo']] = array(
				'name'=> $rowEtareo,
				'y'=> NULL,
				'sliced'=> $rowSliced,
                'selected'=> $rowSelected
			);
		} 
		foreach ($listaPacEdad as $key => $row) { 
			$arrGroupEdad[$row['etareo']]['y']++; 
		}
		$arrGroupEdad = array_values($arrGroupEdad);
		$arrListado['pac_edad_graph'] = $arrGroupEdad;

		/****************************************************/
		/*                        IMC                       */
		/****************************************************/
		// EVALUACIÓN DEL IMC - BARRAS 
		$listaPacPeso = $this->model_informe_empresarial->cargar_pacientes_por_peso_atendidos($allInputs); 
		$arrGroupPeso = array();
		foreach ($listaPacPeso as $key => $row) {
			$arrGroupPeso[] = array($row['tipo_peso'],(float)$row['contador']);
		}
		$arrListado['pac_peso_graph'] = $arrGroupPeso;

		// EVALUACIÓN DEL IMC CON LA EDAD - BARRAS AGRUPADAS 
		$arrGroupPacPeso = array();
		$sumObesidad = 0;
		foreach ($listaPacPeso as $key => $row) { 
			$newKey = $row['tipo_peso']; 
			if( $row['tipo_peso'] == 'Obesidad 1°' || $row['tipo_peso'] == 'Obesidad 2°' || $row['tipo_peso'] == 'Obesidad 3°'){ 
				$newKey = 'obesidad';
				$sumObesidad += $row['contador'];
			}
			$arrGroupPacPeso[$newKey] = array(
				'contador'=> (int)$row['contador'],
				'tipo_peso'=> $row['tipo_peso']
			);
		}
		$arrGroupPacPeso['obesidad']['contador'] = $sumObesidad;
		$arrGroupPacPeso['obesidad']['tipo_peso'] = 'Obesidad';
		$arrGroupPacPeso = array_values($arrGroupPacPeso);

		$listaPacPorEdadMasIMC = $this->model_informe_empresarial->cargar_pacientes_por_edad_atendidos_mas_complementos($allInputs);
		$arrGroupPesoEdad = array(); 
		foreach ($arrGroupPacPeso as $key => $row) { 
			array_push($arrGroupPesoEdad,
				array(
					'name'=> $row['tipo_peso'],
					'data'=> array()
				)
			); 
			$countJ = 0;
			$countA = 0;
			$countAD = 0;
			foreach ($listaPacPorEdadMasIMC as $keyDet => $rowDet) {
				if( $row['tipo_peso'] == 'Bajo de peso' ){
					if( (float)$rowDet['imc'] < 18.5  ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
				}
				if( $row['tipo_peso'] == 'Normal' ){
					if( (float)$rowDet['imc'] >= 18.5 && (float)$rowDet['imc'] <= 24.9  ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
				}
				if( $row['tipo_peso'] == 'Sobrepeso' ){
					if( (float)$rowDet['imc'] >= 25 && (float)$rowDet['imc'] <= 29.9  ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
				}
				if( $row['tipo_peso'] == 'Obesidad' ){
					if( (float)$rowDet['imc'] >= 30 ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
				}
			}
			$arrGroupPesoEdad[$key]['data'] = array($countJ,$countA,$countAD); 
		}
		$arrListado['pac_edad_peso_graph'] = $arrGroupPesoEdad;

		// EVALUACIÓN DEL IMC CON EL SEXO - BARRAS AGRUPADAS 
		$listaPacPorSexoMasIMC = $this->model_informe_empresarial->cargar_pacientes_por_sexo_atendidos_mas_complementos($allInputs);
		$arrGroupPesoSexo = array(); 
		foreach ($arrGroupPacPeso as $key => $row) { 
			array_push($arrGroupPesoSexo,
				array(
					'name'=> $row['tipo_peso'],
					'data'=> array()
				)
			); 
			$countM = 0;
			$countF = 0;
			foreach ($listaPacPorSexoMasIMC as $keyDet => $rowDet) {
				if( $row['tipo_peso'] == 'Bajo de peso' ){
					if( (float)$rowDet['imc'] < 18.5  ){ 
						if( $rowDet['sexo'] == 'M' ){ 
							$countM++;
						}
						if( $rowDet['sexo'] == 'F' ){ 
							$countF++;
						}
					}
				}
				if( $row['tipo_peso'] == 'Normal' ){
					if( (float)$rowDet['imc'] >= 18.5 && (float)$rowDet['imc'] <= 24.9  ){ 
						if( $rowDet['sexo'] == 'M' ){ 
							$countM++;
						}
						if( $rowDet['sexo'] == 'F' ){ 
							$countF++;
						}
					}
				}
				if( $row['tipo_peso'] == 'Sobrepeso' ){
					if( (float)$rowDet['imc'] >= 25 && (float)$rowDet['imc'] <= 29.9  ){ 
						if( $rowDet['sexo'] == 'M' ){ 
							$countM++;
						}
						if( $rowDet['sexo'] == 'F' ){ 
							$countF++;
						}
					}
				}
				if( $row['tipo_peso'] == 'Obesidad' ){
					if( (float)$rowDet['imc'] >= 30 ){ 
						if( $rowDet['sexo'] == 'M' ){ 
							$countM++;
						}
						if( $rowDet['sexo'] == 'F' ){ 
							$countF++;
						}
					}
				}
			}
			$arrGroupPesoSexo[$key]['data'] = array($countM,$countF);
		}
		$arrListado['pac_sexo_peso_graph'] = $arrGroupPesoSexo;

		/****************************************************/
		/*               ÍNDICE GRASA VISCERAL              */
		/****************************************************/
		// EVALUACIÓN DE LA GRASA VISCERAL - BARRAS 
		$listaPacGrasaVisceral = $this->model_informe_empresarial->cargar_pacientes_por_grasa_visceral_atendidos($allInputs); 
		$arrGroupGV = array();
		foreach ($listaPacGrasaVisceral as $key => $row) {
			$arrGroupGV[] = array($row['indice_grasa_visceral'],(float)$row['contador']);
		}
		$arrListado['pac_grasa_visceral_graph'] = $arrGroupGV;

		// EVALUACIÓN DE LA GRASA VISCERAL CON LA EDAD - BARRAS AGRUPADAS 
		$arrGroupPacGV = array();
		foreach ($listaPacGrasaVisceral as $key => $row) { 
			$newKey = $row['indice_grasa_visceral']; 
			$arrGroupPacGV[$newKey] = array(
				'contador'=> (int)$row['contador'],
				'indice_grasa_visceral'=> $row['indice_grasa_visceral']
			);
		}
		$arrGroupPacGV = array_values($arrGroupPacGV);

		$listaPacPorEdadMasGV = $this->model_informe_empresarial->cargar_pacientes_por_edad_atendidos_mas_complementos($allInputs);
		$arrGroupGVEdad = array(); 
		foreach ($arrGroupPacGV as $key => $row) { 
			array_push($arrGroupGVEdad,
				array(
					'name'=> $row['indice_grasa_visceral'],
					'data'=> array()
				)
			); 
			$countJ = 0;
			$countA = 0;
			$countAD = 0;
			foreach ($listaPacPorEdadMasGV as $keyDet => $rowDet) {
				if( $row['indice_grasa_visceral'] == 'NORMAL' ){
					if( (float)$rowDet['puntaje_grasa_visceral'] <= 9  ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
				}
				if( $row['indice_grasa_visceral'] == 'ALTO' ){
					if( (float)$rowDet['puntaje_grasa_visceral'] >= 10 && (float)$rowDet['puntaje_grasa_visceral'] <= 14  ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
				}
				if( $row['indice_grasa_visceral'] == 'MUY ALTO' ){
					if( (float)$rowDet['puntaje_grasa_visceral'] >= 15 ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
				}
			}
			$arrGroupGVEdad[$key]['data'] = array($countJ,$countA,$countAD); 
		}
		$arrListado['pac_edad_grasa_visceral_graph'] = $arrGroupGVEdad;

		// EVALUACIÓN DE LA GRASA VISCERAL CON EL SEXO - BARRAS AGRUPADAS 
		$listaPacPorSexoMasGV = $this->model_informe_empresarial->cargar_pacientes_por_sexo_atendidos_mas_complementos($allInputs);
		$arrGroupGVSexo = array(); 
		foreach ($arrGroupPacGV as $key => $row) { 
			array_push($arrGroupGVSexo,
				array(
					'name'=> $row['indice_grasa_visceral'],
					'data'=> array()
				)
			); 
			$countM = 0;
			$countF = 0;
			foreach ($listaPacPorSexoMasGV as $keyDet => $rowDet) {
				if( $row['indice_grasa_visceral'] == 'NORMAL' ){
					if( (float)$rowDet['puntaje_grasa_visceral'] <=9  ){ 
						if( $rowDet['sexo'] == 'M' ){ 
							$countM++;
						}
						if( $rowDet['sexo'] == 'F' ){ 
							$countF++;
						}
					}
				}
				if( $row['indice_grasa_visceral'] == 'ALTO' ){
					if( (float)$rowDet['puntaje_grasa_visceral'] >= 10 && (float)$rowDet['puntaje_grasa_visceral'] <= 14  ){ 
						if( $rowDet['sexo'] == 'M' ){ 
							$countM++;
						}
						if( $rowDet['sexo'] == 'F' ){ 
							$countF++;
						}
					}
				}
				if( $row['indice_grasa_visceral'] == 'MUY ALTO' ){
					if( (float)$rowDet['puntaje_grasa_visceral'] >= 15 ){ 
						if( $rowDet['sexo'] == 'M' ){ 
							$countM++;
						}
						if( $rowDet['sexo'] == 'F' ){ 
							$countF++;
						}
					}
				}
			}
			$arrGroupGVSexo[$key]['data'] = array($countM,$countF);
		}
		$arrListado['pac_sexo_grasa_visceral_graph'] = $arrGroupGVSexo;

		/****************************************************/
		/*                  % GRASA CORPORAL                */
		/****************************************************/
		// EVALUACIÓN DE LA GRASA CORPORAL - BARRAS 

		$listaPacGrasaCorporal = $this->model_informe_empresarial->cargar_pacientes_por_grasa_corporal_atendidos($allInputs); 
		$arrListaPacGrasaCorporal = array();
		foreach ($listaPacGrasaCorporal as $key => $row) { 
			$arrListaPacGrasaCorporal[ $row['porc_grasa_corporal'] ]['contador'] = 0; 
		}
		foreach ($listaPacGrasaCorporal as $key => $row) {  
			$arrListaPacGrasaCorporal[$row['porc_grasa_corporal']]['porc_grasa_corporal'] = $row['porc_grasa_corporal']; 
			$arrListaPacGrasaCorporal[$row['porc_grasa_corporal']]['contador'] += (float)$listaPacGrasaCorporal[$key]['contador']; 
		}
		$arrListaPacGrasaCorporal = array_values($arrListaPacGrasaCorporal);
		// var_dump($listaPacGrasaCorporal,$arrListaPacGrasaCorporal); exit();
		$arrGroupGC = array();
		foreach ($arrListaPacGrasaCorporal as $key => $row) {
			$arrGroupGC[] = array($row['porc_grasa_corporal'],(float)$row['contador']);
		}
		$arrListado['pac_porc_grasa_corporal_graph'] = $arrGroupGC;

		// EVALUACIÓN DE LA GRASA CORPORAL CON LA EDAD - BARRAS AGRUPADAS 
		$arrGroupPacGC = array();
		foreach ($arrListaPacGrasaCorporal as $key => $row) { 
			$newKey = $row['porc_grasa_corporal']; 
			$arrGroupPacGC[$newKey] = array(
				'contador'=> (int)$row['contador'],
				'porc_grasa_corporal'=> $row['porc_grasa_corporal']
			);
		}
		$arrGroupPacGC = array_values($arrGroupPacGC);

		$listaPacPorEdadMasGC = $this->model_informe_empresarial->cargar_pacientes_por_edad_atendidos_mas_complementos($allInputs);
		$arrGroupGCEdad = array(); 
		foreach ($arrGroupPacGC as $key => $row) { 
			array_push($arrGroupGCEdad,
				array(
					'name'=> $row['porc_grasa_corporal'],
					'data'=> array()
				)
			); 
			$countJ = 0;
			$countA = 0;
			$countAD = 0;
			foreach ($listaPacPorEdadMasGC as $keyDet => $rowDet) {
				if( $row['porc_grasa_corporal'] == 'BAJO' ){
					if( (float)$rowDet['value_porc_grasa_corporal'] < 25 && $rowDet['sexo'] == 'F' ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
					if( (float)$rowDet['value_porc_grasa_corporal'] < 15 && $rowDet['sexo'] == 'M' ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
				}
				if( $row['porc_grasa_corporal'] == 'NORMAL' ){
					if( (float)$rowDet['value_porc_grasa_corporal'] >= 25 && (float)$rowDet['value_porc_grasa_corporal'] <= 30 && $rowDet['sexo'] == 'F' ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
					if( (float)$rowDet['value_porc_grasa_corporal'] >= 15 && (float)$rowDet['value_porc_grasa_corporal'] <= 20 && $rowDet['sexo'] == 'M' ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
				}
				if( $row['porc_grasa_corporal'] == 'ALTO' ){
					if( (float)$rowDet['value_porc_grasa_corporal'] > 30 && $rowDet['sexo'] == 'F' ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
					if( (float)$rowDet['value_porc_grasa_corporal'] > 20 && $rowDet['sexo'] == 'M' ){ 
						if( $rowDet['etareo'] == 'J' ){ 
							$countJ++;
						}
						if( $rowDet['etareo'] == 'A' ){ 
							$countA++;
						}
						if( $rowDet['etareo'] == 'AD' ){ 
							$countAD++;
						}
					}
				}
			}
			$arrGroupGCEdad[$key]['data'] = array($countJ,$countA,$countAD); 
		}
		$arrListado['pac_edad_porc_grasa_corporal_graph'] = $arrGroupGCEdad;

		// EVALUACIÓN DE LA GRASA CORPORAL CON EL SEXO - BARRAS AGRUPADAS 
		$listaPacPorSexoMasGC = $this->model_informe_empresarial->cargar_pacientes_por_sexo_atendidos_mas_complementos($allInputs);
		$arrGroupGCSexo = array(); 
		foreach ($arrGroupPacGC as $key => $row) { 
			array_push($arrGroupGCSexo,
				array(
					'name'=> $row['porc_grasa_corporal'],
					'data'=> array()
				)
			); 
			$countM = 0;
			$countF = 0;
			foreach ($listaPacPorSexoMasGC as $keyDet => $rowDet) {
				if( $row['porc_grasa_corporal'] == 'BAJO' ){
					if( $rowDet['value_porc_grasa_corporal'] < 25 && $rowDet['sexo'] == 'F' ){ 
						$countF++;
					}
					if( $rowDet['value_porc_grasa_corporal'] < 15 && $rowDet['sexo'] == 'M' ){ 
						$countM++;
					} 
				}
				if( $row['porc_grasa_corporal'] == 'NORMAL' ){
					if( $rowDet['value_porc_grasa_corporal'] >= 25 && $rowDet['value_porc_grasa_corporal'] <= 30 && $rowDet['sexo'] == 'F' ){ 
						$countF++;
					}
					if( $rowDet['value_porc_grasa_corporal'] >= 15 && $rowDet['value_porc_grasa_corporal'] <= 20 && $rowDet['sexo'] == 'M' ){ 
						$countM++;
					}
				}
				if( $row['porc_grasa_corporal'] == 'ALTO' ){
					if( $rowDet['value_porc_grasa_corporal'] > 30 && $rowDet['sexo'] == 'F' ){ 
						$countF++;
					}
					if( $rowDet['value_porc_grasa_corporal'] > 20 && $rowDet['sexo'] == 'M' ){ 
						$countM++;
					}
				}
			}
			$arrGroupGCSexo[$key]['data'] = array($countM,$countF);
		}
		$arrListado['pac_sexo_porc_grasa_corporal_graph'] = $arrGroupGCSexo;


		// EVALUACION DEL PESO Y GRASA PERDIDA 
		$arrPacientesPesoGrasaPerdida = array(); 
		$listaDetalleAtenciones = $this->model_informe_empresarial->cargar_detalle_pacientes_atendidos($allInputs);
		foreach ($listaDetalleAtenciones as $key => $row) {
			$arrPacientesPesoGrasaPerdida[$row['idcliente']] = array(
				'idcliente' => $row['idcliente'],
				'nombres' => $row['nombre'].' '.$row['apellidos'],
				'sexo' => $row['sexo'],
				'edad' => $row['edad'],
				'peso_perdido'=> null,
				'grasa_perdida'=> null,
				'atenciones'=> array() 
			);
		}
		foreach ($listaDetalleAtenciones as $key => $row) {
			$arrPacientesPesoGrasaPerdida[$row['idcliente']]['atenciones'][$row['idatencion']] = array(
				'idatencion' => $row['idatencion'],
				'fecha_atencion'=> strtotime($row['fecha_atencion']),
				'peso'=> (float)$row['peso'], 
				'kg_masa_grasa'=> (float)$row['kg_masa_grasa'] 
			);
		}
		$arrPacientesPesoGrasaPerdida = array_values($arrPacientesPesoGrasaPerdida);
		foreach ($arrPacientesPesoGrasaPerdida as $key => $value) { 
			$arrPacientesPesoGrasaPerdida[$key]['atenciones'] = array_values($arrPacientesPesoGrasaPerdida[$key]['atenciones']);
		}
		$cantPesoPerdido = 0; 
		$cantGrasaPerdida = 0; 
		foreach ($arrPacientesPesoGrasaPerdida as $key => $row) {
			if( count($row['atenciones']) > 1 ){ // mas de una atencion 
				$arrPacientesPesoGrasaPerdida[$key]['peso_perdido'] = $row['atenciones'][(count($row['atenciones']) - 1)]['peso'] - $row['atenciones'][0]['peso']; 
				$arrPacientesPesoGrasaPerdida[$key]['grasa_perdida'] = $row['atenciones'][(count($row['atenciones']) - 1)]['kg_masa_grasa'] - $row['atenciones'][0]['kg_masa_grasa']; 
				$cantPesoPerdido += $arrPacientesPesoGrasaPerdida[$key]['peso_perdido']; 
				$cantGrasaPerdida += $arrPacientesPesoGrasaPerdida[$key]['grasa_perdida']; 
			}
		}
		$arrListado['peso_perdido'] = array( 
			'cantidad'=> $cantPesoPerdido 
		);
		$arrListado['grasa_perdida'] = array( 
			'cantidad'=> $cantGrasaPerdida 
		);

		// PESO Y GRASA PERDIDA POR GÉNERO 
		$arrPacientePPSGraph = array();
		$sumaPesoM = 0;
		$sumaPesoF = 0;
		$arrPacientePGSGraph = array();
		$sumaGrasaM = 0;
		$sumaGrasaF = 0;
		foreach ($arrPacientesPesoGrasaPerdida as $key => $row) { 
			if( count($row['atenciones']) > 1 ){ // mas de una atencion 

				$arrPacientesPesoGrasaPerdida[$key]['peso_perdido'] = $row['atenciones'][(count($row['atenciones']) - 1)]['peso'] - $row['atenciones'][0]['peso']; 
				if( strtoupper($row['sexo']) == 'M' ){
					$sumaPesoM += $arrPacientesPesoGrasaPerdida[$key]['peso_perdido'];
				}
				if( strtoupper($row['sexo']) == 'F' ){
					$sumaPesoF += $arrPacientesPesoGrasaPerdida[$key]['peso_perdido'];
				}

				$arrPacientesPesoGrasaPerdida[$key]['grasa_perdida'] = $row['atenciones'][(count($row['atenciones']) - 1)]['kg_masa_grasa'] - $row['atenciones'][0]['kg_masa_grasa']; 
				if( strtoupper($row['sexo']) == 'M' ){
					$sumaGrasaM += $arrPacientesPesoGrasaPerdida[$key]['grasa_perdida'];
				}
				if( strtoupper($row['sexo']) == 'F' ){
					$sumaGrasaF += $arrPacientesPesoGrasaPerdida[$key]['grasa_perdida'];
				}
			}
		}
		$arrPacientePPSGraph[] = array( 
			'name'=> 'MASCULINO',
			'y'=> abs($sumaPesoM),
			'sliced'=> TRUE,
            'selected'=> TRUE 
		);
		$arrPacientePPSGraph[] = array( 
			'name'=> 'FEMENINO',
			'y'=> abs($sumaPesoF),
			'sliced'=> FALSE,
            'selected'=> FALSE 
		);
		$arrPacientePGSGraph[] = array( 
			'name'=> 'MASCULINO',
			'y'=> abs($sumaGrasaM),
			'sliced'=> TRUE,
            'selected'=> TRUE 
		);
		$arrPacientePGSGraph[] = array( 
			'name'=> 'FEMENINO',
			'y'=> abs($sumaGrasaF),
			'sliced'=> FALSE,
            'selected'=> FALSE 
		);
		$arrListado['peso_perdido_sexo_graph'] = $arrPacientePPSGraph;
		$arrListado['grasa_perdida_sexo_graph'] = $arrPacientePGSGraph;

		// PESO Y GRASA PERDIDA POR EDAD 
		$arrPacientePPEGraph = array();
		$arrPacientePGEGraph = array();

		$sumaPesoPorEdadJ = 0;
		$sumaPesoPorEdadA = 0;
		$sumaPesoPorEdadAD = 0;

		$sumaGrasaPorEdadJ = 0;
		$sumaGrasaPorEdadA = 0;
		$sumaGrasaPorEdadAD = 0;

		foreach ($arrPacientesPesoGrasaPerdida as $key => $row) { 
			if( count($row['atenciones']) > 1 ){ // mas de una atencion 
				$arrPacientesPesoGrasaPerdida[$key]['peso_perdido'] = $row['atenciones'][(count($row['atenciones']) - 1)]['peso'] - $row['atenciones'][0]['peso']; 
				if( $row['edad'] >= 18 && $row['edad'] <= 29 ){
					$sumaPesoPorEdadJ += $arrPacientesPesoGrasaPerdida[$key]['peso_perdido'];
				}
				if( $row['edad'] >= 30 && $row['edad'] <= 59 ){
					$sumaPesoPorEdadA += $arrPacientesPesoGrasaPerdida[$key]['peso_perdido'];
				}
				if( $row['edad'] >= 60  ){
					$sumaPesoPorEdadAD += $arrPacientesPesoGrasaPerdida[$key]['peso_perdido'];
				}

				$arrPacientesPesoGrasaPerdida[$key]['grasa_perdida'] = $row['atenciones'][(count($row['atenciones']) - 1)]['kg_masa_grasa'] - $row['atenciones'][0]['kg_masa_grasa']; 
				if( $row['edad'] >= 18 && $row['edad'] <= 29 ){
					$sumaGrasaPorEdadJ += $arrPacientesPesoGrasaPerdida[$key]['grasa_perdida'];
				}
				if( $row['edad'] >= 30 && $row['edad'] <= 59 ){
					$sumaGrasaPorEdadA += $arrPacientesPesoGrasaPerdida[$key]['grasa_perdida'];
				}
				if( $row['edad'] >= 60  ){
					$sumaGrasaPorEdadAD += $arrPacientesPesoGrasaPerdida[$key]['grasa_perdida'];
				}
			}
		}
		$arrPacientePPEGraph[] = array( 
			'name'=> 'JÓVENES',
			'y'=> abs($sumaPesoPorEdadJ),
			'sliced'=> TRUE,
            'selected'=> TRUE 
		);
		$arrPacientePPEGraph[] = array( 
			'name'=> 'ADULTOS',
			'y'=> abs($sumaPesoPorEdadA),
			'sliced'=> FALSE,
            'selected'=> FALSE 
		);
		$arrPacientePPEGraph[] = array( 
			'name'=> 'ADULTOS MAYORES',
			'y'=> abs($sumaPesoPorEdadAD),
			'sliced'=> FALSE,
            'selected'=> FALSE 
		);
		$arrListado['peso_perdido_edad_graph'] = $arrPacientePPEGraph;

		$arrPacientePGEGraph[] = array( 
			'name'=> 'JÓVENES',
			'y'=> abs($sumaGrasaPorEdadJ),
			'sliced'=> TRUE,
            'selected'=> TRUE 
		);
		$arrPacientePGEGraph[] = array( 
			'name'=> 'ADULTOS',
			'y'=> abs($sumaGrasaPorEdadA),
			'sliced'=> FALSE,
            'selected'=> FALSE 
		);
		$arrPacientePGEGraph[] = array( 
			'name'=> 'ADULTOS MAYORES',
			'y'=> abs($sumaGrasaPorEdadAD),
			'sliced'=> FALSE,
            'selected'=> FALSE 
		);
		$arrListado['grasa_perdida_edad_graph'] = $arrPacientePGEGraph;

    	$arrData['datos'] = $arrListado;
    	$arrData['message'] = '';
    	$arrData['flag'] = 1;
		if(empty($arrListado)){ 
			$arrData['flag'] = 0;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
}
