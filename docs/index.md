# Sistema de Registro de Estudiantes

Bienvenido a la documentación técnica del Sistema NoFatIsPhat.

## Vista de Contexto (C4 Nivel 1)

```mermaid
graph TD
%% Definición de Actores
Nutri[Nutriólogo]
Pac[Paciente]

%% Interacciones Principales
subgraph Plataforma_NoFatIsPhat
    App[Interfaz Web/Móvil]
    API[Lógica de Negocio - PHP]
    DB[(Base de Datos - Pacientes/Dietas)]
end

Nutri -->|Asigna Dieta| App
Pac -->|Registra Consumo| App
App --> API
API --> DB

%% Conexión con ODS 3
DB -.->|Seguimiento Continuo| ODS3((ODS 3: Bienestar))

```

## Secciones

### Diccionario de datos

<https://deadgon48.github.io/NoFatIsPhat-frontend/datos>

### Guía de Despliegue

<https://deadgon48.github.io/NoFatIsPhat-frontend/despliege>
