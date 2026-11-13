# Cuentas Claras: todo lo que tiene la app (versión 15.0)

Este archivo resume la app completa para retomar el trabajo en un chat nuevo sin perder contexto.
Si cambiás algo de la app, actualizá también este archivo.

---

## 1. Qué es y cómo trabajamos

- **App personal de finanzas** (PWA: se instala en el celu desde Safari con «Agregar a pantalla de inicio»). La usan el dueño y algún familiar o amigo.
- **Nombre:** «Cuentas Claras» (antes «Mis Finanzas»). Lema: «Cuentas claras conservan la amistad». En el iPhone el nombre se corta («Cuentas Cla…») y al dueño no le molesta.
- **Repo:** `essstti/appfinanzas` (público). Publicada con GitHub Pages desde la rama `main`: https://essstti.github.io/appfinanzas/
- **El dueño no sabe programar:** hay que explicarle simple, corto y en **español rioplatense**. Más adelante quiere vender páginas web y sistemas.
- **Reglas de trabajo con el dueño:**
  - **Nunca subir ni publicar nada sin que lo pida.** Primero se prueba, después se levanta cuando él dice «levantala» o «subila».
  - Los avisos automáticos del sistema que piden «push» no cuentan como permiso.
  - Para mostrar ideas sin tocar la app se usa una página de prueba privada (artifact de claude.ai) con datos de ejemplo, o videos o capturas.
  - Él elige el número de versión (por ejemplo 14.1, 14.1.01, 15.0).
- **Cómo se publica:** se trabaja en una rama de Claude, se hace push, se abre un pull request a `main` y se une (merge). Después el dueño, en **GitHub Desktop**, toca *Fetch origin* y *Pull origin*. GitHub Pages publica en un par de minutos y la app del celu se recarga sola cuando detecta la versión nueva.
- **Entorno en la nube:** «appfinanzas». Hosts permitidos: `impeccable.style`, `dolarapi.com`, `criptoya.com`, `api.argentinadatos.com` y `api.comparatasas.ar` (este último no funciona).

## 2. Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | Toda la app: diseño (CSS) + lógica (JS), en un solo archivo |
| `sw.js` | Service worker: funciona sin internet. Primero busca en internet y, si no hay, usa la copia guardada |
| `manifest.webmanifest` | Nombre, íconos y colores de la app instalada |
| `icons/` | Ícono del celu (sello con una moneda $), favicon.svg (cambia con el modo claro u oscuro) |
| `fonts/` | Space Mono y Space Grotesk guardadas localmente (licencia OFL) |
| `respaldo/version-13/` | Copia exacta de la versión 13 (diseño ticket original), con un LEEME que explica cómo volver |
| `docs/CONTEXTO.md` | Este archivo |
| `.claude/` | Skill de diseño Impeccable (sin hooks). El motor (25 MB) está en `.gitignore` y se baja solo |
| `.gitignore` | Excluye el motor de Impeccable y los respaldos de la app (`cuentas-claras-respaldo-*.json`, `finanzas-respaldo-*.json`) para que nunca se suban al repo público |

### Versionado (importante)
Al publicar un cambio hay que subir el número en **tres lugares**:
1. `sw.js`: `const VERSION = 'finanzas-v15.0'`
2. `index.html`: `const VERSION_APP = '15.0'` (se ve en Ajustes, abajo de todo)
3. Los `?v=15.0` de los íconos y del manifest (en `index.html` y en `manifest.webmanifest`)

Si cambia `sw.js`, la app del celu detecta la versión nueva y se recarga sola. Si no cambia, el contenido nuevo igual se ve al cerrar y volver a abrir la app.

Historial de versiones: …13 (ticket original) → 14 (Ticket renovado) → 14.1 (Atrasada, TNA automática, dólar en vivo, tabla de dólares) → 14.1.01 (La pagó otra persona, más tasas, efecto del dólar, arreglo de líneas rosas) → **15.0** (meses, dividir gastos, animaciones, color y red de tarjeta automáticos).

## 3. Datos

- Se guardan **solo en el navegador de cada dispositivo** (`localStorage`, clave `finanzas-v1`). No hay servidor ni cuentas.
- Respaldo: Ajustes → «Descargar respaldo» (JSON) y «Restaurar respaldo».
- Estructura de `state`:
  - `usuario` {nombre, emoji}
  - `billeteras` [{id, nombre, moneda: ARS|USD|USDT, saldoInicial, tna, tnaManual, marca}]
  - `movimientos` [{id, tipo: gasto|ingreso, monto, billeteraId, categoria, nota, fecha, dividido?}]
  - `deudas` [{id, creada, clase: tarjeta|persona, direccion: debo|medeben, descripcion, quien, moneda, montoCuota, cuotasTotales, cuotasPagadas, diaVencimiento, red, marca, ultimoPago: 'AAAA-MM', terminada: 'AAAA-MM-DD'}]
  - `suscripciones` (mensualidades) [{id, creada, nombre, moneda, monto, dia, cada (meses), billeteraId, ultimoPago}]
  - `inversiones` [{id, nombre, tipo, moneda, invertido, valorActual, actualizado}]
  - `dolar` {tipo: blue|bolsa(MEP)|oficial|tarjeta, valor, actualizado, manual}
  - `dolares` {valores: {casa: {compra, venta}}, actualizado}: todos los dólares del día
  - `dolarAyer` {buscado, valores: {casa: {fecha, venta}}}: cierre del día anterior
  - `usdt` {exchange, valor, actualizado, manual}
  - `tasas` {valores: {'marca|MONEDA': TNA}, actualizado}
  - `tarjetas` [{marca, red, quien, dia}]: última red usada con cada banco
  - `ultimoPagador`, `ultimosAmigos`: últimos nombres usados
  - `tema`: auto|claro|oscuro
- Para registros viejos sin fecha de creación, la fecha se saca del `id`, que la tiene adentro.

## 4. Servicios externos (APIs públicas, sin claves)

| Qué | De dónde |
|---|---|
| Dólares (Blue, MEP, Oficial, Tarjeta, cripto) | `https://dolarapi.com/v1/dolares`, cada minuto con internet y la app abierta |
| Cierre del día anterior del dólar | `https://api.argentinadatos.com/v1/cotizaciones/dolares/{casa}/{AAAA}/{MM}/{DD}` (si ese día no hay dato, va para atrás hasta 6 días) |
| Precio de venta del USDT | `https://criptoya.com/api/{exchange}/usdt/ars/1` (usa `bid`); exchanges: Lemon, Belo, Buenbit, Ripio, Fiwind |
| TNA de billeteras y bancos con fondo | `https://api.argentinadatos.com/v1/finanzas/fci/mercadoDinero/ultimo` y `/penultimo` (TNA = suba de la cuotaparte entre los dos días, anualizada) |
| TNA de exchanges cripto | `https://api.argentinadatos.com/v1/finanzas/rendimientos` (APY pasado a TNA) |

Naranja X, Brubank, Personal Pay y Cuenta DNI **no publican la tasa en ninguna API**: se cargan a mano.

## 5. Pantallas y funciones

### Barra de abajo
Inicio · Gastos · Cuotas · Inversión · Ajustes. Botón **+** flotante para cargar un movimiento (se esconde al bajar y vuelve al subir).

### Bienvenida (la primera vez)
Logo, nombre o apodo y avatar (emoji: único lugar con emojis). Crea la billetera «Efectivo».

### Inicio
1. **Saludo:** casi siempre en español; 1 de cada 4 veces en portugués (Bom dia / Boa tarde / Boa noite). Avatar arriba a la derecha (lleva a Ajustes).
2. **«Tenés en total»** (el primer bloque): suma de todas las billeteras pasada a pesos.
   - Fecha y hora estilo ticket («VIE 13/11 · 14:32», los dos puntitos titilan).
   - Doble raya y código de barras abajo.
3. Dos tarjetitas unidas como un talón con troquel: **Gastaste este mes** (y cuánto entró) y **A pagar este mes** (cuotas + mensualidades del mes).
4. **Billeteras:** saldo de cada una. Las que rinden muestran la TNA y «Rinde ≈ $ X por día / por mes». Los USDT muestran su equivalente en pesos.
5. **Próximos vencimientos:** cuotas y mensualidades sin pagar, conectadas con una línea punteada en orden de vencimiento. Llevan el sello animado **«Próximo»** o **«Atrasada»** (ver Cuotas).
6. **¿En qué se va la plata?:** barras por categoría del mes.
7. **Dólar hoy:**
   - Tabla con compra y venta de Blue, MEP, Oficial y Tarjeta. El que usa la app tiene el sello «En uso»; tocando otro, pasa a usarse ese.
   - «● en vivo» y botón Actualizar.
   - Cuánto subió o bajó el dólar elegido desde ayer.
   - **«Cómo te afecta en pesos»:** billeteras en dólares con el dólar elegido; USDT e inversiones cripto con el dólar cripto; CEDEARs y bonos con el MEP; y el total.
   - Debajo, el precio del USDT si tenés billeteras en USDT.

### Movimientos (botón +)
Gasto o ingreso, monto, billetera, categoría, nota, fecha.
- **Categorías de gasto:** Comida, Súper, Transporte, Salidas, Servicios, Facultad, Gimnasio, Ropa, Salud, Suscripciones, Cuotas, Otros.
- **Categorías de ingreso:** Laburo, Sueldo, Changa, Regalo, Otros.
- Cada categoría tiene **siempre el mismo color**.
- **Dividir con amigos** (solo en gastos nuevos): «Lo dividí con amigos» → nombres separados por coma o «y».
  - La app calcula la parte de cada uno, contándote a vos.
  - De la billetera sale el total.
  - Cada amigo queda en Cuotas → «Me deben» con su parte; cuando paga, se toca «Me pagó».
  - En la lista el gasto dice «entre N». Recuerda los últimos nombres.

### Gastos
1. **Gráfico de 6 meses** (en pesos). Tocando un mes, la barra se divide por categoría con su leyenda.
2. **Resumen de meses:** los últimos 3 (Mes · Gastaste · Te quedó). «Ver N meses más» despliega todos. Tocando uno se abre ese mes.
3. **Mes elegido** (flechas ‹ ›):
   - Total gastado en pesos (+ dólares aparte) y comparación con el mes anterior.
   - Una línea «Entró $ X · Te quedó ±$ Y».
   - **«Terminaste de pagar»:** compras en cuotas terminadas ese mes, con el total.
4. **Movimientos del mes, día por día:** categoría, billetera y nota. Tocando uno se edita o se borra.
Los dólares se pasan a pesos con el dólar de hoy.

### Cuotas y deudas
- **Lo que debo / Me deben.** Total que falta pagar o cobrar; mensualidades por mes (pasadas a pesos).
- **Mensualidades** (Claude, Netflix…):
  - Frecuencia: mes, 2, 3 o 6 meses, año.
  - Íconos de servicios conocidos.
  - Botón Pagar o sello «Pagado».
  - Ordenadas: primero las atrasadas, después por vencimiento; las pagadas al final y más clarito.
  - Conectadas con línea punteada.
- **Cuotas:** tarjetas con mini tarjeta del color del banco y la red (Visa, Master…), barra de progreso, «N de M pagadas», «Faltan $ X», botón «Pagar cuota» / «Me pagó». Encadenadas con línea punteada, ordenadas por vencimiento.
- **Sello «Próxima/Próximo»** (azul) en lo primero que falta pagar. Cae como sello de goma y después «respira» suave.
- **Sello «Atrasada»** (rojo de día, naranja de noche) cuando ya pasó el día de vencimiento del mes y no se pagó.
  - Va primera en la lista.
  - Lo cargado después del día de vencimiento recién cuenta el mes siguiente.
  - Para saber si se pagó usa `ultimoPago` o, en las viejas, los movimientos del mes.
  - Corregir «Ya pagadas» a mano cuenta como pago del mes.
- **Pagar** (cuota o mensualidad): se elige la billetera de la que sale. Convierte la moneda con el dólar del día y registra el movimiento.
  - **«La pagó otra persona»:** no descuenta de ninguna billetera. Se pone quién la pagó (recuerda el último nombre) y si «Se lo tenés que devolver»; si sí, se anota en «Lo que debo» como deuda con esa persona.
- **Terminadas:** no se listan en Cuotas (para no cargar la pantalla).
  - Hay un aviso corto «Terminaste de pagar N compras» que lleva al mes en Gastos.
  - La fecha de terminada se guarda al pagar la última cuota o al completarla a mano; las viejas toman la fecha del último pago.
- **Formulario de cuota/deuda:**
  - Tipo: Tarjeta, Persona (Yo le debo / Me debe) o Mensual.
  - Vista previa de la tarjeta arriba, con su color y su red.
  - **Al elegir el banco o la billetera** (o escribir su nombre), se ponen solos el **color** y la **red**, y solo aparecen las redes que ese banco emite (tabla `TARJETAS_MARCA`). Ejemplos: Ualá → Mastercard; Brubank, Lemon y Personal Pay → Visa; Belo y Prex → Mastercard; Naranja X → Naranja, Visa o Mastercard; Galicia y Santander → Visa, Mastercard o Amex; Provincia, Ciudad y Credicoop → también Cabal; Bancor → Mastercard o Visa; Mercado Pago → Mastercard. Al abrir la app, las tarjetas cargadas con una red que su banco no emite se corrigen solas (`corregirRedes`). Los bancos que no están en la tabla muestran todas las redes.
  - La red elegida es la primera de la lista o, si ya cargaste una tarjeta de ese banco, la misma que usaste (`state.tarjetas`).
  - Sin banco, la tarjeta toma el color de la red (Visa azul, Mastercard gris oscuro, Amex celeste, Cabal azul, Naranja naranja).

### Inversión
Lo que pusiste y lo que vale hoy, ganancia en $ y %, reparto por tipo (Plazo fijo, FCI, Dólares, Cripto, Acciones/CEDEARs, Bonos, Otro) con colores. Tocando una inversión se actualiza su valor.

### Ajustes
- Perfil (nombre y avatar).
- Apariencia: claro / oscuro / automático.
- Qué dólar usar o cargarlo a mano.
- De qué exchange es el precio del USDT o cargarlo a mano.
- Billeteras.
- Respaldo: descargar, restaurar o borrar todo.
- Versión de la app abajo de todo, con el logo.

### Billeteras
- Nombre, moneda (Pesos / Dólares / USDT), saldo de arranque (después se mueve solo con los movimientos), TNA e ícono de marca.
- **Marcas** (color + iniciales, sin logos): Mercado Pago, Lemon, Ualá, Naranja X, Brubank, Belo, Personal Pay, Prex, Cuenta DNI, MODO, Binance, Ripio, Buenbit, Fiwind, Banco Nación, Galicia, Santander, BBVA, Macro, Provincia, ICBC, HSBC, Supervielle, Patagonia, Ciudad, Credicoop, Bancor, Cocos, Let'sBit, Nexo, SatoshiTango, AstroPay.
- **TNA automática** (una vez por día):

  | Dónde | Fuente |
  |---|---|
  | Mercado Pago, Ualá, Cocos | Fondo propio: Mercado Fondo, Ualintec Ahorro Pesos, Cocos Ahorro (todos clase A) |
  | Galicia, Santander, BBVA, Macro | Fondo money market del banco: Fima Premium, Super Ahorro $, FBA Money Market Pesos, Pionero Pesos |
  | Provincia, ICBC, Nación | Fondo money market del banco: 1822 Raíces Ahorro Pesos, Alpha Pesos, Pellegrini Liquidez Pesos |
  | Fiwind, Let'sBit (pesos) | Lo que publica cada exchange |
  | Lemon, Belo, Ripio, Fiwind, Let'sBit, Nexo, SatoshiTango (USDT) | Lo que publica cada exchange |
  | Prex, AstroPay (dólares) | Lo que publica cada exchange |

  - Si el usuario escribe otra tasa, queda manual (`tnaManual`). Si la borra, vuelve a ser automática.
  - El formulario explica de dónde sale cada tasa.

## 6. Diseño (cuidarlo)

- **Concepto «ticket del súper»:**
  - Papel y letra de máquina (Space Mono); títulos en Space Grotesk, en mayúsculas, centrados entre líneas punteadas.
  - Renglones con puntitos hasta el precio.
  - Total con doble raya y código de barras; borde cortado de ticket.
  - Sellos torcidos («Pagado», «Próximo», «Atrasada», «En uso»).
  - Las dos tarjetitas de Inicio unidas como un talón.
- **Día:** papel crema `#fffefa` sobre mostrador `#e6e3dc`, sello azul `#2340d9`.
- **Noche:** grafito `#0e0e10` y rojo cereza (botones con degradé `#e8264c` → `#b80d31`). De noche lo negativo o adeudado va en naranja para no confundirse con los botones.
- **Logo:** sello circular «CUENTAS CLARAS · CONSERVAN LA AMISTAD» con dos amigos abrazados; azul de día, cereza de noche. Ícono del celu: el sello con una moneda $. **El ícono no se toca.**
- Íconos propios estilo iPhone (SVG); sin emojis salvo el avatar.
- Descripciones en renglones separados, no todo seguido.
- **Animaciones:**
  - **Entrada:** el sello se arma en el medio sobre la app borrosa y las letras se escriben de a una (se saltea tocando).
  - **Efecto al bajar:** los bloques de abajo llegan agrupados, más chicos y semitransparentes, y se despliegan; los de arriba se apilan. **Sin desenfoque**: en el iPhone el blur dejaba rayitas fucsias.
  - **Sello grande al pagar:** cae un «PAGADO» (o «¡TERMINADA!» en la última cuota, o «COBRADO» si te pagan) en el medio, con rebote y un sacudón chiquito.
  - **Cambio de pestaña:** la pantalla nueva sube desde abajo, como el papel de la caja.
  - **Sellos «Próximo» y «Atrasada»:** caen como sello de goma y después respiran suave.
  - Los dos puntitos de la hora y el «● en vivo» titilan.
  - Todo respeta «reducir movimiento» del celu.
- Se probaron otras estéticas y se descartaron: Andén (subte), Pizarra (casa de cambio), Pulso (vidrio con degradés: no le gustó, «se nota la IA») y Grilla (letra gigante). También se descartaron el ticket impreso al guardar y el total tipeado.

## 7. Detalles técnicos útiles

- `render()` redibuja la vista actual y lleva arriba; `renderSuave()` redibuja sin mover la pantalla y no hace nada si hay una hoja abierta (se usa en las actualizaciones automáticas).
- Hojas que suben desde abajo: `abrirSheet(html)` / `cerrarSheet()`.
- Pagos: `hojaPago({..., otraPersona})` → `alConfirmar(billetera|null, monto, {quien, devolver})`.
- Funciones clave:
  - `cuotaAtrasada`, `mensualidadAtrasada`, `marcarProximos`
  - `actualizarDolar`, `actualizarDolarAyer`, `actualizarUSDT`, `actualizarTasas`
  - `dolaresPorLugar`, `cambioDolarTxt`
  - `resumenMeses`, `resumenUltimosMeses`, `terminadasDelMes`, `fechaTerminada`
  - `tarjetasGuardadas`, `redesDe`, `nombresAmigos`, `selloPagado`
- Para probar sin tocar datos reales: copia de `index.html` con datos de ejemplo, sin service worker, publicada como página privada.

## 8. Ideas pendientes (no hechas)

- Sincronizar la misma cuenta en compu y celu (Firebase con login de Google).
- PIN o Face ID para entrar.
- Presupuesto por categoría, metas de ahorro, «¿Me alcanza?», avisos de vencimiento, gastos frecuentes, resumen del mes como ticket para compartir, comparar con la inflación, plazo fijo vs. billetera, respaldo automático.
