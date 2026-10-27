export default function MealCard({ meal }) {
  return (
    <article className="meal-card">
      <div className="meal-art" aria-hidden="true">{meal.name.toLowerCase().includes('egg') ? '🍳' : meal.name.toLowerCase().includes('salad') ? '🥗' : meal.name.toLowerCase().includes('paneer') ? '🌯' : meal.name.toLowerCase().includes('poha') ? '🥣' : '🍲'}</div>
      <div className="meal-content">
        <div className="meal-meta"><span>⏱ {meal.preparationTime} min</span><span>₹{meal.estimatedCost}</span></div>
        <h3>{meal.name}</h3>
        <p>{meal.description}</p>
        <div className="tags">{(meal.dietaryTags || []).slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div>
      </div>
    </article>
  );
}
