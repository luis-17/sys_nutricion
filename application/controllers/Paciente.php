<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Paciente extends CI_Controller {
	public function __construct()
    {
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        // $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->helper(array('fechas','otros'));
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
					'idempresa' => $row['idempresa'],
					'idtipocliente' => $row['idtipocliente'],
					'email' => $row['email'],
					'idmotivoconsulta' => $row['idmotivoconsulta'],
					'cod_historia_clinica' => $row['cod_historia_clinica'],
					'alergias_ia' => $row['alergias_ia'],
					'medicamentos' => $row['medicamentos'],
					'antecedentes_notas' => $row['antecedentes_notas'],
					'habitos_notas' => $row['habitos_notas'],

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
	// MANTENIMIENTO
	public function registrar_paciente()
	{
		// $allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['message'] = 'Error al registrar los datos, inténtelo nuevamente';
    	$arrData['flag'] = 0;
    	/*
			'nombre' => strtoupper_total($datos['nombre']),
			'apellidos' => strtoupper_total($datos['apellidos']),
			'idtipocliente' => $datos['idtipocliente'],
			'idempresa' => empty($datos['idempresa'])? NULL : $datos['idempresa'],
			'idmotivoconsulta' => $datos['idmotivoconsulta'],
			'cod_historia_clinica' => empty($datos['cod_historia_clinica'])? 'H001' : $datos['cod_historia_clinica'],
			'sexo' => $datos['sexo'],
			'estatura' => $datos['estatura'],
			'fecha_nacimiento' => darFormatoYMD($datos['fecha_nacimiento']),
			'email' => empty($datos['email'])? '' : $datos['email'],
			'celular' => $datos['celular'],
			'cargo_laboral' => empty($datos['cargo_laboral'])? NULL : $datos['cargo_laboral'],
			'nombre_foto' => empty($datos['nombre_foto'])? 'sin-imagen.png' : $datos['nombre_foto'],
			// 'alergias_ia' => empty($datos['alergias_ia'])? NULL : $datos['alergias_ia'],
			// 'medicamentos' => empty($datos['medicamentos'])? NULL : $datos['medicamentos'],
			// 'antecedentes_notas' => empty($datos['antecedentes_notas'])? NULL : $datos['antecedentes_notas'],
			// 'habitos_notas' => empty($datos['habitos_notas'])? NULL : $datos['habitos_notas'],
			'createdAt' => date('Y-m-d H:i:s'),
			'updatedAt' => date('Y-m-d H:i:s')
    	*/
    	$allInputs['nombre'] = strtoupper_total($this->input->post('nombre'));
    	$allInputs['apellidos'] = strtoupper_total($this->input->post('apellidos'));
    	$allInputs['idtipocliente'] = empty($this->input->post('idtipocliente'))? NULL : $this->input->post('idtipocliente');
    	$allInputs['idempresa'] = empty($this->input->post('idempresa'))? NULL : $this->input->post('idempresa');
    	$allInputs['idmotivoconsulta'] = $this->input->post('idmotivoconsulta');
    	$allInputs['cod_historia_clinica'] = empty($this->input->post('cod_historia_clinica'))? NULL : $this->input->post('cod_historia_clinica');
    	$allInputs['sexo'] = $this->input->post('sexo');
    	$allInputs['estatura'] = $this->input->post('estatura');
    	$allInputs['fecha_nacimiento'] = darFormatoYMD($this->input->post('fecha_nacimiento'));
    	$allInputs['email'] = empty($this->input->post('email'))? '' : $this->input->post('email');
    	$allInputs['celular'] = $this->input->post('celular');
    	$allInputs['cargo_laboral'] = empty($this->input->post('cargo_laboral'))? NULL : $this->input->post('cargo_laboral');
    	$allInputs['createdAt'] = date('Y-m-d H:i:s');
    	$allInputs['updatedAt'] = date('Y-m-d H:i:s');
    	// $allInputs['nombre'] = $this->input->post('nombre');
    	var_dump($allInputs);
    	var_dump($_FILES);

    	exit();
    	// AQUI ESTARAN LAS VALIDACIONES

    	// INICIA EL REGISTRO
		if($this->model_paciente->m_registrar($allInputs)){
			$arrData['message'] = 'Se registraron los datos correctamente' . date('H:n:s');
    		$arrData['flag'] = 1;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function editar_paciente()
	{
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['message'] = 'Error al editar los datos, inténtelo nuevamente';
    	$arrData['flag'] = 0;
    	// var_dump($allInputs); exit();
		if($this->model_paciente->m_editar($allInputs)){
			$arrData['message'] = 'Se editaron los datos correctamente ' . date('H:n:s');
    		$arrData['flag'] = 1;
		}
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function anular_paciente()
	{
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
