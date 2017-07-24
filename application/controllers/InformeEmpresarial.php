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
				$rowEtareo = 'De 18 a 29 años';
				$rowSliced = TRUE;
				$rowSelected = TRUE;
			}
			if($row['etareo'] == 'A'){ 
				$rowEtareo = 'De 30 a 59 años';
			}
			if($row['etareo'] == 'AD'){ 
				$rowEtareo = 'De 60 a + ';
			}
			$arrGroupEdad[$row['etareo']] = array(
				'name'=> $rowEtareo,
				'y'=> NULL,
				'sliced'=> $rowSliced,
                'selected'=> $rowSelected
			);
		}
		$totalCount = 0;
		foreach ($listaPacEdad as $key => $row) { 
			$arrGroupEdad[$row['etareo']]['y']++; 
		}
		$arrGroupEdad = array_values($arrGroupEdad);
		//var_dump($arrGroupEdad); exit(); 
		$arrListado['pac_edad_graph'] = $arrGroupEdad;

		// var_dump($listaPacAte); exit();
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
