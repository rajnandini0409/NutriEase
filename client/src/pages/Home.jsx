import { Link } from 'react-router-dom';

const benefits = [
  ['⏱', 'Made for busy schedules', 'Find ideas that fit the time you actually have.'],
  ['₹', 'Budget-aware choices', 'Explore meals with clear, estimated costs.'],
  ['✦', 'AI-powered suggestions', 'Get ideas tailored to your preferences and routine.']
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">HEALTHY EATING, MADE PRACTICAL</span>
            <h1>Good food for your <em>busy life.</em></h1>
            <p className="hero-description">Affordable, quick meal ideas for people who work hard and still want to take care of themselves.</p>
            <div className="hero-actions">
              <Link className="button" to="/planner">Build my meal plan <span>↗</span></Link>
              <Link className="text-link" to="/meals">Explore meals →</Link>
            </div>
            <div className="hero-proof"><span className="proof-dot"></span> Practical meals. Flexible choices. Less guesswork.</div>
          </div>
          <div className="hero-visual">
            <div className="hero-circle"></div>
            <div className="food-emoji">🥗</div>
            <div className="floating-card top-card"><span>⏱</span><div><b>15 minutes</b><small>Quick meal ideas</small></div></div>
            <div className="floating-card bottom-card"><span>₹</span><div><b>Budget first</b><small>Options for your pocket</small></div></div>
            <div className="visual-caption">Nourish yourself, one meal at a time.</div>
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading"><span className="eyebrow">WHY NUTRIEASE</span><h2>Healthy eating should fit real life.</h2><p>Long shifts and tight schedules shouldn't make meal planning harder.</p></div>
        <div className="benefit-grid">{benefits.map(([icon, title, description]) => <article className="benefit-card" key={title}><div className="benefit-icon">{icon}</div><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>
      <section className="callout">
        <div className="container callout-inner"><div><span className="eyebrow">YOUR ROUTINE, YOUR FOOD</span><h2>Start with what works for you.</h2><p>Set your budget, food preference and available time to get meal ideas that feel achievable.</p></div><Link className="button button-light" to="/profile">Set my preferences →</Link></div>
      </section>
    </main>
  );
}
