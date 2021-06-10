# Zarinpal
a Package to Control Your Zarinpal Payments

## Any Docs?
Nope, it's pretty basic, setup your Zarinpal Gate at first:
```js
const ZarinPal = require("@setar/zarinpal");
const MyGate = new ZarinPal('MY-MERCHANT-CODE-IN-HERE', false /* do i want sandbox option? */);
```

so about the functions, we got 4 of them

**Request** function makes a new Code and URL for a User ready to pay!
**Information** function returns status of a Code to see if the user got paid their payment or not
**FailedPayments** function returns a list of all The Codes that never got their payments finished
**EnableCode** function makes a Code available to use again for user and returns the api status code

**P.S:** all the functions returns promise.
