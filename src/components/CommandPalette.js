import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { playHover, playClick } from "../utils/sounds";
import "../styles/CommandPalette.css";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands = [
    { name: "Navigate: About Me", action: () => navigate("/about") },
    { name: "Navigate: Projects", action: () => navigate("/projects") },
    { name: "Navigate: Skills & Stack", action: () => navigate("/skills") },
    { name: "Navigate: Contact", action: () => navigate("/contact") },
    { name: "System: View Source", action: () => window.open("https://github.com/wasif-exe", "_blank") },
  ].filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch("");
        setSelectedIndex(0);
        playClick();
      }
      if (isOpen) {
        if (e.key === "Escape") setIsOpen(false);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % commands.length);
          playHover();
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + commands.length) % commands.length);
          playHover();
        }
        if (e.key === "Enter" && commands.length > 0) {
          e.preventDefault();
          commands[selectedIndex].action();
          setIsOpen(false);
          playClick();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, search, commands, selectedIndex, navigate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="palette-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="palette-modal"
            initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="palette-header">
              <input
                autoFocus
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                className="palette-input"
              />
              <span className="palette-hint">ESC to close</span>
            </div>
            <div className="palette-results">
              {commands.map((cmd, i) => (
                <div
                  key={cmd.name}
                  className={`palette-item ${i === selectedIndex ? "selected" : ""}`}
                  onMouseEnter={() => { setSelectedIndex(i); playHover(); }}
                  onClick={() => { cmd.action(); setIsOpen(false); playClick(); }}
                >
                  <span className="cmd-icon">{">"}</span> {cmd.name}
                </div>
              ))}
              {commands.length === 0 && <div className="palette-empty">No results found.</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}