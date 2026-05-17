import { RazorpayOptions, RazorpayFailureResponse } from "./type";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (
        event: string,
        handler: (response: RazorpayFailureResponse) => void,
      ) => void;
    };
  }
}
