export default function RecommendationCard({ data }) {
  return (
    <div className="rec-card">
      <h2>AI Recommendation</h2>
      <p><strong>Style:</strong> {data.suggestedStyle}</p>
      <p><strong>Face Shape:</strong> {data.faceShape}</p>
      <p><strong>Price:</strong> {data.price} USDC</p>
      <p><strong>Complexity:</strong> {data.complexity}×</p>
    </div>
  );
}
