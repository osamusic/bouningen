# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `cd dance-animation && npm run dev` - Start development server (accessible at http://localhost:5173/)
- `cd dance-animation && npm run build` - Build for production
- `cd dance-animation && npm run preview` - Preview production build
- `cd dance-animation && npm run lint` - Run ESLint

### Testing
This project currently has no test setup configured.

## Architecture

This is a React + Vite stick figure dance animation application that visualizes music through animated characters.

### Core Architecture

**Audio Processing Pipeline:**
1. `AudioControls` component handles file upload and creates Web Audio API context
2. Audio data flows through: File → AudioContext → AnalyserNode → Frequency data
3. Real-time audio analysis extracts frequency bands (bass, mid, high)
4. Processed audio data propagates to animation and visualization components

**Component Hierarchy:**
- `App.jsx` - Root component managing audio state and data flow
- `AudioControls.jsx` - File upload, playback controls, volume management
- `StickFigureCanvas.jsx` - Canvas-based stick figure animation with `StickFigure` class
- `AudioVisualizer.jsx` - Frequency spectrum visualization bars

**Animation System:**
The `StickFigure` class maps frequency bands to body movements:
- Bass frequencies (0-10) → vertical bounce and leg movement
- Mid frequencies (10-50) → arm swing and hip movement  
- High frequencies (50-100) → head bobbing

**State Management:**
Audio data flows unidirectionally from App → child components via props. The `animationRef` in App.jsx coordinates requestAnimationFrame updates across components.

### Key Technical Details

- Uses Web Audio API `AnalyserNode` with FFT size 256 for frequency analysis
- Canvas rendering with 60fps animation loop synchronized to audio data
- Audio buffer management handles file decoding and playback state
- Volume control implemented via Web Audio API GainNode

### File Structure

Main application code is in `dance-animation/src/` with components in `src/components/`. The project uses standard Vite React structure with ESM modules.