<?php
class Model_profesional extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}
 	//CARGAR PERFIL
	public function m_cargar_perfil($idusuario){ 
		$this->db->select('pro.idprofesional, pro.idusuario, pro.idespecialidad, pro.nombre, pro.apellidos, pro.correo, 
			pro.fecha_nacimiento, pro.num_colegiatura',FALSE);
		$this->db->select('esp.descripcion_es as especialidad',FALSE);
		$this->db->from('profesional pro');
		$this->db->join('especialidad esp', 'esp.idespecialidad = pro.idespecialidad');
		$this->db->where('pro.idusuario', $idusuario);
		$this->db->where('pro.estado_pf', 1);
		$this->db->limit(1);
		return $this->db->get()->row_array();
	}
}
?>