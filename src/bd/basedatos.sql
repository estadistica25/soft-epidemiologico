
--CREATE DATABASE MapaCalor;
--GO

--USE MapaCalor;
--GO

-- ================================
-- Tabla Departamentos
-- ================================
CREATE TABLE Departamentos (
    idDepartamento INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    ubigeo CHAR(2) NOT NULL
);
GO

-- ================================
-- Tabla Provincias
-- ================================
CREATE TABLE Provincias (
    idProvincia INT IDENTITY(1,1) PRIMARY KEY,
    idDepartamento INT NOT NULL,
    nombre NVARCHAR(100) NOT NULL,
    ubigeo CHAR(4) NOT NULL,
    FOREIGN KEY (idDepartamento) REFERENCES Departamentos(idDepartamento)
);
GO

-- ================================
-- Tabla Distritos
-- ================================
CREATE TABLE Distritos (
    idDistrito INT IDENTITY(1,1) PRIMARY KEY,
    idProvincia INT NOT NULL,
    nombre NVARCHAR(100) NOT NULL,
    ubigeo CHAR(6) NOT NULL,
    FOREIGN KEY (idProvincia) REFERENCES Provincias(idProvincia)
);
GO

-- ================================
-- Tabla Casos (Dengue, COVID, etc.)
-- ================================
CREATE TABLE CasosDengue (
    id INT IDENTITY(1,1) PRIMARY KEY,
    anio INT NOT NULL,
    semana INT NOT NULL,
    fechaInicio DATE,
    fechaNotificacion DATE,
    departamento NVARCHAR(100),
    provincia NVARCHAR(100),
    distrito NVARCHAR(100),
    ubigeo VARCHAR(10),
    latitud FLOAT,
    longitud FLOAT,
    sexo CHAR(1),
    edad INT,
    etapaVida NVARCHAR(50),
    casos INT,
    fallecidos INT DEFAULT 0
);


-- ==============================================================================
-- =========================
-- Departamentos (25)
-- =========================
INSERT INTO Departamentos (nombre, ubigeo) VALUES
('Amazonas', '01'),
('�ncash', '02'),
('Apur�mac', '03'),
('Arequipa', '04'),
('Ayacucho', '05'),
('Cajamarca', '06'),
('Callao', '07'),
('Cusco', '08'),
('Huancavelica', '09'),
('Hu�nuco', '10'),
('Ica', '11'),
('Jun�n', '12'),
('La Libertad', '13'),
('Lambayeque', '14'),
('Lima', '15'),
('Loreto', '16'),
('Madre de Dios', '17'),
('Moquegua', '18'),
('Pasco', '19'),
('Piura', '20'),
('Puno', '21'),
('San Mart�n', '22'),
('Tacna', '23'),
('Tumbes', '24'),
('Ucayali', '25');

-- =========================
-- Provincias (ejemplos)
-- =========================
INSERT INTO Provincias (idDepartamento, nombre, ubigeo) VALUES
(1, 'Chachapoyas', '0101'),   -- Amazonas
(2, 'Huaraz', '0201'),        -- �ncash
(3, 'Abancay', '0301'),       -- Apur�mac
(4, 'Arequipa', '0401'),      -- Arequipa
(5, 'Huamanga', '0501'),      -- Ayacucho
(6, 'Cajamarca', '0601'),     -- Cajamarca
(7, 'Callao', '0701'),        -- Callao
(8, 'Cusco', '0801'),         -- Cusco
(9, 'Huancavelica', '0901'),  -- Huancavelica
(10, 'Hu�nuco', '1001'),      -- Hu�nuco
(11, 'Ica', '1101'),          -- Ica
(12, 'Huancayo', '1201'),     -- Jun�n
(13, 'Trujillo', '1301'),     -- La Libertad
(14, 'Chiclayo', '1401'),     -- Lambayeque
(15, 'Lima', '1501'),         -- Lima
(16, 'Maynas', '1601'),       -- Loreto
(17, 'Tambopata', '1701'),    -- Madre de Dios
(18, 'Mariscal Nieto', '1801'), -- Moquegua
(19, 'Pasco', '1901'),        -- Pasco
(20, 'Piura', '2001'),        -- Piura
(21, 'Puno', '2101'),         -- Puno
(22, 'Moyobamba', '2201'),    -- San Mart�n
(23, 'Tacna', '2301'),        -- Tacna
(24, 'Tumbes', '2401'),       -- Tumbes
(25, 'Coronel Portillo', '2501'); -- Ucayali

-- =========================
-- Distritos (ejemplos)
-- =========================
INSERT INTO Distritos (idProvincia, nombre, ubigeo) VALUES
(1, 'Chachapoyas', '010101'),       -- Amazonas
(2, 'Huaraz', '020101'),            -- �ncash
(3, 'Abancay', '030101'),           -- Apur�mac
(4, 'Arequipa', '040101'),          -- Arequipa
(5, 'Ayacucho', '050101'),          -- Ayacucho
(6, 'Cajamarca', '060101'),         -- Cajamarca
(7, 'Callao', '070101'),            -- Callao
(8, 'Cusco', '080101'),             -- Cusco
(9, 'Huancavelica', '090101'),      -- Huancavelica
(10, 'Hu�nuco', '100101'),          -- Hu�nuco
(11, 'Ica', '110101'),              -- Ica
(12, 'Huancayo', '120101'),         -- Jun�n
(13, 'Trujillo', '130101'),         -- La Libertad
(13, 'La Esperanza', '130102'),     -- La Libertad (extra para probar)
(14, 'Chiclayo', '140101'),         -- Lambayeque
(15, 'Lima Cercado', '150101'),     -- Lima
(16, 'Iquitos', '160101'),          -- Loreto
(17, 'Puerto Maldonado', '170101'), -- Madre de Dios
(18, 'Moquegua', '180101'),         -- Moquegua
(19, 'Cerro de Pasco', '190101'),   -- Pasco
(20, 'Piura', '200101'),            -- Piura
(21, 'Puno', '210101'),             -- Puno
(22, 'Moyobamba', '220101'),        -- San Mart�n
(23, 'Tacna', '230101'),            -- Tacna
(24, 'Tumbes', '240101'),           -- Tumbes
(25, 'Pucallpa', '250101');         -- Ucayali




INSERT INTO CasosDengue 
(anio, semana, fechaInicio, fechaNotificacion, departamento, provincia, distrito, ubigeo, latitud, longitud, sexo, edad, etapaVida, casos, fallecidos)
VALUES
-- Caso 1
(2025, 13, '2024-12-30', '2025-04-07', 'La Libertad', 'Trujillo', 'El Porvenir', '130102', -8.0792, -79.0555, 'M', 54, 'Adulto [31-59]', 1, 0),

-- Caso 2
(2025, 13, '2024-12-30', '2025-01-12', 'La Libertad', 'Trujillo', 'Salaverry', '130109', -8.1861897, -78.9890, 'F', 29, 'Joven [18-30]', 1, 0),

-- Caso 3
(2025, 13, '2025-01-03', '2025-01-09', 'San Martin', 'San Martin', 'Juan Guerra', '220908', -8.1116778, -79.0287742, 'F', 67, 'Adulto Mayor [60+]', 1, 0),

-- Caso 4
(2025, 13, '2024-12-29', '2024-12-31', 'La Libertad', 'Trujillo', 'Moche', '130107', -8.152901872, -79.013210535, 'M', 14, 'Adolescente [12-17]', 1, 0),

-- Caso 5
(2025, 13, '2024-12-29', '2025-01-01', 'La Libertad', 'Trujillo', 'Alto Trujillo', '130112', -8.066028866, -79.014650260, 'M', 8, 'Ni�o [0-11]', 1, 0),

-- Caso 6
(2025, 13, '2024-12-30', '2025-01-07', 'La Libertad', 'Trujillo', 'El Porvenir', '130102', -8.062184, -79.02942, 'F', 31, 'Adulto [31-59]', 1, 0),

-- Caso 7
(2025, 13, '2025-01-03', '2025-01-04', 'La Libertad', 'Trujillo', 'El Porvenir', '130102', -8.062483, -79.02605, 'F', 69, 'Adulto Mayor [60+]', 1, 0),

-- Caso 8
(2025, 13, '2025-01-02', '2025-01-07', 'La Libertad', 'Trujillo', 'El Porvenir', '130102', -8.067410187, -79.032096416, 'F', 56, 'Adulto [31-59]', 1, 0),

-- Caso 9
(2025, 13, '2025-01-11', '2025-01-11', 'La Libertad', 'Trujillo', 'Salaverry', '130109', -8.192969953, -78.981754357, 'F', 27, 'Joven [18-30]', 1, 0);


SELECT TOP 20 *
FROM CasosDengue
WHERE LEFT(ubigeo, 6) = '130102'
ORDER BY fechaNotificacion DESC;




USE [MapaCalor];
GO

IF OBJECT_ID('dbo.sp_InsertarCasoDengue', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_InsertarCasoDengue;
GO

CREATE PROCEDURE dbo.sp_InsertarCasoDengue
  @anio INT,
  @semana INT,
  @fechaNotificacion DATE,
  @departamento NVARCHAR(100),
  @provincia NVARCHAR(100),
  @distrito NVARCHAR(100),
  @ubigeo NVARCHAR(10),
  @sexo NVARCHAR(10),
  @edad INT,
  @casos INT,
  @fallecidos INT
AS
BEGIN
  SET NOCOUNT ON;

  MERGE INTO [dbo].[CasosDengue] AS Target
  USING (VALUES (
    @anio, @semana, @fechaNotificacion, @departamento,
    @provincia, @distrito, @ubigeo, @sexo, @edad, @casos, @fallecidos
  )) AS Source (anio, semana, fechaNotificacion, departamento, provincia, distrito, ubigeo, sexo, edad, casos, fallecidos)
  ON Target.anio = Source.anio
     AND Target.semana = Source.semana
     AND Target.fechaNotificacion = Source.fechaNotificacion
     AND Target.ubigeo = Source.ubigeo
     AND Target.sexo = Source.sexo
     AND Target.edad = Source.edad
  WHEN NOT MATCHED THEN
      INSERT (anio, semana, fechaNotificacion, departamento, provincia, distrito, ubigeo, sexo, edad, casos, fallecidos)
      VALUES (Source.anio, Source.semana, Source.fechaNotificacion, Source.departamento, Source.provincia, Source.distrito, Source.ubigeo, Source.sexo, Source.edad, Source.casos, Source.fallecidos);
END;
GO

