// Organization TELOS Template
// Based on Corporate TELOS Example

export const ORGANIZATION_TEMPLATE_STRUCTURE = `
## I. Identity & History
[Organization name, founding history, key milestones]

## II. Problems & Mission
[Core market problems addressed and the organizational mission]

## III. Values & Operating Principles
[Core values and the principles that guide operations]

## IV. Decision-Making & Processes
[How decisions are made, governance, and operational structure]

## V. Active Initiatives
[Current strategic programs and projects]

## VI. Organizational Evolution
[Log of key pivots and strategic decisions]

## VII. Stakeholder Context
[Optional: Key relationships and ecosystem context]
`;

export function buildOrganizationPrompt(
  aboutText: string,
  answers: Record<string, string>
): string {
  return `You are an expert at creating TELOS (Teleological Operating System) files for organizations.

A TELOS file is a comprehensive document that captures an organization's identity, mission, values, and operating principles.

## INPUT DATA

### About Page / Organization Info:
${aboutText || 'No background information provided.'}

### User's Self-Reported Answers:

**Problems Solved:**
${answers.problems || 'Not provided'}

**Mission:**
${answers.mission || 'Not provided'}

**Core Values:**
${answers.values || 'Not provided'}

**Explicit Avoidance/Constraints:**
${answers.constraints || 'Not provided'}

**Operations & Decision Making:**
${answers.operations || 'Not provided'}

**Current Initiatives:**
${answers.initiatives || 'Not provided'}

**Key Stakeholders:**
${answers.stakeholders || 'Not provided'}

## INSTRUCTIONS

Generate a complete Organization TELOS file following this structure:

### I. Identity & History
- Synthesize the organization's identity from the provided text.
- FILTER OUT IRRELEVANT NOISE: Ignore financial tables, generic boilerplate, HR announcements, temporary logistics (e.g. server maintenance), or specific employee names unless founders.
- Focus purely on the enduring identity, history, and founding context.

### II. Problems & Mission
- Extracted from the text, looking for keywords like "Mission", "Purpose", "Why we exist".
- Ignore marketing fluff; look for the concrete problem being solved.

### III. Values & Operating Principles
- List core values and explain them
- Include "Anti-Goals" or constraints based on what they avoid

### IV. Decision-Making & Processes
- Describe how the organization operates
- Detail decision-making frameworks or governance structures

### V. Active Initiatives
- List current major programs or strategic initiatives
- Note their status and priority if clear

### VI. Organizational Evolution
- Infer a "Decision Log" of major strategic choices from the history/about text
- Note how the organization has evolved over time

### VII. Stakeholder Context
${answers.stakeholders ? '- Detail key stakeholder relationships' : '- [Not provided by user]'}

## FORMATTING RULES

- Start the document with a Level 1 Markdown header containing the name of the organization (e.g., "# Acme Corp").
- Use markdown formatting
- Be specific and professional
- Maintain a corporate but authentic tone
- Keep sections focused
- Use bullet points for lists
- Include section headers exactly as shown
- Do not include any preamble or explanation - start directly with the TELOS content

Generate the TELOS file now:`;
}
