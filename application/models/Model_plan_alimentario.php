<?php
class Model_plan_alimentario extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}
 	
 	public function m_registrar_dieta_turno($datos){
 		$data = array(
 			'idatencion' => $datos['idatencion'],
 			'iddia' => $datos['iddia'],
 			'idturno' => $datos['idturno'],
 			'hora' => $datos['hora'],
 			'indicaciones' => $datos['indicaciones'],
 		);

 		return $this->db->insert('atencion_dieta_turno',$data);
 	}
}
?>