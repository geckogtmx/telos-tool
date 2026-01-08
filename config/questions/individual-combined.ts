import { Question } from '@/types';

export const individualCombinedQuestions: Question[] = [
  // --- PART 1: QUICK QUESTIONS (5) ---
  {
    id: 'q1',
    question: 'Who are you in one paragraph?',
    type: 'textarea',
    placeholder: 'Your role, what you do, and the context you operate in...', 
    required: true,
    minLength: 50,
    description: "A concise introduction covering your role, what you do, and the professional/personal context you operate in. Think of this as how you'd introduce yourself to someone who needs to understand your situation quickly to collaborate effectively.",
    examples: [
      'Dr. Priya Sharma: Family Nurse Practitioner, 6 years in practice. I work at a community health center serving primarily uninsured and underinsured patients. I see 18-22 patients per day across all ages, heavy on chronic disease management and preventive care. I also precept NP students 2 days per week.',
      'Marcus Chen: Senior backend engineer, 8 years in. Currently tech lead at a fintech startup (Series B, 45 people). I build payment infrastructure and mentor junior devs. Based in Seattle, work hybrid.',
      'Sarah Okonkwo: I run marketing for a B2B SaaS company in the HR tech space. 12 years in marketing, last 5 in leadership roles. My team is 8 people across content, demand gen, and product marketing. I report to the CEO and sit on the leadership team. We\'re trying to grow from $15M to $30M ARR in 18 months without proportionally growing headcount.',
      'Tomás Reyes: Freelance graphic designer, 9 years in. I specialize in brand identity and packaging design. Most of my clients are small-to-mid CPG brands—food, beverage, wellness. I\'ve built a reputation for work that\'s bold but not trendy, stuff that still looks good in 5 years. Based in Denver, work remotely with clients across the US.',
      'Jake Moreno: full-time streamer + youtuber, variety gaming but mostly cozy/indie stuff. 340k on youtube, 85k on twitch. been doing this 4 years, full-time for 2. I make enough to live but not enough to relax about it.'
    ]
  },
  {
    id: 'q2',
    question: 'What are you trying to accomplish?',
    type: 'textarea',
    placeholder: "The problems you're solving or outcomes you're working toward...",
    required: true,
    minLength: 20,
    description: "The core problems you're solving or outcomes you're working toward. This can be professional, personal, or both. Focus on the meaningful end goals, not just tasks or activities.",
    examples: [
      'Dr. Priya Sharma: Provide excellent care to people who otherwise wouldn\'t get it. Develop systems that let us do more with limited resources. Train the next generation of NPs to work in underserved settings.',
      'Marcus Chen: Ship reliable systems that don\'t page me at 3am. Build a team that can operate without me. Eventually transition to a staff+ IC role or architect position—not management track.',
      'Sarah Okonkwo: Prove that marketing can be a growth engine, not a cost center. Build a team that produces measurable results and has career paths. Personally, I want to be a CMO within 3 years—but only at a company I believe in.',
      'Tomás Reyes: Build a sustainable creative practice where I do excellent work for clients I respect, without grinding myself into dust. Eventually want to shift toward fewer, larger projects and maybe some product revenue (templates, courses, something).',
      'Jake Moreno: sustainable career doing this. I don\'t need to be huge, I need to not burn out and keep paying rent. also want to make stuff I\'m actually proud of, not just algorithm slop.'
    ]
  },
  {
    id: 'q3',
    question: 'What do you value and what do you avoid?',
    type: 'textarea',
    placeholder: "Core principles you operate by, and things you explicitly don't want...",
    required: true,
    minLength: 20,
    description: "Core principles you operate by, and things you explicitly don't want. This includes both what matters to you (values) and what you actively reject or constrain (anti-patterns, boundaries).",
    examples: [
      'Dr. Priya Sharma: Patient-centered always. Evidence-based but practical—best practice adjusted for real-world constraints is better than perfect practice that can\'t be implemented. I value efficiency that serves patients, not efficiency for its own sake. Avoid: Paternalistic care. Judgment about patient choices. Documentation theater.',
      'Marcus Chen: Values: Reliability over cleverness. Documentation. Honest estimates. Deep work. Avoid: Heroics. "Move fast and break things." Meetings without agendas. Premature optimization.',
      'Sarah Okonkwo: I value clarity, accountability, and creative bravery. I have no patience for marketing that\'s just "vibes"—if we can\'t measure it or at least have a hypothesis about why it should work, we shouldn\'t do it. I avoid performative busy-ness, campaigns designed to make us look busy rather than drive results, and I really avoid the word "synergy."',
      'Tomás Reyes: Intentionality. Every design choice should have a reason. I value clients who trust the process and understand that good design takes time. I value craft—I still care about kerning and paper stock and things most people don\'t notice. Avoid: Spec work. "Make it pop." Clients who want to art-direct. Racing to the bottom on price. Design trends that will age badly.',
      'Jake Moreno: authenticity > polish. I\'d rather be real and a little rough than fake and perfect. my audience can smell BS instantly. avoid: drama/controversy farming, clickbait that doesn\'t deliver, selling stuff I don\'t believe in, parasocial manipulation'
    ]
  },
  {
    id: 'q4',
    question: 'How do you prefer to work and receive information?',
    type: 'textarea',
    placeholder: 'Your style: detailed vs. concise, structured vs. exploratory...', 
    required: true,
    minLength: 20,
    description: "Your working style and preferences for how information should be delivered. Include details about depth (detailed vs. concise), structure (organized vs. exploratory), pace (fast iterations vs. deep dives), and how you like to receive feedback or recommendations.",
    examples: [
      'Dr. Priya Sharma: Systematic. I think in protocols and algorithms. If there\'s a framework, I want to know it. I like checklists. I make decisions quickly and move on—can\'t afford analysis paralysis with my patient volume. Give me evidence summaries with recommendations. Concise. Clinical. "Consider X because Y." No preamble needed.',
      'Marcus Chen: Structured. Give me the context, the constraints, and let me think. I work in 90-minute blocks. I prefer async communication—Slack over meetings. Written proposals over verbal pitches. When stuck, give me 2-3 options with tradeoffs. Direct feedback—don\'t soften. "This approach has a race condition" not "Have you considered the threading implications?"',
      'Sarah Okonkwo: I think out loud. When I\'m working through a problem, I want to talk it through—or write it through. I like structured frameworks but I don\'t want them to be rigid. Give me a starting point and let me adapt it. I read fast, so don\'t worry about giving me too much—I\'ll skim what I don\'t need. When stuck, ask me questions—I usually know the answer, I just haven\'t organized my thoughts yet.',
      'Tomás Reyes: Visually, obviously. I think by making—I\'ll sketch or mock something up to figure out what I think. I like clear briefs and then creative freedom. Micromanagement kills my work. I do my best design work in the morning; afternoons are for admin and revisions. Show me references or examples when I\'m stuck. Visual inspiration helps more than verbal explanation.',
      'Jake Moreno: honestly kind of chaotic. I work in bursts. some days I edit for 12 hours, some days I can barely open premiere. I need external structure because I won\'t create it myself. short bursts, 15 min here and there. when stuck just tell me what to do. give me the answer. I can evaluate if it\'s right for me, but I don\'t have time to think through 5 options. casual feedback style, like texting.'
    ]
  },
  {
    id: 'q5',
    question: 'What are you currently working on?',
    type: 'textarea',
    placeholder: 'Active projects, their status, and any blockers...', 
    required: true,
    minLength: 20,
    description: "Active projects, their current status, and any blockers or challenges. Focus on what\'s actually on your plate right now, not aspirational future plans.",
    examples: [
      'Dr. Priya Sharma: Group visits for diabetes (planning phase, need to convince medical director). No-show QI project (active, data collection phase). Student orientation curriculum (needs attention, keeps falling to bottom of priority list). Blockers: Never enough time for anything beyond direct patient care.',
      'Marcus Chen: Payment retry overhaul (active, 60% complete, waiting on compliance review). Team onboarding system (planning, interviewing recent hires). Personal Rust CLI tool (paused, no time with new baby). Recurring challenge: context switching kills productivity.',
      'Sarah Okonkwo: Attribution overhaul (active, deciding between building vs. buying). Website redesign (stalled, stuck on messaging alignment between CEO and CPO). Content strategy reset (planning, audit complete). Blockers: alignment takes forever, everyone has to weigh in.',
      'Tomás Reyes: Suncrest Brewing full rebrand (active, presenting 3 concepts next week). Madre Foods packaging redesign (production phase). Template kit for brand identity (stalled, prioritizing client work). Portfolio redesign (back burner). Recurring challenge: underestimating revision time.',
      'Jake Moreno: merch store (stuck, can\'t decide on designs). youtube essay video about cozy games (active, script 80% done). hiring an editor (thinking about it, got overwhelmed by 200 applications). recurring challenge: procrastinate on everything that isn\'t creating.'
    ]
  },

  // --- PART 2: FULL EXPANSION QUESTIONS (19) ---
  
  // Section 1 Expansion
  {
    id: 'q1a',
    question: "What's your professional background?",
    type: 'textarea',
    placeholder: 'Brief summary of your career path and key transitions...', 
    required: true,
    minLength: 20,
    description: "Your career path, major transitions, and key roles. Focus on what shaped how you work today—pivots, formative experiences, and progression that led to your current position.",
    examples: [
      'Dr. Priya Sharma: BSN from University of Michigan, worked med-surg for 4 years, then ICU for 3. Completed DNP while working full-time (would not recommend). Chose community health over higher-paying options deliberately.',
      'Marcus Chen: Started as QA, moved to dev after 2 years. 3 years at Amazon (Payments team). 2 years at a failed startup (learned a lot). Current role: 3 years, promoted to lead 18 months ago.',
      'Sarah Okonkwo: Started in journalism—wrote for a regional newspaper for 3 years after college. Moved into content marketing when print died, discovered I had a knack for strategy and kept moving up. Did agency work for 4 years (hated the client churn, loved the variety), then went in-house. This is my second director role.',
      'Tomás Reyes: BFA in graphic design, started at a small agency out of school. Did 3 years there—learned a lot, burned out hard. Went freelance at 26 and never looked back. First two years were rough (said yes to everything, made no money), then figured out positioning and niching. Now I\'m booked 2-3 months out consistently.',
      'Jake Moreno: dropped out of college (comp sci, hated it), worked retail for 3 years while building the channel on the side. went full-time when I hit 100k subs and had some sponsorship stability. no formal training in anything content-related, learned everything from youtube and trial/error.'
    ]
  },
  {
    id: 'q1b',
    question: 'What domains are you an expert in?',
    type: 'textarea',
    placeholder: 'Areas where you have deep knowledge and experience...', 
    required: true,
    minLength: 10,
    description: "Areas where you don't need explanations—just answers. Your deep expertise, specialized knowledge, or domains where you can operate at a high level without hand-holding.",
    examples: [
      'Dr. Priya Sharma: Primary care, chronic disease management (diabetes, hypertension, COPD), health literacy challenges, working with interpreters, managing complex patients with limited resources, precepting/clinical education.',
      'Marcus Chen: Distributed systems, PostgreSQL optimization, Go, Python, AWS (certified solutions architect), Payment processing / PCI compliance.',
      'Sarah Okonkwo: Content strategy, brand positioning, B2B demand generation, marketing attribution (I actually understand the math), managing creative people, presenting to boards.',
      'Tomás Reyes: Brand identity systems, packaging design, print production, color theory, typography, client communication, creative briefs, knowing when a project is actually done.',
      'Jake Moreno: youtube algorithm, twitch growth, thumbnail design, short-form editing, community building, knowing which games will pop'
    ]
  },
  {
    id: 'q1c',
    question: 'What domains are you actively learning?',
    type: 'textarea',
    placeholder: 'Skills or topics you are currently upskilling in...', 
    required: false,
    description: "Areas where you want more explanation and context. Topics you're growing into, skills you're developing, or knowledge gaps you're working to fill.",
    examples: [
      'Dr. Priya Sharma: Point-of-care ultrasound. Also working on Spanish—conversational but want to be proficient. Interested in quality improvement methodology.',
      'Marcus Chen: Rust (hobby, considering for side projects). AI/ML basics (want to understand what\'s possible, not become a practitioner). Leadership/management (new to leading people).',
      'Sarah Okonkwo: AI for marketing workflows—not the hype, the practical stuff. What can actually save my team time? Also trying to get better at product-led growth. Our company is shifting that direction and I need to understand it beyond buzzwords.',
      'Tomás Reyes: Motion graphics—want to offer basic logo animations. Also learning the business side better: pricing strategy, contracts, passive income. Design skills are solid; business skills need work.',
      'Jake Moreno: business stuff—taxes, contracts, actually understanding sponsorship terms. also trying to learn more about long-form storytelling for youtube essays. want to branch out beyond just gameplay.'
    ]
  },

  // Section 2 Expansion
  {
    id: 'q2a',
    question: 'What problems are you actively trying to solve?',
    type: 'textarea',
    placeholder: 'Specific challenges you are addressing right now...', 
    required: true,
    minLength: 20,
    description: "List the real friction in your life or work. What keeps coming up? What creates obstacles or inefficiencies? Be specific about current pain points, not general aspirations.",
    examples: [
      'Dr. Priya Sharma: Patient no-show rate is 30%+, destroys our schedule and revenue. Documentation takes 2+ hours after clinic closes daily. Students need more structured learning experiences than I currently provide.',
      'Marcus Chen: Our payment retry logic is brittle and costs us ~$40k/month in failed transactions. Junior devs keep making the same mistakes—no good onboarding system. I\'m a bottleneck for code reviews and it\'s burning me out.',
      'Sarah Okonkwo: Our content doesn\'t convert. We get traffic but it\'s the wrong traffic. Sales complains about lead quality weekly. We also have no systematic way to know what\'s working—attribution is a mess and everyone has opinions but no data.',
      'Tomás Reyes: Feast/famine income cycle. Some months are great, some are terrifying. I undercharge for the value I provide. Know it, struggle to fix it. No systems. Every project is slightly different process. Inefficient.',
      'Jake Moreno: income is too dependent on sponsorships, need to diversify (merch? courses? idk). my upload schedule is killing me, can\'t keep up with youtube AND streaming. no systems for anything, everything is in my head or scattered in discord DMs.'
    ]
  },
  {
    id: 'q2b',
    question: "What's your mission or purpose statement?",
    type: 'textarea',
    placeholder: 'A clear, concise statement of your professional purpose...', 
    required: true,
    minLength: 10,
    description: "If you had to explain what you're about in one sentence, what would it be? Your north star, the thing that guides decisions and priorities.",
    examples: [
      'Dr. Priya Sharma: Excellent primary care should not be a luxury. I want to prove it\'s possible in resource-constrained settings.',
      'Marcus Chen: Build systems that are boring in production and teams that don\'t need heroes.',
      'Sarah Okonkwo: Make marketing the most trusted function in the company by being the team that shows its work.',
      'Tomás Reyes: Create work that matters for brands that matter, while building a business that doesn\'t depend on me being available 50 hours a week.',
      'Jake Moreno: make content that actually matters to people while building something that doesn\'t require me to work 70 hour weeks forever'
    ]
  },
  {
    id: 'q2c',
    question: 'What are your current goals with rough timelines?',
    type: 'textarea',
    placeholder: 'Short-term and long-term objectives...', 
    required: false,
    description: "Concrete outcomes you're aiming for with approximate deadlines. Include professional and personal goals where relevant. Be specific about timeframes (this quarter, this year, 2-3 years).",
    examples: [
      'Dr. Priya Sharma: This quarter: Implement group visit model for diabetes patients. This year: Publish QI project on no-show reduction. 3 years: Complete clinical faculty appointment, teach in DNP program. Personal: Finish Spanish certification, take an actual vacation.',
      'Marcus Chen: Q1: Reduce payment failures by 60%. Q2: Hire and onboard 2 mid-level engineers. 2025: Get promoted to Staff or find a staff role elsewhere. Personal: Run a half marathon (been saying this for 2 years).',
      'Sarah Okonkwo: This quarter: Implement proper attribution. I need to know what\'s actually driving pipeline. This year: 40% increase in qualified pipeline with flat budget. 18 months: Be in consideration for CMO role (here or elsewhere). Personal: Actually take a real vacation without checking Slack.',
      'Tomás Reyes: Q1: Raise rates 20% for new clients (terrified but doing it). Q2: Launch brand identity template kit on Gumroad. This year: Break $150k revenue, hire a part-time assistant. Personal: Actually take a trip without bringing my laptop.',
      'Jake Moreno: this month: launch the merch store (been "almost ready" for 6 months). this quarter: hire an editor, even part-time. this year: 500k on youtube, one viral video (>5M views). life: buy a house in the next 2-3 years, get out of this apartment.'
    ]
  },

  // Section 3 Expansion
  {
    id: 'q3a',
    question: 'What are your anti-goals?',
    type: 'textarea',
    placeholder: 'Outcomes you specifically want to prevent...', 
    required: false,
    description: "What does success explicitly NOT look like for you? Paths you refuse to take, outcomes you're deliberately avoiding, or measures of success you reject.",
    examples: [
      'Dr. Priya Sharma: Will not move to concierge medicine or cash-only practice. Not interested in administrative leadership roles. Won\'t sacrifice patient time for research/publication pressure.',
      'Marcus Chen: Don\'t want to become a manager (tried it, hated it). Don\'t want to be the only person who understands critical systems. Won\'t sacrifice sleep for work anymore.',
      'Sarah Okonkwo: I don\'t want to build a massive team. More people means more management, more coordination overhead, more politics. I\'d rather have 6 excellent people than 15 mediocre ones. I also refuse to be the "make it pretty" department—if that\'s all leadership wants from marketing, I\'m at the wrong company.',
      'Tomás Reyes: Don\'t want to build an agency. Tried managing people, hated it. Don\'t want to become a "design influencer" posting daily tips. Won\'t take crypto/NFT projects regardless of budget. Won\'t do work for brands I\'d be embarrassed to put in my portfolio.',
      'Jake Moreno: not trying to be the biggest, just trying to be sustainable. don\'t want to become "corporate creator" with a team of 20. refuse to make content I\'d be embarrassed to show my mom.'
    ]
  },
  {
    id: 'q3b',
    question: 'What are your hard constraints?',
    type: 'textarea',
    placeholder: 'Non-negotiable boundaries (time, location, ethics)...', 
    required: true,
    minLength: 10,
    description: "Non-negotiable limits—time, budget, family obligations, health, geography, or other factors that define what's actually possible for you. These aren't preferences; they're boundaries.",
    examples: [
      'Dr. Priya Sharma: Clinic hours are fixed: 8am-5pm, no flexibility. 15-minute appointments are the reality, won\'t change. Limited formulary due to 340B program—can\'t prescribe everything I want.',
      'Marcus Chen: Wife and 2-year-old. Non-negotiable family time 6-8pm. Thursday afternoons blocked for deep work (team knows). No weekend deploys unless P0.',
      'Sarah Okonkwo: Budget is fixed this year. Non-negotiable. I also have two kids (8 and 11) and I do school pickup three days a week—I\'m offline 2:45-4pm those days. My team knows, it\'s fine, but I won\'t schedule over it.',
      'Tomás Reyes: I work alone. No team, no contractors (yet). Capacity is limited. Don\'t do web development. Design yes, build no. Tuesdays and Thursdays are no-meeting days. Protect them aggressively.',
      'Jake Moreno: budget is tight. like really tight. can\'t invest more than $500/month in the business right now. I do everything myself currently—editing, thumbnails, social, emails. health stuff: ADHD (medicated but still hard), RSI in my wrist that flares up.'
    ]
  },

  // Section 4 Expansion
  {
    id: 'q4a',
    question: "What's your typical session type?",
    type: 'text',
    placeholder: 'e.g., Deep work sprints, collaborative brainstorming...', 
    required: false,
    description: "How you usually engage with work or tasks. Quick questions scattered throughout the day? Extended focus sessions? Mixed approach? Describe your natural rhythm.",
    examples: [
      'Dr. Priya Sharma: Quick questions during charting. Occasionally longer sessions for precepting materials or QI project work. I don\'t have hours to spend—give me what I need efficiently.',
      'Marcus Chen: Mix. Quick questions throughout day, 1-2 deep work sessions per day for actual coding/design.',
      'Sarah Okonkwo: Mostly working sessions, 15-30 minutes. I use AI for first drafts, frameworks, and sanity-checking my thinking. Occasionally deep dives when I\'m preparing board presentations or working on positioning.',
      'Tomás Reyes: Mixed. Quick questions when I\'m stuck on copy or naming. Longer sessions when I\'m thinking through strategy, positioning, or business decisions. Sometimes I just need to think out loud about a creative direction.',
      'Jake Moreno: short bursts. 15 min here and there. I don\'t have "deep work" blocks, I have "oh crap I need to do this now" blocks.'
    ]
  },
  {
    id: 'q4b',
    question: "When you're stuck, what do you want?",
    type: 'textarea',
    placeholder: 'Do you want suggestions, space, or a rubber duck?', 
    required: true,
    minLength: 10,
    description: "Your preferred approach when facing a problem or decision. Options to choose from? A single recommendation? Questions to clarify your thinking? Something else?",
    examples: [
      'Dr. Priya Sharma: Give me the evidence summary and a recommendation. I\'ll decide. Include the citation so I can reference it if needed.',
      'Marcus Chen: Give me 2-3 options with tradeoffs. I\'ll pick. Don\'t just give me one answer—I want to understand the decision space.',
      'Sarah Okonkwo: Ask me questions. I usually know the answer, I just haven\'t organized my thoughts yet. Good questions are more helpful than good answers for me.',
      'Tomás Reyes: Show me references or examples. Or ask me questions about the _why_ behind what I\'m trying to do—usually the answer is in there, I just haven\'t articulated it. Visual inspiration helps more than verbal explanation.',
      'Jake Moreno: just tell me what to do. give me the answer. I can evaluate if it\'s right for me, but I don\'t have time to think through 5 options. decision fatigue is real.'
    ]
  },
  {
    id: 'q4c',
    question: 'How much pushback do you want?',
    type: 'text',
    placeholder: 'None, gentle challenges, or ruthless critique?', 
    required: true,
    description: "Should AI challenge your ideas, just execute what you ask, or somewhere in between? When and how do you want to be questioned or corrected?",
    examples: [
      'Dr. Priya Sharma: Yes, particularly on clinical decisions. I want to be challenged if something might harm a patient. Less interested in pushback on style or approach.',
      'Marcus Chen: Challenge me, especially on architecture decisions. I have blind spots. If I\'m overcomplicating something, say so directly.',
      'Sarah Okonkwo: Yes, but pick your battles. If I\'m directionally wrong, tell me. If I\'m just doing it differently than you would, let it go. I\'m experienced enough to have opinions—I want collaboration, not a consultant who thinks they know my business better than I do.',
      'Tomás Reyes: On business stuff—yes, push back hard. I have blind spots and I\'m too close to it. On creative direction—lighter touch. I know what I\'m doing there. Trust my taste unless something is objectively not working.',
      'Jake Moreno: yes but be chill about it. don\'t lecture me. if I\'m making a mistake just tell me like a friend would.'
    ]
  },
  {
    id: 'q4d',
    question: "What's your feedback style preference?",
    type: 'textarea',
    placeholder: 'Direct/blunt, sandwich method, async only?', 
    required: true,
    minLength: 10,
    description: "How you prefer to receive feedback or corrections. Direct/blunt? Softened? Socratic questioning? Adapt to context? Be specific about tone and delivery.",
    examples: [
      'Dr. Priya Sharma: Concise. Clinical. "Consider X because Y." No preamble needed.',
      'Marcus Chen: Direct. Don\'t soften. "This approach has a race condition" not "Have you considered the threading implications?"',
      'Sarah Okonkwo: Professional but direct. I\'m a grown-up, I can handle criticism. But I also don\'t need brutal honesty for its own sake. "This message isn\'t landing because X" is great. "This is bad" is not useful.',
      'Tomás Reyes: Direct but not harsh. I appreciate specificity. "The hierarchy isn\'t working because X" is useful. "I don\'t like it" is not.',
      'Jake Moreno: casual. like texting. don\'t need formal anything.'
    ]
  },

  // Section 5 (New)
  {
    id: 'q5a',
    question: "What's your technical setup?",
    type: 'textarea',
    placeholder: 'OS, key hardware, monitor setup...', 
    required: false,
    description: "Devices, operating systems, primary software ecosystem. Include hardware specs if relevant to your work, and the platforms/tools you use daily.",
    examples: [
      'Dr. Priya Sharma: Work laptop only (no personal computer for work). Epic EHR (we\'re on an older version). I do most things on my phone outside of charting.',
      'Marcus Chen: MacBook Pro M2 (work), custom Linux desktop (home/personal projects). VS Code + Neovim for quick edits. iTerm2, tmux. Docker, k8s for local dev.',
      'Sarah Okonkwo: MacBook Air, Google Workspace for everything. HubSpot for marketing automation, Salesforce for CRM (I don\'t love it but it\'s what we have). Figma for reviewing creative. I live in Google Docs and Slides.',
      'Tomás Reyes: MacBook Pro 16" M2, external monitor (crucial). Adobe CC: Illustrator primary, Photoshop, InDesign, After Effects (learning). Figma for anything collaborative or web-related. Procreate on iPad for sketching. Dropbox for file management, Notion for project tracking.',
      'Jake Moreno: gaming PC I built, RTX 4070, pretty solid. streamdeck, SM7B mic, sony a6400 for camera. OBS for streaming, premiere for editing, photoshop for thumbs. notion for trying to be organized (usually fails). discord for community and collabs.'
    ]
  },
  {
    id: 'q5b',
    question: "What's your technical skill level?",
    type: 'text',
    placeholder: 'Beginner, Intermediate, Expert (by domain)...', 
    required: false,
    description: "Your comfort with technology and technical concepts. Non-technical? Technical but not a developer? Developer? Deep technical? Be specific about areas and don't oversell or undersell.",
    examples: [
      'Dr. Priya Sharma: Clinically technical, not IT technical. I can navigate EHRs, do basic data pulls, use Excel for simple analysis. Cannot code. Don\'t want to learn.',
      'Marcus Chen: Deep technical. Don\'t explain language basics, common patterns, or standard tooling. Do explain niche libraries or domains I listed as "learning."',
      'Sarah Okonkwo: Not a developer, but technical enough to have opinions about our website performance and to read a SQL query if someone walks me through it. I can set up basic automations in HubSpot. I understand APIs conceptually but wouldn\'t write one.',
      'Tomás Reyes: Expert in design software. Comfortable with print production specs, prepress, color profiles. Not a developer—I can inspect CSS and communicate with devs but I don\'t write code. Basic understanding of web constraints.',
      'Jake Moreno: good with creative software, bad with business software. I can edit a video in my sleep but spreadsheets make me want to die. don\'t know how to code beyond like, basic html from myspace era.'
    ]
  },
  {
    id: 'q5c',
    question: 'What programming languages/tools do you use?',
    type: 'textarea',
    placeholder: 'List languages, frameworks, and tools you rely on...', 
    required: false,
    description: "If applicable, list languages, frameworks, platforms, and common workflows. If you don't code, list the primary tools in your domain. Be specific about proficiency levels.",
    examples: [
      'Dr. Priya Sharma: Epic (proficient), Excel (basic), UpToDate, DynaMed, CDC guidelines, MDCalc. I use voice-to-text for documentation. Zoom for telehealth.',
      'Marcus Chen: Primary: Go, Python, SQL. Secondary: TypeScript (can read, don\'t enjoy writing). Infra: Terraform, AWS (ECS, RDS, Lambda, SQS), DataDog. DBs: PostgreSQL (expert), Redis, DynamoDB (learning).',
      'Sarah Okonkwo: HubSpot, Salesforce, Google Analytics 4 (reluctantly), Looker for dashboards, Notion for team documentation, Figma (view-only basically), basic HTML/CSS (enough to fix a broken email template).',
      'Tomás Reyes: Illustrator (expert), Photoshop (expert), InDesign (expert), Figma (proficient), After Effects (beginner), Lightroom (proficient), Notion, Dropbox, Google Workspace, Honeybook for invoicing/contracts.',
      'Jake Moreno: premiere pro, after effects (basic), photoshop, OBS, streamlabs, canva (for quick stuff), capcut for shorts, notion (badly), google sheets (under protest)'
    ]
  },

  // Section 6 (Expanded)
  {
    id: 'q6a',
    question: 'What are your active projects and their status?',
    type: 'textarea',
    placeholder: 'List current projects and where they stand...', 
    required: true,
    minLength: 20,
    description: "For each project: name, phase (planning/active/paused), current focus, and blockers. Be specific about what's actually happening now versus what you hope to do.",
    examples: [
      'Dr. Priya Sharma: Group Visits for Diabetes (Planning - researching models, need to write proposal, blocker: need medical director buy-in). No-Show QI Project (Active - data collection phase, blocker: limited data system). Student Orientation Curriculum (Needs attention - have outline, blocker: keeps falling to bottom of priority list).',
      'Marcus Chen: Payment Retry Overhaul (Active - implementation, 60% complete, blocker: waiting on compliance review). Team Onboarding System (Planning - gathering requirements, interviewing recent hires, blocker: no dedicated time). Personal: Rust CLI Tool (Paused - had working prototype, blocker: no time, new baby priorities).',
      'Sarah Okonkwo: Attribution Overhaul (Active, high priority - vendor evaluation, deciding between building vs. buying, blocker: need Sales buy-in on what counts as marketing-sourced). Website Redesign (Active but stalled - have wireframes, stuck on messaging, blocker: CEO and CPO have different opinions about who our customer is). Content Strategy Reset (Planning - audit complete, blocker: content lead emotionally attached to blog series that doesn\'t perform).',
      'Tomás Reyes: Suncrest Brewing - Full Rebrand (Active - concept development, presenting 3 directions next week, blocker: client slow to provide feedback). Madre Foods - Packaging Redesign (Active - production phase, blocker: waiting on final copy). Template Kit (Stalled - have templates, need landing page and copy, blocker: prioritizing client work). Portfolio Redesign (Back burner - planning phase, blocker: cobbler\'s children).',
      'Jake Moreno: merch store (stuck - supposed to launch last month, blocker: can\'t decide on designs, keep second-guessing). youtube essay video (active - 15 min video about cozy games, script 80% done, blocker: can\'t nail the ending). hiring an editor (thinking about it - got 200 applications, got overwhelmed, stopped looking).'
    ]
  },
  {
    id: 'q6b',
    question: 'What recurring challenges do you face?',
    type: 'textarea',
    placeholder: 'Persistent blockers or issues...', 
    required: false,
    description: "Patterns of friction that keep showing up across projects or in your work. Not one-time problems, but systemic issues or ongoing struggles.",
    examples: [
      'Dr. Priya Sharma: Never enough time for anything beyond direct patient care. Administrative burden increasing every year. Compassion fatigue is real—need better boundaries.',
      'Marcus Chen: Context switching kills my productivity. I say yes to too many "quick questions." Estimating work for others is harder than estimating for myself.',
      'Sarah Okonkwo: Alignment takes forever at this company. Everyone has to weigh in, decisions get watered down. I also struggle to protect my team\'s time from "drive-by requests" from sales.',
      'Tomás Reyes: Scoping projects accurately. I always underestimate revisions. Admin work expands to fill available time. Saying no to projects that pay well but don\'t excite me.',
      'Jake Moreno: I procrastinate on everything that isn\'t creating. terrible at email. sponsors probably think I\'m dead. no work-life separation since I work from home.'
    ]
  },

  // Section 7 (New)
  {
    id: 'q7a',
    question: 'What life context affects how you work?',
    type: 'textarea',
    placeholder: 'Family, health, location, or other factors...', 
    required: false,
    description: "Family, health, location, time zone, energy patterns, or other factors that shape your availability and capacity. Real constraints and rhythms that influence when and how you can work.",
    examples: [
      'Dr. Priya Sharma: Married, spouse is a teacher. No kids, not planning on them. Live 15 minutes from clinic. I protect my mornings—gym at 5:30am, non-negotiable. Evenings are for documentation until ~7pm, then I\'m done. Weekends are off unless truly urgent. I deal with secondary trauma from patient stories. I have a therapist. I\'m deliberate about compartmentalization—work stays at work.',
      'Marcus Chen: 2-year-old daughter, wife works full-time (teacher). Seattle timezone (PST). Best focus hours: 6-8am before family wakes, 9-11am at office. Energy crashes around 2pm, second wind at 4pm. Trying to exercise 3x/week, actually hitting 1-2x.',
      'Sarah Okonkwo: Two kids, married, live in Austin. I work from home most days, go into the office once a week for in-person collaboration. I\'m most creative in the morning, most operational in the afternoon. I try to exercise at lunch but it\'s inconsistent. I\'m an introvert who\'s learned to perform extroversion for work—I need alone time to recharge.',
      'Tomás Reyes: 34, partnered (she\'s an architect—we get each other\'s deadlines), no kids, one very needy dog who requires midday walks. Denver timezone (MT). I rent a small studio space separate from home—game changer for work-life boundaries. Most creative 8am-12pm. After lunch is execution mode. I try to stop by 6pm but client deadlines sometimes push that.',
      'Jake Moreno: 25, single, live alone in a 1br apartment. my streaming room is also my bedroom is also my office. austin tx so timezone is CST. I stream 4pm-9pm usually. my sleep schedule is chaos—usually 2am-10am. ADHD is the main thing. meds help but I still struggle with boring tasks.'
    ]
  },
  {
    id: 'q7b',
    question: 'Anything else an AI collaborator should know?',
    type: 'textarea',
    placeholder: 'Quirks, preferences, or other details...', 
    required: false,
    description: "Quirks, preferences, past experiences with AI tools, or context that doesn't fit elsewhere. This is the catch-all for important information that hasn't been captured yet.",
    examples: [
      'Dr. Priya Sharma: I\'m interested in AI for clinical decision support and documentation efficiency. Skeptical of AI for diagnosis—I\'ve seen too many edge cases that algorithms miss. I want tools that save me time without compromising care or creating liability issues. When I ask clinical questions, I need accurate sourced information. If you\'re not sure, say so. In my field, confident wrong answers can hurt people.',
      'Marcus Chen: I\'ve used AI coding assistants for a year. Copilot daily, Claude for design discussions and rubber-ducking. I know how to prompt—don\'t over-explain how to interact with you. Just be useful.',
      'Sarah Okonkwo: I\'ve been burned by AI-generated content that sounds generic. I\'m interested in AI as a thinking tool, less interested in it as a content factory. If something sounds like a LinkedIn post written by a robot, I\'ll throw it out. I\'d rather have a rough draft with a real point of view than a polished draft that says nothing.',
      'Tomás Reyes: I\'m interested in AI for the business/writing side—proposals, contracts, naming brainstorms, client communication. Skeptical of AI-generated imagery for actual design work; it\'s a tool for ideation at best, not output. When I ask for creative input, I\'m looking for a thinking partner, not a decorator. Help me solve the problem, don\'t just make it "look good." I care about _why_ something works, not just _that_ it works. Also: I\'m a visual thinker working in a text-based medium when I talk to AI. That\'s a limitation. I\'ll sometimes describe what I\'m seeing or share references—work with me on that.',
      'Jake Moreno: I\'ve tried using AI for scripts and it always sounds wrong. like obviously AI. I want help thinking through stuff, outlining, business planning—not writing my content for me. my voice is my whole brand, can\'t outsource that. also: I\'m not looking for motivation or cheerleading. I know what I need to do, I just need help actually doing it.'
    ]
  },
];

export type IndividualQuestionAnswers = Record<string, string>;