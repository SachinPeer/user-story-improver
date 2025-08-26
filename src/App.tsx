import React, { useMemo, useState } from 'react';
import { BAD_STORY, REFERENCE_STORY, scoreUserStory } from './scoring';
import { generateCertificatePDF } from './certificate';

export default function App(): JSX.Element {
  const [name, setName] = useState('');
  const [draft, setDraft] = useState(BAD_STORY);
  const { score, breakdown, feedback } = useMemo(() => scoreUserStory(draft), [draft]);

  return (
    <div className="container">
      <header className="header">
        <h1>User Story Improver</h1>
        <p>Rewrite the bad user story. Your changes are scored automatically out of 100.</p>
      </header>

      <section className="panel">
        <h2>Bad user story</h2>
        <pre className="bad-story">{BAD_STORY}</pre>
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
          </div>
          <button
            className="button"
            onClick={() => generateCertificatePDF(name, score)}
            disabled={score === 0}
          >
            Download certificate
          </button>
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

      <section className="panel">
        <h2>Reasonable reference user story</h2>
        <pre className="ref-story">{REFERENCE_STORY}</pre>
      </section>

      <footer className="footer">
        <small>Share this app link with anyone. Built with React + Vite.</small>
      </footer>
    </div>
  );
} 