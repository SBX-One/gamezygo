# Backend Code Standard — Gamezygo (Laravel)

All PHP code must adhere strictly to the PER Coding Style (successor of PSR-12). Laravel Pint is used to enforce these rules.

## 1. Style & Formatting (PER-compliant)

- **Indentation:** Always use **4 spaces** for indentation. Two-space indentation is prohibited for PHP files.
- **Arrays:** Always use short array syntax `[...]` instead of the outdated `array(...)`.
- **Braces:** Class and method opening curly braces `{` must be on the line **below** the declaration. Control statements (`if`, `foreach`, `while`) opening curly braces must be on the **same** line.
- **Control structures:** Every `if`, `elseif`, and `else` block must be enclosed in curly braces `{}`.

## 2. Laravel Architectural Conventions

### 2.1 Request Validation (Form Requests)

Do not perform request validation inline inside controllers. Always create a custom Form Request class using `php artisan make:request`.

```php
// In app/Http/Requests/CheckoutRequest.php
public function rules(): array
{
    return [
        'cart_items' => ['required', 'array', 'min:1'],
        'cart_items.*.product_id' => ['required', 'uuid', 'exists:products,id'],
        'cart_items.*.quantity' => ['required', 'integer', 'min:1', 'max:1'],
        'voucher_code' => ['nullable', 'string', 'exists:vouchers,code'],
    ];
}
```

### 2.2 Service Layer Separation

Move complex business operations (such as payment processing, stock allocation, Google token validation, and CSV parsing) into custom Service classes inside the `app/Services` namespace. Controllers must only handle request receiving and returning API envelopes.

### 2.3 DB Transactions & Concurrency Locking

For operations involving stock reservation and order allocation, wrap queries in database transactions and use `lockForUpdate()` to prevent race conditions (double allocation of shared accounts).

```php
DB::transaction(function () use ($productId, $userId) {
    $credential = GameCredential::where('product_id', $productId)
        ->where('status', 'available')
        ->lockForUpdate()
        ->first();

    if (!$credential) {
        throw new \Exception("Stock depleted for this title.");
    }

    $credential->update([
        'status' => 'reserved',
        'assigned_to_user_id' => $userId,
        'reserved_until' => now()->addMinutes(15),
    ]);
});
```

### 2.4 Cryptographic Security

Sensitive account details stored in the `game_credentials` table (such as `username`, `password`, and `access_token`) must be encrypted using Laravel's native encryption services before persisting to the database. Cast these attributes as encrypted in the model:

```php
// In app/Models/GameCredential.php
protected $casts = [
    'username' => 'encrypted',
    'password' => 'encrypted',
    'access_token' => 'encrypted',
];
```

### 2.5 Environment Variables

Never access `env()` directly outside of configuration files. Always define variables in files under the `config/` directory (e.g., `config/services.php`) and access them using `config('services.service_name.key')`.

---

## 3. Naming Conventions

- **Variables**

  Variable names may only consist of letters and numbers (alphanumeric characters). Underscores (`_`) are not allowed. Numbers may be used in variable names, but in most cases this is not recommended.

  Variable names must always start with a lowercase letter. If a variable name consists of more than one word, the first letter of each subsequent word must be capitalized. This writing convention is known as **camelCase**.

  ```php
  $itemName      = "Kingston KVR13R9S4K4";
  $numberOfItems = 10;
  $price         = 1000;
  $totalPrice    = $price * $numberOfItems;
  ```

  Using descriptive variable names is strongly encouraged. Variable names should be as clear and detailed as possible so they accurately describe the data the developer intends to store.

  Overly short variable names, such as `$i` or `$n`, should be avoided, except in very simple and short loops.

  If a loop contains more than 20 lines of code, the index variable used should have a more descriptive name so the code is easier to understand and maintain.

- **Constants**

  **Constant** names may consist of letters, numbers (alphanumeric characters), and underscores (`_`). The use of numbers in constant names is allowed.

  All letters in a constant name must be written in uppercase. If a constant name consists of more than one word, each word must be separated by an underscore (`_`).

  For example, `DATABASE_USER_PASSWORD` is correctly written, while `DATABASE_USERPASWORD` is incorrect because the words are not separated by underscores.

  Constants must be defined as class members using the `const` modifier, or defined in the global scope using the `define()` function.

  ```php
  define("DATABASE_USER_PASSWORD", "Eja3#RmK");
  ```

  ```php
  class User
  {
      const STATE_TEMPORARY = 1;
      const STATE_NORMAL    = 2;
      const STATE_CANCELLED = 3;
  }
  ```

- **Classes**

  **Class** names may only consist of letters and numbers (alphanumeric characters). The use of numbers in class names is allowed, but in most cases is not recommended.

  Underscores (`_`) may only be used as a substitute for a directory path separator. For example, the file name `Xml/Element.php` should map to the class name `Xml_Element`.

  Class names must always start with an uppercase letter.

  If a class name consists of more than one word, the first letter of each subsequent word must also be capitalized. This writing convention is known as **PascalCase**.

  ```php
  class FileInputStream
  {

  }
  ```

  Consecutive uppercase letters are not allowed. For example, the class name `PDF` is not allowed, while `Pdf` is allowed.

- **Methods**

  **Method** names may only consist of letters and numbers (alphanumeric characters). Underscores (`_`) are not allowed. The use of numbers in method names is allowed, but in most cases is not recommended.

  Method names must always start with a lowercase letter. If a method name consists of more than one word, the first letter of each subsequent word must be capitalized. This writing convention is known as **camelCase**.

  Using descriptive method names is strongly encouraged. Method names should be as clear and detailed as possible so they accurately describe the purpose and behavior (function) of the method.

  Below are some examples of method names that follow this convention:

  ```php
  class FileInputStream
  {
      public function getChannel()
      {
      }

      public function getFD()
      {
      }
  }
  ```

- **Functions**

  **Function** names may only consist of letters and numbers (alphanumeric characters). The use of numbers in function names is allowed, but in most cases is not recommended.

  Function names must always start with a lowercase letter. If a function name consists of more than one word, each word must be separated by a single underscore (`_`) without using spaces. This writing convention is known as **snake_case**.

  Below are some examples of function names that follow this convention:

  ```php
  function validate_email_address($emailAddress) {

  }

  function http_post($url, $postData) {

  }
  ```

- **Files**

  For all files other than class files, the file name may only consist of letters, numbers (alphanumeric characters), and underscores (`_`). The use of spaces in file names is strictly prohibited.

  Every file that contains a **class** must have the same name as that class.

  For example, if there is a class named `Cart`, the file that stores it must be named `Cart.php`.

  ```php
  class Cart
  {

  }
  ```

  Conversely, a file that **does not contain a class** must use **snake_case** naming, meaning each word is separated by an underscore (`_`) and all letters are written in lowercase.

  For example, the file name `cart_add.php` follows this convention correctly.

  ```php
  <?php

  $productId = $_POST['product_id'];
  $num       = $_POST['num'];

  $cart = new Cart();
  $cart->add($productId, $num);
  ```

---

## 4. Strings

- **String Literals**

  If a **string** is **literal** (contains no variable substitution or interpolation), it must always be enclosed in single quotes (**apostrophes**, `'...'`).

  ```php
  $str = 'Hello World!!';
  ```

- **String Literals Containing Apostrophes**

  If a **string literal** contains an apostrophe (single quote) within it, the string is allowed to be enclosed in double quotes (`"..."`).

  ```php
  $str = "It's good.";
  ```

- **String Concatenation (1)**

  String concatenation must use the dot operator (`.`). To improve readability, always add one space before and after the (`.`) operator.

  ```php
  $str = 'Hello' . ' ' . 'World!!';
  ```

- **String Concatenation (2)**

  When concatenating strings using the dot operator (`.`), it is recommended to break the statement across multiple lines to improve code readability.

  In such cases, each continuation line must be indented so that the dot operator (`.`) aligns with the assignment operator (`=`).

  ```php
  $sql = "SELECT `id`, `name` FROM `people` "
       . "WHERE `name` = 'John' "
       . "ORDER BY `id` ASC ";
  ```

  When the result of a string concatenation is passed as an argument to a function, the first part of the string may start on the next line.

  If this format is used, the first line must be indented one level deeper than the line calling the function. All subsequent lines must have the same indentation, and the dot operator (`.`) is placed at the end of each line.

  ```php
  execute_sql(
      "SELECT `id`, `name` FROM `people` " .
      "WHERE `name` = 'John' " .
      "ORDER BY `id` ASC "
  );
  ```

- **Variable Substitution**

  **Variable substitution** within a string is allowed using one of the following two forms:

  ```php
  $var = 'World!!';
  $str = "Hello {$var}";
  ```

  To maintain consistency in code writing, the following forms are **not allowed**:

  ```php
  $str = "Hello ${var}";

  $str = "Hello $var";
  ```

---

## 5. Arrays

- **Indexed Arrays**

  **Negative numbers are not allowed as array indices.**

  Indexed arrays may start with any number as long as the value is not negative. However, using a starting index other than `0` is not recommended.

  When declaring an indexed array using the short array syntax `[]`, each comma (`,`) must be followed by a single space to improve code readability.

  ```php
  $array = ["John", "James", "Mary"];
  ```

  Declaring an **indexed array** across multiple lines using the short array `[]` construct is allowed.

  In such cases, the first array element may start on the next line. That line must be indented one level deeper (4 spaces) than the line containing the array declaration. All subsequent elements must have the same level of indentation.

  The closing bracket (`]`) must be placed on its own line, at the same indentation level as the array declaration line.

  ```php
  $array = [
      "John", "James", "Robert",
      "Michael", "William", "David",
      "Mary", "Linda", "Lisa",
  ];
  ```

- **Associative Arrays**

  When declaring an **associative array** using the short array `[]` construct, it is recommended to break the declaration across multiple lines to improve code readability.

  The first array element may start on the next line. If this format is used, the first line must be indented one level deeper (4 spaces) than the line containing the array declaration. All subsequent elements must have the same level of indentation.

  The closing bracket (`]`) must be placed on its own line, at the same indentation level as the array declaration line.

  To improve readability, the assignment operator `=>` for each array element should be padded so that they are aligned with one another.

  ```php
  $array = [
      "firstName" => "John",
      "lastName"  => "Smith",
      "sex"       => "male",
      "age"       => 36,
  ];
  ```

  When an **array** is passed as an argument to a function, the function call may include the short array `[]` construct, and its declaration may be broken across multiple lines to improve code readability.

  In such cases, all applicable array writing rules must still be followed, such as consistent indentation, placing the closing bracket on its own line, and neat formatting of array elements.

  ```php
  my_function([
      "firstName" => "John",
      "lastName"  => "Smith",
      "sex"       => "male",
      "age"       => 36,
  ]);
  ```

---

## 6. Control Statements

- **if/else/elseif (1)**

  Control statements using **`if`** and **`elseif`** constructs must have one space before the opening parenthesis (`(`) of the condition and one space after the closing parenthesis (`)`).

  Within the condition enclosed in parentheses, each operator must be separated by a space for readability. Using additional parentheses within the condition is also encouraged to clarify logical grouping, especially for complex conditional expressions.

  The opening curly brace (`{`) must be written on the same line as the conditional statement (`if` or `elseif`). The closing curly brace (`}`) must always be written on its own line.

  All code inside the curly braces must be indented using **four spaces** (one indentation level).

  ```php
  if ($a > 100) {
      $b = 1;
  }
  ```

- **if/else/elseif (2)**

  If a **conditional statement** is fairly long and consists of several clauses, it may be broken across multiple lines.

  In such cases, line breaks should occur after a logical operator (e.g. `&&` or `||`). Each continuation line must be indented so it aligns with the first character of the condition clause on the previous line. This is intended to maintain readability and writing consistency.

  ```php
  if (($a > 100) &&
      ($b < 5)   &&
      ($c === $d)) {
      $d = 1;
  }
  ```

- **if/else/elseif (3)**

  For **`if`** statements accompanied by **`elseif`** or **`else`**, the writing rules are the same as for the **`if`** construct.

  The following example shows the correct writing format for an **`if`** statement using **`else`** and/or **`elseif`**.

  ```php
  if ($a === 1) {
      $b = 1;
  } elseif ($a === 2) {
      $b = 5;
  } else {
      $b = 10;
  }

  if ($a > 10) {
      $x = 'test1';
  } else {
      $x = 'test2';
  }
  ```

  PHP allows writing statements without curly braces (`{}`) in some conditions.

  However, this coding standard does not make that distinction. Therefore, **every `if`, `elseif`, and `else` statement must use curly braces (`{}`)**, without exception.

---

## 7. Loop Statements

- **for/foreach/while**

  Loop statements must have one space before the opening parenthesis (`(`) of the condition expression and one space after the closing parenthesis (`)`).

  Within the expression enclosed in parentheses, each operator must be separated by a space for readability.

  The opening curly brace (`{`) must be written on the same line as the loop expression, while the closing curly brace (`}`) must always be written on its own line.

  All code inside the curly braces must be indented using **four spaces** (one indentation level).

  For example, below is the correct writing format for a **`for`** statement. Pay attention to the placement of parentheses, spaces, and curly braces.

  ```php
  for ($i = 0; $i < $max; $i = $i + 2) {
      $a = ($i * 2) - 1;
  }
  ```

---

## 8. Classes

- **Class Declaration**

  Each PHP file may only contain **one class**.

  The opening curly brace (`{`) must always be written on the line **below** the class name.

  All code inside a class must be indented using **four spaces** (one indentation level).

  Below is an example of a **class** declaration that follows this writing standard.

  ```php
  class MyClass
  {
      public function myMethod($arg1, $arg2)
      {

      }
  }
  ```

  A **class** that inherits (**extends**) another class or implements (**implements**) one or more interfaces should declare all its dependencies on the **same line**, when possible.

  ```php
  class MyClass extends ParentClass implements MyInterface
  {
  }
  ```
