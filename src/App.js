import { useState, useRef, useEffect } from 'react';
import './App.css';

// ── NAVBAR ──
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

// ── HOME PAGE ──
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
            { title: 'AI Chat Support', desc: 'Talk to our AI mental health assistant anytime — it listens, offers guidance, and helps you find the right support for what you are going through.' },
          ].map(({ title, desc }) => (
            <div className="home-card" key={title}>
              <h3>{title}</h3>
              <p>{desc}</p>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── CHAT MODAL ───────────────────────────────────────────
function ChatModal({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm here to listen and support you. How are you feeling today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!open) return null;

  const sendMessage = async () => {
  if (!input.trim() || loading) return;

  const userMessage = input.trim();
  setInput('');

  const updatedMessages = [...messages, { role: 'user', text: userMessage }];
  setMessages(updatedMessages);
  setLoading(true);

  // build history excluding the first greeting message
  const history = updatedMessages
    .slice(1)
    .filter(msg => msg.text && msg.text.trim() !== '')
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content: `You are Mia, a warm and empathetic mental health support assistant. 
            You MUST read the entire conversation history and respond SPECIFICALLY to what the user just said.
            Rules:
            - NEVER repeat the same response twice
            - ALWAYS acknowledge what the user specifically said
            - Ask relevant follow-up questions based on their actual words
            - If they mention anxiety, address anxiety specifically
            - If they mention stress, address stress specifically
            - Keep responses under 3 sentences
            - Be warm, specific, and helpful`
          },
          ...history
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error?.message || 'Something went wrong.';
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error: ' + errMsg }]);
    } else {
      const reply = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    }

  } catch (err) {
    setMessages(prev => [...prev, { role: 'assistant', text: 'Connection failed: ' + err.message }]);
  }

  setLoading(false);
};

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="chat-box">
        <div className="chat-header">
          <div>
            <div className="chat-header-title">💬 Live Chat Support</div>
            <div className="chat-header-sub">AI Mental Health Assistant · Always here for you</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble chat-bubble-ai chat-typing">
              <span /><span /><span />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-row">
          <textarea
            className="chat-input"
            placeholder="Type your message... (Enter to send)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
          />
          <button className="chat-send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MODAL COMPONENT ──
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ───────────────────────────────────────────
function AboutPage() {
  return (
    <div className="page" id="About">
      <div className="about-hero-header">
        <h2>UNDERSTANDING MENTAL HEALTH</h2>
      </div>
      <div className="section about-section">
        <div className="about-intro">
          <p>Mental health is just as important as physical health — yet millions of people struggle in silence. We believe that access to information, community, and support can change lives. This platform exists to make that possible. </p>
        </div>
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
  const [modal, setModal] = useState(null);

  const modalContent = {
    article: {
      title: 'Managing Stress: A Practical Guide',
      body: (
        <>
          <p className="modal-tag">Mental Health · Wellness</p>
          <p className="modal-meta">By Dr. Maria Santos · April 1, 2026 · 6 min read</p>
          <p>We all experience stress. Whether it is a deadline at work, a difficult conversation with a family member, or just the general weight of everyday life — stress is something every person knows. The question is not whether we feel it, but how we handle it.</p>
          <h3>What Exactly Is Stress?</h3>
          <p>Stress is your body's natural response to demands or threats. When you perceive something as challenging, your brain triggers a "fight or flight" response — releasing hormones like adrenaline and cortisol. In small doses, this is actually helpful. But when stress becomes chronic, it starts to wear you down physically and mentally.</p>
          <div className="modal-tip">"You cannot always control what happens to you, but you can control how you respond to it."</div>
          <h3>Common Signs You Are Too Stressed</h3>
          <ul>
            <li>Trouble sleeping or sleeping too much</li>
            <li>Headaches, muscle tension, or stomach problems</li>
            <li>Feeling irritable or easily overwhelmed</li>
            <li>Difficulty concentrating or making decisions</li>
            <li>Withdrawing from friends and activities</li>
          </ul>
          <h3>5 Practical Ways to Manage Stress</h3>
          <p><strong>1. Identify Your Triggers</strong> — Keep a simple journal for one week. Write down what caused the stress and how you responded. Patterns will emerge.</p>
          <p><strong>2. Practice Deep Breathing</strong> — Try the 4-7-8 method: inhale for 4 seconds, hold for 7, exhale slowly for 8. Do this 3 times when you feel stressed.</p>
          <p><strong>3. Move Your Body</strong> — Even a 20-minute walk can significantly reduce cortisol levels.</p>
          <p><strong>4. Set Limits</strong> — Learn to say no. Overcommitting is one of the biggest drivers of chronic stress.</p>
          <p><strong>5. Talk to Someone</strong> — A trusted friend, family member, or mental health professional can help you process what you are going through.</p>
          <div className="modal-tip">If you need to talk to someone now, call our helpline at 123-456-7890.</div>
        </>
      ),
    },
    video: {
      title: 'Guided Relaxation Video',
      body: (
        <>
          <div className="modal-video-wrap">
            <iframe
              src="https://www.youtube.com/embed/inpok4MKVLM"
              title="5-Minute Guided Meditation"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="modal-meta" style={{ marginTop: '12px' }}>5-Minute Guided Meditation for Stress & Anxiety · Source: YouTube</p>
          <p style={{ marginTop: '10px' }}>This short guided meditation will help you slow down, breathe, and return to the present moment. You can replace this video by swapping the YouTube link in the code.</p>
        </>
      ),
    },
    guide: {
      title: 'Practical Wellness Guide',
      body: (
        <>
          <p className="modal-tag">Wellness · Self-Care</p>
          <p>This practical guide covers the key habits and strategies to support your overall mental wellness every day.</p>
          <h3>Daily Wellness Checklist</h3>
          <ul>
            <li>🌬️ 5 deep breaths every morning</li>
            <li>🚶 At least 20 minutes of movement</li>
            <li>📝 Write 3 things you are grateful for</li>
            <li>💧 Drink at least 8 glasses of water</li>
            <li>😴 Sleep at the same time every night</li>
            <li>📵 30 minutes phone-free before bed</li>
          </ul>
          <h3>Weekly Goals</h3>
          <ul>
            <li>Connect with one friend or family member</li>
            <li>Try one new healthy meal</li>
            <li>Spend time in nature at least once</li>
            <li>Reflect on your emotional state each Sunday</li>
          </ul>
          <div className="modal-tip">Consistency is more important than perfection. Small steps every day add up to big change.</div>
        </>
      ),
    },
    anxiety: {
      title: 'Anxiety Support',
      body: (
        <>
          <p className="modal-tag">Support · Anxiety</p>
          <p>Anxiety is your body's natural response to stress — but when it becomes overwhelming, it can affect your daily life. Here is how to manage it.</p>
          <h3>Understanding Anxiety</h3>
          <p>Anxiety disorders are the most common mental health condition. Feeling anxious sometimes is normal — it becomes a problem when it is constant and hard to control.</p>
          <h3>Practical Techniques</h3>
          <ul>
            <li><strong>4-7-8 Breathing:</strong> Inhale 4s, hold 7s, exhale 8s. Repeat 3 times.</li>
            <li><strong>5-4-3-2-1 Grounding:</strong> Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.</li>
            <li><strong>Challenge your thoughts:</strong> Ask "Is this thought realistic?"</li>
            <li><strong>Limit caffeine</strong> — it can make anxiety symptoms worse.</li>
            <li><strong>Regular exercise</strong> — even a short walk reduces anxiety significantly.</li>
          </ul>
          <h3>When to Seek Help</h3>
          <p>If anxiety is interfering with your daily life for more than a few weeks, please consider speaking with a mental health professional.</p>
          <div className="modal-tip">You are not your anxiety. It is something you experience — not something you are.</div>
        </>
      ),
    },
    depression: {
      title: 'Depression Help',
      body: (
        <>
          <p className="modal-tag">Support · Depression</p>
          <p>Depression is more than just feeling sad. It is a medical condition that affects how you think, feel, and function. You are not weak — and you are not alone.</p>
          <h3>Signs of Depression</h3>
          <ul>
            <li>Feeling empty, hopeless, or numb most of the day</li>
            <li>Losing interest in things you used to enjoy</li>
            <li>Changes in sleep or appetite</li>
            <li>Difficulty concentrating or making decisions</li>
            <li>Persistent fatigue or low energy</li>
            <li>Feelings of worthlessness or excessive guilt</li>
          </ul>
          <h3>What You Can Do</h3>
          <ul>
            <li>Reach out to a trusted friend, family member, or therapist</li>
            <li>Maintain a daily routine — even small habits help</li>
            <li>Get sunlight and gentle exercise each day</li>
            <li>Avoid isolating yourself — stay connected</li>
            <li>Consider speaking to a doctor about treatment options</li>
          </ul>
          <div className="modal-tip" style={{ borderColor: '#e05555', background: '#fff5f5', color: '#c0392b' }}>
            If you are in crisis, please call our helpline immediately: <strong>123-456-7890</strong>
          </div>
        </>
      ),
    },
    stress: {
      title: 'Stress Management',
      body: (
        <>
          <p className="modal-tag">Support · Stress</p>
          <p>Everyday stress is normal — but when it piles up without release, it can affect your health, relationships, and quality of life.</p>
          <h3>Quick Relief Techniques</h3>
          <ul>
            <li>🧘 10 minutes of meditation or quiet breathing</li>
            <li>🚶 A short walk outside — nature lowers cortisol</li>
            <li>🎵 Listen to calming or uplifting music</li>
            <li>📝 Write down what is stressing you</li>
          </ul>
          <h3>Long-Term Strategies</h3>
          <ul>
            <li>Break big tasks into smaller, manageable steps</li>
            <li>Set clear work/rest boundaries</li>
            <li>Prioritize 7 to 9 hours of sleep every night</li>
            <li>Stay socially connected — talk to people you trust</li>
            <li>Say no when you are already at capacity</li>
          </ul>
          <div className="modal-tip">You cannot pour from an empty cup. Taking care of yourself is not selfish — it is necessary.</div>
        </>
      ),
    },
  };

  return (
    <>
      <Modal open={!!modal} onClose={() => setModal(null)}>
        {modal && (
          <>
            <h2 className="modal-title">{modalContent[modal].title}</h2>
            {modalContent[modal].body}
          </>
        )}
      </Modal>

      <div className="page" id="Help">
        <div className="section help-section">
          <div className="help-header">
            <div className="help-header-icon">📚</div>
            <div>
              <h2>Resources & Support</h2>
              <p>Find helpful tools, articles, and support for your mental well-being.</p>
            </div>
          </div>

          <div className="help-block">
            <h3 className="help-block-title">Articles & Videos</h3>
            <div className="cards-row">
              <div className="resource-card">
                <span className="resource-type">Article Card</span>
                <p className="resource-title">Title: Managing Stress</p>
                <p className="resource-extra">An in-depth article on managing everyday stress.</p>
                <button className="btn-navy" onClick={() => setModal('article')}>View</button>
              </div>
              <div className="resource-card">
                <span className="resource-type">Video Card</span>
                <p className="resource-title">Title: Managing Stress</p>
                <p className="resource-extra">A short guided relaxation video.</p>
                <button className="btn-navy" onClick={() => setModal('video')}>View</button>
              </div>
              <div className="resource-card">
                <span className="resource-type">Guide Card</span>
                <p className="resource-title">Title: Managing Stress</p>
                <p className="resource-extra">A practical wellness guide.</p>
                <button className="btn-navy" onClick={() => setModal('guide')}>View</button>
              </div>
            </div>
          </div>

          <div className="help-block">
            <h3 className="help-block-title">Support Topics Section</h3>
            <div className="cards-row">
              <div className="resource-card">
                <span className="resource-type">Anxiety Support</span>
                <p className="resource-extra">Tips and resources to manage anxious thoughts.</p>
                <button className="btn-navy" onClick={() => setModal('anxiety')}>View</button>
              </div>
              <div className="resource-card">
                <span className="resource-type">Depression Help</span>
                <p className="resource-extra">Learn how to cope and find support.</p>
                <button className="btn-navy" onClick={() => setModal('depression')}>View</button>
              </div>
              <div className="resource-card">
                <span className="resource-type">Stress Management</span>
                <p className="resource-extra">Practical ways to reduce daily pressure.</p>
                <button className="btn-navy" onClick={() => setModal('stress')}>View</button>
              </div>
            </div>
          </div>

          <div className="help-block">
            <h3 className="help-block-title">Hotline & Emergency Support Section</h3>
            <div className="hotline-bar">
              <div className="hotline-field">National Helpline: 123-456-7890</div>
              <div className="hotline-field">Emergency: 911</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── BLOG PAGE ───
function BlogPage() {
  const [selectedPost, setSelectedPost] = useState(null);
  const posts = [
  {
    title: 'Understanding Anxiety: What It Is, What It Isn\'t, and How to Get Help',
    desc: 'Anxiety is one of the most common mental health experiences in the world...',
    tag: 'Anxiety · Mental Health',
    author: 'Dr. Jana Reyes',
    date: 'March 28, 2026',
    read: '7 min read',
    content: (
      <>
        <p>Anxiety is one of the most common mental health experiences in the world — and also one of the most misunderstood. People say "I'm so anxious" when they mean nervous, or they tell someone with an anxiety disorder to "just relax" as if it were that simple. It is not.</p>
        <h3>What Is Anxiety?</h3>
        <p>Anxiety is your body's natural alarm system. When you sense danger — real or imagined — your brain releases stress hormones that put your body on high alert. The problem comes when this alarm goes off too often or without a clear cause.</p>
        <h3>What Anxiety Is NOT</h3>
        <ul>
          <li>It is not just being nervous before a big presentation</li>
          <li>It is not something you can snap out of by thinking positively</li>
          <li>It is not a sign that you are weak or dramatic</li>
        </ul>
        <h3>How to Get Help</h3>
        <p>Anxiety disorders are highly treatable. Talk to a doctor or mental health professional, try therapy, consider medication if recommended, and practice daily coping strategies like deep breathing and regular exercise.</p>
      </>
    ),
  },
  {
    title: 'The Difference Between Sadness and Depression – And Why It Matters',
    desc: 'Sadness is a universal human emotion. It visits after loss, disappointment, failure...',
    tag: 'Depression · Awareness',
    author: 'Maria Cruz, Counselor',
    date: 'March 20, 2026',
    read: '6 min read',
    content: (
      <>
        <p>Sadness is a universal human emotion that fades with time. Depression is a clinical condition that persists and affects your sleep, appetite, energy, and sense of self-worth.</p>
        <h3>Signs It Might Be Depression</h3>
        <ul>
          <li>Feeling empty, hopeless, or numb most of the day</li>
          <li>Losing interest in things you used to love</li>
          <li>Changes in sleep or appetite</li>
          <li>Difficulty concentrating or making decisions</li>
          <li>Persistent fatigue or low energy</li>
        </ul>
        <h3>Why the Distinction Matters</h3>
        <p>When we confuse depression with sadness, we tell people the wrong things. Depression is not a mindset problem — it is a health condition that deserves proper care.</p>
      </>
    ),
  },
  {
    title: 'I Thought I Was "Fine." My Body Knew Otherwise.',
    desc: 'For years, I wore "I\'m fine" like a badge of honor. I was the friend who showed up...',
    tag: 'Personal Story · Burnout',
    author: 'Anonymous',
    date: 'March 15, 2026',
    read: '5 min read',
    content: (
      <>
        <p>For years, I wore "I'm fine" like a badge of honor. I was the friend who showed up for everyone — the one who held it together no matter what. I thought being fine meant being strong.</p>
        <h3>The Body Keeps Score</h3>
        <p>It started with headaches. Then came the tight feeling in my chest. I would wake up at 3am with my heart racing. Everything was "normal" on paper. But I was not normal. I was exhausted in a way that sleep could not fix.</p>
        <h3>What Finally Changed</h3>
        <p>A colleague stopped me in the hallway and said, "You look tired. Not the normal kind. Are you okay?" I almost said yes. Instead, I cried. That conversation led me to a therapist — and slowly, I found my way back.</p>
      </>
    ),
  },
  {
    title: '7 Grounding Techniques to Use When You Feel Overwhelmed',
    desc: 'We all have moments when our thoughts spiral, our chest tightens, and everything...',
    tag: 'Coping Skills · Anxiety',
    author: 'Kristine Manalo, Wellness Coach',
    date: 'March 10, 2026',
    read: '5 min read',
    content: (
      <>
        <p>We all have moments when our thoughts spiral and everything feels like too much. Grounding techniques interrupt the cycle of anxious thoughts and bring you back to the present moment.</p>
        <h3>1. The 5-4-3-2-1 Method</h3>
        <p>Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.</p>
        <h3>2. Box Breathing</h3>
        <p>Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat 4 times.</p>
        <h3>3. Cold Water</h3>
        <p>Splash cold water on your face to snap your attention back to your body.</p>
        <h3>4. Move Your Body</h3>
        <p>Jump, stretch, or shake your hands — physical movement interrupts the mental loop.</p>
        <h3>5. Name What You Feel</h3>
        <p>Say out loud: "I am feeling anxious right now, and that is okay." Naming reduces intensity.</p>
        <h3>6. Body Scan</h3>
        <p>Close your eyes and slowly move attention from your toes to your head.</p>
        <h3>7. Safe Place Visualization</h3>
        <p>Picture somewhere you feel completely calm. Engage all your senses for 2 to 3 minutes.</p>
      </>
    ),
  },
];

  return (
  <div className="page" id="Blog">

    {/* Slide-in Article Viewer */}
    <div className={`blog-slide ${selectedPost ? 'open' : ''}`}>
      <div className="blog-slide-inner">
        <button className="blog-slide-back" onClick={() => setSelectedPost(null)}>
          ← Back to Blog
        </button>
        {selectedPost && (
          <>
            <div className="blog-slide-tag">{selectedPost.tag}</div>
            <h1 className="blog-slide-title">{selectedPost.title}</h1>
            <div className="blog-slide-meta">{selectedPost.author} · {selectedPost.date} · {selectedPost.read}</div>
            <div className="blog-slide-content">
              {selectedPost.content}
            </div>
          </>
        )}
      </div>
    </div>

    {/* Normal Blog View */}
    <div className="section blog-section">
      <div className="blog-hero">
        <div className="blog-hero-content">
          <span className="blog-eyebrow">— MENTAL HEALTH BLOG</span>
          <h2>Words that help you<br /><em>feel less alone.</em></h2>
          <p>Thoughtful reads on anxiety, coping, healing, and the everyday experience of taking care of your mind. Written by professionals and real people alike.</p>
        </div>
      </div>

      <div className="blog-grid">
        {posts.map((post) => (
          <div className="blog-card" key={post.title}>
            <div className="blog-card-img">🖋️</div>
            <div className="blog-card-body">
              <h4>{post.title}</h4>
              <p>{post.desc}</p>
              <button className="btn-navy-sm" onClick={() => setSelectedPost(post)}>Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

// ── CONTACT PAGE ──
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

// ── GET HELP PAGE ──
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
const [allAnswers, setAllAnswers] = useState([]);
const [chatOpen, setChatOpen] = useState(false);

const quizQuestions = [
  { q: 'How have you been feeling lately?', opts: ['Great', 'Okay', 'Not so good', 'Really struggling'] },
  { q: 'How is your sleep?', opts: ['Very good', 'Average', 'Poor', 'Very poor'] },
  { q: 'Do you feel supported by people around you?', opts: ['Yes, very much', 'Somewhat', 'Not really', 'No'] },
  { q: 'How often do you feel anxious or stressed?', opts: ['Rarely', 'Sometimes', 'Often', 'Almost every day'] },
  { q: 'How would you rate your ability to enjoy daily activities?', opts: ['Very well', 'Somewhat', 'Barely', 'Not at all'] },
];

const getAdvice = (answers) => {
  const [feeling, sleep, support, anxiety, enjoyment] = answers;

  if (feeling === 'Really struggling' || sleep === 'Very poor' || support === 'No'
      || anxiety === 'Almost every day' || enjoyment === 'Not at all') {
    return { level: 'serious', text: "It sounds like you're going through a really tough time. Please consider reaching out to a mental health professional or calling our helpline at 123-456-7890. You don't have to face this alone." };
  }
  if (feeling === 'Not so good' || sleep === 'Poor' || support === 'Not really'
      || anxiety === 'Often' || enjoyment === 'Barely') {
    return { level: 'moderate', text: "Things seem a bit rough right now. Try to rest, talk to someone you trust, and consider speaking with a counselor if things don't improve soon." };
  }
  if (feeling === 'Great' && sleep === 'Very good' && support === 'Yes, very much') {
    return { level: 'good', text: "You seem to be in a great place! Keep maintaining your healthy habits and supporting the people around you too." };
  }
  return { level: 'okay', text: "You're doing okay! Keep an eye on your stress levels and make sure you're getting enough sleep and social connection." };
};

  return (
    <>
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
      <div className="page" id="GetHelp">
      <div className="section gethelp-section">
        {/* Emergency Banner */}
        <div className="emergency-banner">
          <span>🚨 NEED URGENT ASSISTANCE? WE'RE HERE TO HELP YOU.</span>
        </div>
        <button className="btn-callnow" onClick={() => window.location.href = 'tel:123-456-7890'}>CONTACT SUPPORT</button>

        {/* 3 Cards */}
        <div className="gethelp-cards">
          {/* Live Chat Support */}
          <div className="gethelp-card">
          <h3>Live Chat Support</h3>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Talk to our AI mental health assistant anytime. We're here to listen and support you.</p>
          <button className="btn-navy" style={{ width: '100%' }} onClick={() => setChatOpen(true)}>Start Chat</button>
        </div>

         {/* Self-Assessment Quiz */}
<div className="gethelp-card">
  <h3>Self-Assessment Quiz</h3>
  {quizStep === 0 && (
    <>
      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}> Take a short quiz to understand your emotional well-being.</p>
      <button className="btn-navy" onClick={() => setQuizStep(1)}>Start Quiz</button>
    </>
  )}
  {quizStep > 0 && quizStep <= quizQuestions.length && (
    <>
      <p className="quiz-q">Q{quizStep} of {quizQuestions.length}: {quizQuestions[quizStep - 1].q}</p>
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
        onClick={() => {
          setAllAnswers([...allAnswers, quizAnswer]);
          setQuizStep(quizStep + 1);
          setQuizAnswer(null);
        }}
        disabled={!quizAnswer}
      >{quizStep < quizQuestions.length ? 'Next' : 'Finish'}</button>
    </>
  )}
  {quizStep > quizQuestions.length && (() => {
    const advice = getAdvice(allAnswers);
    return (
      <>
        <p>✅ Thank you for completing the quiz!</p>
        <div style={{
          background: advice.level === 'good' ? '#d4edda' : advice.level === 'serious' ? '#f8d7da' : '#fff3cd',
          border: `1px solid ${advice.level === 'good' ? '#a8d5b5' : advice.level === 'serious' ? '#f5c6cb' : '#ffeaa7'}`,
          borderRadius: '8px',
          padding: '12px 14px',
          fontSize: '0.83rem',
          lineHeight: '1.6',
          color: advice.level === 'good' ? '#2d6a4f' : advice.level === 'serious' ? '#721c24' : '#856404'
        }}>
          {advice.text}
        </div>
        <button className="btn-navy" onClick={() => {
          setQuizStep(0);
          setQuizAnswer(null);
          setAllAnswers([]);
        }}>Retake</button>
      </>
    );
  })()}
</div>

          {/* Tip of the Day */}
        <div className="gethelp-card gethelp-card--highlight">
          <h3>Tip of the Day</h3>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            A new tip every day to support your mental well-being.
          </p>
          <div style={{
            textAlign: 'center',
            fontSize: '2rem',
            margin: '8px 0'
          }}>
            💡
          </div>
          <div style={{
            background: 'var(--blue-lighter)',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--navy)',
            lineHeight: '1.6',
          }}>
            {tips[new Date().getDate() % tips.length]}
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Come back tomorrow for a new tip!
          </p>
        </div>
        </div>
      </div>
    </div>
    </>
  );
}

// ── APP ROOT ──
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
