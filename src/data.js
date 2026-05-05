// Personal data — single source of truth for the portfolio.
// Update name, title, projects, etc. here and they propagate everywhere.

export const DEV = {
  name: 'Karan Sharma',
  firstName: 'karan',
  title: 'Senior Mobile Engineer',
  location: 'Calgary, Canada',
  tagline:
    "8+ years crafting cutting-edge mobile apps across Android, iOS, and React Native — currently leading mobile engineering at Fintex Inc.",
  about: [
    'Senior Mobile Engineer with 8+ years of experience building scalable, high-performance apps that real users live in.',
    'I lead cross-functional teams, mentor engineers, and ship features that move the needle on engagement and quality. Also a part-time lecturer at McGill University, teaching mobile development and information security.',
  ],
  typewriter: [
    'Senior Mobile Engineer',
    'Android Developer',
    'React Native Developer',
    'iOS via React Native',
    'Mobile Architect',
  ],

  // Skills bucketed by platform — drives the 3-column Skills section.
  skills: {
    android: {
      label: 'Android',
      accent: '#3ddc84',
      items: [
        'Kotlin',
        'Java',
        'Jetpack Compose',
        'MVVM / MVI',
        'Coroutines',
        'RxJava',
        'Dagger Hilt',
        'Room',
        'Android SDK',
        'Wear OS',
        'Firebase',
      ],
    },
    crossPlatform: {
      label: 'Cross-Platform (RN)',
      accent: '#61DAFB',
      items: [
        'React Native',
        'TypeScript',
        'JavaScript',
        'React',
        'Redux',
        'iOS + Android shipping',
        'REST APIs',
        'Reusable components',
      ],
    },
    engineering: {
      label: 'Engineering & Tools',
      accent: '#e8f5ee',
      items: [
        'CI/CD',
        'Unit Testing',
        'Code Review',
        'Code Analysis',
        'Mentorship',
        'JIRA',
        'Git / GitHub',
        'Push Notifications',
        'Security SDKs',
      ],
    },
  },

  // 3 standout projects from work history. Platform: 'android' | 'rn' | 'multi' | 'ios'
  projects: [
    {
      title: 'Runkeeper — Android & Wear OS',
      org: 'ASICS Digital · 2021 – 2026',
      desc:
        'Led new feature development on the flagship fitness app. Architected a modular Kotlin / Jetpack Compose codebase that cut complexity by 40% and shipped features that drove a 30% engagement lift over 12 months.',
      tech: ['Kotlin', 'Jetpack Compose', 'MVI', 'Wear OS', 'CI/CD'],
      platform: 'android',
      metric: '+30% engagement · +15% CSAT',
    },
    {
      title: 'OneSpan Mobile Security SDK',
      org: 'OneSpan · 2020 – 2021',
      desc:
        'Built security-focused SDKs embedded into banking apps. Spearheaded a Java→Kotlin migration that improved maintainability by 60% and drove a 40% reduction in critical bugs through rigorous testing.',
      tech: ['Kotlin', 'Java', 'Android SDK', 'Banking', 'SDK design'],
      platform: 'android',
      metric: '60% maintainability gain · 40% fewer bugs',
    },
    {
      title: 'Enterprise React Native Apps',
      org: 'Plasmatic Technologies',
      desc:
        'Cross-platform RN apps for insurance enterprises shipping to iOS + Android. Led the JS→TypeScript modernization, built shared component libraries, and optimized state and re-renders for smoother UX.',
      tech: ['React Native', 'TypeScript', 'Redux', 'iOS', 'Android'],
      platform: 'multi',
      metric: '40% fewer critical bugs',
    },
  ],

  // Career timeline — drives the Experience section.
  experience: [
    {
      company: 'Fintex Inc',
      role: 'Senior Mobile Engineer',
      period: 'Feb 2026 — Present',
      location: 'Canada',
      stack: ['React Native', 'Kotlin', 'Swift', 'TypeScript', 'AI APIs', 'QA Automation'],
      bullets: [
        'Leading mobile development and QA automation for the Tangerine Wealth app — driving feature velocity and release confidence across iOS and Android.',
        'Architected an AI-powered image-processing pipeline from scratch in a separate React Native project — designing the end-to-end flow and integrating third-party AI APIs into a production mobile experience.',
        'Owning architecture, code quality, and delivery standards for the mobile platform; setting up CI/CD, test automation, and review practices for the team.',
        'Partnering with product and design to translate ambiguous requirements into shippable, well-instrumented features.',
      ],
      highlight: true,
    },
    {
      company: 'ASICS Digital',
      role: 'Senior Mobile Application Developer',
      period: 'Nov 2021 — Feb 2026',
      location: 'Calgary, Canada',
      stack: ['Kotlin', 'Jetpack Compose', 'MVI', 'Wear OS', 'CI/CD'],
      bullets: [
        'Led new feature development on the Runkeeper Android & Wear OS app — drove a 30% engagement lift over 12 months.',
        'Architected and maintained a modular Kotlin / Jetpack Compose codebase — cut complexity by 40%.',
        'Partnered with PMs and Design to align engineering with product OKRs, contributing to a 15% CSAT increase.',
        'Fostered technical excellence through architectural oversight in code review and structured mentorship — improving code quality and team velocity.',
        'Owned CI/CD and automated testing to keep production bugs low and shipping velocity high.',
      ],
    },
    {
      company: 'McGill University',
      role: 'University Lecturer (concurrent)',
      period: 'Nov 2021 — Present',
      location: 'Canada',
      stack: ['React Native', 'Android', 'Information Security'],
      bullets: [
        'Teach core programming concepts, data structures, algorithms, and best practices in modular, maintainable code.',
        'Deliver hands-on mobile app development courses covering React Native and Android fundamentals.',
        'Lead the Information System Security course — secure system design, threat modeling, risk assessment, and cryptography.',
        'Develop course materials, assignments, and practical exercises; mentor students on real-world programming and security applications.',
      ],
    },
    {
      company: 'OneSpan',
      role: 'Intermediate Mobile Application Developer',
      period: 'Sep 2020 — Nov 2021',
      location: 'Canada',
      stack: ['Kotlin', 'Java', 'Android SDK', 'Banking Security'],
      bullets: [
        'Built security-focused SDKs embedded into banking applications, contributing directly to the company’s security offerings.',
        'Spearheaded the legacy Java→Kotlin migration — 60% gain in code readability, performance, and maintainability.',
        'Designed, built, and tested core SDK components — UI, core functionality, and security primitives — driving multiple high-impact feature launches.',
        'Drove a 40% reduction in critical bugs through robustness, edge-case, and usability testing.',
      ],
    },
    {
      company: 'Plasmatic Technologies',
      role: 'Mobile Application Developer',
      period: '2020 — 2021',
      location: 'Canada',
      stack: ['React Native', 'TypeScript', 'Redux'],
      bullets: [
        'Built and maintained large-scale React Native apps for enterprise insurance clients — consistent cross-platform experiences on iOS + Android.',
        'Modernized legacy RN codebases — JS→TypeScript migration with clean, scalable architecture; lifted maintainability and developer confidence.',
        'Built reusable UI components and shared business logic that accelerated feature delivery across multiple apps.',
        'Optimized state and re-renders for smoother UX; strengthened engineering standards through mentoring, code review, and ownership of build/release workflows.',
      ],
    },
    {
      company: 'Lightwave Technology',
      role: 'Mobile Application Developer',
      period: 'Mar 2020 — Aug 2020',
      location: 'Canada',
      stack: ['Android', 'MVP/MVVM', 'CI/CD'],
      bullets: [
        'Implemented MVP and MVVM architectures for complex video-streaming codebases.',
        'Optimized streaming algorithms and updated CI/CD pipelines for a faster release cadence.',
      ],
    },
    {
      company: 'Codedrill InfoTech',
      role: 'Junior Application Developer',
      period: 'Aug 2017 — Dec 2018',
      location: 'India',
      stack: ['Android', 'Java'],
      bullets: [
        'Built a news reader app serving 2k–3k active users with a 4.7 / 5 store rating.',
      ],
    },
    {
      company: 'Vlogic Labs',
      role: 'Intern Application Developer',
      period: 'Jan 2017 — Jul 2017',
      location: 'India',
      stack: ['Android', 'Payment Gateway'],
      bullets: [
        'Shipped a food delivery app with 10K daily active users.',
        'Lifted store rating from 3.7 to 4.2 / 5 by addressing customer feedback.',
      ],
    },
  ],

  // Headline numbers for the Impact section. value can be plain string or number.
  stats: [
    { value: 8, suffix: '+', label: 'Years shipping mobile apps' },
    { value: 30, suffix: '%', label: 'Runkeeper engagement lift' },
    { value: 40, suffix: '%', label: 'Critical-bug reduction' },
    { value: 60, suffix: '%', label: 'Maintainability gain (Java→Kotlin)' },
    { value: 10, suffix: 'K+', label: 'DAU on shipped apps' },
    { value: 4.7, suffix: '/5', label: 'App-store ratings on launches' },
  ],

  // Companies / clients to feature in the marquee under the Work timeline.
  clients: [
    'Fintex Inc',
    'Tangerine',
    'ASICS Digital',
    'Runkeeper',
    'McGill University',
    'OneSpan',
    'Plasmatic',
  ],

  // Education + teaching context.
  education: [
    {
      degree: 'M.Eng., Software Engineering',
      school: 'Concordia University',
      period: 'Sep 2018 — Aug 2020',
    },
    {
      degree: 'B.Tech., Computer Science',
      school: 'Punjab Technical University',
      period: 'Aug 2013 — May 2017',
    },
  ],

  // Public-facing socials.
  socials: {
    github: 'https://github.com/Karan-I0',
    linkedin: 'https://www.linkedin.com/in/karan0910/',
    email: '95sharma.karan@gmail.com',
    whatsapp: 'https://wa.me/15816883007', // +1 (581) 688-3007
    phone: '+15816883007', // E.164; rendered as a tel: link
    stackoverflow: '', // optional — paste full URL or leave blank to hide
  },
}

// Map platform -> display label + accent color (used in ProjectCard tag)
export const PLATFORM_META = {
  android: { label: 'ANDROID', color: '#3ddc84' },
  ios: { label: 'iOS', color: '#f5f5f7' },
  rn: { label: 'REACT NATIVE', color: '#61DAFB' },
  multi: { label: 'iOS + ANDROID', color: '#61DAFB' },
}
