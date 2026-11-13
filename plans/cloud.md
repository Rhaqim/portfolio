# Point cloud: plans

Status: **parked** until hud (masters project) is done. Written 2026-11-13.

The cloud today: [src/scripts/cloud/cloud.js](../src/scripts/cloud/cloud.js) springs
~1500 particles (650 on small screens) towards a target shape. Shapes come from
[shapes.js](../src/scripts/cloud/shapes.js) (`sample`, `fromSVGPath`, `fromText`,
`fromImage`) and can be driven from script through `window.rhaqimCloud.morph(...)` /
`.release()`. Both ideas below fit that seam: each one produces a stream of target
points, and nothing in the physics needs to change.

---

## 1. Face cloud: the cloud follows the visitor and takes their face's shape

**Depends on hud.** hud already tracks posture, eyes, squinting and leaning in
order to adapt the screen. Reuse its tracking rather than writing it twice.

### Behaviour
- Opt-in only. A small "Let the cloud see you" control shows our own explainer
  first, and only then calls `getUserMedia` (the browser's permission prompt).
- Once allowed, the cloud's centre follows the head position, and its target
  becomes the face mesh (landmarks projected to 2D, normalised the same way as
  `sample()` output). Leaning in makes it grow; turning the head makes it
  rotate/skew.
- Hook into hud signals for flavour: squinting tightens or brightens the
  particles, and leaning forward could trigger hud's "ease the strain" response
  on the page itself (larger text, lower contrast).
- Stop: one click turns the camera off, drops the stream (`track.stop()`) and
  `release()`s the cloud. It also stops automatically when the tab is hidden.
- Fallbacks: no camera, permission denied or `prefers-reduced-motion` → the cloud
  keeps behaving as it does today.

### Tech notes
- On-device face landmarks (e.g. MediaPipe Face Landmarker: ~478 points, WASM/
  WebGL, runs in the browser). Or use whatever model hud ends up using.
- Lazy-load the model only after consent, so ordinary visitors pay nothing.
- Landmarks → `target` Float32Array directly; ~478 points spread across 1500
  particles (assign several particles per landmark with small jitter, or sample
  along mesh triangles for an even fill).
- Run detection at ~15–30 fps and off the main thread where possible; keep the
  render loop independent of it.

### Privacy (must ship with it)
- **Nothing leaves the device.** No frames, landmarks or images are sent to the
  demo API or stored. Say so plainly in the consent dialog.
- Add a **privacy page** (`/privacy`) covering: camera use (on-device, opt-in,
  not stored), what *is* stored (the `rhaqim-cloud` localStorage preference, the
  demo API's visitor cookie and feedback), and how to clear it.
- Possibly **terms** for the demos (BYO LLM keys, uploads, feedback).
- Cookie banner: probably not needed while everything is strictly functional
  (no analytics or tracking), but check this at build time. Add one if analytics
  are ever added.
- Remember only the *choice* (allowed/declined) locally, never the image.

---

## 2. Probability cloud: unobserved it's a superposition, observed it collapses

**Built 2026-11-13** (no camera): `fromDensity`, `orbitals` and `blur` in shapes.js,
plus the observation block in cloud.js and `rhaqimCloud.observe(v)` /
`.observed` / the `cloud:collapse` event. Still to do: plug hud's gaze into
`observe()`. The "section on screen" signal was dropped because the canvas is
fixed and always in view.

A fun one, loosely modelled on electrons: while nobody is looking, the cloud is
a fuzzy probability distribution. When the visitor looks, it "collapses" into a
stable, crisp shape.

### Behaviour
- **Unobserved:** particles are re-sampled every few frames from a density, such
  as hydrogen-like orbitals |ψ|² (1s sphere, 2p lobes, 3d clover), or a blend
  of two shapes. They shimmer and the shape is never quite settled. It can also
  wander into "something else" (a different shape or a hidden message) that only
  exists while unobserved.
- **Observed:** sampling stops, the springs pull every particle to one definite
  shape, and the shimmer damps out. Add a quick flash or contraction on collapse.
- Looking away again lets it "decohere" back into the cloud, slowly.

### What counts as "observing"
In order of fidelity:
1. **Gaze, via hud** (if camera consent is given): eyes on the screen / on the cloud.
2. **No camera:** cursor near the cloud, the cloud's section in view
   (IntersectionObserver), recent input (idle timer).
3. **Tab visibility:** `visibilitychange`. The cloud can't be seen while the tab
   is hidden, so the joke is that the visitor returns to find it mid-collapse:
   "you observed it."

### Tech notes
- Add `fromDensity(fn, n)` to shapes.js: rejection-sample points from a 2D
  density (or project a 3D orbital). Precompute a few orbitals into Float32Arrays.
- An "observation" value 0..1 blends re-sampling rate and spring stiffness
  (`k[]`): at 0 it's high noise and low stiffness, at 1 it's no noise and full
  stiffness. Exposing this as `rhaqimCloud.observe(v)` lets either the gaze or
  the fallback signals drive it.
- Respect `prefers-reduced-motion`: show the collapsed state only.

---

## Order
1. Finish hud.
2. Probability cloud with the no-camera "observation" signals (no consent needed,
   so it can ship first).
3. Privacy page (+ terms).
4. Face cloud behind the consent flow, using hud's tracking; plug gaze into the
   probability cloud's `observe()`.
