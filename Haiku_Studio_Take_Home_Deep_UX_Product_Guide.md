# Haiku Studio Take-Home — Deep UX & Product Thinking Guide

## Purpose

This document explains how to approach the Haiku Studio take-home assignment as a product/UX problem rather than simply a coding exercise.

> **Core idea:** The patient's goal is not to "use AI" or "fill a form." The goal is to provide the clinic with useful, accurate information with as little friction, confusion, and anxiety as possible.

The assignment gives you:
- A hair-clinic patient
- 16 medical-intake questions
- A fixed final form/schema
- Freedom over everything the patient sees
- Freedom to use voice, taps, AI, text, or a combination
- A 6–10 hour expected effort

The evaluator is explicitly interested in:
- How it feels to use
- Product judgment
- UX decisions
- Taste
- Ideas
- Resourcefulness
- Your ability to explain why you built it that way

---

# 1. What the Assignment Is Really Testing

The surface-level task is:

> Build a 16-question medical intake.

The deeper task is:

> Given a real user, a fixed output contract, limited time, and freedom over implementation, can you design the simplest and most intuitive experience that reliably gets the required information?

This is very different from:

> "Can you build a form?"

A generic implementation might look like:

```text
Question 1
Input
Next

Question 2
Input
Next

...

Question 16
Input
Submit
```

It may technically work, but it doesn't demonstrate much product thinking.

A stronger implementation asks:

- What is the patient trying to accomplish?
- Which questions are easy to answer?
- Which require thought?
- Which are sensitive?
- Which should be taps rather than typing?
- Where can voice genuinely reduce effort?
- Where would AI add risk rather than value?
- What happens when the patient doesn't know?
- What happens when they change their mind?
- How do we make 16 questions feel short?
- How do we prevent the patient from feeling like they are taking a test?

---

# 2. Design for Two Very Different Patients

A particularly useful mental model is to design for two extremes.

## Patient A — Calm and Cooperative

Imagine:

- They have time.
- They are sitting comfortably.
- They want to give accurate information.
- They don't mind reading a little.
- They may appreciate explanations.
- They may want to describe their situation in their own words.

They value:

- Clarity
- Trust
- Context
- Ability to elaborate
- Ability to review
- Feeling understood

---

## Patient B — Impatient and Distracted

Imagine:

- They are in the clinic waiting room.
- They may have already waited 20 minutes.
- They are on their phone.
- Other people are around them.
- They want to finish quickly.
- They don't want to listen to a long AI conversation.
- They don't want to type long answers.

They value:

- Speed
- Large obvious controls
- Minimal reading
- Minimal typing
- No unnecessary animation
- Clear progress
- Easy correction
- "Not sure" options
- No repetitive questions

---

## The Product Goal

Do NOT create two separate experiences.

Instead:

> **Fast by default, conversational when useful.**

A calm patient can slow down and elaborate.

An impatient patient can tap through quickly.

Both should feel like the same product.

---

# 3. The Most Important UX Principle

## The patient's goal is completion, not conversation.

This is especially important if you use AI.

A flashy interface might say:

> "Hi! I'm your intelligent AI medical assistant. I'll guide you through your personalized healthcare journey."

That sounds impressive in a demo.

But a patient may think:

> "Bhai, mujhe bas form bharna hai."

The product should not make the technology more important than the task.

Instead:

> "A few quick questions will help your clinician prepare for your consultation."

That immediately communicates value.

---

# 4. First Screen

The first screen should answer three questions.

### Why am I doing this?

> "This helps your clinician understand your concerns before your consultation."

### How long will it take?

> "About 4 minutes."

### What should I do?

> `[ Start ]`

Example:

```text
Before your consultation

A few quick questions will help
your clinician prepare for your visit.

About 4 minutes

[ Start ]
```

Avoid unnecessary onboarding.

Do not force the user to configure:
- Voice preferences
- AI preferences
- Account settings
- Notification settings
- Personality
- Long explanations

unless they are genuinely necessary.

---

# 5. One Question at a Time

For a medical intake, one clear question per screen is often easier than a large form.

Instead of:

```text
Medical History

Name: ______
Age: ______
Concern: ______
Duration: ______
Medication: ______
Family history: ______
...
```

Use:

```text
What brings you in today?

[ Hair loss ]

[ Hair thinning ]

[ Receding hairline ]

[ Something else ]
```

Benefits:

- Lower cognitive load
- Easier on mobile
- Clear focus
- Easier to make each interaction appropriate to the question
- Feels faster

But don't blindly use one-screen-per-question for everything. The interaction should depend on the question.

---

# 6. Interaction Should Follow the Question

This is one of the strongest product principles for this assignment.

## Simple structured answer → Tap

Example:

```text
Have you experienced hair loss before?

[ Yes ]
[ No ]
[ Not sure ]
```

No need for AI.

---

## Single choice → Large cards

```text
When did you first notice it?

[ Less than 6 months ago ]

[ 6–12 months ago ]

[ 1–2 years ago ]

[ More than 2 years ago ]

[ I'm not sure ]
```

---

## Multiple choice → Chips or checkboxes

```text
Where have you noticed hair loss?

[ Scalp ] [ Eyebrows ]
[ Beard ] [ Eyelashes ]
[ Other ]
```

---

## Number → Numeric input

If the schema requires age:

```text
How old are you?

[ 24 ]

years old
```

Use the appropriate mobile keyboard.

---

## Date → Date picker

If exact date is required, use a date picker.

If exact date is NOT required, don't force unnecessary precision.

---

## Long explanation → Text + optional voice

```text
Tell us about treatments you've tried.

[ Type your answer... ]

🎙 Speak instead
```

This is where voice has real value.

---

# 7. Don't Make the Patient Tap "Next" Unnecessarily

Traditional forms often do:

```text
Choose answer
       ↓
Tap Next
```

If choosing the answer is sufficient to continue, remove the extra step.

Example:

```text
What brings you in today?

[ Hair loss ]
[ Hair thinning ]
[ Receding hairline ]
```

Tap "Hair loss" → continue.

This is particularly helpful for impatient users.

However, don't auto-advance when:
- The user can select multiple answers
- The answer needs confirmation
- The interaction is ambiguous
- The patient may want to edit
- A destructive action is involved

---

# 8. Progress Is a Psychological Tool

Sixteen questions can feel long.

You need to continuously answer:

> "How much longer?"

Useful formats:

```text
7 of 16
```

or:

```text
7 of 16 · About 2 min left
```

This is particularly powerful.

An impatient patient sees:

> "Only 9 left."

A calm patient sees:

> "I'm making progress."

Avoid making it feel like an exam.

A subtle progress indicator is better than an aggressive progress bar.

---

# 9. Never Force False Certainty

Medical intake is different from a normal survey.

People may genuinely not know.

If you ask:

> "Have you used any hair-loss medication?"

A patient may think:

> "I don't remember the name."

Don't force:

```text
[ Yes ]
[ No ]
```

Use:

```text
[ Yes ]
[ No ]
[ Not sure ]
```

Potentially:

```text
[ I'd rather explain ]
```

where appropriate.

This improves both UX and data quality.

---

# 10. "Other" Must Actually Work

Don't use an "Other" option and then make it painful.

Good:

```text
Anything else you'd like your clinician to know?

[ Type something... ]

🎙 You can also speak
```

The user gets a natural escape hatch.

---

# 11. Voice: Useful, but Don't Make It Mandatory

Voice is attractive for a demo.

But think like a real patient.

A patient might be:

- In a waiting room
- Around strangers
- Wearing headphones
- In a noisy environment
- Uncomfortable saying medical information aloud
- Simply faster at tapping

Therefore:

## Voice should be optional.

A strong pattern:

```text
Tell us about any previous treatment.

[ Type your answer... ]

🎙 Speak instead
```

The patient chooses.

Do not make voice the only way to proceed.

---

# 12. AI: Use It Where It Removes Friction

AI should not be present simply because this is an AI-focused company.

A good use case:

Patient says:

> "I've been losing hair for around two years, mostly at the front, and it became worse recently."

AI can help convert this into structured information if those fields exist in the schema.

Conceptually:

```text
Patient language
      ↓
AI extraction
      ↓
Structured candidate values
      ↓
Validation
      ↓
Patient confirmation
      ↓
Final schema
```

This can reduce several repetitive questions.

---

# 13. Important Medical AI Boundary

Do NOT let AI turn intake into diagnosis.

Bad:

> "This sounds like male pattern baldness."

Better:

> "I heard that you've experienced hair loss for around two years, mainly at the front. Is that correct?"

Then:

```text
[ Yes, continue ]

[ Change ]
```

The AI's role should be:

> **Capture and structure what the patient said.**

Not:

> **Decide what medical condition the patient has.**

---

# 14. Patient Remains the Source of Truth

This is a strong principle you can use in the interview.

If the patient says:

> "I started using minoxidil around last summer."

Do not silently infer an exact date.

Instead:

```text
Just to confirm:

You started using minoxidil
around summer 2025?

[ Yes ]

[ Change ]
```

This gives the patient control.

A useful rule:

> **AI can accelerate input, but the patient owns the final answer.**

---

# 15. Use AI for Normalization, Not Guessing

Suppose a patient says:

> "No meds."

Possible interpretation:

```json
{
  "medications": []
}
```

That might be safe if the context makes it unambiguous.

But if the patient says:

> "I used something a while back, don't remember the name."

Do not invent a medication name.

Preserve uncertainty.

Possible internal representation:

```json
{
  "medication": null,
  "patient_uncertain": true,
  "raw_response": "I used something a while back, don't remember the name."
}
```

Then map only what the final schema actually permits.

---

# 16. Medical Language Should Be Human

Don't make patients decode clinical terminology.

Instead of:

> "Do you have a history of androgenetic alopecia?"

Prefer understandable language where the schema permits:

> "Has anyone in your family experienced hair loss?"

If a clinical term is unavoidable:

```text
Have you ever been diagnosed with alopecia?

ⓘ Alopecia means hair loss.
```

Use progressive disclosure.

Don't put long medical explanations on every screen.

---

# 17. Progressive Disclosure

This is especially useful for balancing calm and impatient users.

### Impatient user

Sees:

```text
Have you used any hair-loss treatment?

[ Yes ]
[ No ]
[ Not sure ]
```

They answer immediately.

### Calm user

Can tap:

```text
ⓘ Why are we asking?
```

and see a short explanation.

The key principle:

> **Make information available without making it mandatory to consume.**

---

# 18. Make Every Answer Reversible

Medical information is sensitive.

Patients will make mistakes.

Provide:

```text
← Back
```

and preserve their previous answers.

A patient should never fear:

> "If I go back, I'll lose everything."

Avoid:
- Resetting the form
- Clearing answers
- Making users repeat previous sections

---

# 19. Add a Compact Review Before Submission

At the end, don't force users through all 16 questions again.

Show a summary:

```text
Your intake

Main concern
Hair loss

Started
About 2 years ago

Previous treatment
Minoxidil

Family history
Yes

[ Edit ]

[ Submit intake ]
```

Impatient user:

> Looks good → Submit.

Calm user:

> Notices an error → Edit.

This serves both.

---

# 20. Error Recovery

Good UX assumes users will make mistakes.

Suppose the user accidentally selects "No".

They should be able to change it easily.

Avoid:

> "Invalid answer."

Prefer:

> "I didn't quite get that."

Then provide clear options.

For voice:

```text
I didn't quite catch that.

You can choose an option below
or try speaking again.

[ Try again ]

[ Not sure ]
```

Never make the user feel stupid.

---

# 21. Friction Budget

A useful way to reason about every interaction is to give it a "friction cost."

### Very low friction

Tap:

> Yes

### Low friction

Choose one option:

> 1–2 years

### Medium friction

Select multiple options.

### Higher friction

Type a sentence.

### Higher still

Speak → wait for transcription → review.

Therefore:

> **Do not spend high-friction interactions on low-value questions.**

If a yes/no question can be answered with one tap, don't make the user have a conversation with an AI.

---

# 22. The Best UX May Be Hybrid

A strong overall experience could look like:

```text
Structured questions
        ↓
       Taps
        ↓
Complex/open-ended questions
        ↓
   Text + Voice
        ↓
AI where useful
        ↓
Patient confirmation
        ↓
Schema validation
        ↓
Final intake
```

This is better than:

> "Everything is a chatbot."

The technology should adapt to the user's needs.

---

# 23. Suggested High-Level User Flow

```text
Landing
   ↓
Short explanation
   ↓
Start
   ↓
Question 1
   ↓
Question 2
   ↓
...
   ↓
Question 16
   ↓
Compact review
   ↓
Submit
   ↓
Success
```

Within individual questions:

```text
Question
   ↓
Best interaction for that question
   ↓
Immediate feedback
   ↓
Next question
```

For complex responses:

```text
Patient speaks/types
        ↓
AI extracts structured values
        ↓
Show interpretation
        ↓
Patient confirms
        ↓
Continue
```

---

# 24. Final Schema Is the Contract

The fixed schema is the most important technical constraint.

Think of the system as:

```text
                PATIENT
                   |
                   v
          +----------------+
          |   Your UX      |
          |                |
          | Tap / Voice /  |
          | Text / AI      |
          +-------+--------+
                  |
                  v
          +----------------+
          | Answer Mapping |
          +-------+--------+
                  |
                  v
          +----------------+
          | Validation     |
          | against schema |
          +-------+--------+
                  |
                  v
          +----------------+
          | Final Intake   |
          | JSON           |
          +----------------+
```

The patient-facing experience can be creative.

The final output must be disciplined.

---

# 25. Build Around the Schema, Not Around Your UI

Do not start by building screens.

First understand:

- Every required field
- Optional fields
- Allowed values
- Types
- Nested objects
- Arrays
- Nullability
- Whether "unknown" is allowed
- Whether free text is allowed

Then map each field to the best interaction.

Conceptually:

| Data requirement | Patient interaction |
|---|---|
| Boolean | Yes / No |
| Enum | Tap cards |
| Multi-select | Chips |
| Number | Numeric input |
| Date | Date picker |
| Free text | Text + voice |
| Uncertain | Not sure |
| Complex natural language | AI-assisted capture |

The exact mapping must be based on the actual schema.

---

# 26. Edge Cases You Should Explicitly Think About

Before coding, create an edge-case checklist.

## Patient uncertainty

> "I don't know."

## Patient correction

> "Actually, no."

## Patient gives extra information

> "I've been using it for two years, but it got much worse recently."

## Patient gives multiple answers at once

> "Yes, my father had it and I started losing hair about three years ago."

## Patient refuses

> "I'd rather not answer."

If the schema allows it, preserve that choice.

## Voice misunderstanding

AI hears:

> "Two years."

but patient meant:

> "Twenty years."

Provide confirmation.

## Refresh / accidental close

Don't lose everything if persistence is feasible within the time budget.

## Network/API failure

The interface should fail gracefully.

## AI failure

The user should still be able to continue manually.

This last point is very important:

> **AI should be an accelerator, not a single point of failure.**

---

# 27. What NOT to Build

Because the assignment says 6–10 hours, scope discipline matters.

Avoid spending most of your time on:

- Microservices
- Kubernetes
- Complex authentication
- Admin dashboards
- Analytics platforms
- Elaborate database architecture
- Complex role management
- Unnecessary backend infrastructure
- Huge design systems
- AI avatars just for visual impact

The patient doesn't care.

Prioritize:

1. Patient UX
2. Correct schema output
3. Reliability
4. Edge cases
5. Visual polish
6. AI/voice only where useful

---

# 28. A Practical 6–10 Hour Plan

## 0:00–0:45 — Understand

Read:
- Brief
- Schema
- All 16 questions

Create a simple mapping:

```text
Question
→ Field
→ Answer type
→ Best interaction
→ Edge cases
```

---

## 0:45–1:30 — UX Design

Decide:

- Entry screen
- Progress pattern
- Question layout
- Interaction types
- Back behavior
- Review screen
- Completion state
- Voice/AI usage

Do not code yet.

---

## 1:30–4:30 — Core Build

Implement:

- Mobile-first UI
- 16-question flow
- State management
- Back/forward
- Validation
- Schema mapping

Get the complete flow working first.

---

## 4:30–6:00 — AI/Voice

Only if it genuinely improves the experience.

Implement the smallest useful version.

Example:

```text
Speak
 ↓
Transcription
 ↓
Extraction
 ↓
Confirmation
 ↓
Structured answer
```

Don't build a full AI assistant unless the experience actually benefits.

---

## 6:00–7:00 — Edge Cases

Test:

- Back
- Change answer
- Not sure
- Other
- Empty response
- Unexpected response
- AI failure
- Network failure
- Refresh

---

## 7:00–8:00 — Polish

Focus on:

- Typography
- Spacing
- Mobile layout
- Button size
- Loading states
- Transitions
- Error states
- Progress
- Completion

---

## 8:00–9:00 — Final Testing

Use the product like a patient.

Do one run as:

### Calm patient

Take your time.

Then:

### Impatient patient

Try to finish as quickly as possible.

If both experiences feel good, you're in a strong position.

---

## 9:00–10:00 — Demo

Prepare:

- Live URL
- Repo
- 2-minute recording
- Short explanation of decisions

---

# 29. Test It Like an Impatient Patient

Do this deliberately.

Start a timer.

Try to answer all questions without reading anything unnecessary.

Ask:

- Did I have to type?
- Did I have to click Next unnecessarily?
- Did I understand every question immediately?
- Did I know how many questions remained?
- Did anything slow me down?
- Did the UI ever make me wait unnecessarily?
- Could I correct mistakes easily?

Then ask:

> **"Where did the product make me work harder than necessary?"**

Fix those things.

---

# 30. Test It Like a Calm Patient

Now intentionally slow down.

Ask:

- Can I understand why information is being requested?
- Can I elaborate when needed?
- Can I correct information?
- Does it feel trustworthy?
- Does the interface feel respectful?
- Are sensitive questions worded neutrally?
- Can I understand unfamiliar terms?
- Do I feel like my answers are being recorded accurately?

This catches different problems.

---

# 31. A Strong Design Principle for the Entire Product

You can summarize the product philosophy as:

> **Fast when the answer is simple. Conversational when the answer is complex. Transparent when AI is involved. Forgiving when the patient makes a mistake.**

That's an excellent north star.

---

# 32. A Strong AI Principle

Another useful statement:

> **Use AI to reduce patient effort, not to increase the amount of AI in the product.**

If AI saves three taps and 10 seconds, great.

If AI adds:
- Loading time
- Confusion
- Voice interaction
- Confirmation screens
- Uncertainty

then don't use it.

This is product judgment.

---

# 33. A Strong Medical Principle

> **The system can structure information, but it should never silently invent information.**

If the patient doesn't know:

```text
Not sure
```

should remain:

```text
Not sure
```

not become an AI guess.

If the patient says:

> "Something my doctor prescribed."

Don't invent a medication name.

Preserve uncertainty.

---

# 34. What the 2-Minute Recording Should Demonstrate

Don't spend two minutes describing your tech stack.

The evaluator already knows you can code.

Show the product and your reasoning.

## 0:00–0:20 — Philosophy

> "I approached this as a patient-experience problem rather than a form-building problem. The goal is to collect accurate information with minimum friction."

## 0:20–0:50 — Core UX

Show:

- Start
- A simple tap question
- Progress
- Another question

Explain:

> "I use tap-first interactions wherever the answer is structured because they're faster than typing or talking."

## 0:50–1:20 — Interesting interaction

Show:

- Open-ended question
- Voice/text
- AI extraction if implemented
- Confirmation

Explain:

> "I use AI only where natural language reduces effort. It structures what the patient says rather than diagnosing or guessing."

## 1:20–1:45 — Edge cases

Show:

- Not sure
- Back/edit
- Review

Explain:

> "Medical intake needs to handle uncertainty and correction gracefully."

## 1:45–2:00 — Tradeoff

Say:

> "Given the 6–10 hour constraint, I prioritized the patient-facing flow, schema reliability, and edge cases over unnecessary infrastructure."

---

# 35. Potential Interview Questions

If the assignment goes well, expect them to ask about decisions.

## "Why did you choose this UX?"

Answer around:
- patient effort
- information type
- speed
- clarity

## "Why AI?"

Answer:

> "Only where it reduced effort. I didn't want AI to become the product."

## "Why not make it voice-first?"

Answer:

> "Voice isn't always appropriate in a clinic environment, and structured questions are usually faster to answer with a tap."

## "What if the AI gets it wrong?"

Answer:

> "The patient remains the source of truth. AI interpretations are shown for confirmation, and manual input remains available."

## "What would you build next?"

Good answers:
- Better persistence
- More robust voice fallback
- Accessibility testing
- Real clinic validation
- Analytics around completion/drop-off
- Localization
- Better schema validation

Avoid:

> "I'd add more AI."

Unless there is a concrete reason.

---

# 36. What "Taste" Means Here

Taste is not:

- More animations
- More gradients
- More AI
- More features

Taste is knowing:

> **what not to build.**

Examples:

Good:

> "I removed the Next button where selection itself is unambiguous."

Good:

> "I don't ask users to choose voice mode upfront."

Good:

> "I provide Not sure rather than forcing an inaccurate answer."

Good:

> "I use explanations only when users ask for them."

Good:

> "I keep AI optional and fall back to manual input."

These small decisions communicate maturity.

---

# 37. What "Resourcefulness" Means

They gave you a limited time budget.

Resourcefulness means:

> Can you turn a vague requirement into a polished working experience quickly?

You can use:

- AI coding tools
- Existing UI libraries
- Speech-to-text APIs
- LLM APIs
- Browser APIs
- Existing components
- Free services

But don't confuse resourcefulness with using the most technologies.

A simple product that feels excellent is more impressive than a complicated architecture that feels mediocre.

---

# 38. The Ideal Architecture

Keep it simple.

Conceptually:

```text
Frontend
  |
  +-- Question Engine
  |
  +-- Form State
  |
  +-- Voice Input (optional)
  |
  +-- AI Extraction (optional)
  |
  +-- Validation
  |
  +-- Schema Mapping
  |
  +-- Review
  |
  +-- Submit
```

You probably don't need a huge backend unless the brief explicitly requires persistence/server behavior.

---

# 39. The Most Important Metric

Don't optimize for:

> Number of AI calls

or:

> Number of features

or:

> Lines of code

Optimize for:

## **Successful completion with accurate answers and minimal friction.**

Possible conceptual metrics:

- Completion rate
- Average completion time
- Drop-off per question
- Number of corrections
- Number of AI misunderstandings
- Number of manual fallbacks
- Percentage of required fields completed

Even if you don't implement analytics, thinking in these terms demonstrates product maturity.

---

# 40. Final Mental Model

Before writing any code, imagine this person:

> A real patient has just entered a hair clinic.

They open your app.

You have roughly four goals:

### 1. Make them understand what to do.

### 2. Make each answer as easy as possible.

### 3. Never make them feel stupid or trapped.

### 4. Deliver accurate structured information to the clinic.

Everything else is secondary.

---

# 41. The One-Sentence Product Strategy

If you need one sentence to guide the entire build:

> **"Make the fastest path the easiest path, while giving patients control whenever the information is uncertain or nuanced."**

---

# 42. The One-Sentence AI Strategy

> **"Use AI as a quiet assistant for messy human input, not as the star of the experience."**

---

# 43. The One-Sentence Medical Safety Strategy

> **"Never silently convert uncertainty into certainty."**

---

# 44. The One-Sentence FDE Strategy

> **"Start from the user's problem, work backward from the required outcome, and spend engineering effort where it changes the user's experience."**

---

# 45. Important Next Step

The exact 16-question analysis should be done from the actual assignment files, not guessed.

Once `take-home.pdf` and `intake-schema.json` are available, create a table like:

| # | Question | Schema Field | Patient Psychology | Best UI | AI? | Edge Cases |
|---|---|---|---|---|---|---|
| 1 | Actual question | Actual field | Analysis | Interaction | Yes/No | Cases |
| 2 | Actual question | Actual field | Analysis | Interaction | Yes/No | Cases |
| ... | ... | ... | ... | ... | ... | ... |
| 16 | Actual question | Actual field | Analysis | Interaction | Yes/No | Cases |

That is the next level of analysis.

The strongest implementation should come **after** this mapping, because the schema is the fixed contract and the patient experience is the part you are being asked to design.
