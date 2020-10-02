// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const configProveedores = {
  LOGIN: {
    URL: 'http://mail.gcv.ec:8042/ws_dd_externo_portales_desarrollo/Sistemas/Sistemas.svc?singleWsdl'
    ,METODOS : [
      'autenticar_usuario'
      ,'traer_menu'
    ]
  }
  ,PROVEEDOR: {
    URL: 'http://mail.gcv.ec:8042/ws_dd_externo_portales_desarrollo/Adquisiciones/Solicitud_compra/Solicitud_compra.svc?singleWsdl'
    ,METODOS: [
      'traer_solicitud_compra'
      ,'ingresar_cotizacion'
      ,'traer_en_concurso'
      ,'eliminar_cotizacion'
      ,'traer_foto_detalles'
      ,'traer_solicitud_en_compromiso'
      ,'eliminar_compromiso'
      ,'actualziar_proveedor'
      ,'traer_proveedor'
    ]
    ,URL2: 'http://mail.gcv.ec:8042/ws_dd_externo_portales_desarrollo/Proveedores/FacturaServicio/FacturaServicio.svc?singleWsdl'
    ,METODOS2: [
      'Traer_Factura_PorNumero'
      ,'Traer_Factura_PorNumero_Estado'
      ,'Traer_Factura_PorNumero_Estado_Fecha'
      ,'Traer_Factura_Anio'
      ,'Traer_departamentos'
      ,'Insertar_factura_fisica'
      ,'Eliminar_factura'
      ,'Traer_factura'
    ]
  }
};

export const configColaborador = {
  LOGIN: {
    URL: 'http://mail.gcv.ec:8042/ws_dd_externo_portales/Sistemas/Sistemas.svc?singleWsdl'
    ,METODOS : [
      'autenticar_usuario'
      ,'traer_menu'
    ]
  }
  ,COLABORADOR: {
    URL: 'http://mail.gcv.ec:8042/ws_dd_externo_portales/Colaboradores/CompraMP/Negociacion.svc?singleWsdl'
    ,METODOS: [
      'Traer_resumen_compra_mes_anio',//0
      'Traer_resumen_cabecera_mes_anio',//1
      'Compra_copiar_datos',//2
      'Confirmar_negociacion',//3
      'Compra_verificar_eliminar',//4
      'Compra_eliminar',//5
      'Compra_cancelar',//6
      'Verificar_imprimir_contrato',
      'Imprimir_contrato',
      'Traer_novedad_cancelar_compra',
      'Traer_requisitos',
      'Notificar_bread_down', 
      'Traer_grupo_compra',
      'Tipo_tipo_compra_traer_porgrupo',
      'Termino_compra_traer',
      'Materia_prima_traer',
      'Proveedor_ax_traer',
      'Barco_traer_ax',
      'Compra_traer',
      'Compra_traer_por_cabecera',
      'Bandera_traer',
      'Compra_traer_informacion',
      'Compra_Modificar',
      'Compra_Guardar',
      'Cabecera_guardar',
      'Cabecera_modificar', 
      'Proveedor_guardar',
      'Organismo_pesca_traer_todos',
      'Barco_crear',
      'Barco_traer_por_codigo_domus',
      'Barco_modificar',
      'Organismo_pesca_resumen_por_compra',
      'Organismo_pesca_eliminar',
      'Organismo_pesca_modificar',
      'Organismo_pesca_insertar',
      'Requisito_modificar', 
      'Status_embarcacion_traer_documento',
      'Status_embarcacion_adjuntar_documento',
      'Compra_mp_traer_resumen',
      'Tabla_precio_resumen_por_compra',
      'Condicion_pago_por_compra',
      'Precio_contrato_modificar',
      'Configuracion_pago_traer',
      'Tipo_barco_traer',//43
      'Traer_informacion_cabecera',
       
    ] 
    ,MetodosDoc: [
      ,'Tipo_barco_traer' // 1 
      ,'Barco_traer_ax' // 2
      ,'Mercante_traer' // 3
      ,'Barco_traer_por_compra_domus' // 4
      ,'Barco_modificar' // 5
      ,'Compra_notificar_observaciones' // 6
      ,'Compra_taer_documentos' // 7
      ,'Adjuntar_documento' // 8
      ,'Documento_traer' // 9
      ,'Documento_modificar' // 10
      ,'Compra_mp_traer_resumen' // 11
      ,'Especie_talla_armador_traer' // 12
      ,'Especie_traer' // 13
      ,'Talla_traer' // 14
      ,'Agrupacion_talla_traer' // 15
      ,'Especie_talla_armador_insertar' // 16
      ,'Especie_talla_armador_modificar' // 17
      ,'Especie_talla_armador_eliminar' // 18
      ,'Cargos_varios_pago_por_compra' // 19
      ,'Asignacion_gasto_traer' // 20
      ,'Agrupacion_cargos_varios_traer' // 21
      ,'Sincronizar_documentos' // 22
      ,'Tabla_pecio_generar_por_configuracion' // 23
      ,'Cargos_varios_insertar' // 24
      ,'Cargos_varios_modificar' // 25
      ,'Tipo_pago_traer' // 26
      ,'Condicion_pago_modificar' // 27
      ,'Condicion_pago_insertar' // 28
      ,'Condicion_pago_eliminar' // 29
      ,'Tabla_precio_traer' // 30
      ,'Condicion_pago_generar' // 31
    ]
  }
};