import { Component } from "react";
import "./Home.css";

export class Home extends Component {
  render() {
    return (
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">Code Faster. Think Smarter.</span>
            </div>
            <h1 className="hero-title">
              Master Coding
              <span className="gradient-text"> Without the Mouse</span>
            </h1>
            <p className="hero-description">
              Transform your coding workflow by learning essential keyboard
              shortcuts and keybindings. Practice with real code challenges and
              become a more efficient developer.
            </p>
            <div className="hero-buttons">
              <a href="/Editor" className="btn btn-primary">
                Start Practicing
              </a>
              <a href="/Shortcuts" className="btn btn-secondary">
                Learn Shortcuts
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="code-preview">
              <div className="code-window">
                <div className="window-controls">
                  <span className="control-dot red"></span>
                  <span className="control-dot yellow"></span>
                  <span className="control-dot green"></span>
                </div>
                <div className="code-content">
                  <div className="code-line">
                    <span className="code-keyword">function</span>{" "}
                    <span className="code-function">calculate</span>
                    <span className="code-bracket">()</span> {"{"}
                  </div>
                  <div className="code-line indent">
                    <span className="code-keyword">const</span>{" "}
                    <span className="code-variable">result</span> ={" "}
                    <span className="code-number">42</span>;
                  </div>
                  <div className="code-line indent">
                    <span className="code-keyword">return</span>{" "}
                    <span className="code-variable">result</span>;
                  </div>
                  <div className="code-line">{"}"}</div>
                  <div className="cursor-blink">|</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple, focused practice that makes you a better developer.
            </p>
          </div>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3 className="step-title">Choose a Challenge</h3>
                <p className="step-description">
                  Select from a variety of code modification challenges that
                  test your keyboard navigation skills.
                </p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3 className="step-title">Practice with Keyboard</h3>
                <p className="step-description">
                  Use only keyboard shortcuts to navigate, select, and modify
                  code. No mouse required!
                </p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3 className="step-title">Track Your Progress</h3>
                <p className="step-description">
                  View detailed statistics on your speed, accuracy, and
                  improvement over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Code Faster?</h2>
            <p className="cta-description">
              Join developers who are mastering keyboard-first coding and
              boosting their productivity.
            </p>
            <div className="cta-buttons">
              <a href="/Editor" className="btn btn-primary btn-large">
                Start Your Journey
              </a>
              <a href="/Shortcuts" className="btn btn-outline btn-large">
                Explore Shortcuts
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Home;
