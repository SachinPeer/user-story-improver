export type ScoreBreakdown = {
  structure: number;
  acceptanceCriteria: number;
  clarity: number;
  invest: number;
  penalties: number;
};

export function scoreUserStory(storyRaw: string): { score: number; breakdown: ScoreBreakdown; feedback: string[] } {
  const story = storyRaw.trim();
  const feedback: string[] = [];

  // Structure: As a, I want, so that
  let structure = 0;
  const hasAsA = /\bAs a\b/i.test(story);
  const hasIWant = /\bI want\b/i.test(story);
  const hasSoThat = /\bso that\b/i.test(story);
  structure = [hasAsA, hasIWant, hasSoThat].filter(Boolean).length / 3 * 30; // up to 30
  if (!hasAsA) feedback.push("Consider starting with 'As a <role>'");
  if (!hasIWant) feedback.push("Add 'I want <capability>'");
  if (!hasSoThat) feedback.push("Explain the value with 'so that <benefit>'");

  // Acceptance criteria: Given/When/Then lines
  const lines = story.split(/\n+/).map(l => l.trim());
  const gwtCount = lines.filter(l => /^(Given|When|Then)/i.test(l)).length;
  const acceptanceCriteria = Math.min(3, gwtCount) / 3 * 25; // up to 25
  if (gwtCount === 0) feedback.push("Add acceptance criteria with Given/When/Then");

  // Clarity: avoid ambiguous words and extreme length
  const ambiguousWords = [
    'quickly','easily','etc','and/or','some','many','various','optimize','improve','better','nice','fast'
  ];
  const ambiguousMatches = ambiguousWords.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(story)).length;
  let clarity = 25; // start full marks
  clarity -= Math.min(ambiguousMatches, 5) * 3; // -3 per ambiguous word up to -15
  const wordCount = story.split(/\s+/).filter(Boolean).length;
  if (wordCount < 12) { clarity -= 5; feedback.push('Story is too short; add detail.'); }
  if (wordCount > 200) { clarity -= 5; feedback.push('Story is too long; make it concise.'); }
  clarity = Math.max(0, Math.min(25, clarity));

  // INVEST signals
  let invest = 20;
  // Independent/Small: check single outcome
  const andCount = (story.match(/\band\b/gi) || []).length;
  if (andCount > 5) { invest -= 5; feedback.push('May include multiple features; try to split.'); }
  // Testable: requires acceptance criteria
  if (gwtCount === 0) { invest -= 5; }
  // Valuable: presence of 'so that'
  if (!hasSoThat) { invest -= 5; }
  invest = Math.max(0, invest);

  // Penalties
  let penalties = 0;
  if (/should|could|might/i.test(story)) {
    penalties += 5;
    feedback.push("Prefer clear statements over weak words like 'should/could/might'.");
  }

  let score = Math.round(structure + acceptanceCriteria + clarity + invest - penalties);
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    breakdown: { structure, acceptanceCriteria, clarity, invest, penalties },
    feedback
  };
}

export const BAD_STORY = `As a user I want the app to be better and faster etc.
It should do many things and be nice.
`;

export const REFERENCE_STORY = `As a registered shopper, I want to save items to a wishlist so that I can purchase them later without searching again.

Acceptance Criteria:
Given I am on a product page and I am logged in,
When I click the "Add to wishlist" button,
Then the item appears in my wishlist and the wishlist icon shows the updated count.
`; 