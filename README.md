# Backend del Mapa Epidemiológico

Este sistema permite identificar enfermedades reportadas en distintos establecimientos de salud y representarlas geográficamente en un mapa. Cada caso se muestra como un punto en función de su latitud y longitud, facilitando la visualización y el análisis epidemiológico.

## 🚀 Pasos para levantar el proyecto

### 1. Instalar dependencias

Ejecuta el siguiente comando en la raíz del proyecto:
```
npm install
```

## ⚙️ Configurar el puerto de SQL Server

### 1. Abre SQL Server Configuration Manager

En el buscador de Windows, escribe:
```
SQL Server Configuration Manager
```
Ábrelo.

Busca en inicio: "SQL Server Configuration Manager"

### 2. Navegar a los protocolos de red
Ve a:
```
SQL Server Network Configuration
    → Protocols for SQLEXPRESS
        → TCP/IP (doble clic)
```
### 3. Revisar la pestaña IP Addresses
Desplázate hacia abajo hasta la sección **IPAll**, donde verás:

- **TCP Dynamic Ports**
- **TCP Port**

Ejemplo:
```
TCP Dynamic Ports = 53214
TCP Port =
```
Interpretación:  
- Si **TCP Dynamic Ports** tiene un valor numérico → ese es el puerto real asignado dinámicamente.
- Si **TCP Port** tiene valor **1433** → estás usando el puerto estándar de SQL Server.

### 4. Configurar un puerto fijo
Si deseas usar un puerto fijo (por ejemplo, 1433):

- Escribe el puerto deseado en TCP Port.
- Borra el valor de TCP Dynamic Ports (déjalo vacío).
- Guarda los cambios.
- Reinicia el servicio de SQL Server.
