#  Propuesta de Navegación y Arquitectura de Pestañas

Para garantizar un flujo operativo eficiente en **Taquería Gon**, el sistema web se estructurará en 7 módulos principales. El acceso a cada pestaña estará restringido mediante el uso de tokens JWT y validación de roles (Mesero, Cocinero, Administrador), asegurando la seguridad de la información.

##  Estructura de Módulos

| Módulo / Pestaña | Ruta URL | Roles con Acceso | Función Principal y Mejoras Implementadas |
| :--- | :--- | :--- | :--- |
| **1. Login** | `/login` | Público | Pantalla de inicio de sesión. Redirección automática al área de trabajo correspondiente según el rol del usuario autenticado. |
| **2. Punto de Venta (POS)** | `/pos` | `Mesero`, `Admin` | Interfaz rápida para la toma de pedidos (selección de cantidad, producto, carne, extras).<br><br>**Mejora:** Incluye selector de destino (*Mesa #* o *Para Llevar* con generación de ficha) y validación en tiempo real de disponibilidad/stock. |
| **3. Mapa de Mesas** | `/mesas` | `Mesero`, `Admin` | Vista gráfica del estado de las mesas mediante un semáforo (Libre, Esperando, Atendida).<br><br>**Mejora:** Integración de una barra lateral para visualizar y gestionar las **"Fichas Para Llevar Activas"**. |
| **4. Cocina (KDS)** | `/cocina` | `Cocinero`, `Admin` | Pantalla de despacho dividida en dos columnas: *Comer Aquí* y *Para Llevar*. Ordenadas por ID Global (FIFO).<br><br>**Mejora:** Sistema de liberación en cascada (Producto -> Persona -> Orden completa) y preparación para algoritmo de prioridad. |
| **5. Inventario** | `/inventario` | `Admin` | Panel para la edición ágil de precios y banderas de los productos.<br><br>**Mejoras:** Uso de campos booleanos para `disponible` (Sí/No) y `controla_stock` (útil para diferenciar refrescos de carnes/tacos). |
| **6. Corte y Caja** | `/corte` | `Admin` | Resumen operativo del día (Ingresos vs Egresos).<br><br>**Mejora:** Integración de formulario para Registro de Gastos (insumos, servicios) con conversión negativa automática y un Visor de Tickets para reimpresiones. |
| **7. Finanzas (Dashboard)** | `/finanzas` | `Admin` | Analítica avanzada del negocio con gráficas del último mes.<br><br>**Mejora:** Visualización de ventas por día, comparativas de consumo local vs. para llevar, e historial filtrable de transacciones. |

##  Reglas de Navegación (Guardias de Ruta)

* **Redirección por defecto:** Si un usuario intenta acceder a la raíz (`/`), el sistema verificará su sesión. Si no hay sesión, se enviará a `/login`. Si la hay, se enviará a su pestaña principal (ej. `/pos` para meseros).
* **Bloqueo de acceso:** Si un `Mesero` o `Cocinero` intenta escribir en el navegador la URL `/finanzas` o `/inventario`, el sistema (Middleware) bloqueará la petición y mostrará un error *403 Forbidden*.
