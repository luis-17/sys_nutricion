<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Consulta extends CI_Controller {
	public function __construct(){
        parent::__construct();
        // Se le asigna a la informacion a la variable $sessionVP.
        $this->sessionVP = @$this->session->userdata('sess_vp_'.substr(base_url(),-8,7));
        $this->load->helper(array('fechas_helper','otros_helper'));
        $this->load->model(array('model_consulta', 'model_cita', 'model_paciente'));
        $this->load->library('Fpdfext');
    }

	public function registrar_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error registrando la consulta.';

		/*aqui van las validaciones*/

		/*registro de datos*/
		$this->db->trans_start();
		if($this->model_consulta->m_registrar($allInputs)){
			$idatencion = GetLastId('idatencion', 'atencion');
			$datos = array (
				'idcita' => $allInputs['cita']['id'],
				'fecha' => date('Y-m-d', strtotime($allInputs['consulta']['fecha_atencion'])),
			);
			if($this->model_cita->m_act_fecha_cita($datos)){
				$arrData['flag'] = 1;
				$arrData['message'] = 'La consulta ha sido registrada.';
				$arrData['idatencion'] = $idatencion;
			}
		}
		$this->db->trans_complete();

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function actualizar_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error actualizando la consulta.';
		// var_dump($allInputs); exit();
		if(empty($allInputs['cita']['id'])){
			$allInputs['cita']['id'] = $allInputs['consulta']['idcita'];
		}
		$this->db->trans_start();
		if($this->model_consulta->m_actualizar($allInputs)){
			$datos = array (
				'idcita' => $allInputs['cita']['id'],
				'fecha' => date('Y-m-d', strtotime($allInputs['consulta']['fecha_atencion'])),
			);
			if($this->model_cita->m_act_fecha_cita($datos)){
				$arrData['flag'] = 1;
				$arrData['message'] = 'La consulta ha sido actualizada.';
			}
		}
		$this->db->trans_complete();

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function anular_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'Ha ocurrido un error actualizando la consulta.';
		// var_dump($allInputs['atencion']['idatencion']); exit();

		if($this->model_consulta->m_anular($allInputs['atencion']['idatencion'])){
			$arrData['flag'] = 1;
			$arrData['message'] = 'Consulta anulada.';
		}

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

	public function cargar_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag'] = 0;
		$arrData['message'] = 'No se encontro la atencion.';
		// var_dump($allInputs); exit();
		$row = $this->model_consulta->m_consultar_atencion($allInputs['atencion']['idatencion']);

		if(!empty($row['idatencion'])){
				$atencion = array(
					'idcliente' 			=> $row['idcliente'],
					'idcita' 				=> $row['idcita'],
					'idatencion' 			=> $row['idatencion'],
					'si_embarazo' 			=> $row['si_embarazo'] == 1 ? TRUE:FALSE,
					'peso' 					=> (float)$row['peso'],
					'porc_masa_grasa' 		=> (float)$row['porc_masa_grasa'],
					'porc_masa_libre' 		=> (float)$row['porc_masa_libre'],
					'porc_masa_muscular' 	=> (float)$row['porc_masa_muscular'],
					'kg_masa_muscular' 		=> (float)$row['kg_masa_muscular'],
					'porc_agua_corporal' 	=> (float)$row['porc_agua_corporal'],
					'kg_agua_corporal' 		=> (float)$row['kg_agua_corporal'],
					'puntaje_grasa_visceral'=> (float)$row['puntaje_grasa_visceral'],
					/*'porc_grasa_visceral' 	=> (float)$row['porc_grasa_visceral'],
					'kg_grasa_visceral' 	=> (float)$row['kg_grasa_visceral'],*/
					'cm_pecho' 				=> (float)$row['cm_pecho'],
					'cm_antebrazo' 			=> (float)$row['cm_antebrazo'],
					'cm_cintura' 			=> (float)$row['cm_cintura'],
					'cm_abdomen' 			=> (float)$row['cm_abdomen'],
					'cm_cadera_gluteo' 		=> (float)$row['cm_cadera_gluteo'],
					'cm_muslo' 				=> (float)$row['cm_muslo'],
					'cm_hombros' 			=> (float)$row['cm_hombros'],
					'cm_biceps_relajados' 	=> (float)$row['cm_biceps_relajados'],
					'cm_biceps_contraidos' 	=> (float)$row['cm_biceps_contraidos'],
					'cm_muneca' 			=> (float)$row['cm_muneca'],
					'cm_rodilla' 			=> (float)$row['cm_rodilla'],
					'cm_gemelos' 			=> (float)$row['cm_gemelos'],
					'cm_tobillo' 			=> (float)$row['cm_tobillo'],
					'cm_tricipital' 		=> (float)$row['cm_tricipital'],
					'cm_bicipital' 			=> (float)$row['cm_bicipital'],
					'cm_subescapular' 		=> (float)$row['cm_subescapular'],
					'cm_axilar' 			=> (float)$row['cm_axilar'],
					'cm_pectoral' 			=> (float)$row['cm_pectoral'],
					'cm_suprailiaco' 		=> (float)$row['cm_suprailiaco'],
					'cm_supraespinal' 		=> (float)$row['cm_supraespinal'],
					'cm_abdominal' 			=> (float)$row['cm_abdominal'],
					'cm_pierna' 			=> (float)$row['cm_pierna'],
					'diagnostico_notas' 	=> $row['diagnostico_notas'],
					'resultados_laboratorio'=> $row['resultados_laboratorio'],
					'fecha_atencion' 		=> $row['fecha_atencion'],
					'estado_atencion' 		=> $row['estado_atencion'],
					'kg_masa_grasa' 		=> (float)$row['kg_masa_grasa'],
					'kg_masa_libre' 		=> (float)$row['kg_masa_libre'],
					'indicaciones_dieta' 	=> $row['indicaciones_dieta'],
					'tipo_dieta' 			=> $row['tipo_dieta'],
				);

			$arrData['flag'] = 1;
			$arrData['message'] = 'Se encontro la atencion.';
			$arrData['datos'] = $atencion;
		}

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function listar_ultima_consulta(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData['flag1'] = 0;
		$arrData['flag2'] = 0;
		$row = $this->model_consulta->m_cargar_ultima_atencion($allInputs['idcliente']);
		$antecedentes = $this->model_paciente->m_cargar_ultimos_antecedentes_paciente($allInputs);
		// var_dump($antecedentes); exit();
		if(!empty($row)){
			$arrData['flag1'] = 1;
		}
		if(!empty($antecedentes)){
			$arrData['flag2'] = 1;
		}
		$arrData['datos'] = $row;
		$arrData['antecedentes'] = $antecedentes;
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function listar_consultas_paciente(){
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$lista = $this->model_consulta->m_cargar_atenciones_paciente($allInputs['idcliente'],TRUE);
		$arrCabecera = array();
		$arrListado = array();
		foreach ($lista as $key => $row) {
			// array_push($arrListado, array(
			// 	'idatencion' => $row['idatencion'],
			// 	'fecha_atencion' => $row['fecha_atencion'],
			// 	)
			// );
			$arrListado['peso'][] = array('id' =>$key ,'valor' => $row['peso']);
			$arrListado['masa_grasa'][] = array('id' =>$key ,'valor' => $row['porc_masa_grasa']);
			$arrListado['masa_libre'][] = array('id' =>$key ,'valor' => $row['porc_masa_libre']);

			$arrListado['porc_agua'][] = array('id' => $key, 'valor' => $row['porc_agua_corporal']);
			$arrListado['agua_corporal'][] = array('id' => $key, 'valor' => $row['kg_agua_corporal']);
			$arrListado['porc_masa'][] = array('id' =>$key ,'valor' => $row['porc_masa_muscular']);
			$arrListado['masa_muscular'][] = array('id' =>$key ,'valor' => $row['kg_masa_muscular']);
			$arrListado['porc_grasa'][] = array('id' => $key, 'valor' => $row['porc_grasa_visceral']);
			$arrListado['grasa_visceral'][] = array('id' => $key, 'valor' => $row['kg_grasa_visceral']);
			$arrListado['cm_pecho'][] = array('id' => $key, 'valor' => $row['cm_pecho']);
			$arrListado['cm_antebrazo'][] = array('id' => $key, 'valor' => $row['cm_antebrazo']);
			$arrListado['cm_cintura'][] = array('id' => $key, 'valor' => $row['cm_cintura']);
			$arrListado['cm_abdomen'][] = array('id' => $key, 'valor' => $row['cm_abdomen']);
			$arrListado['cm_cadera_gluteo'][] = array('id' => $key, 'valor' => $row['cm_cadera_gluteo']);
			$arrListado['cm_muslo'][] = array('id' => $key, 'valor' => $row['cm_muslo']);
			$arrListado['cm_hombros'][] = array('id' => $key, 'valor' => $row['cm_hombros']);
			$arrListado['cm_biceps_relajados'][] = array('id' => $key, 'valor' => $row['cm_biceps_relajados']);
			$arrListado['cm_biceps_contraidos'][] = array('id' => $key, 'valor' => $row['cm_biceps_contraidos']);
			$arrListado['cm_muneca'][] = array('id' => $key, 'valor' => $row['cm_muneca']);
			$arrListado['cm_rodilla'][] = array('id' => $key, 'valor' => $row['cm_rodilla']);
			$arrListado['cm_gemelos'][] = array('id' => $key, 'valor' => $row['cm_gemelos']);
			$arrListado['cm_tobillo'][] = array('id' => $key, 'valor' => $row['cm_tobillo']);
			$arrListado['cm_tricipital'][] = array('id' => $key, 'valor' => $row['cm_tricipital']);
			$arrListado['cm_bicipital'][] = array('id' => $key, 'valor' => $row['cm_bicipital']);
			$arrListado['cm_subescapular'][] = array('id' => $key, 'valor' => $row['cm_subescapular']);
			$arrListado['cm_axilar'][] = array('id' => $key, 'valor' => $row['cm_axilar']);
			$arrListado['cm_pectoral'][] = array('id' => $key, 'valor' => $row['cm_pectoral']);
			$arrListado['cm_suprailiaco'][] = array('id' => $key, 'valor' => $row['cm_suprailiaco']);
			$arrListado['cm_supraespinal'][] = array('id' => $key, 'valor' => $row['cm_supraespinal']);
			$arrListado['cm_abdominal'][] = array('id' => $key, 'valor' => $row['cm_abdominal']);
			$arrListado['cm_pierna'][] = array('id' => $key, 'valor' => $row['cm_pierna']);
			$arrListado['diagnostico_notas'][] = array('id' => $key, 'valor' => $row['diagnostico_notas']);
			$arrListado['imc'][] = array(
				'id' => $key,
				'valor' => round($row['peso']*10000/($allInputs['estatura']*$allInputs['estatura']),2)
			);

			$arrCabecera[] =array(
				'idatencion' => $row['idatencion'],
				'fecha'=> DarFormatoDMY($row['fecha_atencion'])
			);
		}
		// var_dump($arrListado); exit();
		if(empty($lista)){
			$arrData['flag'] = 0;
		}else{
			$arrData['flag'] = 1;
		}
		$arrData['cabecera'] = $arrCabecera;
		$arrData['datos'] = $arrListado;
		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}
	public function imprimir_consulta()
	{
		$allInputs = json_decode(trim($this->input->raw_input_stream),true);
		$arrData = array();
		$arrData['message'] = '';
    	$arrData['flag'] = 1;
    	// DATOS
    	$configuracion = GetConfiguracion();
		$consulta = $this->model_consulta->m_consultar_atencion($allInputs['consulta']['idatencion']);
    	//var_dump($consulta); exit();

    	$this->pdf = new Fpdfext();
    	$this->pdf->AddPage('P','A4');
    	$this->pdf->SetMargins(8, 8, 8);
    	$this->pdf->SetAutoPageBreak(false);
		$this->pdf->SetFont('Arial','',13);		

		/*header*/
		$this->pdf->Image('assets/images/dinamic/' . $configuracion['logo_imagen'],8,8,60);
		$this->pdf->Cell(0,6,utf8_decode('ID: ' . str_pad($consulta['idcita'], 5, "0", STR_PAD_LEFT)),0,1,'R');
		$this->pdf->Cell(0,6,utf8_decode('Fecha: ' . date('d/m/Y',strtotime($consulta['fecha_atencion']))) ,0,1,'R');
		
		/*paciente*/
		$this->pdf->Ln(5);
		$paciente = $this->model_paciente->m_cargar_paciente_por_id($allInputs['consulta']);
		$nombre = ucwords(strtolower_total($paciente['nombre'] . ' ' . $paciente['apellidos']));
		$this->pdf->Cell(0,6,utf8_decode('Nombre: ' . $nombre ) ,0,1,'L');
		$sexo = ($paciente['sexo'] == 'F') ? 'Femenino' : 'Masculino';
		$this->pdf->Cell(0,6,utf8_decode('Sexo: ' . $sexo ) ,0,1,'L');
		$this->pdf->Cell(0,6,utf8_decode('Edad: ' . devolverEdad($paciente['fecha_nacimiento']) ) ,0,1,'L');
		$this->pdf->Cell(0,6,utf8_decode('Talla: ' . $paciente['estatura'] . ' cm.' ) ,0,1,'L');

		$this->pdf->Ln(8);
		$this->pdf->SetFont('Arial','B',15);
		$this->pdf->Cell(17,6,utf8_decode('PESO: '  ) ,0,0,'L');
		$this->pdf->SetFont('Arial','BU',15);
		$this->pdf->Cell(10,6,utf8_decode($consulta['peso'] . 'KG.') ,0,0,'L');

		/*composicion corporal*/
		$this->pdf->Ln(10);
		$this->pdf->SetFont('Arial','B',11);
		$posYCuadro = $this->pdf->GetY();
		$this->pdf->Cell(10,6,utf8_decode('COMPOSICION CORPORAL') ,0,0,'L');
		$this->pdf->Image('assets/images/icons/composicion-cuerpo.jpg',8,$posYCuadro+6);
		$this->pdf->SetFont('Arial','',11);
		$posXporc = 0;
		$anchoPorc = ($this->pdf->GetPageWidth() - 16) / 2;
		$this->pdf->Ln(12);
		$this->pdf->SetX($posXporc);
		$this->pdf->Cell($anchoPorc,6,utf8_decode('GRASA: '  . $consulta['porc_masa_grasa'] . ' %') ,0,0,'C');
		$this->pdf->Ln(15);
		$this->pdf->SetX($posXporc);
		$this->pdf->Cell($anchoPorc,6,utf8_decode('PROTEINA: '  . $consulta['porc_masa_libre'] . ' %') ,0,0,'C');
		$this->pdf->Ln(15);
		$this->pdf->SetX($posXporc);
		$this->pdf->Cell($anchoPorc,6,utf8_decode('AGUA: '  . $consulta['porc_agua_corporal'] . ' %') ,0,0,'C');

		/*progreso*/
		$this->pdf->Ln(10);
		$this->pdf->SetX(8);
		$anchoProgreso = (($this->pdf->GetPageWidth() - 16) / 2)+ 22;
		$this->pdf->SetFont('Arial','B',11);
		$this->pdf->Cell($anchoProgreso,6,utf8_decode('Progreso:') ,0,1,'L');
		$this->pdf->SetFont('Arial','',11);
		$posYprogreso = $this->pdf->GetY();
		$this->pdf->Image('assets/images/icons/star.png',9, null, 4);
		$this->pdf->SetXY(13, $posYprogreso);
		$this->pdf->Cell($anchoProgreso,6,utf8_decode('Progreso 1...') ,0,0,'L');
		$posYprogreso+=6;
		$this->pdf->Image('assets/images/icons/star.png',9, $posYprogreso, 4);
		$this->pdf->SetXY(13, $posYprogreso);
		$this->pdf->Cell($anchoProgreso,6,utf8_decode('Progreso 2...') ,0,0,'L');
		$posYprogreso+=6;
		$this->pdf->Image('assets/images/icons/star.png',9, $posYprogreso, 4);
		$this->pdf->SetXY(13, $posYprogreso);
		$this->pdf->Cell($anchoProgreso,6,utf8_decode('Progreso 3...') ,0,0,'L');

		/*detalle peso*/
		$posXCuadro = (($this->pdf->GetPageWidth() - 16) / 2)+ 25;
		$anchoCuadro =(($this->pdf->GetPageWidth() - 16) / 2) -20;
		$anchoSubCuadro = $anchoCuadro -30;
		$this->pdf->SetFillColor(234,235,237);
		$this->pdf->SetDrawColor(150,155,165);
		$this->pdf->SetXY($posXCuadro , $posYCuadro);
		$posY = $posYCuadro;
		$this->pdf->SetFont('Arial','B',11);
		$this->pdf->Cell($anchoCuadro,11,utf8_decode('DETALLE DEL PESO') ,1,0,'C', TRUE);
		$this->pdf->SetFont('Arial','',11);
		$posY += 11;
		$this->pdf->SetXY($posXCuadro,$posY);
		$this->pdf->Cell($anchoSubCuadro,9,utf8_decode('   PESO IDEAL') ,1,0,'L', FALSE);
		$this->pdf->SetXY(($posXCuadro+$anchoCuadro-30), $posY);
		$pesoIdeal = round((0.75 * ((float)$paciente['estatura'] - 150)) + 50);
		$this->pdf->Cell(30,9,utf8_decode($pesoIdeal . ' kg.') ,1,0,'C', FALSE);

		$posY += 9;
		$this->pdf->SetXY($posXCuadro, $posY);
		$this->pdf->Cell($anchoSubCuadro,9,utf8_decode('   OBJETIVO') ,1,0,'L', FALSE);
		$this->pdf->SetXY(($posXCuadro+$anchoCuadro-30), $posY);
		$objetivo = round($pesoIdeal - (float)$consulta['peso']);
		$this->pdf->Cell(30,9,utf8_decode($objetivo . ' kg.') ,1,0,'C', FALSE);

		$posY += 9;
		$this->pdf->SetFillColor(252,184,185);
		$this->pdf->SetXY($posXCuadro, $posY);
		$this->pdf->Cell($anchoSubCuadro,9,utf8_decode('   GRASA') ,1,0,'L', TRUE);
		$this->pdf->SetXY(($posXCuadro+$anchoCuadro-30), $posY);		
		$this->pdf->Cell(30,9,utf8_decode(' kg.') ,1,0,'C', TRUE);

		$posY += 9;
		$this->pdf->SetXY($posXCuadro, $posY);
		$this->pdf->Cell($anchoSubCuadro,9,utf8_decode('   MASA MUSCULAR') ,1,0,'L', TRUE);
		$this->pdf->SetXY(($posXCuadro+$anchoCuadro-30), $posY);		
		$this->pdf->Cell(30,9,utf8_decode(' kg.') ,1,0,'C', TRUE);

		/*tipo cuerpo*/
		$posY += 12;
		$this->pdf->SetXY(($posXCuadro), $posY);
		$this->pdf->Cell($anchoCuadro,8,utf8_decode('TIPO DE CUERPO') ,0,0,'C', FALSE);
		$posY += 8;
		$this->pdf->Image('assets/images/icons/tipo-cuerpo.jpg',$posXCuadro+10,$posY);

		/*barras*/
		$anchoTotalBarras = $this->pdf->GetPageWidth() - 32;
		$posYprogreso+=6;
		$this->pdf->SetXY(8,$posYprogreso);
		//BARRA IMC
		$this->pdf->Ln(8);
		$this->pdf->SetFont('Arial','B',15);
		$this->pdf->Cell(17,6,utf8_decode('IMC: '  ) ,0,0,'L');
		$anchoColor = $anchoTotalBarras / 6;
		$this->pdf->Ln(8);
		$this->pdf->SetFont('Arial','',10);
		$this->pdf->SetX(16);
		$this->pdf->SetFillColor(58,111,255);
		$this->pdf->Cell($anchoColor,11,utf8_decode('Bajo peso') ,0,0,'C',TRUE);

		$this->pdf->SetFillColor(73,196,91);
		$this->pdf->Cell($anchoColor,11,utf8_decode('Bajo normal') ,0,0,'C',TRUE);

		$this->pdf->SetFillColor(255,253,67);
		$this->pdf->Cell($anchoColor,11,utf8_decode('Sobrepeso') ,0,0,'C',TRUE);

		$this->pdf->SetFillColor(255,152,91);
		$this->pdf->Cell($anchoColor,11,utf8_decode('Obesidad 1º') ,0,0,'C',TRUE);

		$this->pdf->SetFillColor(255,71,71);
		$this->pdf->Cell($anchoColor,11,utf8_decode('Obesidad 2º') ,0,0,'C',TRUE);

		$this->pdf->SetFillColor(214,50,53);
		$this->pdf->Cell($anchoColor,11,utf8_decode('Obesidad 3º') ,0,0,'C',TRUE);
		$this->pdf->Ln();
		$this->pdf->SetX(16);
		$this->pdf->Cell($anchoColor,5,utf8_decode('< 18.5') ,0,0,'C',FALSE);
		$this->pdf->Cell($anchoColor,5,utf8_decode('18.5 a 24.9') ,0,0,'C',FALSE);
		$this->pdf->Cell($anchoColor,5,utf8_decode('25 a 29.9') ,0,0,'C',FALSE);
		$this->pdf->Cell($anchoColor,5,utf8_decode('30 a 34.9') ,0,0,'C',FALSE);
		$this->pdf->Cell($anchoColor,5,utf8_decode('35 a 39.9') ,0,0,'C',FALSE);
		$this->pdf->Cell($anchoColor,5,utf8_decode('> 40') ,0,0,'C',FALSE);

		$this->pdf->Ln(8);
		$this->pdf->SetFont('Arial','B',15);
		$this->pdf->Cell(17,6,utf8_decode('GRASA: '  ) ,0,0,'L');

		$this->pdf->Ln(8);
		$this->pdf->SetFont('Arial','B',15);
		$this->pdf->Cell(17,6,utf8_decode('GRASA VISCERAL: '  ) ,0,0,'L');


		/*output*/
		$timestamp = date('YmdHis');
		$result = $this->pdf->Output( 'F','assets/images/dinamic/pdfTemporales/tempPDF_'. $timestamp .'.pdf' );

		$arrData['urlTempPDF'] = 'assets/images/dinamic/pdfTemporales/tempPDF_'. $timestamp .'.pdf';
	    // $arrData = array(
	    //   'urlTempPDF'=> 'assets/images/dinamic/pdfTemporales/tempPDF_'. $timestamp .'.pdf'
	    // );

		$this->output
		    ->set_content_type('application/json')
		    ->set_output(json_encode($arrData));
	}

}
