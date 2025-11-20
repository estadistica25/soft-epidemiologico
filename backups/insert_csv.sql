-- 
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'Ad Hoc Distributed Queries', 1;
RECONFIGURE;
----

DECLARE @sql NVARCHAR(MAX);

SET @sql = N'BULK INSERT dbo.Departamentos FROM ''' +
    N'D:\' + '\Departamentos.csv'' WITH (' +
    N'CODEPAGE = ''65001'',' + N'FIRSTROW = 2, FIELDTERMINATOR = '','',
    ROWTERMINATOR = ''\n'', TABLOCK, KEEPNULLS);';
PRINT @sql;
EXEC sp_executesql @sql;

		

DECLARE @sql NVARCHAR(MAX);
SET @sql = N'BULK INSERT dbo.Provincias FROM ''' +
    N'D:\' + '\Provincias.csv'' WITH (' +
    N'CODEPAGE = ''65001'',' + N'FIRSTROW = 2, FIELDTERMINATOR = '','',
    ROWTERMINATOR = ''\n'', TABLOCK, KEEPNULLS);';
PRINT @sql;
EXEC sp_executesql @sql;

DECLARE @sql NVARCHAR(MAX);
SET @sql = N'BULK INSERT dbo.Distritos FROM ''' +
    N'D:\' + '\Distritos.csv'' WITH (' +
    N'CODEPAGE = ''65001'',' + N'FIRSTROW = 2, FIELDTERMINATOR = '','',
    ROWTERMINATOR = ''\n'', TABLOCK, KEEPNULLS);';
PRINT @sql;
EXEC sp_executesql @sql;


DECLARE @sql NVARCHAR(MAX);
SET @sql = N'BULK INSERT dbo.CasosDengue FROM ''' +
    N'D:\' + '\CasosDengue.csv'' WITH (' +
    N'CODEPAGE = ''65001'',' + N'FIRSTROW = 2, FIELDTERMINATOR = '','',
    ROWTERMINATOR = ''\n'', TABLOCK, KEEPNULLS);';
PRINT @sql;
EXEC sp_executesql @sql;