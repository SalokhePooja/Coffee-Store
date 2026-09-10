# Coffee Store Frontend

Frontend application for the Coffee Store assignment, built with Angular 21.

Customers can browse drinks, customize them with toppings, manage a cart, apply promotions, and place orders. An administration area supports drink and topping CRUD operations.

---

## Tech Stack

- Angular 21
- TypeScript
- Angular Signals
- Angular Router
- Reactive Forms
- RxJS
- Functional HTTP interceptors
- Jasmine/Karma

API requests are handled by a mock API interceptor and persisted in browser `localStorage`.

---

## Angular Features Used

- Standalone components without NgModules
- Angular Signals and computed signals for reactive local state
- Angular Router for customer and administration routes
- Reactive Forms for catalog create/edit workflows
- Built-in `@if` template control flow
- Component inputs and outputs for reusable shared components
- Dependency injection with `providedIn: 'root'` services
- Functional HTTP interceptors for mock API, errors, and loading state
- RxJS observables for HTTP requests and asynchronous operations
- Angular CLI production builds and Karma test execution

---

## Project Structure

```text
src/
  app/
    core/
      constants/
      interceptors/
      models/
      services/
      utils/
    features/
      customer/
      admin/
    shared/
      components/
      ui/
      validators/
    state/
      cart.store.ts
    app.config.ts
    app.routes.ts
  assets/
    coffee-logo.svg
  styles.scss
```

---

## Reusable Components

Shared UI components are used across the customer and administration features:

- `CatalogListComponent` displays drinks and toppings with configurable actions.
- `CatalogFormComponent` provides the validated create/edit form for drinks and toppings.
- `CartComponent` renders cart items, quantities, totals, promotions, and order actions.
- `SnackbarComponent` provides global success and error feedback.

This keeps feature pages focused on orchestration and avoids duplicating catalog, cart, form, and feedback UI logic.

---

## Architecture Decisions

### State Management

Cart state is managed by `CartStore` using Angular Signals.

- The cart is the single source of truth for the customer UI.
- Optimistic cart updates keep the interface responsive.
- Failed mutations reload the cart and display an error notification.
- Cart success notifications are emitted only after the backend response succeeds.

#### Why Signals Instead of NgRx?

Signals were selected because the application has a small and focused shared-state requirement: one active cart and its calculated summary.

- Signals provide reactive updates with minimal boilerplate.
- The store remains easy to read and test without actions, reducers, selectors, or effects.
- Angular components can consume state directly through readonly signals.
- The cart state does not require the advanced event orchestration or large-scale state normalization that NgRx is designed for.
- Signals are a built-in Angular feature, so no additional state-management dependency is needed.

NgRx could be introduced if the application grows to include multiple complex state domains, extensive event history, sophisticated effects, or state requirements shared across many feature areas.

### API Layer

HTTP communication is encapsulated in dedicated services:

- `DrinkService`
- `ToppingService`
- `CartService`
- `OrderService`

The `mockApiInterceptor` provides REST-style mock endpoints and stores data under the `coffee-store-mock-db-v1` localStorage key.

### Routing

The application has two routes:

- `/` - customer ordering experience
- `/admin` - drink and topping administration

Unknown routes redirect to the customer page.

### Forms and Validation

Reactive forms are used for drink and topping create/edit operations.

Validation includes:

- Required fields
- Trimmed names between 2 and 50 characters
- Positive prices
- Prices with at most two decimal places
- Duplicate catalog-name checks

### Feedback and Error Handling

Functional interceptors provide:

- Mock API responses
- HTTP error handling
- Global request loading state

`SnackbarService` displays success and error messages. `LoadingService` tracks concurrent requests and drives the global loading indicator.

---

## Promotion Responsibility

According to the assignment, the frontend does not need to calculate promotions when the backend provides the calculated cart summary. The real frontend therefore treats the backend response as the source of truth for subtotal, discount, promotion name, and total.

Because this project uses a browser-local mock backend, the mock API must simulate that backend behavior. Promotion calculation is centralized in `src/app/core/utils/promotion.util.ts` and is used by both the mock API and the cart store's optimistic UI state so the displayed values remain consistent before the backend response arrives.

The mock backend applies these rules:

- Orders with a subtotal of EUR 12 or more receive a 25% discount.
- Orders containing three or more drinks receive the cheapest drink, including toppings, free.
- If both promotions apply, only the promotion producing the lower final total is selected.

Totals are rounded to two decimal places.

---

## Installation

```bash
npm install
```

---

## Running the Application

```bash
npm start
```

Open http://localhost:4200 in your browser.

There is no separate mock API server to start.

---

## Configuration

The application currently uses a browser-local mock API interceptor.

To connect to a real backend:

1. Remove the mock API interceptor registration.
2. Configure a backend API base URL.
3. Update service endpoint configuration.
4. Replace mock persistence with real REST endpoints.

No additional configuration is required for local development.

---

## Building

```bash
npm run build
```

The production build is written to `dist/coffee-store`.

---

## Running Linting

Run ESLint:

```bash
npm run lint
```
---

## Running Tests

Run the unit tests in ChromeHeadless:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Run Karma interactively:

```bash
npm test
```

### Current Test Coverage

The current suite contains 14 unit-test specifications, all passing in the latest ChromeHeadless run.

Coverage includes:

- `DrinkService`: fetching, creating, updating, and deleting drinks
- `ToppingService`: fetching, creating, updating, and deleting toppings
- `CartService`: cart retrieval and cart mutation requests
- `OrderService`: order submission behavior
- `CartStore`: cart state updates and promotion summaries
- Shared catalog form: validation and successful form submission behavior

The suite focuses on critical service, state, validation, and shared-component behavior. A percentage coverage report and end-to-end test suite are not currently configured.

---

## Main Screens

Customer Area
- Drink Catalog
- Shopping Cart
- Order Placement

Administration Area
- Drink Management
- Topping Management

---

## Features Implemented

### Customer

- Browse drinks and toppings
- Select toppings
- Add customized drinks to the cart
- Update item quantities
- Remove cart items
- View subtotal, promotion, discount, and total
- Place orders
- Receive global loading and snackbar feedback

### Administration

- Create, edit, and delete drinks
- Create, edit, and delete toppings
- Validate names and prices
- Clear forms after successful create/edit operations
- Display updated lists and feedback messages

---

## Data Persistence

The mock API initializes default drinks, toppings, cart, and orders on first use. Changes are persisted in browser localStorage:

```text
coffee-store-mock-db-v1
```

To reset the mock data, remove this key from the browser's localStorage and reload the application.

---

## Assumptions

- Authentication and authorization are out of scope.
- A single active cart (`cart-1`) is used.
- The mock interceptor represents the backend for local development.
- Backend cart summaries are treated as the source of truth after API responses.
- Only one promotion is applied to an order.

---

## Known Limitations

- The mock API is browser-local and is not suitable for production.
- Test coverage is focused on critical services and shared components.
- No end-to-end test suite is included.
- No authentication or authorization is implemented.
- No server-side pagination is required for the current catalog size.

---

## Future Improvements

- Add a real backend and database.
- Add authentication and role-based authorization.
- Add end-to-end tests.
- Add an order-history view.
- Add accessibility and WCAG verification.
- Add localization and currency configuration.
- Add Docker support.

---

## AI Usage

AI tools were used to accelerate implementation and review:

- Angular boilerplate and refactoring assistance
- Architecture exploration
- Unit-test examples
- Documentation drafting

All generated code was reviewed, adapted to the project conventions, and validated with the Angular build and test commands.

---

## Development Environment

- Visual Studio Code
- Node.js
- npm
- Angular CLI 21
