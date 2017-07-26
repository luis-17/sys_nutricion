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
	public function cargar_pacientes_por_sexo_atendidos_mas_imc($datos)
	{
		$sql = 'SELECT cl.idcliente, cl.sexo, emp.idempresa, 
				ROUND(am.peso / ( (cl.estatura / 100) * (cl.estatura / 100)  ) ,2 ) AS imc   
				FROM atencion am 
				INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
				INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
				WHERE am.estado_atencion = 1 
				AND emp.idempresa = ? 
				AND DATE(am.fecha_atencion) BETWEEN ? AND ? ';
		$query = $this->db->query( $sql,array($datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin'])) ); 
		return $query->result_array();
	}
	public function cargar_pacientes_por_edad_atendidos($datos)
	{
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
		$query = $this->db->query( $sql,
			array(
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
			) 
		); 
		return $query->result_array();
	}
	public function cargar_pacientes_por_edad_atendidos_mas_imc($datos)
	{
		$sql = " 
			SELECT cl.idcliente, emp.idempresa, 'J' AS etareo,
				ROUND(am.peso / ( (cl.estatura / 100) * (cl.estatura / 100)  ) ,2 ) AS imc  
			FROM atencion am 
			INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
			INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
			WHERE am.estado_atencion = 1 
			AND TIMESTAMPDIFF(YEAR, cl.fecha_nacimiento, CURDATE()) BETWEEN 18 AND 29  
			AND emp.idempresa = ? 
			AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
			UNION 
			SELECT DISTINCT cl.idcliente, emp.idempresa, 'A' AS etareo, 
				ROUND(am.peso / ( (cl.estatura / 100) * (cl.estatura / 100)  ) ,2 ) AS imc  
			FROM atencion am 
			INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
			INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
			WHERE am.estado_atencion = 1 
			AND TIMESTAMPDIFF(YEAR, cl.fecha_nacimiento, CURDATE()) BETWEEN 30 AND 59  
			AND emp.idempresa = ? 
			AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
			UNION 
			SELECT DISTINCT cl.idcliente, emp.idempresa, 'AD' AS etareo, 
				ROUND(am.peso / ( (cl.estatura / 100) * (cl.estatura / 100)  ) ,2 ) AS imc  
			FROM atencion am 
			INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
			INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
			WHERE am.estado_atencion = 1 
			AND TIMESTAMPDIFF(YEAR, cl.fecha_nacimiento, CURDATE()) BETWEEN 60 AND 150   
			AND emp.idempresa = ? 
			AND DATE(am.fecha_atencion) BETWEEN ? AND ?
		"; 
		$query = $this->db->query( $sql,
			array(
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
			) 
		); 
		return $query->result_array();
	}
	public function cargar_pacientes_por_peso_atendidos($datos)
	{
		$sql= "
			SELECT COUNT(*) AS contador ,'Bajo de peso' AS tipo_peso 
			FROM atencion am 
			INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
			INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
			WHERE am.estado_atencion = 1 
			AND (am.peso / ( (cl.estatura / 100) * (cl.estatura / 100)  ) ) BETWEEN 1 AND 18.5 
			AND am.peso > 0 
			AND cl.estatura > 0 
			AND emp.idempresa = ? 
			AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
			UNION 
			SELECT COUNT(*) AS contador ,'Normal' AS tipo_peso 
			FROM atencion am 
			INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
			INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
			WHERE am.estado_atencion = 1 
			AND (am.peso / ( (cl.estatura / 100) * (cl.estatura / 100)  ) ) BETWEEN 18.6 AND 24.9 
			AND am.peso > 0 
			AND cl.estatura > 0 
			AND emp.idempresa = ? 
			AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
			UNION 
			SELECT COUNT(*) AS contador ,'Sobrepeso' AS tipo_peso 
			FROM atencion am 
			INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
			INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
			WHERE am.estado_atencion = 1 
			AND (am.peso / ( (cl.estatura / 100) * (cl.estatura / 100)  ) ) BETWEEN 25 AND 29.9 
			AND am.peso > 0 
			AND cl.estatura > 0 
			AND emp.idempresa = ? 
			AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
			UNION 
			SELECT COUNT(*) AS contador ,'Obesidad 1°' AS tipo_peso 
			FROM atencion am 
			INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
			INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
			WHERE am.estado_atencion = 1 
			AND (am.peso / ( (cl.estatura / 100) * (cl.estatura / 100)  ) ) BETWEEN 30 AND 34.9 
			AND am.peso > 0 
			AND cl.estatura > 0 
			AND emp.idempresa = ? 
			AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
			UNION 
			SELECT COUNT(*) AS contador ,'Obesidad 2°' AS tipo_peso 
			FROM atencion am 
			INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
			INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
			WHERE am.estado_atencion = 1 
			AND (am.peso / ( (cl.estatura / 100) * (cl.estatura / 100)  ) ) BETWEEN 35 AND 39.9 
			AND am.peso > 0 
			AND cl.estatura > 0 
			AND emp.idempresa = ? 
			AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
			UNION 
			SELECT COUNT(*) AS contador ,'Obesidad 3°' AS tipo_peso 
			FROM atencion am 
			INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
			INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
			WHERE am.estado_atencion = 1 
			AND (am.peso / ( (cl.estatura / 100) * (cl.estatura / 100)  ) ) BETWEEN 40 AND 100 
			AND am.peso > 0 
			AND cl.estatura > 0 
			AND emp.idempresa = ? 
			AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
		";
		$query = $this->db->query( $sql,
			array(
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
				$datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin']),
			) 
		); 
		return $query->result_array();
	}
	// PESO PERDIDO 
	public function cargar_detalle_pacientes_atendidos($datos)
	{
		$sql = 'SELECT am.idatencion, cl.idcliente, cl.nombre, cl.apellidos, cl.sexo, emp.idempresa, am.fecha_atencion, am.peso, 
				TIMESTAMPDIFF(YEAR, cl.fecha_nacimiento, CURDATE()) AS edad, am.kg_masa_grasa 
				FROM atencion am 
				INNER JOIN cliente cl ON am.idcliente = cl.idcliente 
				INNER JOIN empresa emp ON cl.idempresa = emp.idempresa 
				WHERE am.estado_atencion = 1 
				AND emp.idempresa = ? 
				AND DATE(am.fecha_atencion) BETWEEN ? AND ? 
				ORDER BY cl.idcliente ASC, am.fecha_atencion ASC';
		$query = $this->db->query( $sql,array($datos['empresa']['id'], darFormatoYMD($datos['inicio']), darFormatoYMD($datos['fin'])) ); 
		return $query->result_array();
	}
}
?>