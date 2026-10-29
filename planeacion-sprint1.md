# Sistema Integral de Gestión "Taquería Gon" (Versión Web)

## 1. Planeación y Metas del Sprint 1
El objetivo de este sprint es establecer la arquitectura base, documentar los requerimientos del sistema punto de venta para la taquería y estructurar la base de datos y la seguridad.

## 2. Requerimientos
**Funcionales:**
### Requerimientos Funcionales

| Id | Requerimiento | Descripción |
| :--- | :--- | :--- |
| RF-01 | El sistema restringirá opciones según el rol del trabajador. | Por ejemplo, solo los gerentes pueden ver o modificar el inventario, o hacer el corte de caja. |
| RF-02 | El sistema debe mostrar visualmente las mesas y su estado actual según un color. | Habrá varios estados, mesas libres serán color blanco, las que ya les tomaron el pedido pero no les llevaron sus platos serán amarillas, y las finalizadas serán color rojo |
| RF-03 | El sistema debe mostrar los pedidos actuales en la pantalla del cocinero en orden FIFO | El cocinero tendrá su propia pantalla que se actualizara al ingresar el pedido |
| RF-04 | El sistema tendrá comandas por cada mesa y estas se dividirán jerárquicamente en personas y pedidos. | Cada pedido puede contener múltiples personas y cada persona tiene múltiples productos |
| RF-05 | El sistema debe poder generar un ticket detallado después de liberar la mesa. | Después de liberar la mesa se tendrá que generar el ticket |
| RF-06 | El sistema debe permitir a un usuario permitido modificar el catálogo de productos | Solo un gerente o admin podrá modificar el inventario |
| RF-07 | El sistema debe poder registrar gastos con su respectiva justificación | Se podrán registrar gastos como la luz, agua, salarios etc. |
| RF-08 | El sistema debe almacenar los tickets de consumo para su previsualización e impresión. | Se guardarán completos por si se quieren consultar en un futuro |
| RF-09 | El sistema debe calcular la ganancia neta diaria, sumando las ventas y restando los gastos operativos generando un reporte. | |

**No Funcionales:**
### Requerimientos No Funcionales

| Id | Requerimiento | Descripción |
| :--- | :--- | :--- |
| RNF-01 | Rendimiento y tiempos de respuesta | El sistema debe procesar la captura de comandas y reflejarlas en la pantalla de cocina (KDS) casi de manera instantánea (ej. < 2 segundos) para no generar cuellos de botella en horas pico. |
| RNF-02 | Usabilidad e Interfaz Ágil | La interfaz gráfica debe estar optimizada para el flujo de la taquería, minimizando los clics necesarios para agregar modificadores (ej. "sin cebolla", "con todo") para capturar órdenes complejas rápidamente. |
| RNF-03 | Persistencia y Transaccionalidad (ACID) | Las operaciones financieras y de inventario en la base de datos deben usar transacciones (Commit/Rollback). Si ocurre un error de red durante el cobro de una mesa, la operación debe revertirse por completo para evitar inconsistencias. |
| RNF-04 | Escalabilidad Arquitectónica | El sistema utilizará una separación estricta mediante API REST (Backend) y Vistas (Frontend), lo que permitirá en un futuro integrar tabletas adicionales o dispositivos móviles sin reescribir la lógica de negocio. |
| RNF-05 | Alta disponibilidad en entorno local | Al ser un sistema para un local físico, la aplicación debe poder ejecutarse de forma ligera en el hardware disponible de la taquería, asegurando que no haya dependencia externa de internet para tomar órdenes. |

### Requerimientos de Seguridad

| Id | Requerimiento | Descripción |
| :--- | :--- | :--- |
| RS-01 | Protección de secretos y configuración | Las credenciales de la base de datos y llaves del servidor nunca se subirán al repositorio de código; se administrarán estrictamente mediante un archivo de variables de entorno (`.env`) excluido en el `.gitignore`. |
| RS-02 | Encriptación de credenciales | Las contraseñas de los usuarios (Administrador y Trabajadores) no se guardarán en texto plano en la base de datos; deberán someterse a un proceso de hashing (ej. bcrypt). |
| RS-03 | Validación de entradas en el servidor | El backend debe sanitizar y validar todos los datos entrantes para prevenir inyección SQL. Además, aplicará lógica estricta (ej. convertir números a absolutos negativos) para impedir registros de montos inválidos en finanzas. |
| RS-04 | Autorización y protección de rutas | No basta con ocultar botones en la interfaz. El servidor implementará *Middlewares* para verificar el token o sesión del usuario, bloqueando cualquier petición HTTP no autorizada a módulos financieros o de inventario. |

## 3. Requisitos y Metas de Seguridad
* **Protección de secretos:** Uso estricto de variables de entorno (`.env`) para credenciales de base de datos; el archivo `.env` será ignorado en GitHub mediante `.gitignore`.
* **Validaciones previstas:** Filtros numéricos en el backend para evitar inyección de montos negativos en el panel de gastos.
* **Control de acceso:** Uso de Middlewares para restringir rutas financieras exclusivas del Administrador.

## 4. Arquitectura y Separación de Responsabilidades Propuesta
Se utilizará una arquitectura basada en **MVC (Modelo-Vista-Controlador)**:
* **Rutas:** Endpoints de la API REST.
* **Controladores:** Lógica de negocio (ej. validaciones de stock y cortes de caja).
* **Modelos:** Consultas a la base de datos MySQL.
* **Middlewares:** Verificación de roles y seguridad.

## 5. Modelo Entidad-Relación (ER)
El sistema gestiona la concurrencia operativa con las siguientes entidades principales:
* `mesas` (idMesa, estado)
* `cuentas` (idCuenta, idMesa) -> Controla el orden FIFO.
* `personas` (idPersona, idCuenta, nombre)
* `pedidos` (idPedido, idPersona, cantidad, producto, estado)
* `inventario` (idProd, nombre, precio, stock, disponible)
* `finanzas` (idTransaccion, tipo, monto, detalle, fecha) -> Almacena el ticket inmutable.
* `usuarios` (usuario, password, rol)

## 6. Casos de Uso

| ID | Nombre del Caso de Uso | Actor(es) | Descripción |
| :--- | :--- | :--- | :--- |
| CU-01 | Autenticación de usuarios | Todos | El sistema valida las credenciales y redirige según el rol (Administrador, Mesero, Cocinero). |
| CU-02 | Gestión de mapa de mesas | Mesero / Admin | Visualización del estado de las mesas mediante código de colores (blanco, amarillo, rojo). |
| CU-03 | Toma de pedidos (Comandas) | Mesero | Asignación de productos por persona dentro de la cuenta de una mesa específica. |
| CU-04 | Visualización de KDS | Cocinero | Recepción de pedidos en pantalla bajo un modelo FIFO (Primeras Entradas, Primeras Salidas). |
| CU-05 | Cobro y liberación de mesa | Cajero / Admin | Cálculo del total, procesamiento del pago, generación del ticket y reinicio del estado de la mesa. |
| CU-06 | Gestión de inventario | Administrador | Operaciones CRUD sobre el catálogo de productos y actualización de stock. |
| CU-07 | Registro de gastos operativos | Administrador | Captura de salidas de dinero con justificación para el cálculo de ganancias netas. |  
