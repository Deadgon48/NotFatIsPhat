# Guía de Contribución - NoFatIsPhat (ODS 3)

¡Bienvenido al repositorio de **NoFatIsPhat**! Este proyecto busca
transformar la relación entre nutriólogos y pacientes mediante
tecnología ética y eficiente.

Para garantizar la calidad del software y el cumplimiento de los
estándares del ITSX, todos los colaboradores deben seguir estas
directrices.

------------------------------------------------------------------------

## 1. Estándares Éticos (Gobernanza de Datos)

Como solución orientada al **ODS 3: Salud y Bienestar**, la ética es
nuestra prioridad:

- **Privacidad:**\
    No se deben subir datos reales de pacientes al repositorio. Use
    datos sintéticos para pruebas.

- **Inclusión:**\
    Todo cambio en la interfaz debe ser validado con herramientas de
    accesibilidad (lectores de pantalla, contraste adecuado).

- **Transparencia:**\
    Cualquier cambio en la lógica de procesamiento de datos debe ser
    documentado en el **Manifiesto de Ética**.

------------------------------------------------------------------------

## 2. Flujo de Trabajo de Git (Historial Lineal)

Para cumplir con la auditoría de integridad solicitada, mantenemos un
historial de commits limpio y legible:

1. **Sincronización:**\
    Antes de empezar, asegúrese de tener la última versión de la rama
    `main`.

2. **Ramas:**\
    Use nombres descriptivos como:

    -   feature/nombre-mejora
    -   bugfix/descripcion-error

3. **Rebase Obligatorio:**\
    Queda estrictamente prohibido el uso de `git merge` para integrar
    `main` en su rama de trabajo.\
    Debe utilizar `rebase`:

    ``` bash
    git fetch origin
    git rebase origin/main
    ```

4. **Pull Requests:**\
    Describa claramente el impacto del cambio y vincule el Issue
    correspondiente.\
    Ejemplo:

    Closes #12

------------------------------------------------------------------------

## 3. Documentación (Docs-as-Code)

-   Es obligatorio el uso de **Mermaid.js** para cualquier actualización
    en los diagramas de arquitectura.
-   Los archivos de documentación deben residir en:
    -   `/docs`
    -   o en la raíz si son archivos de gobernanza
-   Verifique la renderización correcta en el plugin de PhpStorm antes
    de realizar el commit.

------------------------------------------------------------------------

## 4. Auditoría de Seguridad

-   El pipeline de CI/CD rechazará automáticamente cualquier commit que
    contenga:
    -   secretos (API Keys, contraseñas)
    -   dependencias con vulnerabilidades conocidas
-   Todo código debe pasar por un escaneo de seguridad antes de ser
    integrado a la rama protegida.

------------------------------------------------------------------------

## Institución

**Instituto Tecnológico Superior de Xalapa**\
Ingeniería en Sistemas Computacionales
