<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pesanan Berhasil - Gamezygo</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0d0e15;
      color: #e2e8f0;
      margin: 0;
      padding: 24px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #161826;
      border: 1px solid #282b3f;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      padding: 28px 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      letter-spacing: 0.5px;
    }
    .header p {
      color: #e0e7ff;
      margin: 6px 0 0;
      font-size: 14px;
    }
    .content {
      padding: 24px;
    }
    .badge-success {
      display: inline-block;
      background-color: #10b981;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #f8fafc;
      margin: 20px 0 12px;
      border-bottom: 1px solid #282b3f;
      padding-bottom: 6px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .info-table td {
      padding: 8px 0;
      font-size: 14px;
      color: #94a3b8;
    }
    .info-table td.value {
      text-align: right;
      color: #f1f5f9;
      font-weight: 600;
    }
    .card {
      background-color: #1e2133;
      border: 1px solid #2e334d;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .credential-box {
      background-color: #0b0c13;
      border: 1px dashed #6366f1;
      border-radius: 6px;
      padding: 12px 14px;
      margin-top: 10px;
      font-family: 'Courier New', Courier, monospace;
    }
    .credential-row {
      margin: 4px 0;
      font-size: 13px;
    }
    .credential-label {
      color: #94a3b8;
      display: inline-block;
      width: 110px;
    }
    .credential-val {
      color: #38bdf8;
      font-weight: 700;
    }
    .btn {
      display: block;
      width: 220px;
      margin: 24px auto 8px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff !important;
      text-align: center;
      text-decoration: none;
      font-weight: 700;
      border-radius: 8px;
      font-size: 14px;
    }
    .footer {
      background-color: #11121d;
      padding: 20px 24px;
      text-align: center;
      border-top: 1px solid #282b3f;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎮 GAMEZYGO</h1>
      <p>Terima kasih atas pesanan Anda!</p>
    </div>

    <div class="content">
      <div style="text-align: right; margin-bottom: 12px;">
        <span class="badge-success">Pembayaran Berhasil</span>
      </div>

      <p style="margin-top: 0; font-size: 15px;">
        Halo <strong>{{ $order->user->name ?? 'Gamer' }}</strong>,
      </p>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.5;">
        Pembayaran untuk pesanan Anda telah kami terima dan kredensial game Anda sudah siap diakses di Game Library.
      </p>

      <div class="section-title">Detail Transaksi</div>
      <table class="info-table">
        <tr>
          <td>Nomor Pesanan:</td>
          <td class="value">#{{ $order->order_code }}</td>
        </tr>
        <tr>
          <td>Tanggal:</td>
          <td class="value">{{ $order->paid_at ? $order->paid_at->format('d M Y, H:i') : now()->format('d M Y, H:i') }} WIB</td>
        </tr>
        <tr>
          <td>Metode Pembayaran:</td>
          <td class="value">{{ strtoupper($order->payment?->payment_method ?? 'Online Payment') }}</td>
        </tr>
        <tr>
          <td>Total Pembayaran:</td>
          <td class="value" style="color: #34d399; font-size: 16px;">Rp {{ number_format($order->total_price, 0, ',', '.') }}</td>
        </tr>
      </table>

      <div class="section-title">Kredensial Game Anda</div>
      @if(!empty($credentials))
        @foreach($credentials as $cred)
          <div class="card">
            <div style="font-weight: 700; color: #f8fafc; font-size: 15px;">
              {{ $cred['game_title'] ?? 'Game Account' }}
            </div>
            <div class="credential-box">
              <div class="credential-row">
                <span class="credential-label">Username:</span>
                <span class="credential-val">{{ $cred['username'] ?? '-' }}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">Password:</span>
                <span class="credential-val">{{ $cred['password'] ?? '-' }}</span>
              </div>
              @if(!empty($cred['access_token']))
                <div class="credential-row">
                  <span class="credential-label">Steam Guard:</span>
                  <span class="credential-val">{{ $cred['access_token'] }}</span>
                </div>
              @endif
            </div>
          </div>
        @endforeach
      @else
        <div class="card" style="text-align: center; color: #94a3b8; font-size: 13px;">
          Kredensial dapat langsung diakses melalui menu Game Library pada akun Anda.
        </div>
      @endif

      <a href="{{ rtrim(config('app.url', 'http://localhost:3000'), '/') }}/library" class="btn">
        Buka Game Library
      </a>

      <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 16px;">
        *Harap jangan membagikan kredensial di atas kepada orang lain untuk menjaga keamanan akun game Anda.
      </p>
    </div>

    <div class="footer">
      &copy; {{ date('Y') }} Gamezygo. Seluruh hak cipta dilindungi undang-undang.<br>
      Email ini dikirim otomatis sebagai bukti pembayaran resmi.
    </div>
  </div>
</body>
</html>
