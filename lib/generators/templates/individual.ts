// Individual TELOS Template
// Based on Daniel Miessler's TELOS Framework

export const INDIVIDUAL_TEMPLATE_STRUCTURE = `
## I. Identity & History
[Summary of who this person is based on their CV - career path, key experiences, expertise areas]

## II. Problems & Mission
[The problems they're trying to solve and their stated mission]

## III. Values & Constraints
[Their core values and what they actively avoid or constrain]

## IV. Work Style & Preferences
[How they prefer to work - environment, schedule, collaboration style]

## V. Active Projects & Challenges
[Current initiatives and ongoing work]

## VI. Decision Log
[Key career decisions and their reasoning - inferred from CV transitions]

## VII. Life Context Layer
[Optional: Personal factors that influence professional life]
`;

export function buildIndividualPrompt(
  cvText: string,
  answers: Record<string, string>,
  mode?: 'quick' | 'full'
): string {
  // If explicitly Quick mode or we only have the first 5 questions
  if (mode === 'quick') {
    return buildQuickPrompt(cvText, answers);
  }

  // Otherwise, default to Full mode
  return buildFullPrompt(cvText, answers);
}

function buildQuickPrompt(cvText: string, answers: Record<string, string>): string {
  return `Generate a Quick TELOS file for an individual.

CV DATA (if provided):
${cvText || 'No CV provided'}

USER ANSWERS:
**Q1: Who are you in one paragraph?**
${answers.q1 || 'Not provided'}

**Q2: What are you trying to accomplish?**
${answers.q2 || 'Not provided'}

**Q3: What do you value and what do you avoid?**
${answers.q3 || 'Not provided'}

**Q4: How do you prefer to work and receive information?**
${answers.q4 || 'Not provided'}

**Q5: What are you currently working on?**
${answers.q5 || 'Not provided'}

Create a concise TELOS with these sections:
I. Identity (synthesize from Q1 + CV)
II. Purpose & Mission (from Q2)
III. Values & Constraints (from Q3)
IV. Work Style (from Q4)
V. Active Projects (from Q5)

Keep it practical and actionable. This is version 1.0 - user may expand later.

## FORMATTING RULES
- Start the document with a Level 1 Markdown header containing the name of the individual (e.g., "# John Doe").
- Use markdown formatting
- Be specific and actionable
- Maintain a professional but personal tone
- Keep sections focused and concise
- Do not include any preamble or explanation - start directly with the TELOS content
`;
}

function buildFullPrompt(cvText: string, answers: Record<string, string>): string {
  return `You are an expert at creating TELOS (Teleological Operating System) files for individuals.

A TELOS file is a comprehensive document that captures an individual's professional identity, mission, values, and operating principles.

## INPUT DATA

### CV/Resume Content:
${cvText || 'No CV provided'}

### User's Self-Reported Answers:

**I. Identity & Background:**
- Identity Summary (Quick): ${answers.q1 || '-'}
- Professional Background: ${answers.q1a || '-'}
- Expert Domains: ${answers.q1b || '-'}
- Learning Domains: ${answers.q1c || '-'}

**II. Problems & Mission:**
- Core Objective (Quick): ${answers.q2 || '-'}
- Problems actively solving: ${answers.q2a || '-'}
- Mission Statement: ${answers.q2b || '-'}
- Goals/Timeline: ${answers.q2c || '-'}

**III. Values & Constraints:**
- Values/Avoidances (Quick): ${answers.q3 || '-'}
- Anti-goals: ${answers.q3a || '-'}
- Hard Constraints: ${answers.q3b || '-'}

**IV. Work Style & Preferences:**
- Work Style (Quick): ${answers.q4 || '-'}
- Session Type: ${answers.q4a || '-'}
- Stuck/Help: ${answers.q4b || '-'}
- Pushback preference: ${answers.q4c || '-'}
- Feedback style: ${answers.q4d || '-'}

**V. Technical Context:**
- Setup: ${answers.q5a || '-'}
- Skill Level: ${answers.q5b || '-'}
- Languages/Tools: ${answers.q5c || '-'}

**VI. Active Projects & Challenges:**
- Current Work (Quick): ${answers.q5 || '-'}
- Active Projects Detail: ${answers.q6a || '-'}
- Recurring Challenges: ${answers.q6b || '-'}

**VII. Decision Log (Infer from CV/Background)**

**VIII. Life Context Layer:**
- Context: ${answers.q7a || '-'}
- Other Notes: ${answers.q7b || '-'}

## INSTRUCTIONS

Generate a comprehensive TELOS file following this structure:

### I. Identity & History
- Synthesize their self-description (Q1) with their CV background and Q1a
- clearly list expert domains and learning areas

### II. Problems & Mission
- Define the core problems they address (combine Q2 and Q2a)
- State their mission and current goals clearly

### III. Values & Constraints
- articulate core values (Q3)
- Explicitly list anti-goals and hard constraints (what they will NOT do)

### IV. Work Style & Preferences
- Detail their ideal work rhythm (Q4) and session types
- Explain how they want to receive feedback and pushback
- Describe their collaboration preferences

### V. Technical Context
- Outline their stack, tools, and environment
- Note their technical proficiency levels

### VI. Active Projects & Challenges
- List active projects with status (combine Q5 and Q6a)
- Note recurring challenges or blockers

### VII. Decision Log
- Infer 3-5 key career decisions from their CV (if provided) or background description
- Show patterns in how they make professional choices

### VIII. Life Context Layer
- Include relevant personal context if provided

## FORMATTING RULES
- Start the document with a Level 1 Markdown header containing the name of the individual (e.g., "# John Doe").
- Use markdown formatting
- Be specific and actionable
- Maintain a professional but personal tone
- Keep sections focused and concise
- Use bullet points for lists
- Include section headers exactly as shown
- Do not include any preamble or explanation - start directly with the TELOS content

Generate the TELOS file now:`;
}