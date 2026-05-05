const axios = require('axios');

const STYLE_CATALOG = {
  'Long Layers':  { price: 150, complexity: 1.2 },
  'Pixie Cut':    { price: 80,  complexity: 1.0 },
  'Box Braids':   { price: 250, complexity: 2.5 },
  'Bob Cut':      { price: 100, complexity: 1.1 },
  'Locs':         { price: 300, complexity: 3.0 },
};

/**
 * Calls the AI face-analysis endpoint and maps the result to a style + price.
 * @param {string} imageBase64 - Base64-encoded user photo
 * @returns {{ suggestedStyle: string, price: number, complexity: number }}
 */
async function getHairRecommendation(imageBase64) {
  // POST to AI microservice (Python/TensorFlow face-mesh model)
  const { data } = await axios.post(process.env.AI_API_URL + '/analyze', {
    image: imageBase64,
  });

  // data = { faceShape: 'Oval', suggestedStyle: 'Long Layers' }
  const style = data.suggestedStyle;
  const rec   = STYLE_CATALOG[style];

  if (!rec) throw new Error(`Unknown style: ${style}`);

  console.log(`AI → ${style} for ${data.faceShape} face | ${rec.price} USDC`);
  return { suggestedStyle: style, ...rec };
}

/**
 * Build the Soroban contract call args after AI recommendation.
 * @param {string} customerAddr
 * @param {string} stylistAddr
 * @param {object} recommendation - output of getHairRecommendation
 */
function buildBookingArgs(customerAddr, stylistAddr, recommendation) {
  return {
    customer:   customerAddr,
    stylist:    stylistAddr,
    token_addr: process.env.USDC_CONTRACT_ID,
    // price in stroops (USDC has 7 decimals on Stellar)
    amount:     BigInt(Math.round(recommendation.price * 1e7)),
  };
}

module.exports = { getHairRecommendation, buildBookingArgs };
