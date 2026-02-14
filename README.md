# Architecture

For this test I used a monolithic design just for simplicity. I decided to use Express because it's pretty to manage, Axios to make requests, zod to validate data and vitest for the tests.

The design patterns chosen to get the rate are:

- Strategy
- Registry

With these strategies it was really easier to create a service that stores different carrier or UPS classes so whenever is needed to add another carrier, you don't need to change UPS code, you only need to implement the CarrierService interface.

I also decided to create an interface to mock HTTP calls on tests. In the production code the class HttpClient uses Axios to handle requests.
