import { useState } from 'react';
import './App.css';

// ── NAVBAR ──────────────────────────────────────────────
function Navbar({ activePage, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ['Home', 'About', 'Help', 'Blog', 'Contact'];

  return (
    <nav className="navbar">
      <div className="nav-logo">MHA</div>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </button>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {links.map(l => (
          <li key={l}>
            <button
              className={`nav-link ${activePage === l ? 'active' : ''}`}
              onClick={() => { navigate(l); setMenuOpen(false); }}
            >{l}</button>
          </li>
        ))}
      </ul>
      <button className="nav-gethelp" onClick={() => navigate('GetHelp')}>
        [Get Help]
      </button>
    </nav>
  );
}

// ── HOME PAGE ────────────────────────────────────────────
function HomePage({ navigate }) {
  return (
    <div className="page" id="Home">
      <div className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>You're <span className="hero-red">Not</span> Alone.<br />Support Is Here.</h1>
          <p>A safe space for mental health support,<br />guidance, and understanding.</p>
          <div className="hero-btns">
            <button className="btn-outline" onClick={() => navigate('GetHelp')}>Get Support</button>
            <button className="btn-white" onClick={() => navigate('About')}>Learn More</button>
          </div>
        </div>
      </div>

      <div className="section home-cards-section">
        <h2 className="section-title-dark">HOW WE CAN HELP</h2>
        <div className="cards-row">
          {[
            { title: 'Support & Counseling', desc: 'Access professional and confidential guidance to help you cope with stress, anxiety, or other challenges in a safe, understanding environment.' },
            { title: 'Resources & Guides', desc: 'Explore curated articles, tips, and practical tools to improve mental wellness, build resilience, and support your personal growth.' },
            { title: 'Community Support', desc: 'Connect with peers who understand what you\'re going through, share experiences, and find encouragement in a supportive online community.' },
          ].map(({ title, desc }) => (
            <div className="home-card" key={title}>
              <h3>{title}</h3>
              <p>{desc}</p>
              <button className="btn-navy">Read More</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ───────────────────────────────────────────
function AboutPage() {
  return (
    <div className="page" id="About">
      <div className="section about-section">
        <h2 className="section-title-dark">UNDERSTANDING MENTAL HEALTH</h2>
        <div className="about-grid">
          {[
            { title: "What's Mental Health", desc: "Mental health includes our emotional, psychological, and social well-being. It affects how we think, feel, and act in daily life. Taking care of mental health is just as important as taking care of physical health." },
            { title: 'Why It Matters', desc: 'Good mental health helps us cope with stress, build strong relationships, and make healthy choices. When mental health is neglected, it can affect work, school, and personal life.' },
            { title: 'Our Mission', desc: 'Our mission is to provide a safe, supportive, and judgment-free space where individuals can learn, share, and find help for their mental well-being.' },
            { title: 'Breaking the Stigma', desc: 'Many people hesitate to talk about mental health due to fear or misunderstanding. We aim to break this stigma by encouraging open conversations and promoting awareness.' },
          ].map(({ title, desc }) => (
            <div className="about-card" key={title}>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>

        <div className="contact-bar">
          <span className="contact-bar-title">Contact Information</span>
          <div className="contact-bar-row">
            <div className="contact-field">mhagroup@gmail.com</div>
            <div className="contact-field">09123456789</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HELP PAGE ────────────────────────────────────────────
function HelpPage() {
  return (
    <div className="page" id="Help">
      <div className="section help-section">
        {/* Header */}
        <div className="help-header">
          <div className="help-header-icon">📚</div>
          <div>
            <h2>Resources & Support</h2>
            <p>Find helpful tools, articles, and support for your mental well-being.</p>
          </div>
        </div>

        {/* Articles & Videos */}
        <div className="help-block">
          <h3 className="help-block-title">Articles & Videos</h3>
          <div className="cards-row">
            {[
              { type: 'Article Card', title: 'Managing Stress', action: 'View', extra: null },
              { type: 'Video Card', title: 'Managing Stress', action: 'View', extra: 'A short guided relaxation video.' },
              { type: 'Guide Card', title: 'Managing Stress', action: 'Download', extra: 'Download a practical wellness guide.' },
            ].map(({ type, title, action, extra }) => (
              <div className="resource-card" key={type}>
                <span className="resource-type">{type}</span>
                <p className="resource-title">Title: {title}</p>
                {extra && <p className="resource-extra">{extra}</p>}
                <button className="btn-navy">{action}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Support Topics */}
        <div className="help-block">
          <h3 className="help-block-title">Support Topics Section</h3>
          <div className="cards-row">
            {[
              { title: 'Anxiety Support', desc: 'Tips and resources to manage anxious thoughts.' },
              { title: 'Depression Help', desc: 'Learn how to cope and find support.' },
              { title: 'Stress Management', desc: 'Practical ways to reduce daily pressure.' },
            ].map(({ title, desc }) => (
              <div className="resource-card" key={title}>
                <span className="resource-type">{title}</span>
                <p className="resource-extra">{desc}</p>
                <button className="btn-navy">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* Hotline */}
        <div className="help-block">
          <h3 className="help-block-title">Hotline & Emergency Support Section</h3>
          <div className="hotline-bar">
            <div className="hotline-field">National Helpline: 123-456-7890</div>
            <div className="hotline-field">Emergency: 911</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BLOG PAGE ────────────────────────────────────────────
function BlogPage() {
  const posts = [
    { title: 'Understanding Anxiety: What It Is, What It Isn\'t, and How to Get Help', desc: 'Anxiety is one of the most common mental health experiences in the world...' },
    { title: 'The Difference Between Sadness and Depression – And Why It Matters', desc: 'Sadness is a universal human emotion. It visits after loss, disappointment, failure...' },
    { title: 'I Thought I Was "Fine." My Body Knew Otherwise.', desc: 'For years, I wore "I\'m fine" like a badge of honor. I was the friend who showed up...' },
    { title: '7 Grounding Techniques to Use When You Feel Overwhelmed', desc: 'We all have moments when our thoughts spiral, our chest tightens, and everything...' },
  ];

  return (
    <div className="page" id="Blog">
      <div className="section blog-section">
        <div className="blog-hero">
          <div className="blog-hero-content">
            <span className="blog-eyebrow">— MENTAL HEALTH BLOG</span>
            <h2>Words that help you<br /><em>feel less alone.</em></h2>
            <p>Thoughtful reads on anxiety, coping, healing, and the everyday experience of taking care of your mind. Written by professionals and real people alike.</p>
          </div>
        </div>

        <div className="blog-grid">
          {posts.map(({ title, desc }) => (
            <div className="blog-card" key={title}>
              <div className="blog-card-img">🧠</div>
              <div className="blog-card-body">
                <h4>{title}</h4>
                <p>{desc}</p>
                <button className="btn-navy-sm">Read More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── CONTACT PAGE ─────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="page" id="Contact">
      <div className="section contact-section">
        <div className="contact-hero">
          <div className="contact-hero-text">
            <h2>Let's Get in Touch!</h2>
            <p>Have a question or need assistance? Reach out to us via email, phone, or the contact form below. We're eager to assist you!</p>
          </div>
          <div className="contact-hero-img">💬</div>
        </div>

        <div className="contact-body">
          <div className="contact-info-box">
            <h3>Contact Info</h3>
            <p>✉️ mhagroup@gmail.com</p>
            <p>📞 09123456789</p>
            <p>📍 Bohol, Philippines</p>
          </div>

          <div className="contact-form-box">
            <h3>Contact Form</h3>
            {submitted && <div className="form-success">Message sent! We'll get back to you soon. 💙</div>}
            <label>Name</label>
            <input
              placeholder="Enter Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <label>Email</label>
            <input
              placeholder="Enter Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <label>Message</label>
            <textarea
              placeholder="Enter Message"
              rows={4}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
            />
            <button className="btn-navy" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── GET HELP PAGE ────────────────────────────────────────
function GetHelpPage() {
  const [tips] = useState([
    'Take deep breaths',
    'Go for a walk',
    'Talk to a trusted person',
    'Write your thoughts',
    'Drink a glass of water',
    'Listen to calming music',
  ]);
  const [tipIndex, setTipIndex] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const quizQuestions = [
    { q: 'How have you been feeling lately?', opts: ['Great', 'Okay', 'Not so good', 'Really struggling'] },
    { q: 'How is your sleep?', opts: ['Very good', 'Average', 'Poor', 'Very poor'] },
    { q: 'Do you feel supported by people around you?', opts: ['Yes, very much', 'Somewhat', 'Not really', 'No'] },
  ];

  return (
    <div className="page" id="GetHelp">
      <div className="section gethelp-section">
        {/* Emergency Banner */}
        <div className="emergency-banner">
          <span>🚨</span> If you are in immediate danger, please contact emergency services.
        </div>
        <button className="btn-callnow">CALL NOW</button>

        {/* 3 Cards */}
        <div className="gethelp-cards">
          {/* Talk to Someone */}
          <div className="gethelp-card">
            <h3>Talk to Someone</h3>
            <div className="talk-item">💬 Live Chat Support <button className="btn-navy-sm">Learn More</button></div>
            <div className="talk-item">📞 Phone Support <button className="btn-navy-sm">Learn More</button></div>
            <div className="talk-item">🌐 Online Counseling <button className="btn-navy-sm">Learn More</button></div>
          </div>

          {/* Self-Assessment Quiz */}
          <div className="gethelp-card">
            <h3>Self-Assessment Quiz</h3>
            {quizStep === 0 && (
              <>
                <p>Take a short quiz to understand your emotional well-being.</p>
                <button className="btn-navy" onClick={() => setQuizStep(1)}>Start Quiz</button>
              </>
            )}
            {quizStep > 0 && quizStep <= quizQuestions.length && (
              <>
                <p className="quiz-q">{quizQuestions[quizStep - 1].q}</p>
                <div className="quiz-opts">
                  {quizQuestions[quizStep - 1].opts.map(opt => (
                    <button
                      key={opt}
                      className={`quiz-opt ${quizAnswer === opt ? 'selected' : ''}`}
                      onClick={() => setQuizAnswer(opt)}
                    >{opt}</button>
                  ))}
                </div>
                <button
                  className="btn-navy"
                  onClick={() => { setQuizStep(quizStep + 1); setQuizAnswer(null); }}
                  disabled={!quizAnswer}
                >{quizStep < quizQuestions.length ? 'Next' : 'Finish'}</button>
              </>
            )}
            {quizStep > quizQuestions.length && (
              <>
                <p>✅ Thank you! Consider speaking with a professional for personalized support.</p>
                <button className="btn-navy" onClick={() => { setQuizStep(0); setQuizAnswer(null); }}>Retake</button>
              </>
            )}
          </div>

          {/* Quick Tips */}
          <div className="gethelp-card gethelp-card--highlight">
            <h3>Quick Tips</h3>
            <ul className="tips-list">
              {tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
            <button className="btn-navy" onClick={() => setTipIndex((tipIndex + 1) % tips.length)}>
              Daily Tips 💡
            </button>
            <div className="daily-tip">Tip of the moment: <em>{tips[tipIndex]}</em></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ─────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState('Home');

  const navigate = (page) => {
    setActivePage(page);
    setTimeout(() => {
      const el = document.getElementById(page);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="app">
      <Navbar activePage={activePage} navigate={navigate} />
      <div className="pages-wrapper">
        <HomePage navigate={navigate} />
        <AboutPage />
        <HelpPage />
        <BlogPage />
        <ContactPage />
        <GetHelpPage />
      </div>
      <footer className="footer">
        <p>© 2026 IPT Group 10 · Mental Health Awareness Platform</p>
      </footer>
    </div>
  );
}
