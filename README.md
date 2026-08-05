# Futbolle - Football Guessing Game
Proyecto Final de la materia Desarrollo Web de la Universidad Abierta Interamericana.

## Descripción
Futbolle es un juego web interactivo donde el usuario debe adivinar un jugador de fútbol secreto basándose en pistas y atributos (Nacionalidad, Club, Posición, Edad, Valoración General y Altura). El juego se conecta a una API RESTful para obtener los datos de los jugadores en tiempo real.

## Contexto Académico
*   **Alumno:** Walter Toledo
*   **Profesor:** Tomás Arias Karle

## Funcionalidades
*   **Buscador con Autocompletado:** Peticiones asíncronas a la API para buscar jugadores en tiempo real.
*   **Feedback Visual:** Sistema de colores (verde/rojo) y flechas (↑/↓) para guiar al usuario en sus intentos.
*   **Selector de Dificultad:** Modos Fácil (foto que se desenfoca progresivamente), Medio (pistas de texto progresivas) y Difícil (sin pistas y con el club oculto).
*   **Sistema de Puntuación:** Algoritmo matemático que calcula el puntaje final basado en la dificultad, intentos restantes y bonificación por tiempo.
*   **Historial Local (LocalStorage):** Registro completo de partidas jugadas con opción de ordenar por fecha o por cantidad de intentos.
*   **Accesibilidad y UX:** Soporte para Modo Claro/Oscuro persistente y efectos de sonido dinámicos para aciertos, victorias y derrotas.
*   **Formulario de Contacto:** Validación completa de datos del lado del cliente y redirección a cliente de correo (`mailto`).

## Tecnologías y Restricciones Técnicas
El proyecto fue desarrollado bajo normas técnicas requeridas por la cátedra:
*   **HTML5 Semántico:** Sin errores de validación (W3C).
*   **CSS3 Puro:** Diseño 100% responsivo (Mobile First/Flexbox) sin el uso de frameworks (Bootstrap, Tailwind) ni estilos en línea.
*   **JavaScript (ES5 Estricto):** Manipulación pura del DOM. Código escrito sin funciones flecha, sin declaraciones `let`/`const` y sin promesas nativas (excepto Fetch).

## Despliegue
El juego se encuentra funcional y desplegado a través de GitHub Pages.
👉 **[Jugar a Futbolle Aquí](https://waltoledo.github.io/Futbolle-ProyectoFinalDesWeb/)**