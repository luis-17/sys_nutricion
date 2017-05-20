<?php
class Model_paciente extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}
	public function m_cargar_pacientes($paramPaginate=FALSE){
		$this->db->select('cl.idcliente, cl.nombre, cl.apellidos, cl.sexo, cl.fecha_nacimiento,
			cl.email, cl.celular, cl.nombre_foto, cl.idtipocliente, cl.idempresa,
			cl.idmotivoconsulta, cl.cod_historia_clinica, alergias_ia, cl.medicamentos,
			cl.antecedentes_notas, cl.habitos_notas, cl.estado_cl');
		$this->db->from('cliente cl');
		$this->db->where('cl.estado_cl', 1);
		if( isset($paramPaginate['search'] ) && $paramPaginate['search'] ){
			foreach ($paramPaginate['searchColumn'] as $key => $value) {
				if(! empty($value)){
					$this->db->like($key ,strtoupper($value) ,FALSE);
				}
			}
		}

		if( $paramPaginate['sortName'] ){
			$this->db->order_by($paramPaginate['sortName'], $paramPaginate['sort']);
		}
		if( $paramPaginate['firstRow'] || $paramPaginate['pageSize'] ){
			$this->db->limit($paramPaginate['pageSize'],$paramPaginate['firstRow'] );
		}
		return $this->db->get()->result_array();
	}
	public function m_count_pacientes($paramPaginate=FALSE){
		$this->db->select('count(*) AS contador');
		$this->db->from('cliente');
		$this->db->where('estado_cl', 1);
		if( isset($paramPaginate['search'] ) && $paramPaginate['search'] ){
			foreach ($paramPaginate['searchColumn'] as $key => $value) {
				if(! empty($value)){
					$this->db->like($key ,strtoupper($value) ,FALSE);
				}
			}
		}
		$fData = $this->db->get()->row_array();
		return $fData['contador'];
	}
	public function m_cargar_pacientes_autocomplete($datos){
		$this->db->select("c.idcliente, c.email");
		$this->db->select("UPPER(CONCAT(c.nombre, ' ',c.apellidos)) AS paciente", FALSE);
		$this->db->from('cliente c');
		$this->db->where("c.estado_cl",1);
		$this->db->where("UPPER(CONCAT(c.nombre, ' ',c.apellidos)) LIKE '%". strtoupper($datos['search']) . "%'");

		$this->db->limit(10);
		return $this->db->get()->result_array();
	}

	public function m_registrar($datos)
	{
		$data = array(
			'nombre' => strtoupper($datos['nombre']),
			'apellidos' => strtoupper($datos['apellidos']),
			'idtipocliente' => $datos['idtipocliente'],
			'idempresa' => $datos['idempresa'],
			'idmotivoconsulta' => $datos['idmotivoconsulta'],
			'cod_historia_clinica' => empty($datos['cod_historia_clinica'])? 'H001' : $datos['cod_historia_clinica'],
			'sexo' => $datos['sexo'],
			'fecha_nacimiento' => darFormatoYMD($datos['fecha_nacimiento']),
			'email' => $datos['email'],
			'celular' => $datos['celular'],
			'cargo_laboral' => empty($datos['cargo_laboral'])? NULL : $datos['cargo_laboral'],
			'nombre_foto' => empty($datos['nombre_foto'])? 'sin-imagen.png' : $datos['nombre_foto'],
			'alergias_ia' => empty($datos['alergias_ia'])? NULL : $datos['alergias_ia'],
			'medicamentos' => empty($datos['medicamentos'])? NULL : $datos['medicamentos'],
			'antecedentes_notas' => empty($datos['antecedentes_notas'])? NULL : $datos['antecedentes_notas'],
			'habitos_notas' => empty($datos['habitos_notas'])? NULL : $datos['habitos_notas'],
			'createdAt' => date('Y-m-d H:i:s'),
			'updatedAt' => date('Y-m-d H:i:s')
		);
		return $this->db->insert('cliente', $data);
	}

	public function m_editar($datos)
	{
		$data = array(
			'nombre' => strtoupper($datos['nombre']),
			'apellidos' => strtoupper($datos['apellidos']),
			'idtipocliente' => $datos['idtipocliente'],
			'idempresa' => $datos['idempresa'],
			'idmotivoconsulta' => $datos['idmotivoconsulta'],
			'sexo' => $datos['sexo'],
			'fecha_nacimiento' => darFormatoYMD($datos['fecha_nacimiento']),
			'email' => $datos['email'],
			'celular' => $datos['celular'],
			'cargo_laboral' => empty($datos['cargo_laboral'])? NULL : $datos['cargo_laboral'],
			'nombre_foto' => empty($datos['nombre_foto'])? 'sin-imagen.png' : $datos['nombre_foto'],
			'alergias_ia' => empty($datos['alergias_ia'])? NULL : $datos['alergias_ia'],
			'medicamentos' => empty($datos['medicamentos'])? NULL : $datos['medicamentos'],
			'antecedentes_notas' => empty($datos['antecedentes_notas'])? NULL : $datos['antecedentes_notas'],
			'habitos_notas' => empty($datos['habitos_notas'])? NULL : $datos['habitos_notas'],
			'updatedAt' => date('Y-m-d H:i:s')
		);
		$this->db->where('idcliente',$datos['idcliente']);
		return $this->db->update('cliente', $data);
	}
	public function m_anular($datos)
	{
		$data = array(
			'estado_cl' => 0,
			'updatedAt' => date('Y-m-d H:i:s')
		);
		$this->db->where('idcliente',$datos['idcliente']);
		return $this->db->update('cliente', $data);
	}

}