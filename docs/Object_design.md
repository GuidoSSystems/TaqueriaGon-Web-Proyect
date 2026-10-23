## Entity-Relationship (ER) Diagram

Database schema adapted to support "Takeaway" orders without a mandatory table assignment, featuring a global autoincremental ID for unified FIFO sorting.

```mermaid
erDiagram
    USERS {
        int idUser PK
        varchar username
        varchar password_hash
        enum role "ADMIN, WAITER, COOK"
        boolean is_active
    }

    TABLES {
        int idTable PK
        int table_number
        enum status "FREE, WAITING, SERVED"
    }

    ORDERS {
        int idOrder PK "Global Autoincremental ID (FIFO)"
        int idTable FK "Nullable if Takeaway"
        int idUser FK "Waiter who opened the order"
        enum service_type "DINE_IN, TAKEAWAY"
        int ticket_number "Nullable if Dine-in"
        enum order_status "PENDING, SERVED, PAID, CANCELED"
        int priority_level "For future fast-track algorithm"
        datetime created_at
    }

    PERSONS {
        int idPerson PK
        int idOrder FK
        varchar identifier "e.g., Person 1 or Customer Name"
        enum person_status "PENDING, COMPLETED"
    }

    ORDER_ITEMS {
        int idOrderItem PK
        int idPerson FK
        int idProduct FK
        int quantity
        varchar selected_meat "Pastor, Steak, Chorizo, etc."
        varchar modifiers "Everything, no onions, etc."
        decimal unit_price "Frozen price at order time"
        enum kitchen_status "PENDING, COMPLETED"
    }

    INVENTORY {
        int idProduct PK
        varchar name
        enum category "TACO, BEVERAGE, SNACK, MEAT"
        decimal price
        int stock "Ignored if tracks_stock is 0"
        boolean tracks_stock "1: Sodas, 0: Meats/Tacos"
        boolean is_available "1: Available, 0: Sold out"
        int estimated_time_min "For fast-track algorithm"
    }

    FINANCES {
        int idTransaction PK
        int idOrder FK "Nullable if it's an operational expense"
        int idUser FK "Admin/Cashier who registered it"
        enum type "INCOME, EXPENSE"
        varchar expense_category "Supplies, Utilities, POS Sales"
        decimal amount "Negative for EXPENSE, Positive for INCOME"
        text ticket_detail "Immutable snapshot of the receipt"
        datetime date
    }

    TABLES ||--o{ ORDERS : "hosts (0..N)"
    USERS ||--o{ ORDERS : "registers"
    ORDERS ||--|{ PERSONS : "split into (1..N)"
    PERSONS ||--|{ ORDER_ITEMS : "requests (1..N)"
    INVENTORY ||--o{ ORDER_ITEMS : "contains"
    ORDERS |o--o| FINANCES : "settled in"
    USERS ||--o{ FINANCES : "audits"
```
---
## UML Sequence Diagram: Order Creation (MVC Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Waiter
    participant UI as Frontend (POS Tab)
    participant API as Route + Auth Middleware
    participant Ctrl as OrderController
    participant Mod as OrderModel / InventoryModel
    participant DB as MySQL (Docker)
    actor Cook

    Waiter->>UI: Selects dishes, extras, and destination
    UI->>API: POST /api/orders (JWT Token + Order JSON)
    API->>API: Verify Token & Role (WAITER or ADMIN)
    API->>Ctrl: createOrder(req, res)
    
    Ctrl->>Mod: verifyStockAndAvailability(products)
    Mod->>DB: SELECT is_available, tracks_stock, stock FROM inventory
    DB-->>Mod: Inventory data
    
    alt Product not available or out of stock
        Mod-->>Ctrl: Availability Error
        Ctrl-->>UI: HTTP 400 Bad Request (Item sold out)
        UI-->>Waiter: Visual alert on screen
    else Everything available
        Ctrl->>Mod: saveTransactionalOrder(orderData)
        Mod->>DB: START TRANSACTION
        Mod->>DB: INSERT INTO orders (service_type, idTable/ticket)
        Mod->>DB: INSERT INTO persons & INSERT INTO order_items
        Mod->>DB: UPDATE inventory SET stock = stock - qty (if tracks_stock = 1)
        Mod->>DB: UPDATE tables SET status = 'WAITING' (if DINE_IN)
        Mod->>DB: COMMIT
        DB-->>Mod: Confirmation & Generated Global ID
        Mod-->>Ctrl: Order created successfully
        Ctrl-->>UI: HTTP 201 Created (Global ID & Ticket/Table)
        UI-->>Waiter: Confirmation & screen reset
    end

    Cook->>UI: Opens Kitchen Tab (KDS)
    UI->>API: GET /api/kitchen/fifo-queue
    API->>Ctrl: getKDSQueue()
    Ctrl->>Mod: fetchPendingOrders()
    Mod->>DB: SELECT * FROM orders JOIN persons JOIN order_items ORDER BY idOrder ASC
    DB-->>Ctrl: Grouped List (Dine-in and Takeaway)
    Ctrl-->>UI: HTTP 200 OK (JSON split into 2 lists)
    UI-->>Cook: Renders Dine-in and Takeaway columns
```

---
## UML Class Diagram (MVC Pattern)

```mermaid
classDiagram
    class AuthMiddleware {
        +verifyToken(req, res, next)
        +verifyRole(allowedRoles)
    }

    class OrderController {
        +createOrder(req, res)
        +getTableAndTicketMap(req, res)
        +settleAndReleaseOrder(req, res)
        +cancelOrder(req, res)
    }

    class KitchenController {
        +getFIFOQueue(req, res)
        +cascadeRelease(req, res)
        +sortByPriority(orderQueue)
    }

    class InventoryController {
        +getCatalog(req, res)
        +batchUpdate(req, res)
    }

    class FinanceController {
        +registerExpense(req, res)
        +generateDailyCut(req, res)
        +getMonthlyMetrics(req, res)
    }

    class OrderModel {
        +insertFullOrder(orderDTO)
        +updateTableStatus(idTable, status)
        +executeStockRefund(idOrder)
    }

    class KitchenModel {
        +markItemCompleted(idOrderItem)
        +checkPendingPersonItems(idPerson)
        +checkPendingOrderItems(idOrder)
    }

    class InventoryModel {
        +validateStockAndAvailability(idProduct, quantity)
        +executeBatchUpdate(productList)
    }

    class FinanceModel {
        +insertTransaction(type, amount, ticketDetail)
        +calculateCutByDate(date)
        +fetchSalesLastMonth()
    }

    AuthMiddleware ..> OrderController : protects routes
    AuthMiddleware ..> KitchenController : protects routes
    AuthMiddleware ..> InventoryController : requires ADMIN role
    AuthMiddleware ..> FinanceController : requires ADMIN role

    OrderController --> OrderModel : uses
    OrderController --> InventoryModel : validates stock
    OrderController --> FinanceModel : triggers sale on settle
    KitchenController --> KitchenModel : uses
    InventoryController --> InventoryModel : uses
    FinanceController --> FinanceModel : uses
```
