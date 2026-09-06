import * as config from "./public-contact.json";

/** Public contact identity, shared by browser, server, structured data and asset scripts. */
export const publicContact = Object.freeze({
  phone: config.phoneDisplay,
  phoneE164: config.phoneE164,
  phoneHref: `tel:${config.phoneE164}`,
  smsHref: `sms:${config.phoneE164}`,
  email: config.email,
  emailHref: `mailto:${config.email}`,
});
