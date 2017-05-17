<?php
class Model_Empresa extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}
	public function m_cargar_empresa_cbo(){
		$this->db->select('emp.idempresa, emp.nombre_comercial');
		$this->db->from('empresa emp');
		$this->db->where('emp.estado_emp', 1);
		return $this->db->get()->result_array();
	}
}
?>