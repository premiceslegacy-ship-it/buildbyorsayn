import type Stripe from "stripe";

export async function hasStripeHistory(stripe: Stripe, email: string) {
  const escapedEmail = email.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
  const query = `receipt_email:\"${escapedEmail}\"`;
  let searchPage: string | undefined;
  do {
    const receiptPayments = await stripe.paymentIntents.search({
      query,
      limit: 100,
      ...(searchPage ? { page: searchPage } : {}),
    });
    if (receiptPayments.data.some((payment) => payment.status !== "canceled")) {
      return { hasPayment: true, hasSubscription: false };
    }
    searchPage = receiptPayments.next_page ?? undefined;
  } while (searchPage);

  let customerCursor: string | undefined;
  do {
    const customers = await stripe.customers.list({
      email,
      limit: 100,
      ...(customerCursor ? { starting_after: customerCursor } : {}),
    });

    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 1 });
      if (subscriptions.data.length > 0) {
        return { hasPayment: false, hasSubscription: true };
      }

      let paymentCursor: string | undefined;
      do {
        const payments = await stripe.paymentIntents.list({
          customer: customer.id,
          limit: 100,
          ...(paymentCursor ? { starting_after: paymentCursor } : {}),
        });
        if (payments.data.some((payment) => payment.status !== "canceled")) {
          return { hasPayment: true, hasSubscription: false };
        }
        const lastPayment = payments.data[payments.data.length - 1];
        paymentCursor = payments.has_more && lastPayment ? lastPayment.id : undefined;
        if (payments.has_more && !paymentCursor) throw new Error("stripe_payment_pagination_invalid");
      } while (paymentCursor);
    }

    const lastCustomer = customers.data[customers.data.length - 1];
    customerCursor = customers.has_more && lastCustomer ? lastCustomer.id : undefined;
    if (customers.has_more && !customerCursor) throw new Error("stripe_customer_pagination_invalid");
  } while (customerCursor);

  return { hasPayment: false, hasSubscription: false };
}
