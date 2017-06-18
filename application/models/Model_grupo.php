<?php
class Model_grupo extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}
	public function m_cargar_grupo(){
		$this->db->select('idgrupo, nombre_gr');
		$this->db->from('grupo');
		$this->db->where('estado_gr', 1);		
		return $this->db->get()->result_array();
	}
	
}
?>