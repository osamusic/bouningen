# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `cd dance-animation && npm run dev` - Start development server (accessible at http://localhost:5173/)
- `cd dance-animation && npm run build` - Build for production
- `cd dance-animation && npm run preview` - Preview production build
- `cd dance-animation && npm run lint` - Run ESLint
- `cd dance-animation && npm run typecheck` - Run TypeScript type checking

### Testing
This project currently has no test setup configured.

## Architecture

This is a React + Vite stick figure dance animation application (DansaBo) that visualizes music through animated characters. It's a 100% client-side application with no server requirements.

### Core Architecture

**Audio Processing Pipeline:**
1. `AudioControls` component handles file upload and creates Web Audio API context
2. Audio data flows through: File → AudioContext → AnalyserNode → Frequency data
3. Real-time audio analysis extracts frequency bands (bass, mid, high, ultraHigh)
4. Processed audio data propagates to animation and visualization components

**Component Hierarchy:**
- `App.jsx` - Root component managing global state, audio data flow, and error boundaries
- `AudioControls.jsx` - File upload, playback controls, volume management
- `StickFigureCanvas.jsx` - Canvas-based animation with `StickFigure` class and formation system
- `AudioVisualizer.jsx` - Frequency spectrum visualization bars
- `VideoRecorder.jsx` - MediaRecorder API integration for video capture
- `SyncControl.jsx` - Dance synchronization with auto-sync music analysis
- `FigureControl.jsx` - Figure count control with auto-figure mode
- `PersonalityControl.jsx` - Personality balance distribution for dance styles
- `LanguageContext.jsx` - i18n support for Japanese/English

**Animation System:**
The `StickFigure` class contains complex dance logic:
- Bass frequencies (0-10) → vertical bounce, leg movement, breaking moves
- Mid frequencies (10-50) → arm swing, hip movement, wave motions
- High frequencies (50-100) → head bobbing, hand gestures
- Ultra-high frequencies (100-150) → spin moves, particle effects

**Formation System:**
Dynamic positioning based on figure count:
- 1-3: Line formation
- 4-6: Triangle formation
- 7-10: Inverted triangle
- 11-15: Diamond formation
- 16-25: Circle formation
- 26+: Grid layout

**Background Effects:**
10 different background patterns with audio-reactive animations:
- Each pattern responds to frequency bands differently
- Particle effects integrated with performance optimization
- Dark mode support with color adjustments

**State Management:**
- Audio data flows unidirectionally from App → child components via props
- `useRef` for performance-critical animation loops
- `useCallback` for expensive computations (auto-figure, auto-sync)
- Error boundaries wrap canvas components to prevent white screen crashes

### Key Technical Details

- Web Audio API `AnalyserNode` with FFT size 256 for frequency analysis
- Canvas 2D context with dynamic sizing based on aspect ratio and figure count
- requestAnimationFrame loop synchronized at 60fps
- MediaRecorder API for MP4/WebM video capture
- Error handling: Math.max() guards against negative arc radius values
- Cooldown mechanisms prevent infinite update loops in auto modes
- Memory management: automatic cleanup of audio buffers and canvas resources

### Critical Implementation Notes

**Canvas Drawing Safety:**
- Always use `Math.max(0, value)` for arc radius calculations to prevent IndexSizeError
- Wrap canvas operations in try-catch or use safeRender pattern

**Performance Considerations:**
- Limit particle effects when showParticles is false
- Scale down figure size for counts > 20 to maintain performance
- Use cooldown timers for auto-sync and auto-figure modes

**Common Issues:**
- White screen: Usually caused by negative arc radius or infinite update loops
- iOS file input: Requires specific accept attributes and event handlers
- 9:16 aspect ratio: Requires careful Y-position adjustments to prevent clipping

### File Structure

Main application code is in `dance-animation/src/` with components in `src/components/`. The project uses standard Vite React structure with ESM modules. Context providers are in `src/contexts/`.