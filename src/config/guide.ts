// The Fukutsuji Method PDF, sold on Gumroad. Change the link or price here and
// every buy box and card on the site follows.
export const GUIDE_URL = 'https://simpleseniorfitness.gumroad.com/l/fukutsuji-method';
export const GUIDE_PRICE = '$6';
export const GUIDE_TITLE = 'The Fukutsuji Method: A 14-Day Program';

/** Gumroad link with UTM tags, so Gumroad shows which page and box sold. */
export const guideLink = (medium: string, campaign: string) =>
  `${GUIDE_URL}?utm_source=site&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;
