# Copilot Instructions for this Repository

This is a static educational web app. The main entry is `index.html` and there is no build system or bundler.

- Root app is in `index.html`; scripts are loaded in order:
  - `js/complex.js`
  - `js/linearAlgebra.js`
  - `js/quantumGates.js`
  - `js/quantumCircuit.js`
  - `js/slides.js`
  - `js/simulations.js`
  - `js/app.js`

- The app uses global singletons instead of modules:
  - `App` manages view routing, slide rendering, quiz, dictionary, and lab menu state.
  - `SlidesData` contains slide text, questions, notes, and optional `sim` links.
  - `Simulations` contains canvas-based lab simulations and is initialized with `Simulations.init('sim-canvas')`.

- View structure is section-based in HTML with IDs like `view-home`, `view-presentation`, `view-lab`, `view-quiz`, `view-dictionary`.
  - Switch views via `App.switchView(viewId)`.
  - Navigation links use `data-view` attributes.

- Slide-to-simulation integration is data-driven:
  - slide objects in `js/slides.js` may include `sim: 'blackbody'`, `sim: 'doubleslit'`, `sim: 'circuitSim'`, etc.
  - `App.goToSim(simId)` and `App.loadSim(id)` route the user into the lab.

- Simulation module conventions:
  - Each simulation is a method on `Simulations` named after the sim ID.
  - `Simulations.load(simId)` clears the canvas and calls the method.
  - `Simulations.params` and `Simulations.state` are reused for UI controls and animation state.

- The project uses direct DOM `innerHTML` templates and query selection rather than a framework.
  - Dynamic content is injected in `App.showSlide()`, `renderDictionary()`, `renderSimList()`, `renderProgList()`, and simulation UI helpers.

- Developer workflow:
  - Open `index.html` in a browser locally.
  - No `npm` or build commands are required.
  - The project is designed for GitHub Pages deployment from the repository root.

- Important patterns to preserve:
  - Keep script load order intact in `index.html`.
  - Add new slides in `js/slides.js` with matching `sim` IDs if linking to lab simulations.
  - Use `App.isStudentMode` for presentation mode toggling and speaker-note visibility.

- Note: A duplicate copy of the project exists under `canakkale/`, but the primary live app is the root folder.

If you want, I can refine this with any missing developer workflow details or clarify the `Simulations` state conventions.