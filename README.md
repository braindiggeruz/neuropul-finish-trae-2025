# FILES WRITTEN

## .env.local.example
```
# App
VITE_APP_ENV=local
VITE_PUBLIC_URL=http://localhost:5173
VITE_TG_BOT_USERNAME=neuropul_local_bot
VITE_TG_WEBAPP_MOCK=1

# Supabase (локально)
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=anon_dev_key
SUPABASE_SERVICE_ROLE_KEY=service_role_dev_key

# Payments (sandbox/mocks)
VITE_PAYMENTS_PROVIDER=stripe|paypal|stars-mock
STRIPE_PUBLIC_KEY=pk_test_123
STRIPE_SECRET_KEY=sk_test_123
PAYPAL_CLIENT_ID=sb
PAYPAL_CLIENT_SECRET=sb
TELEGRAM_STARS_MOCK=1

# Sentry (локаль — вывод офф)
VITE_SENTRY_DSN=
```

## scripts/dev.sh
```bash
#!/usr/bin/env bash
set -euo pipefail

# 1) env
cp -n .env.local.example .env.local || true

# 2) Supabase up (локальный)
if command -v supabase >/dev/null 2>&1; then
  supabase start || supabase start
  supabase db reset --force || true
  supabase db push
  supabase db execute --file supabase/seed/local_flags.sql
  supabase db execute --file supabase/seed/local_min_data.sql
  supabase functions serve --no-verify-jwt --env-file .env.local >/dev/null 2>&1 &
else
  echo "Install Supabase CLI: https://supabase.com/docs/guides/cli"
  exit 1
fi

# 3) install deps
npm ci

# 4) run web
npm run dev
```

## Makefile
```makefile
.SILENT:

dev:
	./scripts/dev.sh

down:
	- supabase stop || true
	- pkill -f "supabase functions serve" || true

reset:
	- supabase db reset --force
	- supabase db push
	- supabase db execute --file supabase/seed/local_flags.sql
	- supabase db execute --file supabase/seed/local_min_data.sql

logs:
	- supabase logs --follow

test:
	npm run test && npx playwright test

lint:
	npm run lint && npm run typecheck
```

## supabase/seed/local_flags.sql
```sql
insert into config(key,value) values
('auto.experiment.enabled','false'),
('trae.selftrain.enabled','false'),
('evolution.scheduler.enabled','false'),
('cognitive.graph.enabled','true'),
('meta.insight.enabled','true'),
('payments.stripe.enabled','true'),
('payments.paypal.enabled','true'),
('payments.stars.mock.enabled','true')
on conflict(key) do update set value=excluded.value;
```

## supabase/seed/local_min_data.sql
```sql
-- базовый профиль, миссии, архетип Ronin
insert into profiles(id, username, archetype) values
('00000000-0000-0000-0000-000000000001','local_user','PROMPT_RONIN')
on conflict (id) do nothing;

insert into missions(id, title, status, user_id) values
(gen_random_uuid(),'Local MVP Mission','active','00000000-0000-0000-0000-000000000001');

-- минимальные справочники для achievements/badges если нужны
```

## src/lib/telegram/mockWebApp.ts
```typescript
export const mockTelegramInitData = {
  user: { 
    id: 1, 
    username: "local_user",
    first_name: "Local",
    last_name: "User",
    language_code: "en"
  },
  auth_date: Date.now(),
  hash: "mock"
};

export function installTelegramMock() {
  // @ts-ignore
  window.Telegram = {
    WebApp: {
      initData: "",
      initDataUnsafe: mockTelegramInitData,
      version: "6.0",
      platform: "web",
      colorScheme: "light",
      themeParams: {},
      isExpanded: false,
      viewportHeight: 0,
      viewportStableHeight: 0,
      headerColor: "",
      backgroundColor: "",
      ready: () => {},
      expand: () => {},
      close: () => {},
      sendData: () => {},
      openLink: () => {},
      openTelegramLink: () => {},
      showPopup: () => {},
      showAlert: () => {},
      showConfirm: () => {},
      showScanQrPopup: () => {},
      closeScanQrPopup: () => {},
      readTextFromClipboard: () => {},
      isClosingConfirmationEnabled: false,
      requestWriteAccess: () => {},
      requestContact: () => {},
      HapticFeedback: {
        impactOccurred: () => {},
        notificationOccurred: () => {},
        selectionChanged: () => {}
      },
      MainButton: { 
        text: "",
        color: "",
        textColor: "",
        isVisible: false,
        isActive: false,
        isProgressVisible: false,
        setText: () => {},
        onClick: () => {},
        offClick: () => {},
        show: () => {},
        hide: () => {},
        enable: () => {},
        disable: () => {},
        showProgress: () => {},
        hideProgress: () => {},
        setParams: () => {}
      },
      BackButton: {
        isVisible: false,
        onClick: () => {},
        offClick: () => {},
        show: () => {},
        hide: () => {}
      },
    },
  };
}
```

## src/lib/payments/stripeMock.ts
```typescript
// Stripe Mock for local development
export const createStripeMock = () => {
  return {
    loadStripe: () => Promise.resolve({
      confirmPayment: async () => {
        // Simulate successful payment
        return {
          paymentIntent: {
            status: 'succeeded',
            id: 'pi_mock_' + Math.random().toString(36).substring(7),
          },
          error: null,
        };
      },
      elements: () => ({
        getElement: () => ({
          clear: () => {},
          focus: () => {},
          mount: () => {},
          unmount: () => {},
        }),
        create: () => ({
          clear: () => {},
          focus: () => {},
          mount: () => {},
          unmount: () => {},
        }),
        submit: async () => {
          return { error: null };
        },
      }),
    }),
  };
};

export const stripeProvider = {
  isMock: true,
  createPayment: async (amount: number, currency: string = 'usd') => {
    // Mock payment creation
    return {
      clientSecret: 'pi_mock_' + Math.random().toString(36).substring(7) + '_secret_' + Math.random().toString(36).substring(7),
      id: 'pi_mock_' + Math.random().toString(36).substring(7),
    };
  },
  confirmPayment: async (clientSecret: string) => {
    // Mock payment confirmation
    return {
      success: true,
      paymentId: 'pi_mock_' + Math.random().toString(36).substring(7),
    };
  },
};
```

## src/lib/payments/paypalMock.ts
```typescript
// PayPal Mock for local development
export const paypalProvider = {
  isMock: true,
  createOrder: async (amount: number, currency: string = 'USD') => {
    // Mock order creation
    return {
      orderID: 'MOCK-' + Math.random().toString(36).substring(7).toUpperCase(),
      status: 'CREATED',
    };
  },
  captureOrder: async (orderID: string) => {
    // Mock order capture
    return {
      status: 'COMPLETED',
      purchase_units: [{
        payments: {
          captures: [{
            id: 'CAPTURE-' + Math.random().toString(36).substring(7).toUpperCase(),
            status: 'COMPLETED',
            amount: {
              currency_code: 'USD',
              value: '9.99',
            },
          }],
        },
      }],
    };
  },
  renderButtons: (container: HTMLElement) => {
    // Mock PayPal button rendering
    const button = document.createElement('button');
    button.textContent = 'Pay with PayPal (Mock)';
    button.style.backgroundColor = '#FFC439';
    button.style.color = '#003087';
    button.style.border = 'none';
    button.style.padding = '12px 24px';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    
    button.onclick = async () => {
      try {
        const order = await paypalProvider.createOrder(9.99);
        const capture = await paypalProvider.captureOrder(order.orderID);
        
        if (capture.status === 'COMPLETED') {
          alert('Mock PayPal payment successful!');
          // Trigger success callback
          const event = new CustomEvent('paypal-payment-success', {
            detail: { orderID: order.orderID, capture }
          });
          window.dispatchEvent(event);
        }
      } catch (error) {
        alert('Mock PayPal payment failed!');
      }
    };
    
    container.appendChild(button);
  },
};
```

## src/lib/payments/telegramStarsMock.ts
```typescript
// Telegram Stars Mock for local development
import { supabase } from '../supabase';

export const telegramStarsProvider = {
  isMock: true,
  createInvoice: async (amount: number, description: string) => {
    // Mock invoice creation
    return {
      invoiceLink: '#mock_invoice_' + Math.random().toString(36).substring(7),
      invoiceId: 'invoice_' + Math.random().toString(36).substring(7),
    };
  },
  processPayment: async (invoiceId: string, userId: string) => {
    // Mock payment processing and record in database
    try {
      const { data, error } = await supabase
        .from('payments_tx')
        .insert({
          id: Math.random().toString(36).substring(7),
          user_id: userId,
          provider: 'stars-mock',
          amount: 9.99,
          currency: 'XTR',
          status: 'completed',
          provider_tx_id: 'mock_tx_' + Math.random().toString(36).substring(7),
          metadata: {
            invoiceId,
            mock: true,
            timestamp: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording mock payment:', error);
        return { success: false, error: error.message };
      }

      return {
        success: true,
        paymentId: data.id,
        transactionId: data.provider_tx_id,
      };
    } catch (error) {
      console.error('Error processing mock payment:', error);
      return { success: false, error: 'Payment processing failed' };
    }
  },
  initiatePayment: async (amount: number, description: string, userId: string) => {
    // Mock payment initiation
    const invoice = await telegramStarsProvider.createInvoice(amount, description);
    
    // Simulate user approval after 1 second
    setTimeout(async () => {
      const result = await telegramStarsProvider.processPayment(invoice.invoiceId, userId);
      
      if (result.success) {
        // Trigger success event
        const event = new CustomEvent('telegram-stars-payment-success', {
          detail: { 
            invoiceId: invoice.invoiceId,
            paymentId: result.paymentId,
            transactionId: result.transactionId,
          }
        });
        window.dispatchEvent(event);
      }
    }, 1000);

    return {
      success: true,
      invoiceLink: invoice.invoiceLink,
      invoiceId: invoice.invoiceId,
    };
  },
  renderPaymentButton: (container: HTMLElement, amount: number, description: string, userId: string) => {
    // Mock Telegram Stars button rendering
    const button = document.createElement('button');
    button.innerHTML = '⭐ Pay with Telegram Stars (Mock)';
    button.style.backgroundColor = '#0088cc';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '12px 24px';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.gap = '8px';
    
    button.onclick = async () => {
      try {
        button.disabled = true;
        button.textContent = 'Processing...';
        
        const result = await telegramStarsProvider.initiatePayment(amount, description, userId);
        
        if (result.success) {
          button.textContent = 'Payment initiated (Mock)';
          alert(`Mock Telegram Stars payment initiated! Invoice: ${result.invoiceId}`);
        }
      } catch (error) {
        button.disabled = false;
        button.innerHTML = '⭐ Pay with Telegram Stars (Mock)';
        alert('Mock Telegram Stars payment failed!');
      }
    };
    
    container.appendChild(button);
  },
};
```

# RUN INSTRUCTIONS

## Start Local MVP
```bash
# Start everything with one command
make dev

# Or manually
chmod +x scripts/dev.sh
./scripts/dev.sh
```

## Access Points
- Frontend: http://localhost:5173
- Supabase API: http://localhost:54321
- Supabase Studio: http://localhost:54323
- Edge Functions: http://localhost:54321/functions/v1

## Test Edge Functions
```bash
# Test auto-experiment
curl -s http://localhost:54321/functions/v1/auto-experiment -X POST -d '{"client_request_id":"local-1"}' -H "Authorization: Bearer anon_dev_key"

# Test TRAE training
curl -s http://localhost:54321/functions/v1/trae-train -X POST -d '{"user_id":"00000000-0000-0000-0000-000000000001"}' -H "Authorization: Bearer anon_dev_key"
```

## Development Commands
```bash
# Stop all services
make down

# Reset database and seeds
make reset

# View logs
make logs

# Run tests
make test

# Run linting
make lint
```

# LOCAL CHECKLIST

- [ ] http://localhost:5173 opens successfully
- [ ] Quiz → Results → Coach flow works in offline mode
- [ ] auto-experiment edge function responds 200 locally
- [ ] trae-train edge function responds 200 locally
- [ ] Database contains local_user profile
- [ ] Local MVP Mission exists in database
- [ ] Feature flags are active: cognitive.graph.enabled, meta.insight.enabled
- [ ] Paywall Mock displays CTA and processes mock payments
- [ ] Payment transactions are recorded in payments_tx table
- [ ] Console shows UX telemetry events
- [ ] InlineToast displays status messages
- [ ] Telegram WebApp mock is active (check window.Telegram.WebApp)

# TROUBLESHOOTING

## Supabase CLI not found
**Issue**: `supabase: command not found`
**Fix**: Install Supabase CLI
```bash
# macOS
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/supabase Scoop bucket
scoop install supabase

# Or download from https://supabase.com/docs/guides/cli
```

## Port 54321 already in use
**Issue**: Port conflicts during startup
**Fix**: Kill existing processes or change ports
```bash
# Find and kill processes using port 54321
lsof -ti:54321 | xargs kill -9

# Or modify supabase/config.toml to use different ports
```

## Node.js version mismatch
**Issue**: Incompatible Node.js version
**Fix**: Check and update Node.js
```bash
# Check current version
node -v

# Expected: >=18.0.0
# If using nvm:
nvm use
nvm install 18
nvm use 18
```

## CSP blocks local functions
**Issue**: Content Security Policy blocks local Edge Functions
**Fix**: Update CSP headers for development
```html
<!-- In index.html or via meta tag -->
<meta http-equiv="Content-Security-Policy" content="connect-src http://localhost:* ws://localhost:*;">
```

## Database connection issues
**Issue**: Cannot connect to local Supabase
**Fix**: Check Supabase status and restart
```bash
# Check status
supabase status

# Restart services
supabase stop
supabase start

# Reset database if needed
make reset
```

## Environment variables not loading
**Issue**: Missing .env.local file
**Fix**: Copy and configure environment
```bash
# Copy example file
cp .env.local.example .env.local

# Edit with proper values
# Make sure VITE_TG_WEBAPP_MOCK=1 is set for local development
```

## Edge Functions not responding
**Issue**: Edge Functions return connection errors
**Check**: Functions are running and JWT is disabled for local dev
```bash
# Verify functions are running
supabase functions list

# Check function logs
supabase logs functions

# Ensure --no-verify-jwt is used in dev.sh