<?php
class Model_consulta extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}


	public function m_anular($id){
		$data = array(
			'estado_atencion' => 0,
			'updatedat' => date('Y-m-d H:i:s')
		);
		$this->db->where('idatencion', $id);
		return $this->db->update('atencion', $data);
	}


}
?>