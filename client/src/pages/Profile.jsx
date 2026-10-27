import { useState } from 'react';

const initial = { budget: '150', foodPreference: 'vegetarian', availableCookingTime: '15', cookingAccess: 'basic kitchen', allergies: '' };

export default function Profile() {
  const [form, setForm] = useState(() => {
    try { return { ...initial, ...JSON.parse(localStorage.getItem('nutriease-preferences') || '{}') }; }
    catch { return initial; }
  });
  const [saved, setSaved] = useState(false);
  const update = e => { setForm({ ...form, [e.target.name]: e.target.value }); setSaved(false); };
  const submit = e => {
    e.preventDefault();
    localStorage.setItem('nutriease-preferences', JSON.stringify(form));
    setSaved(true);
  };

  return <main className="container section page-main narrow">
    <span className="eyebrow">A LITTLE ABOUT YOU</span><h1 className="page-title">Make it fit your life.</h1>
    <p className="page-intro">Tell NutriEase what is realistic for your routine. You can change these preferences anytime.</p>
    <form className="form-card" onSubmit={submit}>
      <label>Daily food budget (₹)<input name="budget" type="number" min="1" required value={form.budget} onChange={update} /></label>
      <label>Food preference<select name="foodPreference" value={form.foodPreference} onChange={update}><option value="vegetarian">Vegetarian</option><option value="eggetarian">Eggetarian</option><option value="vegan">Vegan</option><option value="non-vegetarian">Non-vegetarian</option></select></label>
      <label>Maximum preparation time<select name="availableCookingTime" value={form.availableCookingTime} onChange={update}><option value="5">5 minutes</option><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="30">30 minutes</option></select></label>
      <label>Cooking access<select name="cookingAccess" value={form.cookingAccess} onChange={update}><option value="no kitchen">No kitchen</option><option value="basic kitchen">Basic kitchen</option><option value="full kitchen">Full kitchen</option></select></label>
      <label>Allergies or ingredients to avoid (optional)<textarea name="allergies" value={form.allergies} onChange={update} placeholder="e.g. peanuts, milk" rows="3" /></label>
      <button className="button" type="submit">Save preferences</button>
      {saved && <p className="success-note" role="status">Preferences saved in this browser. You can now use them in the AI meal planner.</p>}
    </form>
  </main>;
}
