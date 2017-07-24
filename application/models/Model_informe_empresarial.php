<?php
class Model_informe_empresarial extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}
	public function cargar_total_pacientes_atendidos($datos){ 
		$sql = 'SELECT COUNT(*) AS contador, sc.idempresa  FROM ( 
					SELECT DISTINCT cl.idcliente, emp.idempresa 
					FROM atencion am 
					INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
					INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
					WHERE am.estado_atencion = 1 
					AND emp.idempresa = ? 
					AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
				) AS sc 
			GROUP BY sc.idempresa';
		$query = $this->db->query( $sql,array($datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin'])) ); 
		return $query->row_array();
	}
	public function cargar_pacientes_por_sexo_atendidos($datos)
	{
		$sql = 'SELECT COUNT(*) AS contador, UPPER(sc.sexo) AS sexo, sc.idempresa  FROM ( 
					SELECT DISTINCT cl.idcliente, cl.sexo, emp.idempresa 
					FROM atencion am 
					INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
					INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
					WHERE am.estado_atencion = 1 
					AND emp.idempresa = ? 
					AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
				) AS sc 
			GROUP BY UPPER(sc.sexo), sc.idempresa';
		$query = $this->db->query( $sql,array($datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin'])) ); 
		return $query->result_array();
	}
	public function cargar_pacientes_por_edad_atendidos($datos)
	{
		// SELECT COUNT(*) AS contador, sc.etareo AS etareo2, sc.idempresa  FROM (
		$sql = " 
					SELECT DISTINCT cl.idcliente, emp.idempresa, 'J' AS etareo 
					FROM atencion am 
					INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
					INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
					WHERE am.estado_atencion = 1 
					AND TIMESTAMPDIFF(YEAR, cl.fecha_nacimiento, CURDATE()) BETWEEN 18 AND 29  
					AND emp.idempresa = ? 
					AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
					UNION 
					SELECT DISTINCT cl.idcliente, emp.idempresa, 'A' AS etareo 
					FROM atencion am 
					INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
					INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
					WHERE am.estado_atencion = 1 
					AND TIMESTAMPDIFF(YEAR, cl.fecha_nacimiento, CURDATE()) BETWEEN 30 AND 59  
					AND emp.idempresa = ? 
					AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
					UNION 
					SELECT DISTINCT cl.idcliente, emp.idempresa, 'AD' AS etareo 
					FROM atencion am 
					INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
					INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
					WHERE am.estado_atencion = 1 
					AND TIMESTAMPDIFF(YEAR, cl.fecha_nacimiento, CURDATE()) BETWEEN 60 AND 150   
					AND emp.idempresa = ? 
					AND DATE(am.fecha_atencion) BETWEEN ? AND ?
				";
		// ) AS sc GROUP BY sc.etareo2, sc.idempresa
		$query = $this->db->query( $sql,
			array(
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
			) 
		); 
		return $query->result_array();
	}
}
?>