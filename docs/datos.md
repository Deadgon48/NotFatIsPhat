# Diccionario de Datos - Sistema NoFatIsPhat

Este documento detalla la estructura de la base de datos del sistema **NoFatIsPhat**, diseñado para facilitar la gestión nutricional y el seguimiento entre profesionales de la salud y sus pacientes (Alineado con el **ODS 3**).

---

## Tabla: `paciente`
Almacena la información personal y biométrica básica de los usuarios del sistema.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id_paciente` | INT (PK) | Identificador único del paciente. |
| `nombre` | VARCHAR(100) | Nombre completo del usuario. |
| `edad` | INT | Edad actual del paciente. |
| `peso` | FLOAT | Peso corporal inicial o actual en kilogramos (kg). |
| `altura` | FLOAT | Estatura del paciente en metros (m). |
| `correo` | VARCHAR(100) | Dirección de correo electrónico para contacto y acceso. |

---

## Tabla: `dieta`
Contiene los planes alimenticios asignados por el nutriólogo.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id_dieta` | INT (PK) | Identificador único de la dieta. |
| `id_paciente` | INT (FK) | Relación con la tabla `paciente`. |
| `descripcion` | TEXT | Detalle de los alimentos y porciones permitidas. |
| `calorias` | INT | Meta de calorías totales diarias recomendadas. |
| `fecha_inicio` | DATE | Fecha en que el paciente debe comenzar el plan. |
| `fecha_fin` | DATE | Fecha estimada de finalización o revisión del plan. |

---

## Tabla: `historial`
Registra el progreso físico del paciente a través del tiempo.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id_historial` | INT (PK) | Identificador único del registro de progreso. |
| `id_paciente` | INT (FK) | Relación con la tabla `paciente`. |
| `peso` | FLOAT | Peso corporal registrado en la fecha indicada. |
| `fecha` | DATE | Fecha en la que se realizó la medición. |
| `observaciones` | TEXT | Notas clínicas o comentarios del nutriólogo sobre el avance. |

---

## Tabla: `nutriologo`
Información de los profesionales que gestionan el sistema.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id_nutriologo` | INT (PK) | Identificador único del nutriólogo. |
| `nombre` | VARCHAR(100) | Nombre completo del profesional. |
| `especialidad` | VARCHAR(100) | Especialidad clínica (ej. Nutrición Deportiva, Clínica). |
| `correo` | VARCHAR(100) | Correo electrónico profesional. |
| `telefono` | VARCHAR(15) | Número de contacto para urgencias o citas. |

---

## 🔗 Relaciones Lógicas
* **1:N (Paciente - Dieta):** Un paciente puede recibir múltiples dietas a lo largo de su tratamiento.
* **1:N (Paciente - Historial):** Un paciente genera múltiples registros de peso para el análisis de tendencias.
* **1:N (Nutriólogo - Paciente):** Un profesional puede tener bajo su cargo a múltiples pacientes de forma simultánea.

---
*Documento generado para la gestión de arquitectura de software - ITSX*