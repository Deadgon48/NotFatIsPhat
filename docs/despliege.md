# Guía de Despliegue - Sistema NoFatIsPhat

Este documento describe el proceso técnico necesario para poner en marcha la plataforma **NoFatIsPhat**, enfocada en la gestión nutricional y el cumplimiento del **ODS 3**.

---

## 1. Introducción
**NoFatIsPhat** es una plataforma digital que conecta a nutriólogos con pacientes. Permite la planificación de dietas, seguimiento biométrico y monitoreo de progreso en tiempo real.

## 2. Objetivo
Proporcionar un procedimiento claro para desplegar el sistema en entornos de desarrollo (Local) y producción, garantizando la integridad y seguridad de los datos de salud.

## 3. Arquitectura del Sistema
El sistema sigue una arquitectura **Cliente-Servidor (Fullstack)**:
* **Frontend:** HTML5, CSS3, JavaScript (Vue.js recomendado).
* **Backend:** PHP (Procesamiento de lógica nutricional).
* **Base de Datos:** PostgreSQL / MySQL (Almacenamiento de expedientes clínicos).
* **Servidor:** Apache / Nginx.

## 4. Requisitos del Sistema

### Software
* **Servidor Web:** XAMPP, WAMP o Laragon (para entorno PHP/SQL).
* **IDE:** PhpStorm (Recomendado para gestión de Git y Rebase).
* **Navegador:** Chrome, Firefox o Edge (versiones actualizadas).

### Hardware (Mínimo)
* **RAM:** 4 GB.
* **Procesador:** Dual Core 2.0 GHz o superior.
* **Espacio en disco:** 200 MB para la aplicación.

## 5. Estructura del Proyecto
```text
NoFatIsPhat/
├── config/             # Conexión a BD y constantes
├── public/             # Archivos accesibles (index.php, css, js)
├── src/                # Lógica de PHP (Modelos/Controladores)
├── docs/               # Diccionario de datos y Mermaid diagrams
├── .github/            # Workflows de CI/CD (Pipeline ITSX)
├── CONTRIBUTING.md     # Guía de gobernanza
└── README.md           # Manifiesto de ética