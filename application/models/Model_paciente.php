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
}