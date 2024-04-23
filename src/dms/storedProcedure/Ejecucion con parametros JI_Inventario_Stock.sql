EXEC JI_Inventario_Stock

	--###### Paginación ######

	@Page = 1,
	@PageSize = 50,

    --##### Populate ######

	@PopulateStockDetails = true,  -- para que lo muestre true y para que no lo muestre false
	@PopulateStock = true,   -- para que lo muestre true y para que no lo muestre false
	@PopulateCost = true,   -- para que lo muestre true y para que no lo muestre false
	@PopulatePrice = true,   -- para que lo muestre true y para que no lo muestre false
	@PopulateGroup = true,    -- para que lo muestre true y para que no lo muestre false
	
	--###### Filtros #######
	@Sku = '', --para traer todos los items '' o para un solo codigo = 'codigo'
	@ProductCategory = '', ----para traer todas las categorias '' o 'productos,consignacion'
	@IsWebActive = null ,  --disponible en web si=true, NULL para traer sin importar esta marcacion
	@HasImage = null,  --tiene una imagen si=true no=false, NULL para traer sin importar esta marcacion

	@FilterGroup1 = 'relojes',     ----en Dms LINEA para traer todos los grupos = '' , o para varios o una marca = 'relojes,joyas,gafas'
	@FilterGroup2 = 'rolex',		-- Equivalencia en Dms MARCA
	@FilterGroup3 = '',		-- Equivalencia en Dms GRUPO
	@FilterGroup4 = '',		-- Equivalencia en Dms SUBGRUPO
	@FilterGroup5 = '',		-- Equivalencia en Dms TALLA
	@FilterGroup6 = '',		-- Equivalencia en Dms PIEDRA
	@FilterGroup7 = '',		-- Equivalencia en Dms MATERIAL
	
	@Name='verde'
	


