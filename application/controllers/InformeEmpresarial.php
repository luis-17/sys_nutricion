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

		// EVALUACIÓN DEL PESO - BARRAS 
		$listaPacPeso = $this->model_informe_empresarial->cargar_pacientes_por_peso_atendidos($allInputs); 
		$arrGroupPeso = array();
		foreach ($listaPacPeso as $key => $row) {
			$arrGroupPeso[] = array($row['tipo_peso'],(float)$row['contador']);
		}
		$arrListado['pac_peso_graph'] = $arrGroupPeso;

		// EVALUACIÓN DEL PESO CON LA EDAD - BARRAS AGRUPADAS 
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

		$listaPacPorEdadMasIMC = $this->model_informe_empresarial->cargar_pacientes_por_edad_atendidos_mas_imc($allInputs);
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

		// EVALUACIÓN DEL SEXO CON LA EDAD - BARRAS AGRUPADAS 
		$listaPacPorSexoMasIMC = $this->model_informe_empresarial->cargar_pacientes_por_sexo_atendidos_mas_imc($allInputs);
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

		// EVALUACION DEL PESO PERDIDO 
		$arrPacientesPesoPerdido = array(); 
		$listaDetalleAtenciones = $this->model_informe_empresarial->cargar_detalle_pacientes_atendidos($allInputs);
		foreach ($listaDetalleAtenciones as $key => $row) {
			$arrPacientesPesoPerdido[$row['idcliente']] = array(
				'idcliente' => $row['idcliente'],
				'nombres' => $row['nombre'].' '.$row['apellidos'],
				'sexo' => $row['sexo'],
				'edad' => $row['edad'],
				'peso_perdido'=> null,
				'atenciones'=> array() 
			);
		}
		foreach ($listaDetalleAtenciones as $key => $row) {
			$arrPacientesPesoPerdido[$row['idcliente']]['atenciones'][$row['idatencion']] = array(
				'idatencion' => $row['idatencion'],
				'fecha_atencion'=> strtotime($row['fecha_atencion']),
				'peso'=> (float)$row['peso'] 
			);
		}
		$arrPacientesPesoPerdido = array_values($arrPacientesPesoPerdido);
		foreach ($arrPacientesPesoPerdido as $key => $value) { 
			$arrPacientesPesoPerdido[$key]['atenciones'] = array_values($arrPacientesPesoPerdido[$key]['atenciones']);
		}
		$cantPesoPerdido = 0; 
		foreach ($arrPacientesPesoPerdido as $key => $row) {
			if( count($row['atenciones']) > 1 ){ // mas de una atencion 
				$arrPacientesPesoPerdido[$key]['peso_perdido'] = $row['atenciones'][(count($row['atenciones']) - 1)]['peso'] - $row['atenciones'][0]['peso']; 
				$cantPesoPerdido += $arrPacientesPesoPerdido[$key]['peso_perdido']; 
			}
		}
		$arrListado['peso_perdido'] = array( 
			'cantidad'=> $cantPesoPerdido 
		);

		// PESO PERDIDO POR GÉNERO 
		$arrPacientePPSGraph = array();
		$sumaPesoM = 0;
		$sumaPesoF = 0;
		foreach ($arrPacientesPesoPerdido as $key => $row) { 
			if( count($row['atenciones']) > 1 ){ // mas de una atencion 
				$arrPacientesPesoPerdido[$key]['peso_perdido'] = $row['atenciones'][(count($row['atenciones']) - 1)]['peso'] - $row['atenciones'][0]['peso']; 
				if( strtoupper($row['sexo']) == 'M' ){
					$sumaPesoM += $arrPacientesPesoPerdido[$key]['peso_perdido'];
				}
				if( strtoupper($row['sexo']) == 'F' ){
					$sumaPesoF += $arrPacientesPesoPerdido[$key]['peso_perdido'];
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
		$arrListado['peso_perdido_sexo_graph'] = $arrPacientePPSGraph;

		// PESO PERDIDO POR EDAD 
		$arrPacientePPEGraph = array();
		$sumaPesoPorEdadJ = 0;
		$sumaPesoPorEdadA = 0;
		$sumaPesoPorEdadAD = 0;
		foreach ($arrPacientesPesoPerdido as $key => $row) { 
			if( count($row['atenciones']) > 1 ){ // mas de una atencion 
				$arrPacientesPesoPerdido[$key]['peso_perdido'] = $row['atenciones'][(count($row['atenciones']) - 1)]['peso'] - $row['atenciones'][0]['peso']; 
				if( $row['edad'] >= 18 && $row['edad'] <= 29 ){
					$sumaPesoPorEdadJ += $arrPacientesPesoPerdido[$key]['peso_perdido'];
				}
				if( $row['edad'] >= 30 && $row['edad'] <= 59 ){
					$sumaPesoPorEdadA += $arrPacientesPesoPerdido[$key]['peso_perdido'];
				}
				if( $row['edad'] >= 60  ){
					$sumaPesoPorEdadAD += $arrPacientesPesoPerdido[$key]['peso_perdido'];
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
