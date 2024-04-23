
ALTER PROCEDURE [dbo].[JI_Inventario_Stock]
	--###### Paginación ######

	@Page INT,
	@PageSize INT,

     --##### Populate ######
	 
	@PopulateStockDetails BIT = false,
	@PopulateStock BIT = false,
	@PopulateCost BIT = false,
	@PopulatePrice BIT = false,
	@PopulateGroup BIT = false,
	
	--###### Filtros #######

	@Sku VARCHAR(50) = '',
	@ProductCategory VARCHAR(50) = '', --'productos,consignacion'
	@IsWebActive VARCHAR(50) = '',  --disponible en web si=1 no=null
	@HasImage VARCHAR(50) = '',  --tiene una imagen si=1 no=null

	@FilterGroup1 VARCHAR(50) = '',   -- Equivalencia en Dms LINEA 
	@FilterGroup2 VARCHAR(50) = '',   -- Equivalencia en Dms MARCA
	@FilterGroup3 VARCHAR(50) = '',   -- Equivalencia en Dms GRUPO
	@FilterGroup4 VARCHAR(50) = '',   -- Equivalencia en Dms SUBGRUPO
	@FilterGroup5 VARCHAR(50) = '',   -- Equivalencia en Dms TALLA
	@FilterGroup6 VARCHAR(50) = '',   -- Equivalencia en Dms PIEDRA
	@FilterGroup7 VARCHAR(50) = '',   -- Equivalencia en Dms MATERIAL

	@Name VARCHAR(MAX) = ''   -- Buscar una palabra clave en el campo Descripcion del producto
	
  
AS
BEGIN

	--Manejo de TRY CATCH para el control de los errores
	BEGIN TRY

    DECLARE @TotalReg INT;

    -- Contar el número total de registros
    SELECT @TotalReg = COUNT(DISTINCT p.id)
     FROM v_cot_item_stock_tot st JOIN cot_item p ON st.id_cot_item = p.id
		LEFT JOIN  cot_item_lote lt ON st.id_cot_item=lt.id_cot_item AND st.id_cot_item_lote=lt.id
		LEFT JOIN cot_item_alt alt ON alt.id_cot_item = p.id AND st.id_cot_item_lote=alt.id_cot_item_lote
		LEFT JOIN cot_item_bodega b_item ON b_item.id_cot_item = st.id_cot_item AND b_item.id_cot_bodega = st.id_cot_bodega
		LEFT JOIN cot_bodega b ON b_item.id_cot_bodega= b.id
		JOIN cot_item_categoria cat_item ON  p.id_cot_item_categoria = cat_item.id AND st.id_emp = cat_item.id_emp
		JOIN cot_item_talla tall ON p.id_cot_item_talla = tall.id
        JOIN cot_item_color col ON p.id_cot_item_color = col.id
		JOIN cot_grupo_sub sub ON sub.id = p.id_cot_grupo_sub
		JOIN cot_grupo gru ON gru.id = sub.id_cot_grupo
		LEFT JOIN cot_grupo_sub5 s5 ON s5.id = p.id_cot_grupo_sub5
        LEFT JOIN cot_grupo_sub4 s4 ON s4.id = s5.id_cot_grupo_sub4
		LEFT JOIN cot_grupo_sub3 s3 ON s3.id = s4.id_cot_grupo_sub3

    WHERE (st.stock > 0) 
        AND p.id_cot_item_categoria IN (531, 534)  
        AND (@Sku = '' OR p.codigo = @Sku)
        AND (@ProductCategory = '' OR cat_item.descripcion IN (SELECT value FROM STRING_SPLIT(@ProductCategory, ',')))
        AND (@IsWebActive IS NULL OR (@IsWebActive = '' OR (@IsWebActive = 'true' AND p.web IS NOT NULL) OR (@IsWebActive = 'false' AND p.web IS NULL)))
        AND (@HasImage IS NULL OR (@HasImage = '' OR (@HasImage = 'true' AND p.imagen IS NOT NULL) OR (@HasImage = 'false' AND p.imagen IS NULL)))
        AND (@FilterGroup1 = '' OR gru.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup1, ',')))
        AND (@FilterGroup2 = '' OR sub.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup2, ',')))
        AND (@FilterGroup3 = '' OR s3.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup3, ',')))
        AND (@FilterGroup4 = '' OR s4.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup4, ',')))
        AND (@FilterGroup5 = '' OR s5.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup5, ',')))
        AND (@FilterGroup6 = '' OR tall.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup6, ',')))
        AND (@FilterGroup7 = '' OR col.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup7, ',')))
		AND (@Name = '' OR p.descripcion LIKE '%' + @Name + '%')
      
SELECT

	--****** Cantidad total de registros con los filtros realizados *********************
	@TotalReg AS totalRecords,

    (
		
	--########### Inicio de las consultas #############

	
        SELECT 
		       
		p.id AS id,
        UPPER(p.descripcion) AS name,
        CONVERT(VARCHAR(70), p.codigo) AS sku,
		cat_item.descripcion AS productCategory,
		gru.descripcion AS productType,
		CASE WHEN p.web IS NULL 
		THEN CAST(0 AS bit) 
		ELSE CAST(1 AS bit) 
		END As isWebActive,

       --**************** Imagen ***************

	   	(SELECT 
			CASE 
				WHEN p_inner.imagen IS NULL THEN 
				NULL 
				ELSE '' + (SELECT direccion
						  FROM  cot_bodega
						  WHERE id=80)
						 + CONVERT(VARCHAR(50), p_inner.codigo) + ''
				END AS hasImageConcatenated
		FROM cot_item p_inner
		WHERE p_inner.id = p.id) AS hasImage,
		CASE WHEN p.maneja_lotes IS NULL THEN 
		CAST(0 AS bit) 
		ELSE CAST(1 AS bit) 
		END As hasSerial,
				
		--**************** Atributos ***************

		--##### Tablas de campos varios  cot_item_cam_def  y  cot_item_cam #####

		(  SELECT max(alt_inner.codigo) FROM  cot_item_alt alt_inner  
			WHERE alt_inner.id_cot_item = p.id AND alt_inner.adicional = 'COD A') AS "attributes.altCode",

		(  SELECT max(cv_inner.campo_3) FROM  v_campos_varios cv_inner 
		WHERE cv_inner.id_cot_item = p.id ) AS "attributes.ean13",

		(  SELECT max(cv_inner.campo_1) FROM  v_campos_varios cv_inner 
		WHERE cv_inner.id_cot_item = p.id ) AS "attributes.name",

		(  SELECT max(cv_inner.campo_2) FROM  v_campos_varios cv_inner 
		WHERE cv_inner.id_cot_item = p.id ) AS "attributes.description",
				
		p.max_dcto AS "attributes.maxDiscount",

		(  SELECT max(um_inner.peso_neto) FROM  cot_item_cabas um_inner 
		WHERE um_inner.id_cot_item = p.id ) AS "attributes.weight",

		(  SELECT max(cv_inner.campo_4) FROM  v_campos_varios cv_inner 
		WHERE cv_inner.id_cot_item = p.id ) AS "attributes.json",

		(  SELECT max(cv_inner.campo_5) FROM  v_campos_varios cv_inner 
		WHERE cv_inner.id_cot_item = p.id ) AS "attributes.groupCode",
		
		--**************** Stock por bodegas ***************
			
		( JSON_QUERY(
			CASE 
				WHEN @PopulateStockDetails = 'true' THEN
					(
						SELECT
							(
								SELECT  
									st_inner.id_cot_bodega AS id,
									b.codigo_interno AS code,
									b.descripcion AS name,
									(
										SELECT 
											lt.lote AS code,                    
											CONVERT(numeric(20,2), st_inner_l.costo_stock) AS cost,
											alt.codigo AS ean8,
											CONVERT(date,lt.fecha_creacion) AS createdAt
                               
										FROM v_cot_item_stock_tot st_inner_l 
										JOIN cot_item p_inner ON st_inner_l.id_cot_item = p_inner.id
										LEFT JOIN cot_item_alt alt ON alt.id_cot_item = p.id AND st_inner_l.id_cot_item_lote = alt.id_cot_item_lote
										JOIN cot_item_lote lt ON st_inner_l.id_cot_item = lt.id_cot_item AND st_inner_l.id_cot_item_lote = lt.id
										WHERE st_inner_l.id_cot_bodega = st_inner.id_cot_bodega AND p_inner.id = p_inner.id  AND alt.adicional = 'EAN 8'
										GROUP BY p_inner.id, st_inner_l.id_cot_bodega, lt.lote, st_inner_l.costo_stock, alt.codigo,lt.fecha_creacion
										FOR JSON PATH, INCLUDE_NULL_VALUES
									) AS serial,
									CONVERT(numeric(20,2), SUM(st_inner.stock)) AS value

								FROM v_cot_item_stock_tot st_inner 
								JOIN cot_item p_inner ON st_inner.id_cot_item = p_inner.id 
								LEFT JOIN cot_item_bodega b_item ON b_item.id_cot_item = st_inner.id_cot_item AND b_item.id_cot_bodega = st_inner.id_cot_bodega
								JOIN cot_bodega b ON b_item.id_cot_bodega = b.id
								WHERE p_inner.id =  p.id
								GROUP BY st_inner.id_cot_bodega, b.codigo_interno, b.descripcion, st_inner.id_cot_bodega
								FOR JSON PATH, INCLUDE_NULL_VALUES, ROOT('wharehouses')
							) AS wharehouses
					)
				ELSE 
				NULL
			END
		)	) AS stockDetails,
		

		--**************** Stock General ***************

		( JSON_QUERY(
			CASE 
				WHEN @PopulateStock = 'true' THEN
						JSON_QUERY(
			(SELECT 
                       
					CONVERT(numeric(20,2), SUM(st_inner.stock)) AS value
				 			
					FROM v_cot_item_stock_tot st_inner 
					JOIN cot_item p_inner ON st_inner.id_cot_item = p_inner.id 
					WHERE p_inner.id =  p.id
					GROUP BY st_inner.id_cot_item
					FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES
			  )
		
					)
				ELSE 
				NULL
			END
		)	) AS stock,


		--**************** Detalle del Costo ***************
					
			( JSON_QUERY(
			CASE 
				WHEN @PopulateCost = 'true' THEN

						JSON_QUERY(
			CASE 
				WHEN p.maneja_lotes = 2 THEN
					(
						SELECT 
							CONVERT(numeric(20,2), SUM(st_inner.costo_stock)) AS stock,  
							CONVERT(numeric(20,2), MAX(st_inner.costo_promedio)) AS average
						FROM v_cot_item_stock_tot st_inner 
						JOIN cot_item p_inner ON st_inner.id_cot_item = p_inner.id 
						WHERE st_inner.id_cot_item = p.id
						GROUP BY st_inner.id_cot_item
						FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES
					)
          
				WHEN p.maneja_lotes  IS NULL THEN

					(
						SELECT 
							CONVERT(numeric(20,2), MAX(st_inner.costo_stock)) AS stock,  
							CONVERT(numeric(20,2), MAX(st_inner.costo_promedio)) AS average
						FROM v_cot_item_stock_tot st_inner 
						JOIN cot_item p_inner ON st_inner.id_cot_item = p_inner.id 
						WHERE st_inner.id_cot_item = p.id
						GROUP BY st_inner.id_cot_item
						FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER, INCLUDE_NULL_VALUES
					)
			END
			)
				ELSE 
				NULL
			END
		)	) AS cost,

		
			--**************** Precios de lista ***************
		
			( JSON_QUERY(
			CASE 
				WHEN @PopulatePrice = 'true' THEN

				(SELECT 
		 
					l_inner.id AS id,
					CONVERT(VARCHAR(10),l_inner.precio_nro) AS code,
					UPPER(l_inner.descripcion) AS name,
					CONVERT(numeric(20,2), pre_inner.precio) AS value

					FROM cot_item_precios pre_inner 
					JOIN cot_item_listas l_inner ON pre_inner.id_cot_item_listas = l_inner.id 
					WHERE pre_inner.id_cot_item = p.id
					FOR JSON PATH, INCLUDE_NULL_VALUES
							)
						
				ELSE 
				NULL
			END
		)	) AS price,

			
		--**************** Grupos ***************

		( JSON_QUERY(
			CASE 
				WHEN @PopulateGroup = 'true' THEN
						(SELECT 
			v_g.id AS id,
			v_g.parentId AS parentId,
			v_g.code AS code,
			UPPER(v_g.nombre) AS name,
			UPPER(v_g.descripcion) AS value			

            FROM JI_V_Clasificacion_Inventario v_g 
            WHERE v_g.idItem = p.id
			FOR JSON PATH, INCLUDE_NULL_VALUES
		
					)
				ELSE 
				NULL
			END
		)	) AS groups,

		
		--**************** Piedra y Material ***************
		 
		 ( JSON_QUERY(
			CASE 
				WHEN @PopulateGroup = 'true' THEN
						(
                    SELECT
                        (
                            SELECT 
                                tall_inner.descripcion AS name,
                                tall_inner.descripcion AS value
                            FROM cot_item p_inner 
                            JOIN cot_item_talla tall_inner ON p_inner.id_cot_item_talla = tall_inner.id
                            WHERE p_inner.id = p.id
                            FOR JSON PATH
                        ) AS piedra,
                        (
                            SELECT 
                                col_inner.descripcion AS name,
                                col_inner.descripcion AS value
                            FROM cot_item p_inner 
                            JOIN cot_item_color col_inner ON p_inner.id_cot_item_color = col_inner.id
                            WHERE p_inner.id = p.id
                            FOR JSON PATH
                        ) AS material
                    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                )
				ELSE 
				NULL
			END
		)	) AS otherGoups

		
        FROM v_cot_item_stock_tot st JOIN cot_item p ON st.id_cot_item = p.id
		LEFT JOIN  cot_item_lote lt ON st.id_cot_item=lt.id_cot_item AND st.id_cot_item_lote=lt.id
		LEFT JOIN cot_item_alt alt ON alt.id_cot_item = p.id AND st.id_cot_item_lote=alt.id_cot_item_lote
		LEFT JOIN cot_item_bodega b_item ON b_item.id_cot_item = st.id_cot_item AND b_item.id_cot_bodega = st.id_cot_bodega
		LEFT JOIN cot_bodega b ON b_item.id_cot_bodega= b.id
		JOIN cot_item_categoria cat_item ON  p.id_cot_item_categoria = cat_item.id AND st.id_emp = cat_item.id_emp
		JOIN cot_item_talla tall ON p.id_cot_item_talla = tall.id
        JOIN cot_item_color col ON p.id_cot_item_color = col.id
		JOIN cot_grupo_sub sub ON sub.id = p.id_cot_grupo_sub
		JOIN cot_grupo gru ON gru.id = sub.id_cot_grupo
		LEFT JOIN cot_grupo_sub5 s5 ON s5.id = p.id_cot_grupo_sub5
        LEFT JOIN cot_grupo_sub4 s4 ON s4.id = s5.id_cot_grupo_sub4
		LEFT JOIN cot_grupo_sub3 s3 ON s3.id = s4.id_cot_grupo_sub3
		
		
		WHERE (st.stock > 0) 
		AND  p.id_cot_item_categoria IN (531, 534)  
		AND (@Sku = '' OR p.codigo = @Sku)
		AND (@ProductCategory = '' OR cat_item.descripcion IN (SELECT value FROM STRING_SPLIT(@ProductCategory, ',')))
		AND (@IsWebActive IS NULL 
         OR (@IsWebActive = '')
         OR (@IsWebActive = 'true' AND p.web IS NOT NULL) -- Si @ConImagen es 1, seleccionar solo registros con imagen
         OR (@IsWebActive = 'false' AND p.web IS NULL)  -- Si @ConImagen es 0, seleccionar solo registros sin imagen
		)
		AND (@HasImage IS NULL
		 OR (@HasImage = '')
         OR (@HasImage = 'true' AND p.imagen IS NOT NULL) -- Si @ConImagen es 1, seleccionar solo registros con imagen
         OR (@HasImage = 'false' AND p.imagen IS NULL)  -- Si @ConImagen es 0, seleccionar solo registros sin imagen
		 )
		AND (@FilterGroup1 = '' OR gru.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup1, ',')))
		AND (@FilterGroup2 = '' OR sub.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup2, ',')))
		AND (@FilterGroup3 = '' OR s3.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup3, ',')))
		AND (@FilterGroup4 = '' OR s4.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup4, ',')))
		AND (@FilterGroup5 = '' OR s5.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup5, ',')))

		AND (@FilterGroup6 = '' OR tall.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup6, ',')))
		AND (@FilterGroup7 = '' OR col.descripcion IN (SELECT value FROM STRING_SPLIT(@FilterGroup7, ',')))
		
		AND (@Name = '' OR p.descripcion LIKE '%' + @Name + '%')

	
        GROUP BY
        p.id,
        p.codigo,
		cat_item.descripcion,
        p.descripcion,
        p.web,
		p.maneja_lotes,
		gru.descripcion,
		p.max_dcto,
		st.id_cot_item,
		p.id_cot_grupo_sub,
        p.id_cot_grupo_sub5,
        tall.descripcion,
        col.descripcion

		ORDER BY p.id

		--******* Paginacion *********

		OFFSET (@Page - 1 ) * @PageSize ROWS
		FETCH NEXT @PageSize ROWS ONLY

		
		FOR JSON PATH,INCLUDE_NULL_VALUES

--		--########### Fin de las consultas #############

   ) AS data
   

END TRY
BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;

        SELECT
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

			 -- Retorno de errores al cliente
        SELECT
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage,
            ERROR_SEVERITY() AS ErrorSeverity,
            ERROR_STATE() AS ErrorState;
    END CATCH;
END;