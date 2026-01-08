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

## V. Technical Context
[Tools, stack, and technical environment]

## VI. Active Projects & Challenges
[Current initiatives and ongoing work]

## VII. Decision Log
[Key career decisions and their reasoning - inferred from CV transitions]

## VIII. Life Context Layer
[Optional: Personal factors that influence professional life]
`;

export function buildIndividualPrompt(
  cvText: string,
  answers: Record<string, string>
): string {
  // Check if this is the new Full flow (has 'q1', 'q2', etc) or legacy
  const isFullFlow = 'q1' in answers || 'q2' in answers;

  if (isFullFlow) {
    return buildFullPrompt(cvText, answers);
  }

  // Legacy Prompt (Phase 1-11)
  return `You are an expert at creating TELOS (Teleological Operating System) files for individuals.

A TELOS file is a comprehensive document that captures an individual's professional identity, mission, values, and operating principles. It serves as a reference for how this person works, what they value, and how they make decisions.

## INPUT DATA

### CV/Resume Content:
${cvText}

### User's Self-Reported Answers:

**Problems They're Trying to Solve:**
${answers.problems || 'Not provided'}

**Mission Statement:**
${answers.mission || 'Not provided'}

**Core Values (Top 3-5):**
${answers.values || 'Not provided'}

**What They Actively Avoid or Constrain:**
${answers.constraints || 'Not provided'}

**Ideal Work Style and Rhythm:**
${answers.workStyle || 'Not provided'}

**Current Active Projects:**
${answers.projects || 'Not provided'}

**Life Context (Optional):**
${answers.lifeContext || 'Not provided'}

## INSTRUCTIONS

Generate a complete TELOS file following this structure:

### I. Identity & History
- Write a 2-3 paragraph summary of who this person is based on their CV
- Highlight their career trajectory, key transitions, and areas of expertise
- Note patterns in their professional development

### II. Problems & Mission
- Synthesize the problems they care about solving
- State their mission clearly
- Connect their background to why these problems matter to them

### III. Values & Constraints
- List and briefly explain each core value
- Explain what they actively avoid and why
- Show how values and constraints work together

### IV. Work Style & Preferences
- Describe their ideal working environment
- Note their preferred collaboration style
- Mention their work rhythm and productivity patterns

### V. Active Projects & Challenges
- List current initiatives with brief descriptions
- Note any challenges or focus areas mentioned
- Connect projects to their broader mission

### VI. Decision Log
- Infer 3-5 key career decisions from their CV
- For each, briefly note the decision and likely reasoning
- Show patterns in how they make professional choices

### VII. Life Context Layer
${answers.lifeContext ? '- Include relevant life context that affects their work' : '- [Not provided by user]'}

## FORMATTING RULES

- Use markdown formatting
- Be specific and actionable
- Maintain a professional but personal tone
- Keep sections focused and concise
- Use bullet points for lists
- Include section headers exactly as shown
- Do not include any preamble or explanation - start directly with the TELOS content

Generate the TELOS file now:`;
}

function buildFullPrompt(cvText: string, answers: Record<string, string>): string {
  return `You are an expert at creating TELOS (Teleological Operating System) files for individuals.

A TELOS file is a comprehensive document that captures an individual's professional identity, mission, values, and operating principles.

## INPUT DATA

### CV/Resume Content:
${cvText || 'No CV provided'}

### User's Self-Reported Answers:

**I. Identity & Background:**
- Who are you: ${answers.q1 || '-'}
- Background: ${answers.q1a || '-'}
- Expert Domains: ${answers.q1b || '-'}
- Learning Domains: ${answers.q1c || '-'}

**II. Problems & Mission:**
- Trying to accomplish: ${answers.q2 || '-'}
- Problems solving: ${answers.q2a || '-'}
- Mission statement: ${answers.q2b || '-'}
- Goals/Timeline: ${answers.q2c || '-'}

**III. Values & Constraints:**
- Values/Avoid: ${answers.q3 || '-'}
- Anti-goals: ${answers.q3a || '-'}
- Hard Constraints: ${answers.q3b || '-'}

**IV. Work Style & Preferences:**
- Preferred Style: ${answers.q4 || '-'}
- Session Type: ${answers.q4a || '-'}
- Stuck/Help: ${answers.q4b || '-'}
- Pushback preference: ${answers.q4c || '-'}
- Feedback style: ${answers.q4d || '-'}

**V. Technical Context:**
- Setup: ${answers.q5a || '-'}
- Skill Level: ${answers.q5b || '-'}
- Languages/Tools: ${answers.q5c || '-'}

**VI. Active Projects & Challenges:**
- Active Projects: ${answers.q6a || '-'}
- Recurring Challenges: ${answers.q6b || '-'}

**VII. Life Context:**
- Life Context: ${answers.q7a || '-'}
- Other Notes: ${answers.q7b || '-'}

## INSTRUCTIONS

Generate a comprehensive TELOS file following this structure:

### I. Identity & History
- Synthesize their self-description with their CV background
- clearly list expert domains and learning areas

### II. Problems & Mission
- Define the core problems they address
- State their mission and current goals clearly

### III. Values & Constraints
- articulate core values
- Explicitly list anti-goals and hard constraints (what they will NOT do)

### IV. Work Style & Preferences
- Detail their ideal work rhythm and session types
- Explain how they want to receive feedback and pushback
- Describe their collaboration preferences

### V. Technical Context
- Outline their stack, tools, and environment
- Note their technical proficiency levels

### VI. Active Projects & Challenges
- List active projects with status
- Note recurring challenges or blockers

### VII. Decision Log
- Infer 3-5 key career decisions from their CV (if provided) or background description
- Show patterns in how they make professional choices

### VIII. Life Context Layer
- Include relevant personal context if provided

## FORMATTING RULES
- Use markdown formatting
- Be specific and actionable
- Maintain a professional but personal tone
- Keep sections focused and concise
- Use bullet points for lists
- Include section headers exactly as shown
- Do not include any preamble or explanation - start directly with the TELOS content

Generate the TELOS file now:`;
}

export function buildIndividualQuickPrompt(
  cvText: string,
  answers: Record<string, string>
): string {
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
- Use markdown formatting
- Be specific and actionable
- Maintain a professional but personal tone
- Keep sections focused and concise
- Do not include any preamble or explanation - start directly with the TELOS content
`;
}
