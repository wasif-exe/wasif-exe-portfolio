import React, { useState, useEffect, useRef } from "react";
import PixelCard from "./components/PixelCard";
import "./Contact.css";

import LinkedInIcon from "./components/images/linkedin.png";
import GitHubIcon from "./components/images/github.png";
import InstagramIcon from "./components/images/instagram.png";
import DiscordIcon from "./components/images/discord.png";
import EmailIcon from "./components/images/email.png";
import TwitterIcon from "./components/images/twitter.png";

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const columns = Math.floor(canvas.width / 12);
    const drops = Array(columns).fill(1);
    const characters = "01ZXCVBNMASDFGHJKLQWERTYUIOP";

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(57, 255, 20, 0.7)";
      ctx.font = "12px monospace";

      drops.forEach((y, index) => {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, index * 12, y * 12);
        drops[index] = y * 12 > canvas.height || Math.random() > 0.97 ? 0 : y + 1;
      });
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-rain" />;
};

const Contact = () => {
  const [tooltip, setTooltip] = useState("");

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setTooltip(field);
    setTimeout(() => setTooltip(""), 1500);
  };

  return (
    <div className="contact-container">
      <PixelCard variant="pink">
        <div className="matrix-layer">
          <MatrixRain />
        </div>
        <div className="pixel-hover-layer">
          <div className="card-content">
            <div className="contact-section">
              <div className="contact-links">
                <a href="https://www.linkedin.com/in/syedwasif/" target="_blank" rel="noopener noreferrer">
                  <img src={LinkedInIcon} alt="LinkedIn" className="icon" />
                </a>
                <span className="username">Syed Wasif</span>
              </div>
            </div>
            <div className="contact-section">
              <div className="contact-links">
                <a href="https://github.com/wasif-exe" target="_blank" rel="noopener noreferrer">
                  <img src={GitHubIcon} alt="GitHub" className="icon" />
                </a>
                <span className="username">@wasif-exe</span>
              </div>
            </div>
            <div className="contact-section">
              <div className="contact-links">
                <img 
                  src={EmailIcon} 
                  alt="Email" 
                  className="icon" 
                  onClick={() => copyToClipboard("syedwasifzidane@gmail.com", "email")}
                />
                <span 
                  className="username" 
                  onClick={() => copyToClipboard("syedwasifzidane@gmail.com", "email")}
                >
                  syedwasifzidane@gmail.com
                </span>
                {tooltip === "email" && <span className="tooltip">Copied!</span>}
              </div>
            </div>
          </div>
        </div>
      </PixelCard>

      <PixelCard variant="pink">
        <div className="matrix-layer">
          <MatrixRain />
        </div>
        <div className="pixel-hover-layer">
          <div className="card-content">
            <div className="contact-section">
              <div className="contact-links">
                <a href="https://x.com/wasif_exe" target="_blank" rel="noopener noreferrer">
                  <img src={TwitterIcon} alt="Twitter" className="icon" />
                </a>
                <span className="username">@wasif_exe</span>
              </div>
            </div>
            <div className="contact-section">
              <div className="contact-links">
                <img 
                  src={DiscordIcon} 
                  alt="Discord" 
                  className="icon" 
                  onClick={() => copyToClipboard("wasif.exe", "discord")}
                />
                <span 
                  className="username" 
                  onClick={() => copyToClipboard("wasif.exe", "discord")}
                >
                  @wasif.exe
                </span>
                {tooltip === "discord" && <span className="tooltip">Copied!</span>}
              </div>
            </div>
            <div className="contact-section">
              <div className="contact-links">
                <a href="https://www.instagram.com/justt.wasif/" target="_blank" rel="noopener noreferrer">
                  <img src={InstagramIcon} alt="Instagram" className="icon" />
                </a>
                <span className="username">@justt.wasif</span>
              </div>
            </div>
          </div>
        </div>
      </PixelCard>
    </div>
  );
};

export default Contact;