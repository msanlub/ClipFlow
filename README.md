![Logo](/src/assets/ClipFlow.png)

ClipFlow es una aplicación web diseñada para simplificar la creación de vídeos cortos, conocidos como reels, para redes sociales mediante el uso de plantillas predefinidas. Está dirigida principalmente a adolescentes y jóvenes que buscan una solución rápida y eficaz para editar vídeos atractivos, sin necesidad de invertir mucho tiempo en procesos de edición complejos.

## Problema y solución
Actualmente, los creadores de contenido y usuarios de redes sociales dedican demasiado tiempo a editar vídeos para adaptarlos a formatos verticales. Este proceso resulta tedioso y requiere habilidades técnicas que no todos poseen. ClipFlow ofrece una plataforma donde los usuarios pueden seleccionar plantillas específicas para reels, personalizarlas y descargar el vídeo listo para compartir en redes sociales.

## Audiencia objetivo
El perfil principal de usuarios de ClipFlow son adolescentes y jóvenes adultos, entre 15 y 30 años, activos en redes sociales. Este grupo busca rapidez, simplicidad y resultados visualmente atractivos sin necesidad de experiencia previa en edición de vídeo. ClipFlow les ofrece ahorro de tiempo, facilidad de uso y una herramienta especializada en la creación de contenido para redes sociales.

## Análisis de mercado
Entre los principales competidores de ClipFlow se encuentran RenderForest, Canva, Envato y Clipchamp. Sin embargo, ClipFlow se diferencia por su enfoque exclusivo en plantillas optimizadas para reels y dispositivos móviles, su interfaz intuitiva diseñada para resultados rápidos y la posibilidad de personalización mediante inteligencia artificial.

## Funcionalidades clave

ClipFlow ofrece autenticación y seguridad, gestión de plantillas favoritas, un panel de plantillas categorizado y opciones de descarga del producto final.


## Tecnologías
**Frontend**: Vue.js, Pinia, Vue Router, SCSS (metodología BEM), LocalStorage, sweetAlert2.

**Backend**: Laravel, FFmpeg, Token JWT, Spatie, Telescope, Sail.

El proyecto se contendrá mediante Docker y se desplegará en Netlify.


## Conclusión
ClipFlow se posiciona como una solución innovadora y especializada para la creación de contenido en formato reel, dirigida a usuarios que valoran rapidez y simplicidad. La combinación de tecnologías modernas tanto en el frontend como en el backend garantiza un producto sólido y escalable, capaz de satisfacer las necesidades de una audiencia exigente en redes sociales.



## Instalación

1. **Clona el repositorio del front y del back:**

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. **Navegue al directorio:**
    ```bash
    cd clipflow
    ```

3. **Instala las dependencias:**

   ```bash
   npm install
   ```

4. **Configura las variables de entorno:**
   
   Copia el archivo `.env.template` a `.env` y completa los valores necesarios.

5. **Instale las dependencias del backend:**

    ```bash
    composer install
    ```

6. **Configure el archivo .env con sus credenciales de base de datos y otras configuraciones necesarias.**

7. **Genere la clave de la aplicación:**

    ```
    ./vendor/laravel/sail artisan key:generate
    ```

8. **Ejecute las migraciones:**

    ```
    ./vendor/laravel/sail artisan migrate
    ```

9. **Inicie los contenedores de Docker:**

    ```
    ./vendor/laravel/sail up -d
    ```

## Uso

### Desarrollo

Para iniciar el servidor en modo desarrollo, utiliza el siguiente comando:

```bash
npm run dev
```

Devuelve un link a tu localhost, púlsalo con CTRL + click.

### Producción

Para poder ver el proyecto desplegado en producción accede a la página TODO