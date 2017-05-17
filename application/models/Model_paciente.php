<?php
class Model_paciente extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}
	public function m_cargar_pacientes($paramPaginate=FALSE){
		$this->db->select('idcliente, nombre, apellidos, sexo, fecha_nacimiento, email, celular, nombre_foto');
		$this->db->from('cliente');
		$this->db->where('estado_cl', 1);

		return $this->db->get()->result_array();
	}
	public function m_registrar($datos)
	{
		$data = array(
			'nombre' => strtoupper($datos['nombre']),
			'apellidos' => strtoupper($datos['apellidos']),
			'idtipocliente' => $datos['idtipocliente'],
			'idempresa' => $datos['idempresa'],
			'idmotivoconsulta' => empty($datos['idmotivoconsulta'])? 1 : $datos['idmotivoconsulta'],
			'cod_historia_clinica' => empty($datos['cod_historia_clinica'])? 'H001' : $datos['cod_historia_clinica'],
			'sexo' => $datos['sexo'],
			'fecha_nacimiento' => darFormatoYMD($datos['fecha_nacimiento']),
			'email' => $datos['email'],
			'celular' => $datos['celular'],
			'cargo_laboral' => empty($datos['cargo_laboral'])? NULL : $datos['cargo_laboral'],
			'nombre_foto' => empty($datos['nombre_foto'])? 'sin-imagen.png' : $datos['nombre_foto'],
			'alergias_ia' => empty($datos['alergias_ia'])? NULL : $datos['alergias_ia'],
			'habitos_notas' => empty($datos['habitos_notas'])? NULL : $datos['habitos_notas'],
			'createdAt' => date('Y-m-d H:i:s'),
			'updatedAt' => date('Y-m-d H:i:s')
		);
		return $this->db->insert('cliente', $data);
	}
}