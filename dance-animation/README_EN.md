# DansaBo - Dancing Stick Figures

<div align="center">

🕺 **A music-reactive stick figure dance animation app** 🎵

**English** | [**日本語**](./README.md)

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Client_Side-00D26A?style=flat-square&logo=shield)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![No Server](https://img.shields.io/badge/Server-Not_Required-FF6B6B?style=flat-square&logo=x)](https://jamstack.org/)

</div>

## 🎯 Features

### 🎵 **Music-Reactive Animation**
- Upload music files and watch stick figures dance in real-time
- Natural movement based on bass, mid, and high frequency analysis
- Supports major audio formats: MP3, WAV, M4A, and more

### 🎨 **Rich Background Patterns**
- **Default**: Simple gradient background
- **🌌 Cosmic**: Fantastical space-like background
- **💫 Dreamlike**: Dreamy floating light particles
- **🔷 Geometric**: Geometric patterns
- **🌊 Waves**: Flowing wave-like animations
- **☁️ Clouds**: Moving clouds with sky gradients
- **💡 Neon**: Neon grids and colorful shapes
- **🔢 Matrix**: Matrix-style falling characters
- **🌈 Rainbow**: Rainbow waves and particles
- **🔥 Fire**: Realistic flame effects

### 🎭 **Advanced Customization**
- **Figure Count**: 1-100 stick figures
- **Dance Sync**: All synchronized or individual random dancing
- **Animation Speed**: 0.1x to 3x speed adjustment
- **Personality Balance**: Adjust ratios of 5 dance styles
  - 🔥 Breakdancer (Breakdance moves)
  - 🌊 Waver (Wave dance)
  - ⚡ Jumper (Jump dance)
  - 🌀 Spinner (Spin dance)
  - 🎵 Groover (Groove dance)

### 🎥 **Video Recording**
- **Aspect Ratios**: 16:9 (landscape) / 9:16 (portrait)
- **Quality**: 480p / 720p / 1080p options
- **Formats**: MP4 (recommended) / WebM
- **Recording Modes**: Manual stop / Auto stop (5-30 seconds)
- Easy creation of vertical videos for TikTok and Instagram Reels

### 🌙 **Dark Mode Support**
- Light and dark theme switching
- Background patterns automatically adjust to theme

### 🔒 **Privacy Protection**
- **🚫 No Server Upload**: Music files and videos are never sent to servers
- **💻 Local Processing**: All audio analysis and video generation happens in your browser
- **🌐 Offline Ready**: Works without internet connection once loaded
- **🗑️ Auto Deletion**: Files are processed in memory only and completely deleted when page is closed
- **📊 No Data Collection**: No personal information or usage data is collected
- **🔐 Copyright Safe**: Your music files never leave your device

> **💡 Technical Note**: DansaBo is a 100% client-side application using [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) and [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dance-animation

# Install dependencies
npm install
```

### Start Development Server

```bash
npm run dev
```

Open http://localhost:5173/ in your browser

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# ESLint code quality check
npm run lint

# TypeScript type checking
npm run typecheck
```

## 📱 How to Use

1. **Upload Music File**
   - Click "🎵 Select music file" button
   - Choose MP3, WAV, M4A or other audio files

2. **Customize Settings**
   - Adjust number of stick figures
   - Toggle dance synchronization ON/OFF
   - Change animation speed
   - Select background pattern

3. **Play Music and Enjoy Dancing**
   - Click ▶️ Play button to start music
   - Watch stick figures dance to the beat

4. **Save as Video** (Optional)
   - Select aspect ratio, quality, and format
   - Click 🔴 Record button to start recording
   - Click 💾 Download to save video

## 🎨 Tech Stack

- **Frontend**: React 19.1.0 + Vite 6.3.5
- **Audio Processing**: Web Audio API
- **Graphics**: HTML5 Canvas
- **Video Recording**: MediaRecorder API
- **Styling**: CSS3 (Flexbox, Grid, Animations)
- **Type Checking**: TypeScript 5.8.3
- **Code Quality**: ESLint

## 🎵 Audio Analysis Mechanism

DansaBo performs real-time audio analysis using the **Web Audio API**'s `AnalyserNode`:

1. **FFT Size 256** to get frequency spectrum
2. **Split into 3 frequency bands**:
   - **Bass (0-10)**: Vertical bounce and leg movement
   - **Mid (10-50)**: Arm swing and hip movement
   - **High (50-100)**: Head bobbing and fine movements
3. **60FPS** animation loop updates
4. Each stick figure responds with **personality-based dance styles**

## 🏗️ Project Structure

```
src/
├── App.jsx                 # Main application
├── App.css                 # Main stylesheet
├── components/
│   ├── AudioControls.jsx   # Audio controls
│   ├── AudioVisualizer.jsx # Audio visualizer
│   ├── FigureControl.jsx   # Figure count control
│   ├── PersonalityControl.jsx # Personality balance control
│   ├── SpeedControl.jsx    # Animation speed control
│   ├── StickFigureCanvas.jsx # Main canvas + stick figure class
│   ├── SyncControl.jsx     # Sync control
│   └── VideoRecorder.jsx   # Video recording feature
└── main.jsx                # Entry point
```

## 🎭 Dance Style Details

Each stick figure is composed of 5 personalities and performs different movements based on music:

- **🔥 Breakdancer**: Acrobatic moves and freeze poses
- **🌊 Waver**: Flowing wave motions
- **⚡ Jumper**: Big jumps and dynamic movements
- **🌀 Spinner**: Rotation-centered dynamic actions
- **🎵 Groover**: Rhythmic groove and flow

## ❓ Frequently Asked Questions

### 🔒 **Privacy & Security**

**Q: Where are music files stored?**
A: Music files are not stored on servers. They are only processed in browser memory and completely deleted when you close the page.

**Q: Can I use copyrighted music safely?**
A: Since files are never sent externally, personal use is fine. However, please be mindful of copyright when publishing recorded videos.

**Q: Do I need an internet connection?**
A: Only for initial access. Once the page loads, it works offline.

### 🎵 **Features**

**Q: What music file formats are supported?**
A: MP3, WAV, M4A, OGG and other formats supported by your browser.

**Q: How are videos saved?**
A: Videos are generated in your browser as MP4 or WebM format and downloaded directly. No server involved.

**Q: Does it work on smartphones?**
A: Yes, it works on mobile browsers, but PC environment is recommended for best experience.

### 🛠️ **Technical Questions**

**Q: Why is no server required?**
A: Using client-side technologies like Web Audio API and Canvas API, all processing is completed within the browser.

**Q: Can it handle large music files?**
A: It can process files within browser memory limits, but extremely large files (several GB+) may cause performance issues.

## 🚀 Future Roadmap

- [ ] Add preset music tracks
- [ ] Expand dance pattern variations
- [ ] Social sharing features
- [ ] Mobile optimization
- [ ] Real-time audio input support

## 📄 License

This project is released under the MIT License.

## 📝 Copyright

© 2025 osamusic. All rights reserved.

---

<div align="center">

**🎵 Enjoy dancing stick figures with your music! 🕺**

Made with ❤️ using React + Vite by osamusic

</div>