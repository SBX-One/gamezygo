# Gamezygo Backend Development Guide & Coding Standards

> [!IMPORTANT]
> The developer of this project is a **Backend Developer**. Gemini (and any other AI agent) must focus strictly on the backend (Laravel 13, database schema, APIs, queue worker, etc.). Frontend specifications are handled separately and do not need frontend components or standards defined here.
>
> **CRITICAL RULE**: Before executing any commands or writing any backend code, the agent **MUST ALWAYS read the files in the [agent-requirement](file:///C:/laragon/www/gamezygo/agent-requirement) directory** (e.g., [Backend-Code-Standard.md](file:///C:/laragon/www/gamezygo/agent-requirement/Backend-Code-Standard.md) and [Gamezygo-AI-PRD.md](file:///C:/laragon/www/gamezygo/agent-requirement/Gamezygo-AI-PRD.md)) to maintain alignment with database design, API schemas, and formatting rules.

---

## 🛠️ Technology Stack & Environment (Backend Focus)

| Component | Technology | Version | Rationale & Configuration |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | Laravel | `13.x` | Laravel Sanctum, PHP 8.5.x, Eloquent ORM |
| **Database** | PostgreSQL | `16.x` | JSONB support, strict row constraints, atomic ACID transactions |
| **Cache & Queue** | Redis | `7.x` | Queue broker for transactional timeouts, email worker & cache |
| **Payments** | Midtrans | Snap SDK | Indonesian localized payments (QRIS, E-Wallet, Virtual Accounts) |
| **Auth** | Google OAuth | `2.0` | One-click onboarding via Google Identity Services |
| **Cloud Storage** | AWS S3 | latest | Centralized cloud storage for game covers and static media |

---

## 🚀 Quick Start Commands (Local Development)

### 1. External Services (PostgreSQL & Redis)
Before running development servers, ensure PostgreSQL and Redis are active.
* **Using Docker Desktop (For Services Only):**
  ```bash
  docker-compose up -d postgres redis
  ```
* **Host Database configuration in `backend/.env`**:
  ```env
  DB_HOST=127.0.0.1
  REDIS_HOST=127.0.0.1
  ```

### 2. Start the Backend (Laravel)
Run these commands from the `backend/` directory:
```bash
# Install PHP dependencies
composer install

# Set application key (first time)
php artisan key:generate

# Run migrations and seed database
php artisan migrate:fresh --seed

# Start the Laravel local development server (runs on http://localhost:8000)
php artisan serve --port=8000

# Start the Redis Queue Worker for email queue / background jobs
php artisan queue:work
```

---

## 📁 Workspace Folder Structure (Backend Focus)

```text
gamezygo/
├── backend/                      # Laravel 13 Core Application
│   ├── app/                      # Http Controllers, Models, Middleware, Services
│   │   ├── Http/Controllers/     # AuthController, CatalogController, CheckoutController, etc.
│   │   ├── Models/               # User, Product, GameCredential, Order, Voucher
│   │   └── Services/             # CryptService for credential encryption
│   ├── config/                   # Configuration files
│   ├── database/                 # Migrations & Seeders
│   ├── routes/                   # API routes (`routes/api.php`)
│   └── .env                      # Local backend configuration (DB/Redis to 127.0.0.1)
├── agent-requirement/            # Requirements and PRD copies (READ FIRST!)
│   ├── Backend-Code-Standard.md  # Detailed PHP standards
│   └── Gamezygo-AI-PRD.md        # Core system architecture & contracts
└── GEMINI.md                     # This developer guide
```

---

## 💾 Database Schema

The PostgreSQL migrations must strictly define the following tables (refer to [Gamezygo-AI-PRD.md](file:///C:/laragon/www/gamezygo/agent-requirement/Gamezygo-AI-PRD.md#L351-L428)):

* **`users`**: Customer and Admin records. Role must be `admin` or `customer`.
* **`products`**: Game catalog items.
* **`vouchers`**: Promo/voucher codes for checkout discounts (percentage or flat).
* **`orders`**: Checkout transactions with payment status (`pending`, `settled`, `expired`, `failed`).
* **`order_items`**: Line items for orders, connecting products to orders.
* **`game_credentials`**: Stores the encrypted shared account credentials (`username`, `password`, `access_token`). Relates to `products` (stock), `order_items` (delivery), and `users` (ownership isolation).

---

## 🔒 Security Best Practices & Patterns

### 1. Row-Level Data Isolation (Preventing Credential Leakage)
In `LibraryController.php`, always constrain credential queries to the authenticated user ID and decrypt credentials on-the-fly:
```php
public function getLibrary(Request $request)
{
  $userId = $request->user()->id;

  $credentials = GameCredential::where('assigned_to_user_id', $userId)
    ->join('products', 'game_credentials.product_id', '=', 'products.id')
    ->select('products.title', 'products.cover_image_url', 'game_credentials.username', 'game_credentials.password', 'game_credentials.access_token', 'game_credentials.updated_at')
    ->get();

  return response()->json([
    'status' => 'success',
    'data' => $credentials->map(function ($item) {
      return [
        'game_title'      => $item->title,
        'cover_image_url' => $item->cover_image_url,
        'credentials'     => [
          'username'     => decrypt($item->username),
          'password'     => decrypt($item->password),
          'access_token' => $item->access_token ? decrypt($item->access_token) : null,
        ],
        'purchase_date'   => $item->updated_at,
      ];
    }),
  ]);
}
```

### 2. Concurrency Control (Anti-Double Allocation Pattern)
To prevent the same account credentials from being sold or reserved simultaneously during concurrent checkouts, use database transaction locking (`lockForUpdate`) in `CheckoutController.php`:
```php
DB::transaction(function () use ($productId, $userId, $orderItem) {
  // Lock the credential record to prevent race conditions
  $credential = GameCredential::where('product_id', $productId)
    ->where('status', 'available')
    ->lockForUpdate()
    ->first();

  if (!$credential) {
    throw new \Exception('Stock depleted for this game.');
  }

  // Reserve the stock to prevent locking forever
  $credential->update([
    'status'              => 'reserved',
    'assigned_to_user_id' => $userId,
    'reserved_until'      => now()->addMinutes(15), // Released back if unpaid in 15 mins
  ]);
});
```

### 3. Midtrans Webhook Callback Signature Auditing
Always verify the SHA512 signature key before processing settlements in `PaymentWebhookController.php`:
```php
public function handleWebhook(Request $request)
{
  $orderId = $request->input('order_id');
  $statusCode = $request->input('status_code');
  $grossAmount = $request->input('gross_amount');
  $serverKey = config('services.midtrans.server_key');

  // Signature validation pattern: order_id + status_code + gross_amount + ServerKey
  $calculatedHash = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

  if ($calculatedHash !== $request->input('signature_key')) {
    return response()->json(['error' => 'Invalid signature verification'], 403);
  }

  // Fulfill order, mark credentials as 'sold', and link the buyer user ID...
}
```

---

## 🔴 Backend (Laravel) Coding Standards

Follow these PHP styling conventions strictly (derived from [Backend-Code-Standard.md](file:///C:/laragon/www/gamezygo/agent-requirement/Backend-Code-Standard.md)):

### 1. Naming Conventions
* **Variables**: Use `camelCase` (e.g., `$totalPrice`, not `$total_price` or `$tp`).
* **Constants**: Use uppercase `SNAKE_CASE` (e.g., `const STATE_ACTIVE = 1;`).
* **Classes**: Use `PascalCase` (e.g., `FileStreamReader`).
* **Methods**: Use `camelCase` (e.g., `getChannel()`).
* **Functions** (Helper/Global): Use `snake_case` (e.g., `format_date_helper()`).
* **Files**: Class files must exactly match the class name (e.g., `Cart.php`). Non-class files must be `snake_case.php`.

### 2. Code Formatting & Indentation
* **Indentation**: Use **two spaces** (not 4 spaces or tabs) for all code blocks (methods, classes, loops, conditionals).
* **Curly Braces**:
  * For **Classes** and **Methods**, the opening curly brace `{` must be on the line **below** the declaration.
    ```php
    class User
    {
      public function getProfile()
      {
        // code
      }
    }
    ```
  * For **Control / Loop statements** (`if`, `elseif`, `else`, `for`, `foreach`, `while`), the opening curly brace `{` must be on the **same line** as the statement.
    ```php
    if ($a > 10) {
      $b = 1;
    }
    ```
* **Control Structures**:
  * One space before the opening parenthesis `(` of the condition and one space after the closing parenthesis `)`.
  * Every conditional/loop block must use curly braces `{}`. Brace-less syntax is strictly prohibited.
  * Long conditional clauses should break after a logical operator (`&&` or `||`) and align with the first character of the clause on the previous line.

### 3. Strings & Arrays
* **String Literals**: Use single quotes (`'...'`) unless variable interpolation is required.
* **Variable Interpolation**: Use `"Hello {$var}"` format. Do not use `"Hello $var"` or `"Hello ${var}"`.
* **String Concatenation**: Use the dot operator with one space on each side (`$a . ' ' . $b`). Long concatenations should break on new lines and align dots with the assignment operator.
* **Arrays**:
  * Commas in array definitions must be followed by a space.
  * Align the `=>` operator in multi-line associative arrays.
  * Negative numbers are not allowed as array indices.
  ```php
  $array = [
    'firstName' => 'John',
    'lastName'  => 'Smith',
  ];
  ```
