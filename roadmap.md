# codeMate - Implementation Roadmap

This roadmap outlines the systematic development of the **codeMate** (Real-time LeetCode Problem Matcher) application, moving from the current basic setup to the fully featured architecture.

## Phase 1: Foundation & Authentication (Current Focus)

**Goal:** Establish a secure foundation where users can sign up, log in, and maintain a session.

*   [x] **Backend Setup:** Node.js + Express initialization.
*   [x] **Database Setup:** MongoDB connection (`Users` collection).
*   [x] **Backend Auth:** JWT-based Registration and Login controllers.
*   [ ] **Frontend Setup:** Next.js (TailwindCSS) base configuration.
*   [ ] **Frontend Auth UI:** Create `Login` and `Register` pages with form validation.
*   [ ] **Auth Integration:** Connect frontend forms to backend APIs.
*   [ ] **Session Management:** Securely store JWT (cookies/localStorage) and create protected routes.

---

## Phase 2: User Dashboard & Matching Service

**Goal:** Allow authenticated users to request a match and successfully pair them with another user based on criteria.

*   [ ] **Dashboard UI:** Create the main landing page post-login (Profile, Stats, "Find Match" entry point).
*   [ ] **Match Configuration UI:** A modal/screen to select desired Problem Difficulty (Easy, Medium, Hard) and Topic.
*   [ ] **Socket.io Server Initialization:** Setup WebSocket server on the backend for real-time communication.
*   [ ] **Matching Service (Backend):** 
    *   Implement an in-memory queue (or Redis) for users searching for matches.
    *   Logic to pair two users with matching criteria.
*   [ ] **Session Manager (Backend):** Upon successful match, generate a unique `Session ID` and save it to the `Sessions` MongoDB collection.
*   [ ] **Match Notification:** Emit WebSocket events to notify both users and redirect them to the specific session room.

---

## Phase 3: The Collaborative Coding Workspace

**Goal:** Build the core room where users can see the problem and code together in real-time.

*   [ ] **Problems Database:** Create the `Problems` collection in MongoDB and seed it with sample algorithm problems (Description, Constraints, Boilerplate code, Test Cases).
*   [ ] **Problem Fetching Logic:** Ensure the Session Manager assigns a specific problem to the newly created session.
*   [ ] **Coding Session UI Layout:** Build the split-pane layout (Problem description on left, Editor/Chat on right).
*   [ ] **Monaco Editor Integration:** Embed `@monaco-editor/react` in the frontend.
*   [ ] **Real-Time Code Sync:** Use WebSockets (and optionally Operational Transformation / CRDTs like Yjs) to broadcast code changes between the two users instantly.
*   [ ] **Text Chat System:** Implement real-time text chat within the session using WebSockets.

---

## Phase 4: Code Execution Integration

**Goal:** Allow users to run their code against test cases.

*   [ ] **Judge0 API Setup:** Obtain API keys and set up the service wrapper in the backend.
*   [ ] **Execution UI:** Add "Run Code" and "Submit" buttons to the editor.
*   [ ] **Backend Execution Route:** Create an endpoint that receives the code, language, and test cases, forwards them to Judge0, and returns the results.
*   [ ] **Result Display:** Show console output, compilation errors, and test case pass/fail statuses in the frontend.

---

## Phase 5: WebRTC Video/Audio Communication

**Goal:** Enable face-to-face communication during the peer programming session.

*   [ ] **WebRTC Signaling Server:** Extend the existing Socket.io server to handle WebRTC offers, answers, and ICE candidates.
*   [ ] **Video UI Component:** Add local and remote video elements to the Coding Session UI.
*   [ ] **Media Stream Management:** Request microphone and camera permissions via browser APIs.
*   [ ] **P2P Connection:** Establish the WebRTC peer-to-peer connection for low-latency communication.

---

## Phase 6: AI Assistance (Claude API)

**Goal:** Provide intelligent hints when the pair gets stuck.

*   [ ] **AI Service (Backend):** Set up integration with the Claude API.
*   [ ] **Hint UI:** Add a "Request AI Hint" button.
*   [ ] **Context Gathering:** When a hint is requested, bundle the problem description, current code state, and language, and send it to the backend.
*   [ ] **Prompt Engineering:** Structure the backend prompt to ensure Claude gives a *hint* rather than the full solution.
*   [ ] **Broadcast Hint:** Send the received hint back to both users in the session (e.g., as a special message in the chat).

---

## Phase 7: Polish & Deployment

*   [ ] **Edge Case Handling:** Handle user disconnections, match timeouts, and re-connections.
*   [ ] **Testing:** Unit tests for matching logic and integration tests for sockets.
*   [ ] **Deployment:** Deploy Frontend (e.g., Vercel), Backend (e.g., Render/Railway), and ensure MongoDB is secure (MongoDB Atlas).
