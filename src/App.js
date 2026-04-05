import './App.css';

function App() {
  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">LOGO</div>
        <ul className="nav-links">
          <li>Home Page</li>
          <li>About Page</li>
          <li>Help Page</li>
          <li>Blog Page</li>
          <li>Contact Page</li>
        </ul>
      </nav>

      {/* SECTIONS */}
      <section className="section">
        <h3>Live Chat | Phone Support | Online Counseling</h3>
        <div className="row">
          <div className="card">Live Chat</div>
          <div className="card">Phone Support</div>
          <div className="card">Online Counseling</div>
        </div>
      </section>

      <section className="section">
        <h3>Pages</h3>
        <div className="row">
          <div className="card">Home Page</div>
          <div className="card">About Page</div>
          <div className="card">Help Page</div>
          <div className="card">Blog Page</div>
          <div className="card">Contact Page</div>
        </div>
      </section>

      <section className="section">
        <h3>Videos | Articles | Topics</h3>
        <div className="row">
          <div className="card">Videos</div>
          <div className="card">Articles</div>
          <div className="card">Depression</div>
          <div className="card">Stress</div>
          <div className="card">Anxiety</div>
        </div>
      </section>

      <section className="section">
        <h3>Support & Resources</h3>
        <div className="row">
          <div className="card">Support</div>
          <div className="card">Resources</div>
          <div className="card">Community</div>
        </div>
      </section>

      <section className="section">
        <h3>Start Quiz & Daily Tips</h3>
        <div className="row">
          <div className="card">Start Quiz</div>
          <div className="card">Daily Tips</div>
        </div>
      </section>

    </div>
  );
}

export default App;