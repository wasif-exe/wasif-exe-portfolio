import React, { useState, useEffect, useRef, useMemo } from "react";
import "./App.css";
import Squares from "./components/Squares";
import Particles from "./components/Particles";
import GlitchText from "./components/GlitchText";
import Dock from "./components/Dock";
import LiveStats from "./components/LiveStats";
import CommandPalette from "./components/CommandPalette";
import { playHover, playClick } from "./utils/sounds";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from "react-icons/vsc";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Clock from "./components/Clock";
import BackgroundMusic from "./components/BackgroundMusic";
import AboutMe from "./pages/AboutMe";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import Home from "./pages/Home";

const CIPHER_CHARS = "0123456789ABCDEF!@#$%^&*()_+-=[]{}|;:,.<>?";

function DecryptLine({ text }) {
  const [displayText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      setIsDone(true);
      return;
    }

    let frame = 0;
    const totalFrames = 8;
    const length = text.length;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealedLength = Math.floor(length * progress);

      let current = text.slice(0, revealedLength);
      for (let i = revealedLength; i < length; i++) {
        current += CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
      }

      setDisplayedText(current);

      if (frame >= totalFrames) {
        setDisplayedText(text);
        setIsDone(true);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={isDone ? "revealed-text" : "encrypted-text"}>{displayText}</span>;
}

// 📌 Wrapper for smooth Page Transitions using Framer Motion
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -15, scale: 0.98 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    style={{ position: "absolute", width: "100%", height: "100%" }}
  >
    {children}
  </motion.div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState([]);
  const [isDockClicked, setIsDockClicked] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const textLines = useMemo(
    () => [
      `USER // SYED M WASIF`,
      `HOST: 127.0.0.1`,
      `DATE: ${new Date().toLocaleDateString()}`,
      ``,
      `// kernel probe...`,
      ``,
      `// > io_uring           OK`,
      `// > lock-free runtime  OK`,
      `// > tcp stack          OK`,
      `// > raft kernel        OK`,
      ``,
      `ENCRYPTION: ACTIVE`,
      `LATENCY:    SUB-US PATH`,
      `SANITIZERS: LOOM + TSAN`,
      `UPTIME:     INFINITE`,
      ``,
      `WELCOME TO MY PORTFOLIO`,
      `> INITIATE BROWSING_`,
    ],
    []
  );

  useEffect(() => {
    if (currentTextIndex < textLines.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => [...prev, textLines[currentTextIndex]]);
        setCurrentTextIndex((prev) => prev + 1);
      }, 110);
      return () => clearTimeout(timer);
    }
    const transitionTimer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(transitionTimer);
  }, [currentTextIndex, textLines]);

  const dockItems = [
    { icon: <VscHome size={18} />, label: "About", path: "/about" },
    { icon: <VscArchive size={18} />, label: "Projects", path: "/projects" },
    { icon: <VscAccount size={18} />, label: "Skills", path: "/skills" },
    { icon: <VscSettingsGear size={18} />, label: "Contact", path: "/contact" },
  ].map((item) => ({
    ...item,
    onClick: () => {
      playClick();
      navigate(item.path);
      setIsDockClicked(true);
    },
  }));

  // Bind hover sound effects to dock elements (optimized to prevent lag)
  useEffect(() => {
    if (isLoading) return;
    const dockEls = document.querySelectorAll(".dock-item");
    const handler = () => playHover();
    dockEls.forEach((el) => el.addEventListener("mouseenter", handler));
    return () => {
      dockEls.forEach((el) => el.removeEventListener("mouseenter", handler));
    };
  }, [isLoading, location.pathname]);

  return (
    <div className="App" onClick={() => { if (isLoading) playHover(); }}>
      {isLoading ? (
        <>
          <Squares
            speed={0.4}
            squareSize={40}
            direction="diagonal"
            borderColor="#222"
            hoverFillColor="#222"
            className="background-canvas"
          />
          <div className="loading-screen">
            <div className="terminal-box">
              {displayedText.map((line, index) => (
                <div className="terminal-line" key={index}>
                  {line === "" ? (
                    <span className="line-break" />
                  ) : (
                    <DecryptLine text={line} />
                  )}
                </div>
              ))}
              {currentTextIndex < textLines.length && (
                <span className="blinking-cursor">|</span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="main-site">
          <LiveStats />
          <CommandPalette />
          <Clock />
          <BackgroundMusic volume={0.1} />

          {!isDockClicked && (
            <div className="ascii-container" ref={containerRef}>
              <GlitchText speed={1} enableShadows={true} enableOnHover={false}>
                SYSTEMS ONLINE
              </GlitchText>
              <p style={{ marginTop: '20px', color: '#666', fontFamily: 'monospace', opacity: 0.5 }}>
                Press Ctrl+K for command palette
              </p>
            </div>
          )}

          <div className="particles-wrapper">
            <Particles
              particleCount={100}
              particleSpread={10}
              speed={0.25}
              particleColors={["#ffffff"]}
              moveParticlesOnHover={true}
              particleHoverFactor={0.8}
              alphaParticles={false}
              particleBaseSize={70}
              sizeRandomness={1}
              cameraDistance={20}
              disableRotation={false}
              className="particles-background"
            />
          </div>

          <div className="dock-wrapper">
            <Dock
              items={dockItems}
              panelHeight={68}
              baseItemSize={48}
              magnification={64}
            />
          </div>

          {/* 📌 Animated Route Transitions */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/about" element={<PageWrapper><AboutMe /></PageWrapper>} />
              <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
              <Route path="/skills" element={<PageWrapper><Skills /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default App;