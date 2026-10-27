import { useState } from 'react';
import MealCard from '../components/MealCard.jsx';
import { getRecommendations } from '../services/api.js';
import { demoMeals } from '../data/demoMeals.js';

function readPreferences() {
  try { return { budget: 150, foodPreference: 'vegetarian', availableCookingTime: 15, ...JSON.parse(localStorage.getItem('nutriease-preferences') || '{}') }; }
  catch { return { budget: 150, foodPreference: 'vegetarian', availableCookingTime: 15 }; }
}

export default function Planner() {
  const [prefs, setPrefs] = useState(readPreferences);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await getRecommendations(prefs);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not generate recommendations.');
      // Keep a useful demo experience even if the backend is not running.
      const filtered = demoMeals.filter(m =>
        m.estimatedCost <= Number(prefs.budget || 150) &&
        m.preparationTime <= Number(prefs.availableCookingTime || 30) &&
        (prefs.foodPreference === 'vegetarian' ? !m.dietaryTags.includes('eggetarian') :
          prefs.foodPreference === 'vegan' ? m.dietaryTags.includes('vegan') :
          prefs.foodPreference === 'eggetarian' ? true : true)
      ).slice(0, 3);
      setResult({ recommendations: filtered, explanation: 'Demo suggestions are shown because the backend could not be reached. Start the backend for API-based recommendations.' });
    } finally { setLoading(false); }
  };

  return <main className="container section page-main">
    <span className="eyebrow">YOUR PERSONAL MEAL ASSISTANT</span><h1 className="page-title">A plan that works as hard as you do.</h1>
    <p className="page-intro">Set your limits and get practical meal suggestions. Estimated costs vary by location and ingredients.</p>
    <form className="planner-form" onSubmit={generate}>
      <label>Budget per day (₹)<input type="number" min="1" required value={prefs.budget} onChange={e => setPrefs({ ...prefs, budget: e.target.value })} /></label>
      <label>Food preference<select value={prefs.foodPreference} onChange={e => setPrefs({ ...prefs, foodPreference: e.target.value })}><option value="vegetarian">Vegetarian</option><option value="eggetarian">Eggetarian</option><option value="vegan">Vegan</option><option value="non-vegetarian">Non-vegetarian</option></select></label>
      <label>Available prep time<select value={prefs.availableCookingTime} onChange={e => setPrefs({ ...prefs, availableCookingTime: e.target.value })}><option value="5">5 min</option><option value="10">10 min</option><option value="15">15 min</option><option value="30">30 min</option></select></label>
      <label>Allergies to avoid<input value={prefs.allergies || ''} onChange={e => setPrefs({ ...prefs, allergies: e.target.value })} placeholder="e.g. peanuts" /></label>
      <button className="button" disabled={loading}>{loading ? 'Planning your meals…' : '✨ Generate meal ideas'}</button>
    </form>
    {error && <p className="status-note">{error}</p>}
    {result && <section className="results-section">
      <h2>Your meal suggestions</h2><p>{result.explanation || 'Suggestions based on your preferences.'}</p>
      {Array.isArray(result.recommendations) && result.recommendations.length ? <div className="meal-grid">{result.recommendations.map((meal, i) => <MealCard key={meal._id || meal.name || i} meal={meal} />)}</div> : <div className="empty-state">No matching meals yet. Try a higher budget or longer prep time.</div>}
      {result.notes && <p className="status-note">{result.notes}</p>}
    </section>}
    <p className="disclaimer">NutriEase provides general meal ideas, not medical nutrition advice. If you have a medical condition or significant food allergy, confirm dietary choices with a qualified professional.</p>
  </main>;
}
