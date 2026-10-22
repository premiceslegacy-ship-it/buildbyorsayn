"use server";

import { readCheckoutBaseLinks } from "@/lib/checkoutLinks";

/** Liens de base Fondations et LE COFFRE. Le complément n'est jamais exposé : il passe par /checkout/upgrade. */
export async function getCheckoutUrls() {
    return readCheckoutBaseLinks();
}
