import { useEffect, useRef, useState } from "react";
import "./ReflectiveCard.css";
import { Fingerprint, Activity, Lock, Cpu } from "lucide-react";

const ReflectiveCard = ({
  blurStrength = 12,
  color = "#e8ffe8",
  metalness = 1,
  roughness = 0.45,
  overlayColor = "rgba(0, 0, 0, 0.35)",
  displacementStrength = 18,
  noiseScale = 1,
  specularConstant = 4,
  grayscale = 0.2,
  glassDistortion = 24,
  className = "",
  style = {},
}) => {
  const videoRef = useRef(null);
  const [hasCam, setHasCam] = useState(false);

  useEffect(() => {
    let stream = null;
    let active = true;

    const startWebcam = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return;
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCam(true);
        }
      } catch {
        setHasCam(false);
      }
    };

    startWebcam();

    return () => {
      active = false;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, []);

  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    "--blur-strength": `${blurStrength}px`,
    "--metalness": metalness,
    "--roughness": roughness,
    "--overlay-color": overlayColor,
    "--text-color": color,
    "--saturation": saturation,
  };

  return (
    <div
      className={`reflective-card-container ${className} ${hasCam ? "has-cam" : "no-cam"}`}
      style={{ ...style, ...cssVariables }}
    >
      <svg className="reflective-svg-filters" aria-hidden="true">
        <defs>
          <filter id="metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="turbulence"
              baseFrequency={baseFrequency}
              numOctaves="2"
              result="noise"
            />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale={displacementStrength}
              specularConstant={specularConstant}
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="solidAlpha"
            />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap
              in="metallic-result"
              in2="glassMap"
              scale={glassDistortion}
              xChannelSelector="A"
              yChannelSelector="A"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="reflective-video"
        style={{ display: hasCam ? "block" : "none" }}
      />

      {!hasCam && <div className="reflective-fallback" />}

      <div className="reflective-noise" />
      <div className="reflective-sheen" />
      <div className="reflective-border" />

      <div className="reflective-content">
        <div className="card-header">
          <div className="security-badge">
            <Lock size={14} className="security-icon" />
            <span>KERNEL ACCESS</span>
          </div>
          <Activity className="status-icon" size={18} />
        </div>

        <div className="card-body">
          <div className="avatar-ring">
            <Cpu size={36} />
          </div>
          <div className="user-info">
            <h2 className="user-name">SYED M WASIF</h2>
            <p className="user-role">Core Systems & Low-Latency Engineer</p>
            <p className="user-sub">DSATM · Bengaluru · 3rd Year</p>
          </div>
        </div>

        <div className="card-footer">
          <div className="id-section">
            <span className="label">OPERATOR ID</span>
            <span className="value">WASIF-EXE-2026</span>
            <span className="label stack-label">STACK</span>
            <span className="value stack-value">Rust · C · io_uring · Raft</span>
          </div>
          <div className="fingerprint-section">
            <Fingerprint size={34} className="fingerprint-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectiveCard;