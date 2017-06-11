<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Consulta extends CI_Controller {
	public function __construct(){
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->helper(array('fechas_helper'));
        $this->load->model(array('model_consulta'));
    }

	public function registrar_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error registrando la consulta.';

		/*aqui van las validaciones*/

		/*registro de datos*/
		if($this->model_consulta->m_registrar($allInputs)){
			$arrData['flag'] = 1;
			$arrData['message'] = 'La consulta ha sido registrada.';
		}

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function actualizar_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error actualizando la consulta.';

		if($this->model_consulta->m_actualizar($allInputs)){
			$arrData['flag'] = 1;
			$arrData['message'] = 'La consulta ha sido actualizada.';
		}

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function anular_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error actualizando la consulta.';


		if($this->model_consulta->m_anular($allInputs['atencion']['idatencion'])){
			$arrData['flag'] = 1;
			$arrData['message'] = 'Consulta anulada.';
		}

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function cargar_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'No se encontro la atencion.';

		$row = $this->model_consulta->m_consultar_atencion($allInputs['atencion']['idatencion']);

		if(!empty($row['idatencion'])){
				$atencion = array(
					'idcliente' 			=> $row['idcliente'],
					'idcita' 				=> $row['idcita'],
					'idatencion' 			=> $row['idatencion'],
					'si_embarazo' 			=> $row['si_embarazo'] == 1 ? TRUE:FALSE,
					'peso' 					=> (float)$row['peso'],
					'porc_masa_grasa' 		=> (float)$row['porc_masa_grasa'],
					'porc_masa_libre' 		=> (float)$row['porc_masa_libre'],
					'porc_masa_muscular' 	=> (float)$row['porc_masa_muscular'],
					'kg_masa_muscular' 		=> (float)$row['kg_masa_muscular'],
					'porc_agua_corporal' 	=> (float)$row['porc_agua_corporal'],
					'kg_agua_corporal' 		=> (float)$row['kg_agua_corporal'],
					'porc_grasa_visceral' 	=> (float)$row['porc_grasa_visceral'],
					'kg_grasa_visceral' 	=> (float)$row['kg_grasa_visceral'],
					'cm_pecho' 				=> (float)$row['cm_pecho'],
					'cm_antebrazo' 			=> (float)$row['cm_antebrazo'],
					'cm_cintura' 			=> (float)$row['cm_cintura'],
					'cm_abdomen' 			=> (float)$row['cm_abdomen'],
					'cm_cadera_gluteo' 		=> (float)$row['cm_cadera_gluteo'],
					'cm_muslo' 				=> (float)$row['cm_muslo'],
					'cm_hombros' 			=> (float)$row['cm_hombros'],
					'cm_biceps_relajados' 	=> (float)$row['cm_biceps_relajados'],
					'cm_biceps_contraidos' 	=> (float)$row['cm_biceps_contraidos'],
					'cm_muneca' 			=> (float)$row['cm_muneca'],
					'cm_rodilla' 			=> (float)$row['cm_rodilla'],
					'cm_gemelos' 			=> (float)$row['cm_gemelos'],
					'cm_tobillo' 			=> (float)$row['cm_tobillo'],
					'cm_tricipital' 		=> (float)$row['cm_tricipital'],
					'cm_bicipital' 			=> (float)$row['cm_bicipital'],
					'cm_subescapular' 		=> (float)$row['cm_subescapular'],
					'cm_axilar' 			=> (float)$row['cm_axilar'],
					'cm_pectoral' 			=> (float)$row['cm_pectoral'],
					'cm_suprailiaco' 		=> (float)$row['cm_suprailiaco'],
					'cm_supraespinal' 		=> (float)$row['cm_supraespinal'],
					'cm_abdominal' 			=> (float)$row['cm_abdominal'],
					'cm_pierna' 			=> (float)$row['cm_pierna'],
					'diagnostico_notas' 	=> $row['diagnostico_notas'],
					'fecha_atencion' 		=> $row['fecha_atencion'],
					'estado_atencion' 		=> $row['estado_atencion'],
				);

			$arrData['flag'] = 1;
			$arrData['message'] = 'Se encontro la atencion.';
			$arrData['datos'] = $atencion;
		}

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function listar_ultima_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$row = $this->model_consulta->m_cargar_ultima_atencion($allInputs['idcliente']);
		// var_dump($row); exit();
		if(empty($row)){
			$arrData['flag'] = 0;
		}else{
			$arrData['flag'] = 1;
		}
		$arrData['datos'] = $row;
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function listar_consultas_paciente(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$lista = $this->model_consulta->m_cargar_atenciones_paciente($allInputs['idcliente']);
		$arrCabecera = array();
		$arrListado = array();
		foreach ($lista as $key => $row) {
			// array_push($arrListado, array(
			// 	'idatencion' => $row['idatencion'],
			// 	'fecha_atencion' => $row['fecha_atencion'],
			// 	)
			// );
			$arrListado['peso'][] = array('id' =>$key ,'valor' => $row['peso']);
			$arrListado['masa_grasa'][] = array('id' =>$key ,'valor' => $row['porc_masa_grasa']);
			$arrListado['masa_libre'][] = array('id' =>$key ,'valor' => $row['porc_masa_libre']);
			$arrListado['agua_corporal'][] = array('id' =>$key ,'valor' => $row['porc_agua_corporal']);
			$arrListado['masa_muscular'][] = array('id' =>$key ,'valor' => $row['porc_masa_muscular']);
			$arrCabecera[] = DarFormatoDMY($row['fecha_atencion']);
		}
		// var_dump($arrListado); exit();
		if(empty($lista)){
			$arrData['flag'] = 0;
		}else{
			$arrData['flag'] = 1;
		}
		$arrData['cabecera'] = $arrCabecera;
		$arrData['datos'] = $arrListado;
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

}
