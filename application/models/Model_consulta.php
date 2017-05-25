<?php
class Model_consulta extends CI_Model {
	public function __construct()
	{
		parent::__construct();
	}

	public function m_registrar($datos){
		$data = array(
			'idcliente' 			=> $datos['cita']['cliente']['idcliente'],
			'idcita' 				=> $datos['cita']['id'],
			'peso' 					=> $datos['consulta']['peso'],
			'porc_masa_grasa' 		=> $datos['consulta']['porc_masa_grasa'], 
			'porc_masa_libre' 		=> $datos['consulta']['porc_masa_libre'], 
			'porc_masa_muscular' 	=> $datos['consulta']['porc_masa_muscular'], 
			'kg_masa_muscular' 		=> $datos['consulta']['kg_masa_muscular'], 
			'porc_agua_corporal' 	=> $datos['consulta']['porc_agua_corporal'], 
			'kg_agua_corporal' 		=> $datos['consulta']['kg_agua_corporal'], 
			'porc_grasa_visceral' 	=> $datos['consulta']['porc_grasa_visceral'], 
			'kg_grasa_visceral' 	=> $datos['consulta']['kg_grasa_visceral'], 
			'cm_pecho' 				=> (empty($datos['consulta']['cm_pecho'])) ? NULL : $datos['consulta']['cm_pecho'], 
			'cm_antebrazo' 			=> (empty($datos['consulta']['cm_antebrazo'])) ? NULL : $datos['consulta']['cm_antebrazo'], 
			'cm_cintura' 			=> (empty($datos['consulta']['cm_cintura'])) ? NULL : $datos['consulta']['cm_cintura'], 
			'cm_abdomen' 			=> (empty($datos['consulta']['cm_abdomen'])) ? NULL : $datos['consulta']['cm_abdomen'], 
			'cm_cadera_gluteo' 		=> (empty($datos['consulta']['cm_cadera_gluteo'])) ? NULL : $datos['consulta']['cm_cadera_gluteo'], 
			'cm_muslo' 				=> (empty($datos['consulta']['cm_muslo'])) ? NULL : $datos['consulta']['cm_muslo'], 
			'cm_hombros' 			=> (empty($datos['consulta']['cm_hombros'])) ? NULL : $datos['consulta']['cm_hombros'], 
			'cm_biceps_relajados' 	=> (empty($datos['consulta']['cm_biceps_relajados'])) ? NULL : $datos['consulta']['cm_biceps_relajados'], 
			'cm_biceps_contraidos' 	=> (empty($datos['consulta']['cm_biceps_contraidos'])) ? NULL : $datos['consulta']['cm_biceps_contraidos'], 
			'cm_muneca' 			=> (empty($datos['consulta']['cm_muneca'])) ? NULL : $datos['consulta']['cm_muneca'], 
			'cm_rodilla' 			=> (empty($datos['consulta']['cm_rodilla'])) ? NULL : $datos['consulta']['cm_rodilla'], 
			'cm_gemelos' 			=> (empty($datos['consulta']['cm_gemelos'])) ? NULL : $datos['consulta']['cm_gemelos'], 
			'cm_tobillo' 			=> (empty($datos['consulta']['cm_tobillo'])) ? NULL : $datos['consulta']['cm_tobillo'], 
			'cm_tricipital' 		=> (empty($datos['consulta']['cm_tricipital'])) ? NULL : $datos['consulta']['cm_tricipital'], 
			'cm_bicipital' 			=> (empty($datos['consulta']['cm_bicipital'])) ? NULL : $datos['consulta']['cm_bicipital'], 
			'cm_subescapular' 		=> (empty($datos['consulta']['cm_subescapular'])) ? NULL : $datos['consulta']['cm_subescapular'], 
			'cm_axilar' 			=> (empty($datos['consulta']['cm_axilar'])) ? NULL : $datos['consulta']['cm_axilar'], 
			'cm_pectoral' 			=> (empty($datos['consulta']['cm_pectoral'])) ? NULL : $datos['consulta']['cm_pectoral'], 
			'cm_suprailiaco' 		=> (empty($datos['consulta']['cm_suprailiaco'])) ? NULL : $datos['consulta']['cm_suprailiaco'], 
			'cm_supraespinal' 		=> (empty($datos['consulta']['cm_supraespinal'])) ? NULL : $datos['consulta']['cm_supraespinal'], 
			'cm_abdominal' 			=> (empty($datos['consulta']['cm_abdominal'])) ? NULL : $datos['consulta']['cm_abdominal'], 
			'cm_pierna' 			=> (empty($datos['consulta']['cm_pierna'])) ? NULL : $datos['consulta']['cm_pierna'], 
			'si_embarazo' 			=> ($datos['consulta']['si_embarazo']) ? 1 : 2, 
			'diagnostico_notas' 	=> (empty($datos['consulta']['diagnostico_notas'])) ? NULL : $datos['consulta']['diagnostico_notas'], 
			'createdat' 			=> date('Y-m-d H:i:s'),
			'updatedat'				=> date('Y-m-d H:i:s')
			);
		return $this->db->insert('atencion' , $data);
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