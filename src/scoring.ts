export type ScoreBreakdown = {
  structure: number;
  acceptanceCriteria: number;
  clarity: number;
  invest: number;
  penalties: number;
};

export const PASS_THRESHOLD = 70;

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

export type StoryCategory = 'General' | 'UI' | 'Frontend' | 'API' | 'Backend';

export const STORIES: Record<StoryCategory, { bad: string; reference: string }> = {
  General: {
    bad: `As a user I want the system to be better and easy etc so that things are improved.
It should do many things and be nice.
`,
    reference: `As a project member, I want to receive a daily digest email summarizing my assigned tasks so that I can plan my day efficiently.

Acceptance Criteria:
Given I have at least one open task,
When the daily digest is generated at 8am local time,
Then I receive an email listing my tasks grouped by due date and priority.
`
  },
  UI: {
    bad: `As a user I want the screens to look nice and modern etc so that it's better.
It should be fast and beautiful and have animations and stuff.
`,
    reference: `As a shopper, I want the product detail page to display images in a responsive gallery so that I can clearly view products on any screen size.

Acceptance Criteria:
Given I open a product detail page on a mobile device,
When I swipe the image carousel,
Then the next image appears smoothly and the thumbnails update to reflect the current image.
`
  },
  Frontend: {
    bad: `As a user I want the app to load quickly and just work with less bugs etc.
It should be reactive and nice and use the latest frameworks.
`,
    reference: `As a returning user, I want client-side caching for my dashboard data so that the page loads instantly on revisits within 5 minutes.

Acceptance Criteria:
Given I have already loaded my dashboard within the last 5 minutes,
When I navigate back to the dashboard,
Then the dashboard data is served from cache and refreshed in the background without blocking the UI.
`
  },
  API: {
    bad: `As an admin I want an API that does everything quickly so data is synced and stuff.
It should be secure and powerful.
`,
    reference: `As an admin, I want an authenticated POST /v1/users/{id}/roles endpoint so that I can assign or revoke roles without database access.

Acceptance Criteria:
Given I have a valid admin token,
When I POST to /v1/users/123/roles with body { add: ['editor'], remove: ['viewer'] },
Then the response is 200 with the updated roles list and the change is recorded in audit logs.
`
  },
  Backend: {
    bad: `As a system I want the backend to be scalable and super fast and microservices etc.
It should handle many things.
`,
    reference: `As a platform operator, I want order processing to be handled asynchronously via a queue so that peak traffic does not slow down checkout.

Acceptance Criteria:
Given an order is submitted,
When the order service enqueues a job for payment and inventory,
Then a worker processes the job within 30 seconds and order status transitions are persisted atomically.
`
  }
};

export const DEFAULT_CATEGORY: StoryCategory = 'Frontend';

export const BAD_STORY = STORIES[DEFAULT_CATEGORY].bad;
export const REFERENCE_STORY = STORIES[DEFAULT_CATEGORY].reference; 