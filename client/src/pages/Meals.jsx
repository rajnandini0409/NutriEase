import { useEffect, useMemo, useState } from 'react';
import MealCard from '../components/MealCard.jsx';
import { getMeals } from '../services/api.js';
import { demoMeals } from '../data/demoMeals.js';

export default function Meals() {
  const [meals, setMeals] = useState(demoMeals);
  const [search, setSearch] = useState('');
  const [budget, setBudget] = useState('100');
  const [maxTime, setMaxTime] = useState('30');
  const [status, setStatus] = useState('Showing sample meals while we connect to the server.');

  useEffect(() => {
    getMeals().then(data => {
      if (Array.isArray(data.meals) && data.meals.length) {
        setMeals(data.meals);
        setStatus('Meals loaded from the database.');
      } else {
        setStatus('Showing sample meals. Add meal records to MongoDB to customize this list.');
      }
    }).catch(() => setStatus('Backend not connected yet — showing sample meals.'));
  }, []);

  const filtered = useMemo(() => meals.filter(meal =>
    meal.name.toLowerCase().includes(search.toLowerCase()) &&
    Number(meal.estimatedCost) <= Number(budget || 100000) &&
    Number(meal.preparationTime) <= Number(maxTime || 100000)
  ), [meals, search, budget, maxTime]);

  return <main className="container section page-main">
    <span className="eyebrow">THE MEAL LIBRARY</span><h1 className="page-title">Find your next good meal.</h1>
    <p className="page-intro">Simple ideas, with time and estimated cost up front.</p>
    <div className="filters">
      <label>Search meals<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Try poha, paneer..." /></label>
      <label>Max cost (₹)<input type="number" min="0" value={budget} onChange={e => setBudget(e.target.value)} /></label>
      <label>Max prep time (min)<input type="number" min="1" value={maxTime} onChange={e => setMaxTime(e.target.value)} /></label>
    </div>
    <p className="status-note">{status}</p>
    {filtered.length ? <div className="meal-grid">{filtered.map(meal => <MealCard key={meal._id || meal.name} meal={meal} />)}</div> : <div className="empty-state">No meals match those filters. Try a higher budget or longer preparation time.</div>}
  </main>;
}
