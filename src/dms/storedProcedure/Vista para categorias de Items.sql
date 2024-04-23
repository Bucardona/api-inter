
ALTER VIEW JI_V_Clasificacion_Inventario AS

SELECT 
    idItem,
	id,
	parentId,
	code,
    nombre,
	descripcion

FROM (
    SELECT 
        i.id AS idItem,
		g.id AS idGrupo,
		g.id_ant AS parentIdGrupo,
        g.descripcion AS Grupo,
		s.id AS idSubgrupo,
		s.id_cot_grupo AS parentIdSubGrupo,
        s.descripcion AS Subgrupo,
        s3.id AS idSubgrupo3,
		s3.id_cot_grupo_sub AS parentIdSubGrupo3,
		s3.descripcion AS Subgrupo3,
        s4.id AS idSubgrupo4,
		s4.id_cot_grupo_sub3 AS parentIdSubGrupo4,
		s4.descripcion AS Subgrupo4,
        s5.id AS idSubgrupo5,
		s5.id_cot_grupo_sub4 AS parentIdSubGrupo5,
		s5.descripcion AS Subgrupo5
       
    FROM 
        cot_item i
        JOIN cot_grupo_sub s ON s.id = i.id_cot_grupo_sub
        JOIN cot_grupo g ON g.id = s.id_cot_grupo
        LEFT JOIN cot_grupo_sub5 s5 ON s5.id = i.id_cot_grupo_sub5
        LEFT JOIN cot_grupo_sub4 s4 ON s4.id = s5.id_cot_grupo_sub4
        LEFT JOIN cot_grupo_sub3 s3 ON s3.id = s4.id_cot_grupo_sub3
        LEFT JOIN cot_item_talla tall ON i.id_cot_item_talla = tall.id
        LEFT JOIN cot_item_color col ON i.id_cot_item_color = col.id
) AS TablaOrigen
CROSS APPLY (
    VALUES 
        (idGrupo, parentIdGrupo,'1','Grupo', Grupo),
        (idSubgrupo, parentIdSubGrupo,'2','Subgrupo', Subgrupo),
        (idSubgrupo3, parentIdSubGrupo3,'3','Subgrupo3',Subgrupo3),
	    (idSubgrupo4, parentIdSubGrupo4,'4','Subgrupo4', Subgrupo4),
        (idSubgrupo5, parentIdSubGrupo5,'5','Subgrupo5', Subgrupo5)
) AS TablaConvertida(id, parentId, code, nombre, descripcion);