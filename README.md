## Install and run project

To run project you have to use node version in `.nvmrc`. You can install the project just using `npm install` and run it using `npm run dev`.

## Environment variables:

You can check all variables required in .env.example.

- PORT: this is where our backend is going to run.
- UPS_PASSWORD: password from UPS account.
- UPS_USERNAME: username from UPS acocunt.
- UPS_ACCOUNT_NUMBER: account number get from UPS developer.
- UPS_BASE_URL: UPS base api url used to make api calls.

## 🛠️ Available Scripts

All useful commands are ready in the `package.json` to automate your workflow:

| Script         | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| `build`        | Compiles TypeScript (`tsc`).                                        |
| `start`        | Runs the compiled app (`node dist/index.js`).                       |
| `dev`          | Starts the server in watch mode (`tsx watch src/index.ts`).         |
| `type-check`   | Runs a check on file types                                          |
| `lint`         | Runs ESLint to check the code.                                      |
| `lint:fix`     | Runs ESLint and automatically fixes errors.                         |
| `format`       | Applies Prettier to the entire project.                             |
| `format:check` | Applies Prettier to check if is required to format some files.      |
| `prepare`      | Husky hook: installs Git hooks.                                     |
| `test`         | Runs the tests and control vitest from console                      |
| `test:run`     | Runs all tests inside **tests** folder                              |
| `test:ui`      | Runs the tests and display an UI                                    |
| `coverage`     | Runs the test and checks places of the code that hasn't been tested |

---

## Libraries used:

- Express
- Supertest
- Vitest
- Axios
- Zod

---

## Services

This backend integrates a number of services with a set of different responsabilities to implement more functionalities and facilitate testing:

- CarrierServicesStrategy: work as intermediary structure that allows implementing multiple carrier services without overwritting UPSService. This service uses strategy and registry design patterns to achieve it which gives us a lot of flexibility in production and testing environments by just adding a carrier and it by an id. You can find it at: `/src/libs/CarrierServices/CarrierServices.ts`
- UPSService: UPSService implements CarrierService interface and get rates from UPS endpoint. You can find it at: `/src/libs/CarrierServices/UPSService.ts`
- UpsAuth: UpsAuth works as a cache for authentication tokens from UPS. This structure acquire, reuses, check and refresh tokens. You can find it at: `/src/libs/UpsAuth.ts`.
- HttpClient: this is an intermediary implementation of a HttpClient used to make API calls. This is very useful for testing because we don't need to make real API calls, we only need to mock them if we use HttpClient interface. You can find it at: `/src/libs/HttpClient.ts`.

---

## Types and interfaces:

You can find all interesting types and interfaces used in our repository inside the following route: `/src/types`.

- **src/types/ShippingRate.ts**: Contains the core domain types for shipping rates. Key interfaces include `RateQuery` (input), `NormalizedRate` (standardized output), and `RateResponse` (raw UPS interface).
- **src/types/UpsTypes.ts**: Includes types related to UPS API authentication and specific error handling, such as `OAuthUpsCredentials` and `UpsResponseErrors`.
- **src/types/carrierService.ts**: Defines the `CarrierService` interface that any carrier implementation (strategy) must follow.
- **src/types/express.ts**: Extension types for Express.js (like `RequestValidatedAPI` and `ResponseAPI`) to support typed requests and responses, ensuring type safety in controllers.
- **src/types/httpClient.ts**: Abstraction for HTTP requests (`HttpClient` interface) to decouple the application from specific libraries like Axios.
- **src/types/utils.ts**: Generic utility types used across the application, like `MakeOptional`.

## What would I improve over time?

I'd improve error handling in the following cases:

- In UpsAuth, in some exceptional cases, I'd might be fetching more than one token at the same time and I should avoid something like that happenig. Also, I should add a retry logic if there are much requests being made in that instant.
- In UPSService I must check text return errors from UPS to handle them more gracefully.
- Adding more tests is always better
