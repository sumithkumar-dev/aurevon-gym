// The official `razorpay` npm package does not ship its own TypeScript
// type declarations, and no `@types/razorpay` package exists on
// DefinitelyTyped. This shorthand ambient declaration silences the
// "could not find a declaration file" error; `lib/razorpay/client.ts`
// immediately wraps the untyped import in an explicit local interface so
// no `any` leaks any further than that one file.
declare module "razorpay";
