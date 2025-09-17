const CLOCK_TO_DEGREES: Record<string, number> = {
  "12": -90,
  "1": -60,
  "2": -30,
  "3": 0,
  "4": 30,
  "5": 60,
  "6": 90,
  "7": 120,
  "8": 150,
  "9": 180,
  "10": -150,
  "11": -120,
};

type Hand = "left" | "right";

export type SemaphorePose = {
  leftAngle: number;
  rightAngle: number;
};

type AngleProvider =
  | number
  | { left: number; right: number }
  | ((hand: Hand, segment: string) => number | null);

type KeywordRule = {
  test: RegExp;
  value: AngleProvider;
};

const NUMBER_REGEX = /\b(1[0-2]|[1-9])(?=\s*(?:o'?clock)?)\b/g;

const sanitizeText = (text: string) =>
  text
    .toLowerCase()
    .replace(/front\s*[▸:-]\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

const isClockKey = (value: string): value is keyof typeof CLOCK_TO_DEGREES =>
  Object.hasOwn(CLOCK_TO_DEGREES, value);

const toAngle = (clock: string | number): number => {
  const key = String(clock);
  return isClockKey(key) ? CLOCK_TO_DEGREES[key] : 0;
};

const applyAngleProvider = (
  provider: AngleProvider,
  hand: Hand,
  segment: string
): number | null => {
  if (typeof provider === "number") return provider;
  if (typeof provider === "function") return provider(hand, segment);
  return provider[hand];
};

const keywordRules: KeywordRule[] = [
  {
    test: /mirrors upward creating an x|glowing x|capital l shape|x shape/,
    value: { left: toAngle("11"), right: toAngle("1") },
  },
  {
    test: /wide v|angle high forward to form a wide v|angle high forming a v/,
    value: { left: toAngle("11"), right: toAngle("1") },
  },
  {
    test: /low v|subtle v|resting in a low v|return to the waist-level low v|low v reset/,
    value: { left: toAngle("7"), right: toAngle("5") },
  },
  {
    test: /horizontal (?:bar|line)|horizontal like the letter r|horizontal without any pre-signal|horizontal before dropping to reset|horizontal for three counts without moving|horizontal forming a bar|extend straight across|neon cross from 9 to 3|straight out at shoulder height|horizontally at 9 and 3/,
    value: { left: toAngle("9"), right: toAngle("3") },
  },
  {
    test: /vertical up like attention|lift both flags to 12|vertical up immediately|vertical up together|attention/,
    value: { left: toAngle("12"), right: toAngle("12") },
  },
  {
    test: /pointing straight down|vertical down together|drop diagonally toward the knees|flags pressed against the thighs|droop outward|diagonal down/,
    value: { left: toAngle("7"), right: toAngle("5") },
  },
  {
    test: /hide behind your back|tuck behind the body|behind the body/,
    value: { left: toAngle("8"), right: toAngle("4") },
  },
  {
    test: /walk away from the card/,
    value: { left: toAngle("12"), right: toAngle("12") },
  },
  {
    test: /both arms lifted overhead like a y|arms lifted overhead like a y|glowing exclamation|45 degrees above the shoulders/,
    value: { left: toAngle("11"), right: toAngle("1") },
  },
  {
    test: /wrists cross in front of the chest|wrists cross in front/,
    value: { left: toAngle("10"), right: toAngle("2") },
  },
];

const handRules: KeywordRule[] = [
  {
    test: /vertical up|stands vertical up|lifts straight up|shoot to 12|lift to 12/,
    value: { left: toAngle("12"), right: toAngle("12") },
  },
  {
    test: /vertical down|facing down|stays low|rests low|drops to 6|rests vertical down|vertical down at 6|points down/,
    value: { left: toAngle("6"), right: toAngle("6") },
  },
  {
    test: /horizontal out|horizontal at|extends horizontal|reaches 9|reaches 3|horizontal/,
    value: (hand) => (hand === "left" ? toAngle("9") : toAngle("3")),
  },
  {
    test: /diagonal up forward|angles high forward|high forward/,
    value: (hand) => (hand === "left" ? toAngle("11") : toAngle("1")),
  },
  {
    test: /diagonal down forward|angles down forward|low forward|drops diagonal forward|diagonal down/,
    value: (hand) => (hand === "left" ? toAngle("7") : toAngle("5")),
  },
  {
    test: /diagonal up across the body|angles high across the body|across high/,
    value: (hand) => (hand === "left" ? toAngle("1") : toAngle("11")),
  },
  {
    test: /diagonal down across the body|angles down across the body|across low/,
    value: (hand) => (hand === "left" ? toAngle("5") : toAngle("7")),
  },
  {
    test: /cross(?:es)? low|across the torso|across the chest|crosses the torso/,
    value: (hand, segment) => {
      if (/high/.test(segment)) {
        return hand === "left" ? toAngle("10") : toAngle("2");
      }
      if (/low/.test(segment)) {
        return hand === "left" ? toAngle("8") : toAngle("4");
      }
      return hand === "left" ? toAngle("8") : toAngle("4");
    },
  },
  {
    test: /cross(?:es)? high|overhead|glowing x|capital l shape|high cross/,
    value: { left: toAngle("11"), right: toAngle("1") },
  },
  {
    test: /mirrors low|mirrors the low/,
    value: { left: toAngle("7"), right: toAngle("5") },
  },
  {
    test: /mirrors upward|mirrors high/,
    value: { left: toAngle("11"), right: toAngle("1") },
  },
  {
    test: /retreats to 6/,
    value: (hand) => (hand === "left" ? toAngle("6") : toAngle("6")),
  },
];

const BOTH_PATTERNS = [
  /\bboth flags[^.!?]*/,
  /\bleft and right flags[^.!?]*/,
  /\bboth arms[^.!?]*/,
];

const HAND_ACTIONS =
  "(?:lifts|extends|stays|drops|matches|reaches|angles|sweeps|arcs|retreats|crosses|points|keeps|floats|presses|rests|holds|mirrors|slides|climbs|settles|travels|glides|shoots|stands|leans|tucks|rolls|drapes|drifts|retracts|resets|stacks|spins|folds|droops|hugs|frames|dives|rises|returns)";

const buildHandPatterns = (hand: Hand): RegExp[] => {
  const base = hand === "left" ? "left" : "right";
  return [
    new RegExp(`\\b${base} flag[^.!?]*`),
    new RegExp(`\\b${base} arm[^.!?]*`),
    new RegExp(`\\b${base} hand[^.!?]*`),
    new RegExp(`\\b${base} ${HAND_ACTIONS}[^.!?]*`),
    new RegExp(`\\b${base} to[^.!?]*`),
  ];
};

const LEFT_PATTERNS = buildHandPatterns("left");
const RIGHT_PATTERNS = buildHandPatterns("right");

const extractFromPatterns = (text: string, patterns: RegExp[]): string | null => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
};

const parseNumbersFromSegment = (segment: string): number[] => {
  const matches = segment.match(NUMBER_REGEX);
  if (!matches) return [];
  return matches.map((match) => toAngle(match));
};

const resolveAngleFromKeywords = (
  segment: string,
  hand: Hand,
  rules: KeywordRule[]
): number | null => {
  for (const rule of rules) {
    if (rule.test.test(segment)) {
      const angle = applyAngleProvider(rule.value, hand, segment);
      if (angle !== null) return angle;
    }
  }
  return null;
};

export const deriveSemaphorePose = (rawText: string): SemaphorePose | null => {
  if (!rawText) return null;
  const text = sanitizeText(rawText);
  if (!/(flag|arm|arms|wrist|wrists|low v|high v)/.test(text)) return null;

  let leftAngle: number | null = null;
  let rightAngle: number | null = null;

  const bothSegment = extractFromPatterns(text, BOTH_PATTERNS);
  if (bothSegment) {
    const numbers = parseNumbersFromSegment(bothSegment);
    if (numbers.length === 1) {
      leftAngle = numbers[0];
      rightAngle = numbers[0];
    } else if (numbers.length >= 2) {
      const [first, second] = numbers;
      leftAngle = first;
      rightAngle = second ?? first;
    } else {
      for (const rule of keywordRules) {
        if (rule.test.test(bothSegment)) {
          const left = applyAngleProvider(rule.value, "left", bothSegment);
          const right = applyAngleProvider(rule.value, "right", bothSegment);
          if (typeof left === "number" && typeof right === "number") {
            leftAngle = left;
            rightAngle = right;
            break;
          }
        }
      }
    }
  }

  const leftSegment = extractFromPatterns(text, LEFT_PATTERNS);
  if (leftSegment) {
    const numbers = parseNumbersFromSegment(leftSegment);
    if (numbers.length) {
      leftAngle = numbers[0];
    } else {
      const keywordAngle = resolveAngleFromKeywords(
        leftSegment,
        "left",
        handRules
      );
      if (keywordAngle !== null) leftAngle = keywordAngle;
    }
  }

  const rightSegment = extractFromPatterns(text, RIGHT_PATTERNS);
  if (rightSegment) {
    const numbers = parseNumbersFromSegment(rightSegment);
    if (numbers.length) {
      rightAngle = numbers[0];
    } else {
      const keywordAngle = resolveAngleFromKeywords(
        rightSegment,
        "right",
        handRules
      );
      if (keywordAngle !== null) rightAngle = keywordAngle;
    }
  }

  if ((leftAngle === null || rightAngle === null) && !bothSegment) {
    const fallback = resolveAngleFromKeywords(text, "left", keywordRules);
    if (fallback !== null) {
      leftAngle ??= fallback;
      rightAngle ??= fallback;
    }
  }

  if (leftAngle === null || rightAngle === null) {
    // Last attempt: check both-hand keyword rules against entire text
    for (const rule of keywordRules) {
      if (rule.test.test(text)) {
        const left = applyAngleProvider(rule.value, "left", text);
        const right = applyAngleProvider(rule.value, "right", text);
        if (typeof left === "number" && typeof right === "number") {
          leftAngle ??= left;
          rightAngle ??= right;
        }
      }
    }
  }

  if (leftAngle === null || rightAngle === null) return null;
  return { leftAngle, rightAngle };
};
