<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Paciente extends CI_Controller {
	public function __construct()
    {
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        // $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->helper(array('fechas','otros','imagen'));
        $this->load->model(array('model_paciente'));

    }
    // LISTAS, COMBOS Y AUTOCOMPLETES
	public function listar_pacientes()
	{
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$paramPaginate = $allInputs['paginate'];
		$lista = $this->model_paciente->m_cargar_pacientes($paramPaginate);
		$totalRows = $this->model_paciente->m_count_pacientes($paramPaginate);
		$arrListado = array();
		// var_dump($lista); exit();
		foreach ($lista as $row) {
			array_push($arrListado,
				array(
					'idcliente' => $row['idcliente'],
					'nombre' => $row['nombre'],
					'apellidos' => $row['apellidos'],
					'fecha_nacimiento_st' => formatoFechaReporte3($row['fecha_nacimiento']),
					'fecha_nacimiento' => DarFormatoDMY($row['fecha_nacimiento']),
					'nombre_foto' => $row['nombre_foto'],
					'celular' => $row['celular'],
					'sexo_desc' => $row['sexo'] == 'M'? 'Masculino' : 'Femenino',
					'sexo' => $row['sexo'],
					'edad' => devolverEdad($row['fecha_nacimiento']) . ' años',
					'estatura' => (int)$row['estatura'],
					'idempresa' => $row['idempresa'],
					'idtipocliente' => $row['idtipocliente'],
					'cargo_laboral' => $row['cargo_laboral'],
					'email' => $row['email'],
					'idmotivoconsulta' => $row['idmotivoconsulta'],
					'clasificacion' => $row['clasificacion'],
					'cod_historia_clinica' => $row['cod_historia_clinica'],
					'alergias_ia' => $row['alergias_ia'],
					'medicamentos' => $row['medicamentos'],
					'antecedentes_notas' => $row['antecedentes_notas'],
					'habitos_notas' => $row['habitos_notas'],
					'ultima_visita'=> empty($row['fec_ult_atencion'])? 'Sin Consultas' :formatoFechaReporte3($row['fec_ult_atencion'])

				)
			);
		}

    	$arrData['datos'] = $arrListado;
    	$arrData['paginate']['totalRows'] = $totalRows;
    	$arrData['message'] = '';
    	$arrData['flag'] = 1;
		if(empty($lista)){
			$arrData['flag'] = 0;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function listar_paciente_por_id(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		// var_dump($allInputs); exit();
		$row = $this->model_paciente->m_cargar_paciente_por_id($allInputs);
		$arrListado = array(
			'idcliente' => $row['idcliente'],
			'nombre' => $row['nombre'],
			'apellidos' => $row['apellidos'],
			'fecha_nacimiento_st' => formatoFechaReporte3($row['fecha_nacimiento']),
			'fecha_nacimiento' => DarFormatoDMY($row['fecha_nacimiento']),
			'nombre_foto' => $row['nombre_foto'],
			'celular' => $row['celular'],
			'sexo_desc' => $row['sexo'] == 'M'? 'Masculino' : 'Femenino',
			'sexo' => $row['sexo'],
			'edad' => devolverEdad($row['fecha_nacimiento']) . ' años',
			'estatura' => $row['estatura'],
			'idempresa' => $row['idempresa'],
			'idtipocliente' => $row['idtipocliente'],
			'cargo_laboral' => $row['cargo_laboral'],
			'email' => $row['email'],
			'idmotivoconsulta' => $row['idmotivoconsulta'],
			'clasificacion' => $row['clasificacion'],
			'cod_historia_clinica' => $row['cod_historia_clinica'],
			'alergias_ia' => $row['alergias_ia'],
			'medicamentos' => $row['medicamentos'],
			'antecedentes_notas' => $row['antecedentes_notas'],
			'habitos_notas' => $row['habitos_notas'],
			);

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
	public function lista_pacientes_autocomplete(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true); // var_dump($allInputs); exit();
		$lista = $this->model_paciente->m_cargar_pacientes_autocomplete($allInputs);
		$arrListado = array();
		foreach ($lista as $row) {
			array_push($arrListado,
				array(
					'idcliente' => $row['idcliente'],
					'paciente' => $row['paciente'],
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
	public function listar_habitos_alim_paciente(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrListado = array();
		$lista = $this->model_paciente->m_cargar_habitos_alim_paciente($allInputs);

		foreach ($lista as $row) {
			if( $row['idclientehabitoturno'] == null ){
				$hora = '--';
				$minuto = '--';
				if( $row['idturno'] == 1 || $row['idturno'] == 2 ){
					$periodo = 'am';
				}else{
					$periodo = 'pm';
				}
			}else{
				$horaUT = strtotime($row['hora']); // obtengo una fecha UNIX ( integer )
				$hora	= date('h', $horaUT);
				$minuto= date('i', $horaUT);
				$periodo= date('a', $horaUT);
			}
			array_push($arrListado, array(
				'idclientehabitoturno' => $row['idclientehabitoturno'],
				'idturno' => $row['idturno'],
				'descripcion_tu' => $row['descripcion_tu'],
				'hora' => $hora,
				'minuto' => $minuto,
				'periodo' => $periodo,
				'texto_alimentos' => $row['texto_alimentos'],
				)
			);
		}
    	$arrData['datos'] = $arrListado;
    	$arrData['message'] = '';
    	$arrData['flag'] = 1;
		if(empty($rowHabitos)){
			$arrData['flag'] = 0;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function listar_evolucion_paciente(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrListado = array();
		$arrPeso = array();
		$arrIMC = array();
		$lista = $this->model_paciente->m_cargar_historial_paciente($allInputs);
		foreach ($lista as $row) {
			array_push($arrPeso, array(
				'fecha' => $row['fecha_atencion'],
				'peso'	=> $row['peso']
				)
			);
			array_push($arrIMC, array(
				'fecha' => $row['fecha_atencion'],
				'imc'	=> round( (($row['peso'] / pow($row['estatura'],2))*10000),2 ),
				)
			);
		}
		$arrListado['peso'] = $arrPeso;
		$arrListado['imc'] = $arrIMC;
		// var_dump($arrListado );exit();

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
	public function listar_habitos_paciente(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		// var_dump($allInputs); exit();
		$arrListado = array();
		$objActividad = array();
		$objFrecuencia = array();
		$objAgua = array();
		$objGaseosa = array();
		$objAlcohol = array();
		$objTabaco = array();
		$objSuenio = array();
		$rowHabitos = $this->model_paciente->m_cargar_habitos_paciente($allInputs);
		switch ($rowHabitos['actividad_fisica']) {
			case 'NR':
				$objActividad['id'] = 'NR';
				$objActividad['descripcion'] = 'No realiza';
				break;
			case 'LE':
				$objActividad['id'] = 'LE';
				$objActividad['descripcion'] = 'Leve';
				break;
			case 'MO':
				$objActividad['id'] = 'MO';
				$objActividad['descripcion'] = 'Moderado';
				break;
			default:
				$objActividad['id'] = '';
				$objActividad['descripcion'] = '';
				break;
		}
		switch ($rowHabitos['frecuencia']) {
			case '':
				$objFrecuencia['id'] = '';
				$objFrecuencia['descripcion'] = '--';
				break;
			case '1s':
				$objFrecuencia['id'] = '1s';
				$objFrecuencia['descripcion'] = 'Una vez a la semana';
				break;
			case '2s':
				$objFrecuencia['id'] = '2s';
				$objFrecuencia['descripcion'] = 'Dos veces a la semana';
				break;
			case '3s':
				$objFrecuencia['id'] = '3s';
				$objFrecuencia['descripcion'] = 'Tres veces a la semana';
				break;
			case '4s':
				$objFrecuencia['id'] = '4s';
				$objFrecuencia['descripcion'] = 'Cuatro veces a la semana';
				break;
			case '5s':
				$objFrecuencia['id'] = '5s';
				$objFrecuencia['descripcion'] = 'Cinco veces a la semana';
				break;
			case '6s':
				$objFrecuencia['id'] = '6s';
				$objFrecuencia['descripcion'] = 'Seis veces a la semana';
				break;
			case 'all':
				$objFrecuencia['id'] = 'all';
				$objFrecuencia['descripcion'] = 'Todos los días';
				break;
			default:
				$objFrecuencia['id'] = '';
				$objFrecuencia['descripcion'] = '';
				break;
				break;
		}
		switch ($rowHabitos['consumo_agua']) {
			case '-2L':
				$objAgua['id'] = '-2L';
				$objAgua['descripcion'] = 'Menos de 2L';
				break;
			case '2L':
				$objAgua['id'] = '2L';
				$objAgua['descripcion'] = '2L';
				break;
			case '+2L':
				$objAgua['id'] = '+2L';
				$objAgua['descripcion'] = 'Mas de 2L';
				break;
			default:
				$objAgua['id'] = '';
				$objAgua['descripcion'] = '';
				break;
		}
		switch ($rowHabitos['consumo_gaseosa']) {
			case 'NR':
				$objGaseosa['id'] = 'NC';
				$objGaseosa['descripcion'] = 'No consume';
				break;
			case 'OC':
				$objGaseosa['id'] = 'OC';
				$objGaseosa['descripcion'] = 'Ocasional';
				break;
			case 'FR':
				$objGaseosa['id'] = 'FR';
				$objGaseosa['descripcion'] = 'Frecuente';
				break;
			case 'EX':
				$objGaseosa['id'] = 'EX';
				$objGaseosa['descripcion'] = 'Excesivo';
				break;
			default:
				$objGaseosa['id'] = '';
				$objGaseosa['descripcion'] = '';
				break;
		}
		switch ($rowHabitos['consumo_alcohol']) {
			case 'NC':
				$objAlcohol['id'] = 'NC';
				$objAlcohol['descripcion'] = 'No consume';
				break;
			case 'OC':
				$objAlcohol['id'] = 'OC';
				$objAlcohol['descripcion'] = 'Ocasional';
				break;
			case 'FR':
				$objAlcohol['id'] = 'FR';
				$objAlcohol['descripcion'] = 'Frecuente';
				break;
			case 'EX':
				$objAlcohol['id'] = 'EX';
				$objAlcohol['descripcion'] = 'Excesivo';
				break;
			default:
				$objAlcohol['id'] = '';
				$objAlcohol['descripcion'] = '';
				break;
		}
		switch ($rowHabitos['consumo_tabaco']) {
			case 'NC':
				$objTabaco['id'] = 'NC';
				$objTabaco['descripcion'] = 'No consume';
				break;
			case 'OC':
				$objTabaco['id'] = 'OC';
				$objTabaco['descripcion'] = 'Ocasional';
				break;
			case 'FR':
				$objTabaco['id'] = 'FR';
				$objTabaco['descripcion'] = 'Frecuente';
				break;
			case 'EX':
				$objTabaco['id'] = 'EX';
				$objTabaco['descripcion'] = 'Excesivo';
				break;
			default:
				$objTabaco['id'] = '';
				$objTabaco['descripcion'] = '';
				break;
		}
		switch ($rowHabitos['tiempo_suenio']) {
			case 'P':
				$objSuenio['id'] = 'P';
				$objSuenio['descripcion'] = 'Poco';
				break;
			case 'A':
				$objSuenio['id'] = 'A';
				$objSuenio['descripcion'] = 'Adecuado';
				break;
			case 'E':
				$objSuenio['id'] = 'E';
				$objSuenio['descripcion'] = 'Excesivo';
				break;
			default:
				$objSuenio['id'] = '';
				$objSuenio['descripcion'] = '';
				break;
		}
		$arrListado = array(
			'idclientehabitogen' => $rowHabitos['idclientehabitogen'],
			'actividad_fisica' => $objActividad,
			'frecuencia' => $objFrecuencia,
			'detalle_act_fisica' => $rowHabitos['detalle_act_fisica'],
			'consumo_agua' => $objAgua,
			'consumo_gaseosa' => $objGaseosa,
			'consumo_alcohol' => $objAlcohol,
			'consumo_tabaco' => $objTabaco,
			'tiempo_suenio' => $objSuenio,
			'notas_generales' => $rowHabitos['notas_generales']

		);

    	$arrData['datos'] = $arrListado;
    	$arrData['message'] = '';
    	$arrData['flag'] = 1;
		if(empty($rowHabitos)){
			$arrData['flag'] = 0;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function listar_antecedentes_paciente(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrListado = array();
		$arrListadoPatologico = array();
		$arrListadoHeredado = array();
		$lista = $this->model_paciente->m_cargar_antecedentes_paciente($allInputs);
		foreach ($lista as $row) {
			if( $row['tipo'] == 'P' ){
				array_push($arrListadoPatologico, array(
					'id' => $row['idantecedente'],
					'descripcion' => $row['antecedente'],
					'tipo' => $row['tipo'],
					'texto_otros' => $row['texto_otros'],
					'check' => $row['checkbox'],
					)
				);
			}else{
				array_push($arrListadoHeredado, array(
					'id' => $row['idantecedente'],
					'descripcion' => $row['antecedente'],
					'tipo' => $row['tipo'],
					'texto_otros' => $row['texto_otros'],

					'check' => $row['checkbox'],
					)
				);
			}
		}
		$arrListado['patologicos'] =  $arrListadoPatologico;
		$arrListado['heredados'] =  $arrListadoHeredado;
		// var_dump($arrListado); exit();
    	$arrData['datos'] = $arrListado;
    	$arrData['message'] = '';
    	$arrData['flag'] = 1;
		if(empty($rowHabitos)){
			$arrData['flag'] = 0;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	// MANTENIMIENTO
	public function registrar_paciente()
	{
		//$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		// var_dump($_POST);
		// var_dump($allInputs);
		//exit();
		$arrData['message'] = 'Error al registrar los datos, inténtelo nuevamente';
    	$arrData['flag'] = 0;
    	// AQUI ESTARAN LAS VALIDACIONES
    	$estatura = $this->input->post('estatura');
    	if( !soloNumeros($estatura) ){
    		$arrData['message'] = 'Ingrese solo números';
    		$this->output
			    ->set_content_type('application/json')
			    ->set_output(json_encode($arrData));
    	}

    	$allInputs['nombre'] = $this->input->post('nombre');
    	$allInputs['apellidos'] = $this->input->post('apellidos');
    	$allInputs['idtipocliente'] = $this->input->post('idtipocliente');
    	$allInputs['idempresa'] = $this->input->post('idempresa');
    	$allInputs['idmotivoconsulta'] = $this->input->post('idmotivoconsulta');
    	$allInputs['cod_historia_clinica'] = $this->input->post('cod_historia_clinica');
    	$allInputs['sexo'] = $this->input->post('sexo');
    	$allInputs['estatura'] = $estatura;
    	$allInputs['fecha_nacimiento'] = $this->input->post('fecha_nacimiento');
    	$allInputs['email'] = $this->input->post('email');
    	$allInputs['celular'] = $this->input->post('celular');
    	$allInputs['cargo_laboral'] = $this->input->post('cargo_laboral');
    	$allInputs['createdAt'] = date('Y-m-d H:i:s');
    	$allInputs['updatedAt'] = date('Y-m-d H:i:s');
    	$allInputs['Base64Img'] = $this->input->post('myCroppedImage');
    	$allInputs['nombre_foto'] = NULL;

    	if(!empty($allInputs['Base64Img'])){
    		$allInputs['nombre_foto'] = $allInputs['nombre'].date('YmdHis').'.png';
    		subir_imagen_Base64($allInputs['Base64Img'], 'assets/images/pacientes/' ,$allInputs['nombre_foto']);

    	}


    	// INICIA EL REGISTRO
		if($this->model_paciente->m_registrar($allInputs)){
			$arrData['message'] = 'Se registraron los datos correctamente' . date('H:n:s');
    		$arrData['flag'] = 1;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function subir_foto_paciente(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['message'] = 'Error al subir la foto, inténtelo nuevamente';
    	$arrData['flag'] = 0;

    	if(!empty($allInputs['croppedImage'])){
    		$allInputs['nombre_foto'] = url_title($allInputs['nombre']).date('YmdHis').'.png';

    		subir_imagen_Base64($allInputs['croppedImage'], 'assets/images/pacientes/' ,$allInputs['nombre_foto']);
    		if($this->model_paciente->m_editar_foto($allInputs)){
	    		$arrData['message'] = 'La foto se cambió correctamente';
	    		$arrData['flag'] = 1;
	    		$arrData['datos'] = $allInputs['nombre_foto'];
	    	}
    	}

    	$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function editar_paciente(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['message'] = 'Error al editar los datos, inténtelo nuevamente';
    	$arrData['flag'] = 0;
		if($this->model_paciente->m_editar($allInputs)){
			$arrData['message'] = 'Se editaron los datos correctamente ' . date('H:n:s');
    		$arrData['flag'] = 1;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function registrar_antecedente_paciente(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['message'] = 'Error al editar los datos, inténtelo nuevamente';
    	$arrData['flag'] = 0;
    	// var_dump($allInputs); exit();
		if($this->model_paciente->m_editar_antecedentes_cliente($allInputs)){
			$arrData['message'] = 'Se editaron los datos correctamente ' . date('H:n:s');
    		$arrData['flag'] = 1;
    		if( $allInputs['cambiaPatologico'] ){
    			$allInputs['tipo'] = 'P';
		    	$this->model_paciente->m_anular_antecedentes_paciente($allInputs);
				foreach ($allInputs['antPatologicos'] as $row) {
					if($row['check'] == 1 ){
						$row['idcliente'] = $allInputs['idcliente'];
						$this->model_paciente->m_registrar_antecedente($row);
					}
				}
    		}
    		if( $allInputs['cambiaHeredado'] ){
    			$allInputs['tipo'] = 'H';
		    	$this->model_paciente->m_anular_antecedentes_paciente($allInputs);
				foreach ($allInputs['antHeredados'] as $row) {
					if($row['check'] == 1 ){
						$row['idcliente'] = $allInputs['idcliente'];
						$this->model_paciente->m_registrar_antecedente($row);
					}
				}
    		}
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function registrar_habito_paciente(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['message'] = 'Error al editar los datos, inténtelo nuevamente';
    	$arrData['flag'] = 0;
    	// var_dump($allInputs); exit();
    	//HABITOS ALIMENTARIOS
    	foreach ($allInputs['alimentarios'] as $row) {
    		if( !empty($row['texto_alimentos']) ){
	    		$row['idcliente'] = $allInputs['idcliente'];
	    		$hora = $row['hora'].':'.$row['minuto'].' '.$row['periodo'];
	    		$row['hora'] = darFormatoHora2($hora);
	    		if( empty($row['idclientehabitoturno']) ){ // si no hay id lo registramos
	    			$this->model_paciente->m_registrar_habito_alimentario($row);
	    		}else{
	    			$this->model_paciente->m_editar_habito_alimentario($row);
	    		}
    		}
    	}
    	// HABITOS GENERALES
    	if( empty($allInputs['idclientehabitogen']) ){ // si no hay id es por que es nuevo
    		if($this->model_paciente->m_registrar_habito_cliente($allInputs)){
    			$arrData['message'] = 'Se registraron los datos correctamente ' . date('H:n:s');
    			$arrData['flag'] = 1;
    		}
    	}else{
    		if($this->model_paciente->m_editar_habito_cliente($allInputs)){
    			$arrData['message'] = 'Se editaron los datos correctamente ' . date('H:n:s');
    			$arrData['flag'] = 1;
    		}
    	}

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function anular_paciente(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['message'] = 'Error al anular los datos, inténtelo nuevamente';
    	$arrData['flag'] = 0;
    	// var_dump($allInputs); exit();
		if($this->model_paciente->m_anular($allInputs)){
			$arrData['message'] = 'Se anularon los datos correctamente' . date('H:n:s');
    		$arrData['flag'] = 1;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
}
