# Sistema de Registro de Estudiantes

Bienvenido a la documentación técnica del Sistema NoFatIsPhat.

![Diagrama de Contexto C4](diagrama actualizado.png)

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
    SSL[Seguridad: Certificado SSL/TLS]
end

Nutri -->|Asigna Dieta| App
Pac -->|Registra Consumo| App
App --> API
API --> DB
DB --> SSL

%% Conexión con ODS 3
SSL -.->|Seguimiento Continuo| ODS3((ODS 3: Bienestar))

```

## Secciones

### Diccionario de datos

<https://deadgon48.github.io/NotFatIsPhat/datos>

### Guía de Despliegue

<https://deadgon48.github.io/NotFatIsPhat/despliege>

## Estado del Proyecto: Desplegado

<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true });
</script>