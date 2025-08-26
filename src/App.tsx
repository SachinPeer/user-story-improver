import React, { useMemo, useState } from 'react';
import { BAD_STORY, REFERENCE_STORY, scoreUserStory, STORIES, StoryCategory, DEFAULT_CATEGORY, PASS_THRESHOLD } from './scoring';
import { generateCertificatePDF } from './certificate';

export default function App(): JSX.Element {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<StoryCategory>(DEFAULT_CATEGORY);
  const [draft, setDraft] = useState(STORIES[DEFAULT_CATEGORY].bad);
  const [certificateIssued, setCertificateIssued] = useState(false);

  const { score, breakdown, feedback } = useMemo(() => scoreUserStory(draft), [draft]);
  const passed = score >= PASS_THRESHOLD;

  function handleCategoryChange(next: StoryCategory) {
    setCategory(next);
    setDraft(STORIES[next].bad);
    setCertificateIssued(false);
  }

  function handleGenerateCertificate() {
    generateCertificatePDF(name, score);
    setCertificateIssued(true);
  }

  function handleNewTest() {
    // Rotate to a different category to keep it fresh; if at end, wrap
    const keys: StoryCategory[] = ['General','UI','Frontend','API','Backend'];
    const idx = keys.indexOf(category);
    const next = keys[(idx + 1) % keys.length];
    handleCategoryChange(next);
    setName('');
  }

  return (
    <div className="container">
      <header className="header">
        <h1>User Story Improver</h1>
        <p>Rewrite the bad user story. Your changes are scored automatically out of 100.</p>
      </header>

      <section className="panel">
        <h2>Choose focus</h2>
        <div className="field">
          <span>Category</span>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value as StoryCategory)}
          >
            <option value="General">General</option>
            <option value="UI">UI</option>
            <option value="Frontend">Frontend</option>
            <option value="API">API</option>
            <option value="Backend">Backend</option>
          </select>
        </div>
      </section>

      <section className="panel">
        <h2>Bad user story</h2>
        <pre className="bad-story">{STORIES[category].bad}</pre>
      </section>

      <section className="panel">
        <h2>Your improved user story</h2>
        <label className="field">
          <span>Your name (for certificate)</span>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <textarea
          className="editor"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={12}
        />
        <div className="score-row">
          <div className="score">
            <span className="score-number">{score}</span>
            <span className="score-label">/ 100</span>
            <span className="score-label" style={{ marginLeft: 8, color: passed ? '#22c55e' : '#ef4444' }}>
              {passed ? 'Pass' : 'Fail'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="button"
              onClick={handleGenerateCertificate}
              disabled={score === 0}
            >
              Download certificate
            </button>
            <button className="button" onClick={handleNewTest}>New test</button>
          </div>
        </div>
        <details className="details">
          <summary>See breakdown</summary>
          <ul>
            <li>Structure: {Math.round(breakdown.structure)} / 30</li>
            <li>Acceptance criteria: {Math.round(breakdown.acceptanceCriteria)} / 25</li>
            <li>Clarity: {Math.round(breakdown.clarity)} / 25</li>
            <li>INVEST: {Math.round(breakdown.invest)} / 20</li>
            <li>Penalties: -{Math.round(breakdown.penalties)}</li>
          </ul>
          {feedback.length > 0 && (
            <>
              <h3>Suggestions</h3>
              <ul>
                {feedback.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </>
          )}
        </details>
      </section>

      {certificateIssued && (
        <section className="panel">
          <h2>Reasonable reference user story</h2>
          <pre className="ref-story">{STORIES[category].reference}</pre>
        </section>
      )}

      <footer className="footer">
        <small>Share this app link with anyone. Built with React + Vite.</small>
      </footer>
    </div>
  );
} 