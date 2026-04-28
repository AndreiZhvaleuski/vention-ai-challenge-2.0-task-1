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
  'David', 'Sarah', 'Robert', 'Emily', 'Michael',
  'Jessica', 'Christopher', 'Amanda', 'Richard', 'Laura',
];

const LAST_NAMES = [
  'Lovelace', 'Turing', 'Hopper', 'Torvalds', 'Ritchie',
  'Gosling', 'Berners-Lee', 'Stroustrup', 'van Rossum', 'Thompson',
  'Kernighan', 'Knuth', 'McCarthy', 'Hamilton', 'Cerf',
  'Murphy', 'Chen', 'Patel', 'Silva', 'Johnson',
  'Williams', 'Garcia', 'Brown', 'Lee', 'Davis',
];

const TITLES = [
  'Senior Engineer', 'Tech Lead', 'Staff Engineer',
  'Principal Engineer', 'Software Architect',
  'Engineering Manager', 'Senior Developer', 'Full Stack Engineer',
  'Junior Engineer', 'Mid-Level Engineer', 'Staff Architect',
  'Technical Director', 'VP Engineering', 'Product Manager',
  'DevOps Engineer', 'Site Reliability Engineer', 'Data Engineer',
  'Machine Learning Engineer', 'Security Engineer', 'QA Engineer',
  'Frontend Engineer', 'Backend Engineer', 'Solutions Architect',
  'Engineering Lead', 'Principal Architect', 'Chief Technology Officer',
];

const DEPARTMENTS = [
  'Platform Engineering', 'Developer Relations',
  'Cloud Infrastructure', 'Data Engineering',
  'Frontend Guild', 'Backend Systems',
  'DevOps & SRE', 'Mobile Engineering',
  'Security & Compliance', 'Quality Assurance', 'Infrastructure',
  'Product Engineering', 'Research & Innovation', 'Technical Operations',
  'Site Reliability', 'Database Engineering', 'Machine Learning',
  'API Platform', 'Developer Tools', 'Integration Services',
  'Performance Engineering', 'Architecture Team', 'Testing Services',
  'Observability Engineering', 'Deployment Systems', 'Documentation',
];

const AVATAR_COLORS = [
  '#1976d2', '#388e3c', '#f57c00', '#7b1fa2',
  '#c62828', '#00796b', '#5d4037', '#455a64',
  '#e64a19', '#0097a7', '#6a1b9a', '#2e7d32',
  '#c2185b', '#1565c0', '#00838f', '#4527a0',
  '#d84315', '#00695c', '#424242', '#bf360c',
  '#0288d1', '#558b2f', '#6d4c41', '#00897b',
];

const CATEGORIES: Category[] = ['Education', 'Public Speaking', 'University Partnerships'];

const ACTIVITY_TITLES: Record<Category, string[]> = {
  'Education': [
    '[LAB] TypeScript workshop lecturer',
    '[LAB] React Hooks deep-dive mentor',
    '[LAB] Testing best-practices session lead',
    '[LAB] Microservices lunch-and-learn host',
    '[LAB] Advanced Async/Await patterns instructor',
    '[LAB] Node.js performance optimization workshop',
    '[LAB] GraphQL API design bootcamp facilitator',
    '[LAB] Docker & containerization crash course leader',
    '[EDU] Authored onboarding guide for EDU program',
    '[EDU] Created video tutorial series for EDU',
    '[EDU] Presented at internal EDU knowledge day',
    '[EDU] Wrote architecture decision record for EDU track',
    '[EDU] Designed curriculum for junior developers',
    '[EDU] Mentored interns through coding challenges',
    '[EDU] Contributed learning modules to EDU platform',
    '[EDU] Facilitated code review workshops',
    '[EDU] Created debugging best practices documentation',
    '[EDU] Led accessibility standards training session',
    '[EDU] Developed full-stack development course',
    '[EDU] Taught security fundamentals to engineers',
    '[EDU] Authored REST API design guidelines',
    '[EDU] Created database optimization tutorial',
    '[EDU] Presented deployment pipeline best practices',
    '[EDU] Wrote performance monitoring guide',
    '[EDU] Developed testing strategy documentation',
    '[EDU] Created API versioning best practices doc',
    '[EDU] Taught error handling patterns',
    '[EDU] Authored logging standards guide',
    '[EDU] Led CI/CD pipeline training',
    '[EDU] Developed monitoring and alerting guidelines',
    '[EDU] Created load testing methodology guide',
    '[EDU] Taught scalability principles',
    '[EDU] Authored caching strategies documentation',
    '[EDU] Led rate limiting implementation workshop',
    '[EDU] Developed backup and recovery procedures',
    '[EDU] Taught disaster recovery planning',
    '[EDU] Created incident response playbook',
    '[EDU] Authored on-call documentation',
    '[EDU] Led infrastructure-as-code workshop',
    '[EDU] Developed configuration management guide',
    '[EDU] Taught observability and tracing',
    '[EDU] Authored service mesh fundamentals',
    '[EDU] Led Kubernetes deep-dive training',
    '[EDU] Developed containerization best practices',
    '[EDU] Taught serverless architecture patterns',
    '[EDU] Authored cloud cost optimization guide',
    '[EDU] Led multi-region deployment workshop',
    '[EDU] Developed disaster recovery documentation',
  ],
  'Public Speaking': [
    '[REG] Speaker at regional JS conference',
    '[REG] Speaker at local DevMeetup',
    '[REG] Keynote at internal engineering all-hands',
    '[REG] Presenter at company tech summit',
    '[REG] Internal training on cloud architecture',
    '[REG] Speaker at NodeConf regional event',
    '[REG] Moderator at open-source tech roundtable',
    '[REG] Guest speaker at startup tech meetup',
    '[REG] Panelist at web development conference',
    '[REG] Speaker at frontend masters bootcamp',
    '[REG] Presenter at API design workshop series',
    '[REG] Panelist at remote work culture discussion',
    '[REG] Speaker at TypeScript advanced patterns workshop',
    '[REG] Keynote at annual code quality summit',
    '[REG] Presenter at performance optimization track',
    '[REG] Speaker at DevOps best practices conference',
    '[REG] Panelist at tech career development panel',
    '[REG] Presenter at security and compliance summit',
    '[REG] Speaker at database design masterclass',
    '[REG] Keynote speaker at engineering culture day',
    '[REG] Presenter at system design workshop',
    '[REG] Speaker at microservices best practices',
    '[REG] Panelist at engineering ethics roundtable',
    '[REG] Presenter at testing strategies conference',
    '[REG] Speaker at documentation workshop',
    '[REG] Keynote at developer productivity summit',
    '[REG] Presenter at code review best practices',
    '[REG] Speaker at technical mentoring workshop',
    '[REG] Panelist at leadership transition panel',
    '[REG] Presenter at architecture patterns conference',
    '[REG] Speaker at API security workshop',
    '[REG] Keynote at innovation and experimentation day',
    '[REG] Presenter at incident management track',
    '[REG] Speaker at monitoring and observability',
    '[REG] Panelist at debugging techniques roundtable',
    '[REG] Presenter at scaling challenges workshop',
    '[REG] Speaker at tech debt management summit',
    '[REG] Keynote at collaboration tools conference',
    '[REG] Presenter at automation and efficiency track',
    '[REG] Speaker at cloud migration workshop',
    '[REG] Panelist at emerging technologies panel',
    '[REG] Presenter at product engineering culture',
    '[REG] Speaker at agile transformation conference',
    '[REG] Keynote speaker at engineering metrics day',
    '[REG] Presenter at feature flagging best practices',
    '[REG] Speaker at data-driven development workshop',
    '[REG] Panelist at AI/ML integration discussion',
    '[REG] Presenter at third-party integration patterns',
  ],
  'University Partnerships': [
    '[UNI] Mentored university capstone team',
    '[UNI] Guest lecturer at partner university',
    '[UNI] Judged student hackathon',
    '[UNI] Academic practice curator for internship cohort',
    '[UNI] Co-authored student research paper',
    '[UNI] Workshop facilitator for CS students',
    '[UNI] Supervised university internship project',
    '[UNI] Guest speaker at computer science seminar',
    '[UNI] Reviewed capstone project proposals',
    '[UNI] Mentored undergraduate research initiative',
    '[UNI] Taught career readiness workshop',
    '[UNI] Presented industry trends to student body',
    '[UNI] Sponsored hackathon as technical judge',
    '[UNI] Supervised summer internship cohort',
    '[UNI] Guest lectured on software architecture',
    '[UNI] Mentored master\'s thesis project',
    '[UNI] Presented at university tech expo',
    '[UNI] Facilitated peer mentorship program',
    '[UNI] Guest lectured on real-world system design',
    '[UNI] Reviewed student coding portfolios',
    '[UNI] Sponsored academic research project',
    '[UNI] Participated in alumni career panel',
    '[UNI] Mentored competitive programming team',
    '[UNI] Guest lecturer on DevOps practices',
    '[UNI] Supervised capstone internship placement',
    '[UNI] Reviewed student thesis research',
    '[UNI] Facilitated industry-academia collaboration',
    '[UNI] Guest spoke at entrepreneurship club',
    '[UNI] Mentored student project competition team',
    '[UNI] Presented recruitment opportunities',
    '[UNI] Supervised full-stack web development project',
    '[UNI] Guest lectured on cloud computing',
    '[UNI] Mentored graduate research fellows',
    '[UNI] Reviewed technical interview performance',
    '[UNI] Sponsored code competition event',
    '[UNI] Facilitated academic internship program',
    '[UNI] Guest lectured on open-source contribution',
    '[UNI] Mentored startup competition participants',
    '[UNI] Presented career path opportunities',
    '[UNI] Supervised machine learning project',
    '[UNI] Guest speaker at women in tech event',
    '[UNI] Mentored diversity fellowship program',
    '[UNI] Reviewed student final project demos',
    '[UNI] Sponsored ethics in computing workshop',
    '[UNI] Facilitated tech industry networking event',
    '[UNI] Guest lectured on professional development',
    '[UNI] Mentored first-gen student cohort',
    '[UNI] Presented internship technical assessment',
    '[UNI] Supervised applied machine learning capstone',
    '[UNI] Guest spoke at graduate student seminar',
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
  const count = 200;

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

    const activityCount = randInt(1, 18);
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
        points: randInt(1, 20),
        quarter,
      });
    }

    const id = String(i);
    employees.push({
      id,
      firstName,
      lastName,
      title: pick(TITLES),
      department: pick(DEPARTMENTS),
      avatarColor: pick(AVATAR_COLORS),
      avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${id}&size=64`,
      avatarUrlLarge: `https://api.dicebear.com/9.x/avataaars/svg?seed=${id}&size=128`,
      activities,
    });
  }

  return employees;
}
