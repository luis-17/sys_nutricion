<?php
class Model_paciente extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}
	public function m_cargar_pacientes($paramPaginate){
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
			'sexo' => $datos['sexo'],
			// 'createdAt' => date('Y-m-d H:i:s'),
			// 'updatedAt' => date('Y-m-d H:i:s')
		);
		return $this->db->insert('cliente', $data);
	}
}