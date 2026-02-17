# DeepTutor Architecture — SEE Adaptation Notes

## Source: [HKUDS/DeepTutor](https://github.com/HKUDS/DeepTutor)

## Core Components Identified

### 1. Multi-Agent Modules (Intelligent Agent Layer)
DeepTutor uses specialized agents for different learning tasks:
- **Problem Solving Agent**: Step-by-step reasoning with RAG + web search + code execution
- **Guided Learning Agent**: Visual explanations + personalized Q&A with session-based knowledge tracking
- **Question Generator Agent**: Creates practice exercises, mimics exam styles
- **Deep Research Agent**: Topic exploration with dual-filter workflow
- **Idea Generation Agent**: Concept synthesis using multi-source insights

**SEE Adaptation**: We map these to 3 ESL-specific agents:
- `DiagnosisAgent` — reads learner profile + diagnosticEngine to assess current state
- `LessonPlannerAgent` — selects next exercise, picks conversation prompts, recommends videos
- `FeedbackAgent` — generates emotion-aware CEFR feedback using psy profile

### 2. RAG Layer (Tool Integration)
DeepTutor uses hybrid retrieval (vector + knowledge graph), web search, Python execution, PDF parsing.

**SEE Adaptation**: Lightweight `ToolLayer` interface with:
- `searchLessons(query)` — searches over local JSON lesson data
- `tts(text)` — stub for Kokoro TTS integration
- `log(event, data)` — structured event logging for research

### 3. Knowledge & Memory Foundation
- **Knowledge Graph**: Entity-relation mapping for semantic connections
- **Vector Store**: Embedding-based semantic search
- **Memory System**: Session state + citation tracking

**SEE Adaptation**: We use `localStorage` for session state (learner profile, progress) and structured JSON as our knowledge base. No vector store needed at this scale.

### 4. Data Structures Relevant for ESL
| DeepTutor Concept | SEE Equivalent |
|---|---|
| User Session | `LearnerProfile` (axes, labels, paths) |
| Tasks/Exercises | `SeeExercise[]` linked to lessons |
| Tools | `ToolLayer` (search, TTS, logging) |
| Graph/Vector Store | `see_learning_system.json` (structured curriculum) |
| Notebooks | Not implemented (future: learner notes) |

### 5. Key Architecture Decisions
- **No code import**: We adapt DeepTutor's *patterns* (multi-agent orchestration, tool-calling, session memory) without copying source code
- **Edge-function agents**: Agent logic runs in Supabase Edge Functions, not Python
- **JSON-first RAG**: Instead of vector embeddings, we do direct JSON filtering on lessons/exercises
- **Emotion-aware loop**: Unlike DeepTutor, SEE inserts emotion checks mid-conversation based on the learner's anxiety profile
