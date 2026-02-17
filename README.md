# Cato Project - Workflow Builder + Map Viewer

React + TypeScript assignment implementation using React Flow for workflow authoring and Deck.gl for map visualization.

## Live Deploy

- Primary deploy: "https://carto-project-five.vercel.app/"

## Deployment and CI

- This project is deployed on Vercel.
- Pull requests targeting `main` run the GitHub Actions pipeline in `.github/workflows/ci-tests.yml`.
- Unit tests must pass in CI before merging to `main`.

## Assignment Coverage

### Part 1 - React Flow workflow app

- [x] Add nodes via drag and drop from a sidebar
- [x] Connect nodes with edges
- [x] Delete nodes and edges
- [x] Save and load workflow state from `localStorage`
- [x] Custom `Source` node
  - [x] One source/output port
  - [x] `URL` text input for free-form GeoJSON URL
- [x] Custom `Layer` node
  - [x] One target/input port

### Part 2 - Deck.gl map view

- [x] `Map` button to switch from diagram to map
- [x] `Back` button to return to diagram
- [x] Automatically detect renderable layers from workflow graph
- [x] Render each layer from the connected `Source` node URL
- [x] Layer render order determined by `Layer` node vertical position (top to bottom)
- [x] Hover tooltip showing feature properties

### Bonus - Intersection node

- [ ] Not implemented in this submission because I keep getting the "side-eye" from my wife and kids :)

## Tech Stack

- React 18 + TypeScript (not very familiar with 19 yet)
- Vite
- React Flow (`@xyflow/react`)
- Deck.gl (`@deck.gl/react`, `@deck.gl/layers`)
- MapLibre (`react-map-gl/maplibre`) (free, no token needed)
- Material UI v5 + Emotion (CSS-in-JS) (I have been using MUI for a long time, easy ramp up)
- Vitest + Testing Library (e2e overkill for this project)

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 9+

### Install

```bash
pnpm install
```

### Run locally

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
pnpm test:coverage
```

## Useful GeoJSON URLs

These URLs can be pasted into `Source` node URL fields:

- `https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/san-francisco.geojson`
- `https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json`

## Implementation Notes

- `WorkflowView` keeps drag-in-progress state (`node.dragging`) from React Flow and intentionally skips snapshot writes while a node is moving. This avoids high-frequency app-level updates during drag, then commits one stable snapshot when dragging ends.
- `workflowSnapshot` in `App` is the main in-memory state shared by both views, while `localStorage` is only the persistence layer used for reload/restore.
- `Mapview` reads from the in-memory snapshot, not directly from `localStorage`, so it always renders the latest validated graph in the same render cycle and avoids stale/partial reads during active editing.
- Workflow state (nodes + edges) is persisted in `localStorage` and restored on app load.
- Current view selection (workflow/map) is persisted in `localStorage`.
- The map derives source-layer pairs from valid `Source -> Layer` edges.
- Only pairs with a non-empty (and valid) source URL are rendered.
- Pair ordering is sorted by `Layer` node `y` position to control map layer draw order. (I didn't worry about a tie breaker for this... such a silly edge case)
- Map loading failures are surfaced in a warning UI. (very basic... but its a take home :))

## Test Coverage

Latest `vitest --coverage` summary (thanks codex):

- Lines: `98.99%`
- Statements: `98.99%`
- Functions: `100%`
- Branches: `92.15%`

## AI Tooling Disclosure

### Methodology

AI tooling was used throughout development as a coding copilot, but the **vast majority of AI usage was for test planning and test coverage implementation**.

- AI was used heavily to propose test cases, generate test scaffolding, and draft most unit/integration tests.
- All AI-generated tests and code were manually reviewed, edited, and validated before being kept.
- Core implementation decisions, behavior verification, and final acceptance were Mike-driven.

### What was AI-generated vs. manual

- Mostly AI-assisted:
  - Test planning strategy
  - High-coverage test case generation
  - Initial drafts of many test files
- Mostly manual:
  - Wiring of react flow and deck.gl (documentation used)
  - Final architecture decisions
  - App behavior/layout/design choices
  - Debugging/fixes after running tests
  - Review and refinement of generated tests/code

### Prompt Log (Exact prompts used)

The assignment requests exact prompts. Add the full prompt transcript used during development here before final submission.

Template:

1.  `Ok here is the document that Carto gave me for the take home assignment. Lets work on a plan together. Lets go through step by step on figuring out the best plan of action. `

---

2. `1. lets work with Vite and use vercel to deploy 2. Strict TS yes, ESLint and prettier yes 3. Lets use MUI v5 and build a mini theme to use and only use sx prop when necessary 4. Let's walk through the domain model (WorkflowGraph) and what that would look like and how it would map to the nodes/edges 5. For now, lets go with mvp and only store the nodes and edges. We can always add more if needed, but lets keep it very simple for the first iteration. 6. Please elaborate on this question. 7. Lets keep it pretty strict for MVP 8. Lets just dynamically render the Diagram/Map and not consider real routing right now 9. A 10. Lets not skip silently for this one. Lets have maybe an icon/error badge on the node in the diagram view, and for the map view the banner is fine for now 11. Lets start with Raw Json for now. This is likely to be refined 12. This is fine... however lets not sort by id 13. no testing for MVP 14. Lets go for functional MVP for now. Then we can polish once I receive an email back from Carto. `

---

3.  `For #3, lets take a deeper dive into this.
For #4, lets have a source only connect to one layer for MVP
#9 no fan out, yes whitespace only is an error`

---

4.  `I think I may be missing something. To me it sounds much simpler for a take home assignment to let ReactFlow handle the state of the workflowraph. Please tell me why I would have a UI state and a domain state`

---

5. `In the folder structure I don't see a workflow view. For MVP, lets not worry about showing the errors unless the response I get back from Carto specifically asks for it. For #10, lets got with a for now. Please rework the plan with this in mind. Also, let me see the commit game plan again`

---

6.  `I forgot to mention that we need drag and drop functionality wherein we have a sidebar that has two node types to choose from. One is the source node and one is a layer node. The source node needs to have the input for the url. This sidebar lives outside of the ReactFlow canvas, so we should use something like neodrag to get this done. See this documentation (https://reactflow.dev/examples/interaction/drag-and-drop)`

---

7.  `Looks like HTML dnd is not supported on touch devices, lets go with neograg`

---

8.  `Is there no built in detection of stencil being dropped over a droppable area?`

---

9.  `
    Ok, I have some answers from the Carto team. First my questions
    1. Is there a rough estimate on how much time you guys want me to spend on it?
    2. What connections are allowed? (Source -> Layer only? Can Source connect to multiple Layers? Can a Layer have multiple Sources?)
    3. If a Layer has no connected Source, should it render nothing, show an error state, or show a placeholder?
    4. Any preferred delete UX? (keyboard delete/backspace, context menu, button on node/edge, selection-based)
    5. Should localStorage store only nodes/edges, or also viewport/zoom and selected node state?
    6. Layer Ordering -> For vertical position, do you mean the Layer node’s y coordinate in the diagram canvas? If two Layers have the same y, what’s the tie-breaker?
    7. If a GeoJSON URL is invalid/unreachable/non-GeoJSON, what UX do you want? (toast, skip rendering, etc.)
    8. When switching to Map and back, should the diagram state (selection, zoom/pan) persist?
    9. Is it acceptable to compute intersection client-side on load and cache it (in memory / localStorage)?
    10. Do you expect automated tests? If yes, what level (smoke, unit for utilities, minimal e2e)?
    11. Do you want preview deploys per commit/branch, or is one final public deploy enough?

    and the answers:

    1.There’s no strict time limit for this. The home assignment is your introduction to the team, so take the time you need to submit something you feel good about. 2. A layer cannot have multiple sources. A source can connect to multiple layers, although you can set a one-to-one restriction if that's easier for you. 3. It should render nothing 4. There is no specific requirement in this regard; the idea is that the end user can edit the workflow intuitively. 5. The idea is to be able to restore the diagram from localStorage, so the candidate must specify what to store. 6. If two layers have the same Y coordinate, you can choose your own tie-breaking criterion. This is not a critical point in the test. 7. Surprise us! 8. What do you think would be the best user experience? :) 9. The candidate must decide this based on the architecture they are implementing. We can only say that it must be computed from the client side and can utilize Turf as indicated in the statement. 10. The candidate must decide. 11. Final public deploy is enough

    Some of my takeaways:
    1. Lets time cap this and keep it to the bare minimum that is being asked.
    2. They gave permission to keep a one to one restriction, so lets stick with that.
    3. Lets add a small button on the node, and when clicked lets go with a "Are you sure" modal/dialog.
    4. This is a bit vague, but it seems at though we just need to store the bare minimum to be able to render the diagram...
    5. hmmm... maybe the delete "x" button can be in the top right of the node and an "i" info icon can be top left (when there is something wrong with the GeoJSON URL) that gives a very basic error in a tooltip.
    6. This is a tough one, ideas?
    7. Lets walk through this one
    8. e2e seems like overkill for this, but lets make sure we have unit test coverage in place. Integration tests overkill for this as well?`

---

10. `Also, lets walk through the full flow of the application to make sure we aren't missing anything. `

---

11. `Yeah lets dynamically render the map vs diagram and not have both of them mounted at the same time`

---

12. `Ok lets dive deeper into this: App-level {nodes, edges} state + activeView. `

---

13. `I have a knowledge gap that I need to fill. Help me understand how the layer node is going to work. For example, lets say that we are going to use this geo json: https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json.

When we add a layer to the workflow, is it safe to assume that the user will then have the ability to configure what the layer looks like? So layer is dropped, then a config menu appears with some defaults, but the user can then update the config. A config along the lines of:
`
const layer = new GeoJsonLayer<PropertiesType>({
id: 'GeoJsonLayer',
data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json',

      stroked: false,
      filled: true,
      pointType: 'circle+text',
      pickable: true,

      getFillColor: [160, 160, 180, 200],
      getLineColor: (f: Feature<Geometry, PropertiesType>) => {
        const hex = f.properties.color;
        // convert to RGB
        return hex ? hex.match(/[0-9a-f]{2}/g).map(x => parseInt(x, 16)) : [0, 0, 0];
      },
      getText: (f: Feature<Geometry, PropertiesType>) => f.properties.name,
      getLineWidth: 20,
      getPointRadius: 4,
      getTextSize: 12
    });`

14. `Keeping the nodes/edges at app level causes the app component to re render on node drag. Can't we just keep the the node state local to the workflow view, and when that is updated we can duplicate it into localstorage for the map to use?`

## Commit plan

### **Commit 1 — Scaffold**

- Vite + TS strict + ESLint/Prettier
- MUI theme scaffold
- App-level {nodes, edges} state + activeView

### **Commit 2 — Diagram baseline**

- ReactFlowCanvas + custom nodes (Source URL input, Layer handle)
- WorkflowView layout (NodeSidebar + canvas)

### **Commit 3 — Neodrag sidebar stencil → create nodes**

- NodeSidebar with Neodrag
- Drop detection via wrapper bounds + screenToFlowPosition

### **Commit 4 — Connect + delete**

- strict 1:1 onConnect
- Node X + confirm dialog
- edge delete via selection + Delete/Backspace

### **Commit 5 — Persistence**

- localStorage save/load {nodes, edges}

### **Commit 6 — Map view baseline + switching**

- MapView mounts/unmounts with Back button
- Deck.gl map

### **Commit 7 — Render layers + ordering + tooltip**

- selectors for ordering + url resolution
- GeoJsonLayer per connected layer
- raw JSON tooltip

### **Commit 8 — “Surprise us” (Map-only)**

- Validate URL fetch/GeoJSON in MapView
- Show a small banner/list of invalid URLs (no diagram icons)

### **Commit 9 — Unit tests (optional, per your later decision)**

- If you proceed with tests: selectors + connect validation only

### **Commit 10 — README + Vercel deploy**

- Document decisions: 1:1, stored fields, map skip behavior, error handling

## Known Limitations / Future Improvements

- Intersection node (bonus) is not implemented.
- Drag cursor polish in sidebar drag interaction can be improved.
- Runtime URL validation and richer fetch error diagnostics could be expanded.
- A more dynamic configured factory for geojson layers, but out of scope
- Decided not to go with the close x button. I like the snappy feeling of the delete key and Im not a ux designer :)

## Feedback on the Test

The assignment is clear and practical, and it does a good job of evaluating UI state management, and map-layer derivation from workflow structure.
