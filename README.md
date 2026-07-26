# Pokédex

Aplicación de Pokédex hecha con React + Vite sobre la [PokeAPI](https://pokeapi.co), como
resolución del challenge técnico de React.

Tiene el listado con scroll infinito, la vista de detalle, buscador con filtros combinables
que quedan en la URL, un equipo de favoritos de hasta 6 Pokémon que se puede reordenar
arrastrando, y un formulario para comparar las stats de dos Pokémon. Todo lo que se trae de
la API queda cacheado y persistido, así que la app sigue funcionando después de un refresh y
también sin conexión.

---

## Instalación y ejecución

Requiere **Node 18.18+** (uso Node 20, está en el `.nvmrc`).

```bash
git clone git@github.com:agustintamb/pokedex.git
cd pokedex
npm install
npm run dev
```

Levanta en `http://localhost:5173`. No hay variables de entorno ni `.env` que configurar: la
PokeAPI es pública y la URL base está en `src/api/pokeApi.js`.

### Scripts

| Comando              | Qué hace                                        |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo con HMR                  |
| `npm run build`      | Build de producción en `dist/`                  |
| `npm run preview`    | Sirve el build ya generado, para probarlo local |
| `npm run test`       | Corre los tests (Vitest)                        |
| `npm run test:watch` | Tests en modo watch                             |
| `npm run coverage`   | Tests + reporte de coverage                     |
| `npm run lint`       | ESLint                                          |
| `npm run format`     | Prettier sobre todo el repo                     |

---

## Stack

|                               |                                                             |
| ----------------------------- | ----------------------------------------------------------- |
| **React 18** + **Vite 5**     | Base del proyecto                                           |
| **Redux Toolkit + RTK Query** | Todas las llamadas a la API, cache incluido                 |
| **redux-persist**             | Persistencia del cache y de los favoritos en `localStorage` |
| **React Router v6**           | Ruteo, con code-splitting por ruta                          |
| **styled-components**         | Estilos                                                     |
| **Formik + Yup**              | Formulario de comparación y su validación                   |
| **JavaScript**                | Sin TypeScript, como pedía la consigna                      |

Extras que sumé por features puntuales: `@dnd-kit` (drag & drop del equipo, elegido sobre la
API nativa de HTML5 porque esa no soporta touch y la app es mobile-first), `recharts` (radar
de stats del equipo), `lottie-react` (animaciones del 404 y del botón de versus aleatorio) y
`@fontsource/roboto` (fuente self-hosted, sin pegarle al CDN de Google Fonts).

Para testing: **Vitest** + **React Testing Library**.

---

## Estructura

```
src/
├── api/         RTK Query: createApi (pokeApi), endpoints y tags
├── store/       configureStore + slices + redux-persist
├── pages/       una carpeta por página (vista + estilos + hook)
├── components/  componentes reutilizables
├── hooks/       lógica compartida entre pantallas
├── styles/      theme + estilos globales + shell de página
├── utils/       helpers puros
└── test/        setup de Vitest y helpers de render
```

Cada componente es una carpeta con la lógica separada de la vista, siempre igual:

```
components/TypeBadge/
├── index.jsx            # la vista (JSX)
├── useTypeBadge.js      # la lógica, devuelve un objeto plano
├── TypeBadge.styles.js  # los styled-components
└── TypeBadge.test.jsx   # el test, al lado
```

---

## Decisiones técnicas

### El problema de base: la PokeAPI no filtra

El endpoint de listado (`/pokemon`) solo acepta `limit` y `offset`. No filtra por tipo ni
por generación, y la búsqueda por nombre parcial existe en la API pero no en la instalación
pública de pokeapi.co. O sea que todo el filtrado hay que resolverlo del lado del cliente.

Acá hay una distinción que me parece la decisión más importante de todo el proyecto, porque
"filtrar client-side" puede significar dos cosas de costo completamente distinto:

- Traer los **detalles** de los ~1300 Pokémon para poder filtrarlos → inaceptable, son 1300
  requests y varios MB.
- Traer **índices livianos** (nombre + url, o la lista de nombres de un tipo) → es un
  request, se cachea, y pesa nada.

Entonces el patrón que uso es: **filtrar sobre índices livianos en memoria, y pedir el
detalle solo de lo que está visible en pantalla.**

En concreto:

- **Nombre:** traigo el índice completo una vez (`/pokemon?limit=100000`, que devuelve solo
  nombre y url) y filtro con `includes()` sobre eso, con debounce de 300 ms.
- **Tipo:** `/type/{tipo}` devuelve todos los Pokémon de ese tipo en un solo request.
- **Generación:** `/generation/{n}` devuelve las species de esa generación, también en uno.
- **Combinar filtros:** intersección de `Set`s en memoria. Es instantáneo y no genera ni un
  request extra.
- El resultado se pagina del lado del cliente, y recién ahí cada card visible pide su propio
  detalle (que RTK Query cachea por argumento, así que volver a scrollear para atrás no
  vuelve a pedir nada).

El `id` sale de la url del índice, así que el número y el sprite de cada card no necesitan el
detalle: la URL del sprite es predecible y se arma sola.

### Cache y persistencia

Esta es la parte con más peso en el criterio, así que la explico entera.

El modelo mental que uso es que el cache es **una caja de respuestas guardadas**. Cada
request deja la suya adentro, etiquetada. Tres reglas la gobiernan.

**1. Cuánto vive cada respuesta.** RTK Query guarda cada respuesta identificada por el
endpoint y el argumento con el que se pidió: el detalle de Pikachu y el de Charizard son dos
entradas distintas de la misma caja. Mientras haya al menos un componente en pantalla usando
una entrada, esa entrada se queda ahí sí o sí. Cuando el último componente que la usaba
desaparece de la pantalla (entrás al detalle de Pikachu y volvés a la Home), arranca una
cuenta regresiva: si nadie vuelve a pedir esa respuesta antes de que termine, se borra de la
caja; si alguien la pide antes, la cuenta se cancela y la respuesta se sirve al instante, sin
tocar la red.

Esa cuenta regresiva es `keepUnusedDataFor`, y la puse en 86400 segundos (24 horas). El valor
por defecto de RTK Query es 60 segundos, que para esta app es muy poco: los datos de la
PokeAPI prácticamente no cambian, así que con un minuto estaría tirando respuestas
perfectamente válidas para volver a pedirlas y recibir exactamente lo mismo. Con 24 horas,
navegar por la app no genera ni un request repetido en todo ese rato, y por eso después de la
primera visita casi no se ven loaders.

**2. La caja se guarda en disco.** El cache de RTK Query vive en el store de Redux, o sea en
memoria: si refrescás la página, se pierde. De eso se ocupa redux-persist, que cada vez que
el store cambia escribe una copia en `localStorage`.

Al arrancar la app hace el camino inverso, que es lo que se llama **rehidratar**: lee lo que
había guardado en `localStorage` y lo vuelve a meter en el store, para que la app arranque
con el cache de la última vez en lugar de arrancar vacía. Eso lo maneja `PersistGate` en
`App.jsx`, que espera a que la lectura termine antes de renderizar: así ningún componente
llega a montarse con el store todavía vacío y sale a pedir de nuevo algo que ya estaba
guardado. Esto *es* el modo offline de la app: no hay un mecanismo aparte, es el mismo cache
de siempre, ahora en disco.

Un detalle de configuración que va con esto: Redux Toolkit trae un chequeo que corre solo en
desarrollo y avisa si se dispara una acción que no sea serializable (que no se pueda convertir
a JSON limpio), porque en general eso es un bug. Las acciones internas de redux-persist
(`FLUSH`, `REHYDRATE`, `PAUSE`, `PERSIST`, `PURGE`, `REGISTER`) no lo son, pero son parte de
su funcionamiento normal, así que están declaradas en `ignoredActions` para que el chequeo las
saltee y no llene la consola de advertencias que no llevan a ningún lado.

Consecuencia directa de persistir el cache, y algo que me pasó de verdad: si un endpoint
guarda el JSON crudo de la PokeAPI, ese blob crece sin control. El detalle de un Pokémon trae
`moves` (cientos de entradas), `game_indices`, `held_items`, `cries`... nada de eso lo usa la
UI, pero todo eso terminaba en `localStorage`, multiplicado por cada Pokémon que el usuario
llegara a ver, y la rehidratación se empezó a notar lenta. Por eso **todo endpoint recorta su
respuesta con `transformResponse`** y guarda únicamente los campos que la interfaz usa
(`src/utils/pokemon-detail.js`). Es una regla del proyecto, no un arreglo puntual.

**3. Cuándo se tira algo.** Acá entran los tags.

Un tag es una etiqueta que cada endpoint declara (`providesTags`) y que le queda pegada a su
respuesta cuando esta entra a la caja: el endpoint del índice etiqueta la suya como
`PokemonList`, el del detalle como `Pokemon`. Las etiquetas solas no hacen nada; sirven para
poder referirse después a un grupo de respuestas sin tener que saber cuáles hay guardadas en
ese momento.

**Invalidar** un tag es exactamente eso: avisarle a RTK Query "todo lo que esté etiquetado
`PokemonList` ya no vale". Ahí RTK Query recorre la caja y con cada respuesta que tenga esa
etiqueta hace lo que corresponde: si hay un componente en pantalla usándola, la vuelve a
pedir en el momento; si no la está usando nadie, la borra, así se pide de nuevo la próxima
vez que alguien la necesite. Nunca hay que ir nombrando entradas una por una.

¿Y cuándo se invalida? En una app con mutaciones (crear, editar, borrar) es automático: la
mutación declara qué tags invalida y RTK Query refresca lo que haga falta apenas termina. Acá
no hay mutaciones, la PokeAPI es de solo lectura, así que el disparador es otro: el momento en
que vuelve la conexión.

Ese es el problema concreto que resuelven en esta app. `refetchOnReconnect` refresca solo lo
que está montado en pantalla: si estoy mirando el detalle de Pikachu, se cae internet y
vuelve, ese detalle se actualiza solo, pero el índice de la Home (que quedó guardado y sin
nadie usándolo) se va a seguir sirviendo viejo hasta 24 horas. Invalidando el tag alcanzo
también a esas respuestas que están guardadas sin nadie mirándolas, que es justo lo que
`refetchOnReconnect` no cubre.

Tengo dos tipos de tag, porque los datos no envejecen igual:

| Tag           | Qué cubre                                                     | ¿Se invalida?                                           |
| ------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| `PokemonList` | índice, listas por tipo y por generación, tipos, generaciones | **Sí**: pueden crecer (Pokémon o generaciones nuevas)   |
| `Pokemon`     | el detalle individual de cada Pokémon                         | **No**: las stats de un Pokémon ya publicado no cambian |

Que el detalle **no** se invalide nunca es a propósito: ese cache es exactamente lo que
sostiene el modo offline. Tirarlo en cada reconexión sería romper un requisito para refrescar
algo que no cambió.

En toda la app hay un solo lugar que invalida: `src/store/reconnect-refresh.js`, que escucha
el evento `online` del navegador. Con un solo disparador, siempre sé de dónde puede venir un
refetch.

### Indicador de conexión y dato cacheado vs. fresco

Está en el header (`components/ConnectionStatus`). El estado online/offline sale de
`navigator.onLine` más los eventos `online`/`offline`, vía `hooks/useOnlineStatus` con
`useSyncExternalStore`.

No lo hice como un slice de Redux a propósito: es estado efímero del dispositivo, no del
dominio de la app, y `useSyncExternalStore` es justamente el primitivo de React 18 para
suscribirse a una fuente externa así. Meterlo en el store hubiera sido un slice con un
reducer, un listener y un `dispatch` para replicar algo que el navegador ya me da.

La lectura de frescura es: si estoy **offline**, lo que se ve es sí o sí el cache persistido
(RTK Query no puede refetchear nada); si estoy **online**, el dato es en vivo, y para que eso
sea cierto de verdad `pokeApi` declara `refetchOnReconnect: true` y el store llama a
`setupListeners(store.dispatch)`.

### Estado en la URL

Los filtros de la Home (búsqueda, tipos, generaciones) viven en query params, que era un
requisito explícito para poder compartir una búsqueda. Apliqué el mismo criterio en otros dos
lugares donde también tiene sentido compartir el link:

- **Detalle:** `?shiny=true&sprite=front`, así se puede mandar el link a un Pokémon con una
  variante ya seleccionada.
- **Versus:** `?a=pikachu&b=charizard`, para compartir una comparación armada.

Todos escriben con `replace: true` para no llenar el historial de entradas en cada click.

Donde **no** usé la URL fue para recordar la página y la posición del scroll al volver del
detalle a la Home. Lo probé y quedaba sobrecargado para lo que es: no necesito que eso
sobreviva a un refresh ni que sea compartible por link, solo que aguante la ida y vuelta
dentro de la misma sesión.

Para eso alcanza con guardarlo en una variable declarada arriba de todo en el archivo del
hook, fuera del componente (`lastListState`, en `usePokedexPage.js`). Al estar fuera de
React, no se borra cuando la Home se desmonta al navegar al detalle: cuando volvés, el hook
lee esa variable y restaura la página y el scroll donde estabas. Si los filtros cambiaron
respecto de la última vez, la ignora y arranca de la página 1 como siempre. Y al refrescar se
pierde, que es justo lo que quería.

### Formulario de comparación (Formik + Yup)

El formulario es reactivo, sin botón de submit: apenas los dos Pokémon elegidos son válidos y
distintos, aparece la comparación abajo.

La regla de "no se puede comparar el mismo contra el mismo" está declarada en el schema de
Yup (`versus.schema.js`), que es la validación que pedía la consigna. Igual, la primera
barrera es la interfaz: cada selector saca de sus sugerencias al Pokémon que ya está elegido
en el otro slot, así que elegir dos veces el mismo desde el desplegable directamente no se
puede. La validación queda como red de seguridad para el caso de escribir el nombre a mano.

### Rendimiento

- **Code-splitting por ruta.** La Home entra en el bundle inicial porque es la landing; el
  resto (`/pokemon/:name`, `/team`, `/versus`, `/404`) va por `lazy()` + `Suspense`. Así
  `recharts`, `@dnd-kit`, `lottie-react` y `formik`/`yup` quedan en chunks aparte y solo se
  descargan si entrás a la pantalla que los usa, en vez de pesar en la primera carga.
- **Scroll infinito con `IntersectionObserver`.** Al final de la grilla hay un div vacío que
  funciona de sensor. `IntersectionObserver` es una API del navegador que avisa cuando un
  elemento entra en pantalla, así que cuando el usuario scrollea y llega a ese div, salta el
  aviso y cargo la página siguiente. La forma clásica de hacerlo es escuchar el evento
  `scroll` y comparar posiciones a mano, pero eso se ejecuta decenas de veces por segundo y
  obliga a medir el DOM en cada una. Con el observer lo resuelve el navegador por su cuenta y
  me avisa una sola vez, justo cuando pasa.
- **Los sprites que ya cargaron se recuerdan en un `Set`.** Cada card muestra un skeleton
  hasta que su imagen termina de cargar. El problema es que al volver del detalle a la Home,
  React remonta las 24 cards de cero y todas vuelven a mostrar el skeleton, aunque la imagen
  ya esté en el cache del navegador: se ve como que recarga todo de nuevo. Entonces guardo
  las URLs que ya cargaron alguna vez en la sesión, y si la URL de una card ya está ahí, esa
  card arranca directamente con la imagen puesta. Uso un `Set` y no un array porque lo único
  que necesito es preguntar "¿esta URL ya está?", y el `Set` responde eso al instante sin
  recorrer la lista entera, además de no dejarme guardar duplicados.
- **Debounce de 300 ms en la búsqueda**, tal cual lo pedía la consigna: mientras escribís no
  se filtra en cada tecla, se espera a que pares 300 ms y recién ahí se aplica el filtro. Las
  sugerencias del buscador sí son inmediatas: son 8 nombres de texto, no hace falta
  amortiguarlas y se sienten mejor así.

### Testing

En la consigna el testing figuraba como bonus opcional, pero lo hice igual: me parece que un
proyecto que se presenta como muestra de trabajo no debería salir sin tests. Lo fui armando
de la mano de la IA para escribirlos más rápido, revisando en cada caso qué se estaba
probando de verdad.

Stack: Vitest + React Testing Library + jsdom. Elegí Vitest sobre Jest porque se integra
directo con la config de Vite que ya existe (mismo alias `@/`, misma transformación de JSX),
sin duplicar configuración.

Hoy hay **348 tests en 63 archivos**, con ~99.8% de coverage. Cubre los utils, los
componentes, los slices, el store, `pokeApi`, el router y las cuatro páginas completas con
sus hooks.

Dos criterios que seguí:

- Los tests verifican comportamiento y estructura accesible (roles, texto, atributos,
  handlers), no estilos computados. De qué color quedó un fondo es responsabilidad de CSS, no
  algo que un test unitario deba vigilar.
- Ningún test le pega a la API de verdad. Cuando pruebo una pantalla, reemplazo los hooks de
  `pokeApi` por datos fijos y verifico cómo reacciona la pantalla a esos datos. Cuando lo que
  quiero probar es `pokeApi` en sí, reemplazo el `fetch` del navegador por uno falso y corro
  los endpoints contra un store real.

---

## Qué cubre de la consigna

| Requerimiento                                                                                      | Dónde está                                                                                 |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Listado con infinite scroll + carga progresiva de imágenes                                         | `pages/pokedex`, `components/PokemonCard`, `components/Skeleton`                           |
| Detalle: artwork, sprites alternativos, shiny, stats con barras, tipos, habilidades, altura y peso | `pages/detail`                                                                             |
| Búsqueda en tiempo real con debounce 300 ms                                                        | `pages/pokedex/usePokedexPage.js`, `hooks/useDebounce.js`                                  |
| Filtros combinables por tipo y generación, persistidos en la URL                                   | `pages/pokedex`, `utils/parse-list-param.js`                                               |
| Mi Equipo: favoritos, máximo 6, reordenar con drag & drop                                          | `pages/team`, `store/slices/favorites.slice.js`                                            |
| Comparación de 2 Pokémon con selector searchable + Formik/Yup                                      | `pages/versus`, `versus.schema.js`                                                         |
| RTK Query con endpoints de listado, detalle, tipos y generaciones                                  | `api/pokeApi.js`                                                                           |
| Cache automático + `keepUnusedDataFor` + tags de invalidación                                      | `api/pokeApi.js`, `store/reconnect-refresh.js`                                             |
| redux-persist con rehidratación y datos offline                                                    | `store/index.js`, `App.jsx`                                                                |
| Slice separado de favoritos, persistido                                                            | `store/slices/favorites.slice.js`                                                          |
| Estado de conexión y cacheado vs. fresco en el header                                              | `components/ConnectionStatus`, `hooks/useOnlineStatus.js`                                  |
| Skeletons, toasts, estados vacíos con ilustración, retry ante error de red                         | `components/Skeleton`, `components/Snackbar`, `components/EmptyState`, `components/Button` |
| Responsive                                                                                         | Toda la app, mobile-first                                                                  |
| Testing (bonus)                                                                                    | 348 tests con Vitest + RTL                                                                 |

El drag & drop y la librería de gráficos figuraban como opcionales. Los sumé igual: el
reordenamiento del equipo está hecho con `@dnd-kit`, y el radar con el promedio de stats de
Mi Equipo con `recharts`. La comparación de Versus, en cambio, es stat por stat con barras
enfrentadas hechas en CSS: para dos valores por fila, meter una librería de gráficos era más
peso del que hacía falta.

---

## Mejoras futuras identificadas

Cosas que no hice pero pude identificar:

- **Mover el filtrado al servidor con el GraphQL de la PokeAPI.** Además del REST, la PokeAPI
  expone un endpoint GraphQL (`https://graphql.pokeapi.co/v1beta2`) donde se puede filtrar
  por tipo, generación y nombre en una sola query, con cláusulas `where`. Con eso el filtrado
  pasaría a ser server-side de verdad: en vez de traer los índices y cruzarlos en memoria, el
  servidor devolvería directamente la lista ya filtrada, que es bastante más eficiente. No lo
  usé por dos motivos. El primero es que el stack de la consigna es REST + RTK Query, que es
  lo que se está evaluando. El segundo son los límites de uso: el REST de la PokeAPI no tiene
  un tope de requests (pide uso razonable, y por eso mismo conviene cachear bien), mientras
  que el GraphQL está limitado a 100 requests por hora, que para una app que hace varios
  pedidos por pantalla se queda corto enseguida.
- **Migrar el cache persistido a IndexedDB.** `localStorage` es síncrono (leer y escribir
  bloquean el hilo principal) y tiene un tope de ~5 MB. Con el recorte de `transformResponse`
  hoy no llego ni cerca, pero si el cache creciera, el paso siguiente sería usar `localforage`
  como storage engine de redux-persist, que guarda en IndexedDB de forma asíncrona.
- **Tests de integración y end-to-end.** Hoy los tests son unitarios y de componente. Para
  las funcionalidades centrales (llenar el equipo hasta el límite, filtrar y compartir la URL
  resultante, comparar dos Pokémon) tendría más sentido cubrirlas de punta a punta con
  Playwright o Cypress, que recorren el flujo en un navegador real. De paso agarrarían cosas
  que jsdom no puede simular, como el drag & drop.
- **Prefetch del detalle.** RTK Query trae `usePrefetch`, que permite ir pidiendo el detalle
  de un Pokémon antes de que el usuario entre (por ejemplo, al pasar el mouse por la card).
  Como el detalle ya se cachea por argumento, la pantalla de detalle abriría con el dato
  puesto en vez de mostrar skeletons.
- **TypeScript.** La consigna pedía explícitamente JavaScript, así que quedó afuera, pero es
  de las cosas que más sumaría en un proyecto real. Con tipos, la forma de los datos que
  vuelven de la API y los props de cada componente quedan declarados y verificados: los
  errores aparecen mientras escribís y no en runtime, refactorizar deja de ser buscar por
  nombre a mano y confiar, y alguien que entra al proyecto entiende qué recibe cada función
  sin tener que rastrearlo. Es bastante más robusto y mantenible, sobre todo cuando el código
  lo toca más de una persona.
