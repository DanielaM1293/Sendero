# Sendero

Plataforma de reservas de experiencias con guías locales en Colombia. Next.js 15 (App Router), Tailwind 3, Framer Motion, Embla Carousel y Stripe.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000
```

Sin claves de Stripe el checkout funciona en **modo demostración** (no se cobra nada):

- `4242 4242 4242 4242` aprueba el pago.
- `4000 0000 0000 0002` muestra un rechazo.
- Cualquier fecha futura y CVC de 3 dígitos.

## Activar Stripe real

1. `cp .env.example .env.local` y completa las claves de prueba de Stripe.
2. Reinicia el servidor. El checkout pasa solo al `PaymentElement` de Stripe (tarjetas y los métodos que tengas habilitados).
3. Webhook local: `stripe listen --forward-to localhost:3000/api/webhook/stripe`.

## Qué incluye

| Área | Detalle |
| --- | --- |
| Hero | Paisaje SVG que cambia con la hora del día (amanecer, mediodía, atardecer, noche), parallax por ratón y scroll, y una experiencia sugerida para cada momento |
| Carruseles | Experiencias (Embla, drag, filtros animados, barra de progreso) y opiniones (loop, autoplay que se pausa al pasar el cursor) |
| Personalización | Quiz "Tu sendero" (ritmo, intereses, grupo, nombre). Reordena el catálogo, muestra % de afinidad y saluda por nombre |
| Reserva | Calendario con cupos reales por API, precio dinámico (temporada alta y fines de semana), extras, personas limitadas por cupo |
| Carrito | Drawer con cantidades, códigos promo (`SENDERO10`, `VIAJA15`, `BIENVENIDO`) y persistencia |
| Checkout | Datos y pago en 2 pasos, validación, tarjeta animada en modo demo, Stripe Payment Element en modo real |
| Confirmación | Confeti, pase con QR, descarga `.ics`, lista de qué llevar, impresión |
| i18n | ES/EN con diccionario tipado (`lib/dict.ts`) |
| Moneda | USD/COP (tasa en `NEXT_PUBLIC_COP_RATE`) |
| Tema | Claro/oscuro con transición circular (View Transitions) |
| Extras | Favoritos, catálogo con búsqueda/filtros/orden, 404, `prefers-reduced-motion`, foco visible |

## API

| Ruta | Función |
| --- | --- |
| `GET /api/availability?slug&month` | Cupos y factor de precio por día |
| `POST /api/promo` | Valida un código |
| `POST /api/checkout/intent` | Revalida el carrito en el servidor y crea el PaymentIntent |
| `POST /api/orders` | Verifica el pago con Stripe y crea la reserva |
| `POST /api/webhook/stripe` | Webhook firmado |

El servidor **recalcula siempre el precio** (`lib/server.ts`) y nunca confía en el total del cliente.

## Para llevarlo a producción

- Disponibilidad (`lib/availability.ts`) y pedidos (`lib/server.ts`) son simulados en memoria. Cámbialos por tu base de datos y descuenta cupos al confirmar.
- Envía el correo de confirmación en `app/api/orders/route.ts` y en el webhook.
- Los precios se cobran en USD. Si cobras en COP, ajusta `STRIPE_CURRENCY` y el cálculo del monto.
- Las ilustraciones son SVG generativos (`components/Scene.tsx`). Cámbialas por fotos reales con `next/image`.
- Contenido, textos y precios viven en `lib/data.ts` y `lib/dict.ts`.

## Estructura

```
app/            rutas, layout y API
components/     Hero, carruseles, Quiz, Booking, Checkout, Confirmation...
lib/            datos, i18n, precios, disponibilidad, estado global
```
https://sendero-six.vercel.app/
