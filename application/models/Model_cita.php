<?php
class Model_cita extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}
 	// ACCESO AL SISTEMA
	public function m_cargar_citas(){ 
		$this->db->select('ci.idcita, ci.idcliente, ci.idprofesional, ci.idubicacion, ci.fecha, ci.hora_desde, ci.hora_hasta, ci.estado_ci',FALSE);
		$this->db->select('cli.cod_historia_clinica, cli.nombre, cli.apellidos, cli.sexo, cli.estatura',FALSE);
		$this->db->select("UPPER(CONCAT(pro.nombre, ' ',pro.apellidos)) AS profesional",FALSE);
		$this->db->select('ub.descripcion_ub, ub.idubicacion',FALSE);

		$this->db->select('at.idatencion, at.createdat AS fecha_atencion, at.diagnostico_notas',FALSE);

		$this->db->from('cita ci');
		$this->db->join('cliente cli', 'cli.idcliente = ci.idcliente AND cli.estado_cl = 1');
		$this->db->join('profesional pro', 'pro.idprofesional = ci.idprofesional AND pro.estado_pf = 1 AND ci.idprofesional = '.$this->sessionVP['idprofesional']);
		$this->db->join('ubicacion ub', 'ub.idubicacion = ci.idubicacion AND ub.estado_ub = 1');

		$this->db->join('atencion at', 'at.idcita = ci.idcita AND at.estado_atencion = 1', 'left');
		$this->db->where('ci.estado_ci <>', 0);
		return $this->db->get()->result_array();
	}

	public function m_registrar($data){
		return $this->db->insert('cita', $data);
	}	

	public function m_actualizar($data, $id){
		$this->db->where('idcita', $id);
		return $this->db->update('cita', $data);
	}

	public function m_anular($id){
		$data = array(
			'estado_ci' => 0,
			'updatedat' => date('Y-m-d H:i:s')
		);
		$this->db->where('idcita', $id);
		return $this->db->update('cita', $data);
	}

	public function m_consulta_cita($idcita){
		$this->db->select('ci.idcita, ci.idcliente, ci.idprofesional, ci.idubicacion, ci.fecha, ci.hora_desde, ci.hora_hasta, ci.estado_ci',FALSE);
		$this->db->select('at.idatencion, at.createdat AS fecha_atencion, at.diagnostico_notas',FALSE);

		$this->db->from('cita ci');
		$this->db->join('atencion at', 'at.idcita = ci.idcita AND at.estado_atencion = 1', 'left');

		$this->db->where('ci.estado_ci <>', 0);
		$this->db->where('ci.idcita =', $idcita);
		return $this->db->get()->row_array();
	}
}
?>