import type { Category, Activity, Employee } from '../types';

// --- Seeded PRNG (mulberry32) ---

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (((hash << 5) + hash) ^ str.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Data pools ---

const FIRST_NAMES = [
  'Ada', 'Alan', 'Grace', 'Linus', 'Dennis',
  'James', 'Tim', 'Bjarne', 'Guido', 'Ken',
  'Brian', 'Donald', 'John', 'Margaret', 'Vint',
];

const LAST_NAMES = [
  'Lovelace', 'Turing', 'Hopper', 'Torvalds', 'Ritchie',
  'Gosling', 'Berners-Lee', 'Stroustrup', 'van Rossum', 'Thompson',
  'Kernighan', 'Knuth', 'McCarthy', 'Hamilton', 'Cerf',
];

const TITLES = [
  'Senior Engineer', 'Tech Lead', 'Staff Engineer',
  'Principal Engineer', 'Software Architect',
  'Engineering Manager', 'Senior Developer', 'Full Stack Engineer',
];

const DEPARTMENTS = [
  'Platform Engineering', 'Developer Relations',
  'Cloud Infrastructure', 'Data Engineering',
  'Frontend Guild', 'Backend Systems',
  'DevOps & SRE', 'Mobile Engineering',
];

const AVATAR_COLORS = [
  '#1976d2', '#388e3c', '#f57c00', '#7b1fa2',
  '#c62828', '#00796b', '#5d4037', '#455a64',
  '#e64a19', '#0097a7', '#6a1b9a', '#2e7d32',
];

const CATEGORIES: Category[] = ['Education', 'Public Speaking', 'University Partnerships'];

const ACTIVITY_TITLES: Record<Category, string[]> = {
  'Education': [
    'Delivered internal TypeScript workshop',
    'Authored onboarding guide',
    'Led React Hooks deep-dive',
    'Ran testing best-practices session',
    'Created video tutorial series',
    'Wrote architecture decision record',
    'Hosted lunch-and-learn on microservices',
  ],
  'Public Speaking': [
    'Presented at JSConf',
    'Spoke at local DevMeetup',
    'Gave keynote at WebSummit',
    'Hosted open-source panel',
    'Presented at company all-hands',
    'Delivered talk at NodeConf',
    'Moderated tech roundtable',
  ],
  'University Partnerships': [
    'Mentored capstone team',
    'Delivered guest lecture at MIT',
    'Judged student hackathon',
    'Hosted campus recruiting event',
    'Co-authored student research paper',
    'Ran workshop for computer science students',
    'Supervised internship project',
  ],
};

// --- Generator ---

export function generateData(seed: string): Employee[] {
  const rng = mulberry32(hashString(seed || 'default'));
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  const randInt = (min: number, max: number): number =>
    Math.floor(rng() * (max - min + 1)) + min;

  const employees: Employee[] = [];
  const usedNames = new Set<string>();
  const count = randInt(12, 15);

  for (let i = 0; i < count; i++) {
    let firstName: string;
    let lastName: string;
    let fullName: string;
    let attempts = 0;

    do {
      firstName = pick(FIRST_NAMES);
      lastName = pick(LAST_NAMES);
      fullName = `${firstName} ${lastName}`;
      attempts++;
    } while (usedNames.has(fullName) && attempts < 20);

    usedNames.add(fullName);

    const activityCount = randInt(3, 8);
    const activities: Activity[] = [];

    for (let j = 0; j < activityCount; j++) {
      const cat = pick(CATEGORIES);
      const year = pick([2024, 2025]) as 2024 | 2025;
      const quarter = randInt(1, 4) as 1 | 2 | 3 | 4;
      const monthStart = (quarter - 1) * 3 + 1;
      const month = randInt(monthStart, monthStart + 2);
      const day = randInt(1, 28);

      activities.push({
        id: `${i}-${j}`,
        title: pick(ACTIVITY_TITLES[cat]),
        category: cat,
        date: new Date(year, month - 1, day),
        points: randInt(1, 10),
        year,
        quarter,
      });
    }

    employees.push({
      id: String(i),
      firstName,
      lastName,
      title: pick(TITLES),
      department: pick(DEPARTMENTS),
      avatarColor: pick(AVATAR_COLORS),
      activities,
    });
  }

  return employees;
}
