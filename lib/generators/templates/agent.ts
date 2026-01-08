// Agent TELOS Template
// Based on TELOS Framework for Agent Personas

export const AGENT_TEMPLATE_STRUCTURE = `
## I. Identity & Purpose
[Agent name, role definition, and primary function]

## II. Scope & Authority
[What problems it solves and the limits of its authority]

## III. Operating Parameters
[Core values, decision-making logic, and priorities]

## IV. Interaction Protocols
[Communication style, tone, and user interaction rules]

## V. Knowledge & Capabilities
[Active tasks, skills, and knowledge base access]

## VI. Failure Handling
[Constraints, what to do in edge cases, error recovery]

## VII. System Context
[Optional: Environment, integrations, and dependencies]
`;

export function buildAgentPrompt(
  promptText: string,
  answers: Record<string, string>
): string {
  return `You are an expert at creating TELOS (Teleological Operating System) files for AI Agents.

A TELOS file defines an agent's identity, purpose, and operating constraints.

## INPUT DATA

### System Prompt / Agent Config:
${promptText || 'No system prompt provided.'}

### User's Self-Reported Answers:

**Primary Function:**
${answers.function || 'Not provided'}

**Problems Solved:**
${answers.problems || 'Not provided'}

**Operating Parameters:**
${answers.parameters || 'Not provided'}

**Constraints (Never Do):**
${answers.constraints || 'Not provided'}

**Communication Style:**
${answers.communication || 'Not provided'}

**Active Tasks:**
${answers.tasks || 'Not provided'}

**System Context:**
${answers.context || 'Not provided'}

## INSTRUCTIONS

Generate a complete Agent TELOS file following this structure:

### I. Identity & Purpose
- Define the agent's identity and core purpose
- Synthesize from the system prompt if available

### II. Scope & Authority
- Clearly define the scope of the agent's work
- Specify authority levels (what it can/cannot approve)

### III. Operating Parameters
- Define how the agent prioritizes tasks
- Explain its decision-making logic

### IV. Interaction Protocols
- Describe the required tone and communication style
- Define how it starts and ends interactions

### V. Knowledge & Capabilities
- List active tasks and capabilities
- Note any specific knowledge domains it relies on

### VI. Failure Handling
- Explicitly list prohibitions and constraints (from "Never Do")
- Define behavior when confused or unable to complete a task

### VII. System Context
${answers.context ? '- Detail system environment and dependencies' : '- [Not provided by user]'}

## FORMATTING RULES

- Start the document with a Level 1 Markdown header containing the name of the agent (e.g., "# AnalysisBot").
- Use markdown formatting
- Be precise and explicit (machine-readable style preferred)
- Maintain a consistent persona tone
- Keep sections focused
- Use bullet points for lists
- Include section headers exactly as shown
- Do not include any preamble or explanation - start directly with the TELOS content

Generate the TELOS file now:`;
}
