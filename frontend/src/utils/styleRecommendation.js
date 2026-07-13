const STYLE_CATALOG = {
  'Long Layers':  { price: 150, complexity: 1.2 },
  'Pixie Cut':    { price: 80,  complexity: 1.0 },
  'Box Braids':   { price: 250, complexity: 2.5 },
  'Bob Cut':      { price: 100, complexity: 1.1 },
  'Locs':         { price: 300, complexity: 3.0 },
};

/**
 * Get style recommendation and pricing for the selected style.
 * @param {string} styleSelection - User-selected style name
 * @returns {{ suggestedStyle: string, price: number, complexity: number }}
 * @throws Error if style is not found in catalog
 */
export function getStyleRecommendation(styleSelection) {
  const rec = STYLE_CATALOG[styleSelection];
  if (!rec) throw new Error(`Unknown style: ${styleSelection}`);
  
  console.log(`→ ${styleSelection} | ${rec.price} USDC`);
  return { suggestedStyle: styleSelection, ...rec };
}

/**
 * Build booking arguments for Soroban contract.
 * @param {string} customerAddr - Customer Stellar address
 * @param {string} stylistAddr - Stylist Stellar address
 * @param {object} recommendation - Output of getStyleRecommendation
 * @returns {{ customer: string, stylist: string, token_addr: string, amount: string }}
 */
export function buildBookingArgs(customerAddr, stylistAddr, recommendation) {
  return {
    customer:   customerAddr,
    stylist:    stylistAddr,
    token_addr: process.env.REACT_APP_USDC_CONTRACT_ID,
    // price in stroops (USDC has 7 decimals on Stellar)
    amount:     BigInt(Math.round(recommendation.price * 1e7)).toString(),
  };
}

/**
 * Get list of available styles.
 * @returns {string[]} Array of style names
 */
export function getAvailableStyles() {
  return Object.keys(STYLE_CATALOG);
}
