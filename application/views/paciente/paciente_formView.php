<div class="modal-header">
	<h4 class="modal-title"> {{ titleForm }}  </h4>
</div>
<div class="modal-body">
    <form class="row" name="formPaciente">
		<div class="form-group mb-md col-md-12">
			<label class="control-label mb-xs">Nombre <small class="text-danger">(*)</small> </label>
			<input type="text" class="form-control input-sm" ng-model="fData.nombre" placeholder="Registre nombre" tabindex="1" focus-me required />
		</div>
	</form>
</div>
<div class="modal-footer">
    <button class="btn btn-primary" ng-click="aceptar(); $event.preventDefault();" ng-disabled="formPaciente.$invalid">Aceptar</button>
    <button class="btn btn-warning" ng-click="cancel()">Cancelar</button>
</div>