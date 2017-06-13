<?php
class Model_alimentos extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}
	public function m_cargar_alimentos($paramPaginate=FALSE){
		$this->db->select('al.idalimento, al.nombre, al.calorias, al.proteinas, al.grasas, al.carbohidratos, al.estado_ali, g1.idgrupo1, g1.descripcion_gr1, 
			g2.idgrupo2, g2.descripcion_gr2'); 
		$this->db->from('alimento al');
		$this->db->join('grupo1 g1','al.idgrupo1 = g1.idgrupo1');
		$this->db->join('grupo2 g2','al.idgrupo2 = g2.idgrupo2');
		$this->db->where('al.estado_ali', 1);
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
	public function m_count_alimentos($paramPaginate=FALSE){
		$this->db->select('COUNT(*) AS contador');
		$this->db->from('alimento al');
		$this->db->join('grupo1 g1','al.idgrupo1 = g1.idgrupo1');
		$this->db->join('grupo2 g2','al.idgrupo2 = g2.idgrupo2');
		$this->db->where('al.estado_ali', 1);
		if( isset($paramPaginate['search'] ) && $paramPaginate['search'] ){
			foreach ($paramPaginate['searchColumn'] as $key => $value) {
				if(! empty($value)){
					$this->db->like($key ,strtoupper($value) ,FALSE);
				}
			}
		}
		$fData = $this->db->get()->row_array();
		return $fData;
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
		return $this->db->insert('alimento', $data);
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
		return $this->db->update('alimento', $data);
	}
	public function m_anular($datos)
	{
		$data = array(
			'estado_cl' => 0,
			'updatedAt' => date('Y-m-d H:i:s')
		);
		$this->db->where('idcliente',$datos['idcliente']);
		return $this->db->update('alimento', $data);
	}

	public function m_cargar_alimentos_cbo($datos){
		$this->db->select("a.idalimento,a.idgrupo1,a.idgrupo2,a.nombre,a.calorias,a.proteinas,a.grasas, a.carbohidratos, 
			 a.estado_ali, a.medida_casera, a.gramo, a.ceniza, a.calcio, a.fosforo, a.zinc, a.hierro ");
		$this->db->from('alimento a');
		$this->db->where("a.estado_ali",1);
		$this->db->where("UPPER(a.nombre) LIKE '%". strtoupper($datos['search']) . "%'");
		$this->db->limit(10);
		return $this->db->get()->result_array();
	}

}