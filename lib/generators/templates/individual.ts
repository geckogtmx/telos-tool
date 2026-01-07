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
  answers: Record<string, string>
): string {
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
