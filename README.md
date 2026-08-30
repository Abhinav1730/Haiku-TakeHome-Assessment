# Hair & scalp intake

Patient-facing GenoRoot intake for a hair clinic. Optional story (type or speak) can pre-fill fields. Everything else is tap-first. The filled form is shown as structured JSON at the end.

Live demo: add the Vercel URL here after deploy.

## Run locally

```bash
npm install
cp .env.example .env.local
# put OPENROUTER_API_KEY in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test    # fixture patients → Zod-valid JSON
npm run build
```

No login. Use a made-up patient. API keys stay on the server.

## What the patient sees

1. Why this exists / about 4 minutes / Start
2. Optional story — skip, type, or speak
3. Confirm anything the model extracted (patient can reject and tap instead)
4. Remaining gaps, one interaction at a time
5. Compact review → submit
6. **Done screen = the filled form** (summary + JSON)

Q6/Q7 (periods, pregnancy) are gated by “Should we ask about periods and pregnancy?” not a gender form. Habits (Q11) are six small questions, not a table. Products/procedures (Q12–13) are “which of these?” then follow-ups only for what applies.

## Choices (bought vs built)

| Bought | Built |
|---|---|
| Next.js, React, Tailwind | Question engine, skip/exclusivity, mapper |
| OpenRouter `:free` chat for extraction | Per-question UIs (cards, chips, expand-only matrices) |
| Browser Web Speech API (voice) | Confirmation of extracted fields |
| Vercel hosting | localStorage resume, fixture tests |
| Geist, Lucide, Sonner | Copy and clinical tone |

We did **not** build a chatbot, TTS, auth, or a database. Voice is never required. Taps never call a model.

### Models

- Extract: `meta-llama/llama-3.3-70b-instruct:free`, then `google/gemma-3-12b-it:free`, then `meta-llama/llama-3.2-3b-instruct:free`
- Voice: browser **Web Speech API** (Chrome/Edge, free, no API key). Typing always works.

`:free` chat is $0 but rate-limited. If extract 429s, the UI continues question-by-question.

## How we tested the fill

`npm test` maps three made-up patients through `toIntakeOutput` and `intakeOutputSchema`:

1. **Impatient male** — skip Q6/Q7 (`Not applicable`), tap-only, minoxidil + oils, no procedures
2. **Calm female** — PCOS, irregular cycle, minoxidil side effects described, PRP 1–3 sessions
3. **None path** — no family history, no products, empty past-6-months array

Also check: family “none” is exclusive; unused product rows have `duration/helped/side_effects: null`.

Manually: finish as a rushed waiting-room patient on a phone; finish with a story + confirm as a calm patient; refresh mid-flow (answers restore).

```bash
npx vercel --yes
npx vercel --prod --yes
```

Set `OPENROUTER_API_KEY` in the Vercel project environment, then redeploy. Invite GitHub: `nikhil@thevectorlabs.in`.
