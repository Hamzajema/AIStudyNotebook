# Study Notebook App

A notebook-style study management application with AI-enhanced features, advanced search, tagging, analytics and import/export. Designed as a Create React Express App project with optional AI integrations.

## Quick summary
This app helps capture and organize study notes like a physical notebook, while adding digital capabilities:
- Rich note-taking with subjects and tags
- Full-text search across notes and metadata
- Optional AI features for summarization and question generation
- Export / Import for backups (JSON/CSV)
- Study analytics (time spent, notes created, tag usage)
- Dark / Light theme and responsive UI

## Key goals
- Capture and organize study notes like a physical notebook.
- Quickly find content via full-text search and tags.
- Use optional AI features for summarization and question generation.
- Provide export/import for backups and simple analytics to track study progress.

## Features (detailed)
- Notebook UI: pages, subjects, note editor with simple formatting and ruled lines.
- Notes: create, edit, delete, pin, archive.
- Subjects & Tags: hierarchical or flat subjects, flexible tags for filtering.
- Search: full-text search (title, body, tags, subjects) with ranking and filters.
- AI (optional): automatic summarization, question/quiz generation, topic extraction.
- Export/Import: JSON export/import with conflict resolution; CSV for flat exports.
- Analytics: session tracking, notes/time per subject, top tags, creation timeline.
- Themes: dark/light mode and persisted user preference.
- Persistence: localStorage or IndexedDB (switchable) with an abstraction layer.

## Project structure (typical)
- src/
  - components/ — presentational components (NoteCard, Editor, SearchBar, TagList)
  - pages/ — app pages (NotebookView, SubjectView, Settings)
  - hooks/ — reusable hooks (useNotes, useSearch, useAnalytics)
  - services/ — storage and AI integration (storageService, aiService)
  - utils/ — helpers (date, export/import, text-processing)
  - models/ — TypeScript types or JS schemas for Note, Subject, Tag
  - App.tsx / index.tsx — app entry
- public/ — static assets

## Important components & responsibilities
- NoteEditor
  - Inputs: note id (optional), initial content
  - Actions: save, autosave, tag/subject assignment, generate summary (AI)
- NoteList / NoteCard
  - Displays note summary, tags, subject and quick actions (pin, delete, export)
- SearchBar
  - Full-text queries + filter controls (tags, subject, date range)
- TagManager
  - Create, rename, delete tags; show usage counts
- SubjectManager
  - Organize notes into subjects or notebooks
- AnalyticsDashboard
  - Visualize study time, notes per subject, tag usage, and creation trends
- Settings
  - Configure storage backend, AI key, theme, export defaults

## Data model (suggested)
- Note
  - id: string
  - title: string
  - content: string (HTML or markdown)
  - subjectId?: string
  - tags: string[]
  - createdAt: ISO string
  - updatedAt: ISO string
  - metadata: { pinned?: boolean, archived?: boolean, readTime?: number }
- Subject
  - id: string
  - name: string
  - color?: string
- Tag
  - id: string
  - name: string

Example note JSON:
{
  "id": "note_123",
  "title": "Linear Algebra - Eigenvectors",
  "content": "Notes about eigenvectors...",
  "subjectId": "math_linear_algebra",
  "tags": ["linear-algebra","exam"],
  "createdAt": "2025-10-01T12:00:00.000Z",
  "updatedAt": "2025-10-02T09:00:00.000Z"
}

## Storage & persistence
- storageService (abstraction) should support:
  - getAllNotes(), getNoteById(id), saveNote(note), deleteNote(id)
  - getTags(), saveTag(), getSubjects(), saveSubject()
- Backends:
  - localStorage (simple, small datasets)
  - IndexedDB (larger datasets, offline-first)
  - Optional remote sync (REST/GraphQL) — ensure privacy & auth
- Migration strategy: versioned schema + migration helpers in services/migrations

## Search & indexing
- Use a lightweight client-side index (lunr.js, FlexSearch) for fast full-text search.
- Index title, content, tags, subject name and metadata fields.
- Support filters: tag, subject, date range, archived/pinned.
- Provide fuzzy matching and ranking.

## AI features
- Optional integration via aiService:
  - summarizeNote(note): returns a short summary
  - generateQuestions(note): returns an array of study questions
  - extractTopics(note): returns topic tags
- Configuration:
  - Set REACT_APP_AI_API_KEY in .env to enable features
  - aiService should gracefully degrade when key is missing (no network calls)
- Security:
  - Do not hardcode API keys; only use environment variables and secure backends for server-side calls if needed.

## Export / Import
- Exports:
  - Full notebook JSON (all notes, tags, subjects, metadata)
  - CSV export for notes list (title, subject, tags, createdAt)
- Imports:
  - JSON import with conflict resolution (skip, overwrite, merge)
  - Validate schema before applying changes
- UI:
  - Provide preview before import and simple undo (if possible)

## Analytics & study sessions
- Track sessions (start/stop) optionally:
  - session: { id, startAt, endAt, notesViewed: [], notesEdited: [] }
- Derive metrics:
  - Time spent per subject
  - Notes created per day/week/month
  - Most used tags
  - Study streaks
- Respect privacy: store analytics locally unless user opts-in to sharing.

## Theming & Accessibility
- Theme provider with persisted preference (localStorage).
- Follow WCAG basics: keyboard navigation, contrast, aria labels for key controls.

## Developer guide
Quick start
1. Install
   npm install
2. Run locally
   npm start
3. Build
   npm run build
4. Test
   npm test

Environment
- Create .env in project root (do not commit)
  REACT_APP_AI_API_KEY=your_api_key_here
  REACT_APP_API_URL=https://api.example.com

Linting & formatting
- Use eslint and prettier. Add pre-commit hooks (husky) to run lint and tests if desired.

Testing
- Unit tests for:
  - storageService (save/load, migrations)
  - search index and ranking
  - export/import routines
  - hooks: useNotes, useSearch
- Integration tests for UI flows: create note, search, export/import.

Extending the app
- Add server-side sync: implement REST or WebSocket endpoints and update storageService to sync.
- Add collaborative editing: requires operational transforms or CRDTs + authentication.
- Replace local AI calls with server-side proxy for security and centralized usage quotas.

Contributing
- Fork repo, create a feature branch, open a PR with tests and description.
- Document design decisions and data migrations for any schema changes.

Privacy & security
- By default the app stores data locally. If you add remote sync, document storage policies and implement authentication & encryption in transit.
- Avoid storing API keys in client bundles; use server-side proxies for sensitive calls if possible.

License
- Add a LICENSE file appropriate to your project (MIT, Apache-2.0, etc.) if you plan to open-source.

Contact
- Project owner / maintainer: update with name or email in repository metadata.

Other resources
- CRA docs for advanced configuration, PWA support and troubleshooting:
  - https://facebook.github.io/create-react-app/docs/
