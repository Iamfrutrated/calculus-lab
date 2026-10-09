import type { QuizQuestion } from '../components/Quiz'

export type QuizTopic = {
  id: string
  slug: string
  title: string
  summary: string
  order: number
  art: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
  questions: QuizQuestion[]
}

export const quizTopics: QuizTopic[] = [
  {
    id: 'limits',
    slug: 'limits',
    title: 'Limits',
    summary: 'What nearby outputs settle on, even if a point is messy.',
    order: 1,
    art: '1',
    questions: [
      {
        id: 'limits-1',
        prompt: 'What is',
        promptMath: '\\displaystyle\\lim_{x\\to 0}\\dfrac{\\sin x}{x}?',
        options: ['0', '1', '∞', 'does not exist'],
        correctIndex: 1,
        explain: 'This is the standard squeeze-theorem limit. Nearby ratios pile up on 1.',
      },
      {
        id: 'limits-2',
        prompt: 'What is',
        promptMath: '\\displaystyle\\lim_{x\\to\\infty}\\dfrac{3x^2+1}{x^2-4}?',
        options: ['0', '1', '3', '∞'],
        correctIndex: 2,
        explain: 'Divide top and bottom by x². The dominant terms leave 3.',
      },
    ],
  },
  {
    id: 'one-sided-limits',
    slug: 'one-sided-limits',
    title: 'One-sided limits',
    summary: 'Approach from the left or from the right — they need not agree.',
    order: 2,
    art: '2',
    questions: [
      {
        id: 'osl-1',
        prompt: 'What is',
        promptMath: '\\displaystyle\\lim_{x\\to 0^-}\\dfrac{|x|}{x}?',
        options: ['−1', '0', '1', 'does not exist'],
        correctIndex: 0,
        explain: 'From the left, |x| = −x, so the ratio is −1.',
      },
      {
        id: 'osl-2',
        prompt: 'A two-sided limit exists only when the left-hand and right-hand limits…',
        options: [
          'are both infinite',
          'exist and are equal',
          'exist, even if they differ',
          'match f(c)',
        ],
        correctIndex: 1,
        explain: 'Left and right must settle on the same number. Matching f(c) is continuity, not existence of the limit.',
      },
    ],
  },
  {
    id: 'continuity',
    slug: 'continuity',
    title: 'Continuity',
    summary: 'Left, right, and the function value all meet at the same height.',
    order: 3,
    art: '5',
    questions: [
      {
        id: 'cont-1',
        prompt: 'At a hole where nearby y-values meet but f(c) is missing, the function is…',
        options: [
          'continuous at c',
          'not continuous at c',
          'differentiable at c',
          'undefined everywhere',
        ],
        correctIndex: 1,
        explain: 'The two-sided limit can exist while f(c) does not. Continuity needs both, and they must agree.',
      },
      {
        id: 'cont-2',
        prompt: 'Polynomials are continuous…',
        options: ['only at 0', 'on (0, ∞)', 'everywhere they are defined', 'never'],
        correctIndex: 2,
        explain: 'A polynomial is defined and continuous on all real numbers.',
      },
    ],
  },
  {
    id: 'derivatives',
    slug: 'derivatives',
    title: 'Derivatives',
    summary: 'Slope of the tangent, written as a limit of secants.',
    order: 4,
    art: '1',
    questions: [
      {
        id: 'der-1',
        prompt: 'The derivative of',
        promptMath: 'x^n',
        options: ['n x^{n-1}', 'x^n / n', 'n x^{n+1}', 'x^{n-1}'],
        correctIndex: 0,
        explain: 'Power rule: bring the exponent down and drop it by one.',
      },
      {
        id: 'der-2',
        prompt: 'What is',
        promptMath: '\\dfrac{d}{dx}\\sin x?',
        options: ['−sin x', 'cos x', '−cos x', 'sec² x'],
        correctIndex: 1,
        explain: 'The derivative of sine is cosine.',
      },
    ],
  },
  {
    id: 'differentiability',
    slug: 'differentiability',
    title: 'Differentiability',
    summary: 'A derivative at a point needs a single tangent — no corners or jumps.',
    order: 5,
    art: '3',
    questions: [
      {
        id: 'diff-1',
        prompt: 'f(x) = |x| at x = 0 is…',
        options: [
          'differentiable and continuous',
          'continuous but not differentiable',
          'differentiable but not continuous',
          'neither',
        ],
        correctIndex: 1,
        explain: 'The graph meets in a corner. Left and right slopes are −1 and 1, so no single derivative.',
      },
      {
        id: 'diff-2',
        prompt: 'If f is differentiable at c, then f is…',
        options: [
          'discontinuous at c',
          'continuous at c',
          'a polynomial',
          'concave up at c',
        ],
        correctIndex: 1,
        explain: 'Differentiability is stronger than continuity. The converse is false (corners).',
      },
    ],
  },
  {
    id: 'rate-in-rate-out',
    slug: 'rate-in-rate-out',
    title: 'Rate-in rate-out',
    summary: 'Net change is what enters minus what leaves.',
    order: 6,
    art: '2',
    questions: [
      {
        id: 'riro-1',
        prompt: 'A tank gains water at 5 gal/min and leaks at 2 gal/min. dV/dt is…',
        options: ['2 gal/min', '3 gal/min', '5 gal/min', '7 gal/min'],
        correctIndex: 1,
        explain: 'Net rate = rate in − rate out = 5 − 2 = 3.',
      },
      {
        id: 'riro-2',
        prompt: 'If r_in(t) and r_out(t) are rates of change of amount A, then A′(t) equals…',
        options: [
          'r_in(t) + r_out(t)',
          'r_in(t) − r_out(t)',
          'r_out(t) − r_in(t)',
          '∫ r_in − ∫ r_out',
        ],
        correctIndex: 1,
        explain: 'The derivative of the amount is the instantaneous net flow: in minus out.',
      },
    ],
  },
  {
    id: 'rate-of-change',
    slug: 'rate-of-change',
    title: 'Rate of change problems',
    summary: 'How fast a quantity grows, including related rates.',
    order: 7,
    art: '4',
    questions: [
      {
        id: 'roc-1',
        prompt: 'If s(t) = t², the average rate of change of s on [1, 3] is…',
        options: ['2', '3', '4', '8'],
        correctIndex: 2,
        explain: '(s(3) − s(1))/(3 − 1) = (9 − 1)/2 = 4.',
      },
      {
        id: 'roc-2',
        prompt: 'The instantaneous rate of change of f at a is…',
        options: ['f(a)', 'f′(a)', '∫ f', 'f(a+h) − f(a)'],
        correctIndex: 1,
        explain: 'That is the definition of the derivative at a.',
      },
    ],
  },
  {
    id: 'particle-motion',
    slug: 'particle-motion',
    title: 'Particle motion',
    summary: 'Position, velocity, and acceleration on a line.',
    order: 8,
    art: '6',
    questions: [
      {
        id: 'pm-1',
        prompt: 'If s(t) is position, then velocity is…',
        options: ['s(t)', 's′(t)', 's″(t)', '∫ s'],
        correctIndex: 1,
        explain: 'Velocity is the derivative of position. Acceleration is the derivative of velocity.',
      },
      {
        id: 'pm-2',
        prompt: 'A particle is instantaneously at rest when…',
        options: ['s(t) = 0', 'v(t) = 0', 'a(t) = 0', 's(t) is max'],
        correctIndex: 1,
        explain: 'At rest means velocity is zero. It may or may not be a turning point.',
      },
    ],
  },
  {
    id: 'definite-integrals',
    slug: 'definite-integrals',
    title: 'Definite integrals',
    summary: 'Signed area, accumulated as a Riemann sum with dx → 0.',
    order: 9,
    art: '2',
    questions: [
      {
        id: 'def-1',
        prompt: 'What is',
        promptMath: '\\displaystyle\\int_0^2 x\\,dx?',
        options: ['0', '1', '2', '4'],
        correctIndex: 2,
        explain: 'An antiderivative is x²/2. Evaluate 2 − 0 = 2. Area of the triangle under y = x from 0 to 2.',
      },
      {
        id: 'def-2',
        prompt: 'The FTC says',
        promptMath: '\\dfrac{d}{dx}\\int_a^x f(t)\\,dt',
        options: ['f(a)', 'f(x)', 'F(x) − F(a)', '0'],
        correctIndex: 1,
        explain: 'Differentiating an integral from a fixed a up to x recovers f(x).',
      },
    ],
  },
  {
    id: 'indefinite-integrals',
    slug: 'indefinite-integrals',
    title: 'Indefinite integrals',
    summary: 'A family of antiderivatives — don’t forget +C.',
    order: 10,
    art: '7',
    questions: [
      {
        id: 'indef-1',
        prompt: 'What is',
        promptMath: '\\int 2x\\,dx?',
        options: ['2', 'x²', 'x² + C', '2x + C'],
        correctIndex: 2,
        explain: 'An antiderivative of 2x is x². The +C is the whole family with that derivative.',
      },
      {
        id: 'indef-2',
        prompt: 'What is',
        promptMath: '\\int e^x\\,dx?',
        options: ['e^x', 'e^x + C', 'x e^x + C', '1/e^x + C'],
        correctIndex: 1,
        explain: 'e^x is its own derivative, so it is its own antiderivative, up to a constant.',
      },
    ],
  },
  {
    id: 'integration-by-parts',
    slug: 'integration-by-parts',
    title: 'Integration by parts',
    summary: 'Undo a product rule: ∫ u dv = uv − ∫ v du.',
    order: 11,
    art: '3',
    questions: [
      {
        id: 'ibp-1',
        prompt: 'Integration by parts is the reverse of the…',
        options: ['chain rule', 'product rule', 'quotient rule', 'power rule'],
        correctIndex: 1,
        explain: 'The product rule says (uv)′ = u′v + uv′. Rearrange and integrate to get ∫ u dv = uv − ∫ v du.',
      },
      {
        id: 'ibp-2',
        prompt: 'For ∫ x e^x dx, a good choice is…',
        options: [
          'u = e^x, dv = x dx',
          'u = x, dv = e^x dx',
          'u = x e^x, dv = dx',
          'u = 1, dv = x e^x dx',
        ],
        correctIndex: 1,
        explain: 'Let u be the polynomial (it gets simpler) and dv be e^x dx (easy to integrate).',
      },
    ],
  },
  {
    id: 'partial-fractions',
    slug: 'partial-fractions',
    title: 'Partial fraction decomposition',
    summary: 'Split a rational function into pieces you can integrate.',
    order: 12,
    art: '8',
    questions: [
      {
        id: 'pf-1',
        prompt: 'Decompose',
        promptMath: '\\dfrac{1}{x(x+1)}',
        options: [
          '1/x + 1/(x+1)',
          '1/x − 1/(x+1)',
          'x + (x+1)',
          '1/(x+1) − 1/x',
        ],
        correctIndex: 1,
        explain: '1/x − 1/(x+1) has common denominator x(x+1) and numerator (x+1) − x = 1.',
      },
      {
        id: 'pf-2',
        prompt: 'Before decomposing p(x)/q(x), you should…',
        options: [
          'differentiate p',
          'make sure the fraction is proper (deg p < deg q)',
          'set q(x) = 0 and stop',
          'replace x with 0',
        ],
        correctIndex: 1,
        explain: 'If the numerator’s degree is at least the denominator’s, divide first, then decompose the remainder.',
      },
    ],
  },
  {
    id: 'taylor-polynomials',
    slug: 'taylor-polynomials',
    title: 'Taylor polynomials',
    summary: 'Match value and derivatives at a center; Maclaurin is the case a = 0.',
    order: 13,
    art: '4',
    questions: [
      {
        id: 'tay-1',
        prompt: 'The degree-2 Maclaurin polynomial for e^x is…',
        options: [
          '1 + x',
          '1 + x + x²/2',
          '1 + x + x²',
          'x + x²/2',
        ],
        correctIndex: 1,
        explain: 'e^x = Σ x^k / k!. Up to k = 2 that is 1 + x + x²/2!.',
      },
      {
        id: 'tay-2',
        prompt: 'A Maclaurin polynomial is a Taylor polynomial centered at…',
        options: ['x = 1', 'x = a', 'x = 0', 'x = ∞'],
        correctIndex: 2,
        explain: 'Maclaurin means a = 0. The lab overlays P_n on f near zero.',
      },
    ],
  },
  {
    id: 'series-tests',
    slug: 'series-tests',
    title: 'Series tests',
    summary: 'Decide whether an infinite sum settles or blows up.',
    order: 14,
    art: '1',
    questions: [
      {
        id: 'ser-1',
        prompt: 'The harmonic series',
        promptMath: '\\sum 1/n',
        options: [
          'converges to 1',
          'converges to 0',
          'diverges',
          'converges only for even n',
        ],
        correctIndex: 2,
        explain: 'The harmonic series diverges, even though terms go to 0. Terms → 0 is necessary, not sufficient.',
      },
      {
        id: 'ser-2',
        prompt: 'A geometric series Σ r^n converges when…',
        options: ['r > 1', '|r| < 1', 'r = 1', '|r| ≥ 1'],
        correctIndex: 1,
        explain: 'Need |common ratio| strictly less than 1. Then the sum is 1/(1 − r) if it starts at n = 0.',
      },
    ],
  },
]

export function getQuizTopicBySlug(slug: string): QuizTopic | undefined {
  return quizTopics.find((topic) => topic.slug === slug)
}

export function quizNeighbors(slug: string): { prev?: QuizTopic; next?: QuizTopic } {
  const index = quizTopics.findIndex((topic) => topic.slug === slug)
  if (index === -1) return {}
  return {
    prev: quizTopics[index - 1],
    next: quizTopics[index + 1],
  }
}
