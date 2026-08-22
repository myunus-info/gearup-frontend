# API Integration

The frontend uses `services/*.ts` for REST calls, `hooks/*.ts` for TanStack Query
state, and `lib/request.ts` for the API base URL, bearer token, and error handling.
The default backend is `https://gearupapi.vercel.app/api/v1`.

## Endpoint Map

| Backend endpoint        | Method           | Frontend owner                                     | Auth           |
| ----------------------- | ---------------- | -------------------------------------------------- | -------------- |
| `/auth/login`           | POST             | `app/auth/_actions/loginAction.ts`                 | Public         |
| `/auth/register`        | POST             | `app/auth/_actions/registerAction.ts`              | Public         |
| `/auth/me`              | GET              | `services/auth.service.ts`, `useGetMe`             | Required       |
| `/auth/refresh-token`   | POST             | `lib/auth.ts`, `proxy.tsx`                         | Refresh cookie |
| `/gears`                | GET              | `gearService.listGears`, `useGears`                | Public         |
| `/gears/[id]`           | GET              | `gearService.getGearById`, `useGear`               | Public         |
| `/categories`           | GET              | `gearService.getGearCategories`, `useCategories`   | Public         |
| `/rentals`              | POST             | Checkout page via `useCreateOrder`                 | Required       |
| `/rentals`              | GET              | Customer order pages via `useMyOrders`             | Required       |
| `/rentals/[id]`         | GET              | `useOrder`                                         | Required       |
| `/payments/create`      | POST             | Checkout page via `paymentService.initiatePayment` | Required       |
| `/payments`             | GET              | Customer payments via `useMyPayments`              | Required       |
| `/payments`             | POST             | `paymentService.confirmPayment`                    | Required       |
| `/reviews`              | POST             | `ReviewDialog` via `useCreateReview`               | Required       |
| `/provider/gear`        | GET, POST        | Provider gear list and add page                    | Provider       |
| `/provider/gear/[id]`   | GET, PUT, DELETE | Provider gear service and edit/list actions        | Provider       |
| `/provider/orders`      | GET              | Provider overview and orders page                  | Provider       |
| `/provider/orders/[id]` | PATCH            | `OrderStatusModal`                                 | Provider       |
| `/admin/users`          | GET              | Admin overview and users page                      | Admin          |
| `/admin/users/[id]`     | PATCH            | Admin user status action                           | Admin          |
| `/admin/gear`           | GET              | Admin overview and gear page                       | Admin          |
| `/admin/rentals`        | GET              | Admin overview and rentals page                    | Admin          |

## Request Details

- Gear filters use `category`, `brand`, `price`, `condition`, `search`, `sortBy`,
  `sortOrder`, `page`, and `limit` query parameters.
- Rental creation sends `{ startDate, endDate, items: [{ gearItemId, quantity }] }`.
- Payment creation sends `{ orderId, paymentMethod }`, where `paymentMethod` is
  `SSLCOMMERZ` or `STRIPE`, and redirects to the returned `paymentUrl`.
- Payment confirmation sends `orderId`, `tranId`, and `status` as query parameters
  to the confirmation POST endpoint.
- Review creation sends `{ rentalOrderId, gearItemId, rating, comment }`.
- Provider gear mutations send the gear form fields; order status sends the selected
  rental status. Admin user status sends the selected `ACTIVE` or `SUSPENDED` value.

## Response Usage

The API returns `{ statusCode, success, message, data, meta }`. Query hooks expose
`data`, while mutations return the complete response so pages can inspect `success`,
`message`, and payment gateway data. Public gear and category requests use
`requiresAuth: false`; protected requests automatically receive the access token.

## Payment Flow

1. Checkout creates a rental with `POST /rentals`.
2. Checkout creates the gateway session with `POST /payments/create` when needed.
3. The browser follows the returned gateway URL.
4. The success callback confirms the transaction with `POST /payments`.
5. Customer orders and payments are refreshed through TanStack Query after payment
   confirmation.
