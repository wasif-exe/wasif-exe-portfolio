import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/OnboardingHints.css";

const DOCK_HINT_KEY = "wasif_hint_dock_v1";
const PROJECTS_HINT_KEY = "wasif_hint_projects_v1";

export default function OnboardingHints() {
  const location = useLocation();
  const [showDockHint, setShowDockHint] = useState(false);
  const [showProjectsHint, setShowProjectsHint] = useState(false);

  useEffect(() => {
    const dockSeen = sessionStorage.getItem(DOCK_HINT_KEY);
    if (!dockSeen) {
      setShowDockHint(true);
      const t = setTimeout(() => {
        setShowDockHint(false);
        sessionStorage.setItem(DOCK_HINT_KEY, "1");
      }, 9000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (location.pathname !== "/projects") {
      setShowProjectsHint(false);
      return;
    }
    const seen = sessionStorage.getItem(PROJECTS_HINT_KEY);
    if (!seen) {
      setShowProjectsHint(true);
      const t = setTimeout(() => {
        setShowProjectsHint(false);
        sessionStorage.setItem(PROJECTS_HINT_KEY, "1");
      }, 10000);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  const dismissDock = () => {
    setShowDockHint(false);
    sessionStorage.setItem(DOCK_HINT_KEY, "1");
  };

  const dismissProjects = () => {
    setShowProjectsHint(false);
    sessionStorage.setItem(PROJECTS_HINT_KEY, "1");
  };

  return (
    <>
      {showDockHint && (
        <div className="hint-dock" onClick={dismissDock}>
          <div className="hint-bubble">
            <span className="hint-kicker">NAV</span>
            <p>
              Use the dock below — <b>About</b> · <b>Projects</b> · <b>Skills</b> · <b>Contact</b>
            </p>
            <p className="hint-sub">Press <kbd>Ctrl</kbd> + <kbd>K</kbd> for command palette · click to dismiss</p>
          </div>
          <div className="hint-arrow" />
        </div>
      )}

      {showProjectsHint && (
        <div className="hint-projects" onClick={dismissProjects}>
          <div className="hint-bubble projects">
            <span className="hint-kicker">PROJECTS</span>
            <p>
              <b>Top cards</b> = flagship work (open for details).  
              <b>Sphere below</b> = drag to spin · click center button to open repo.
            </p>
            <p className="hint-sub">click to dismiss</p>
          </div>
        </div>
      )}
    </>
  );
}