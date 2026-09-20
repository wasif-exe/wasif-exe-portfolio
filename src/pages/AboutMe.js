import React from "react";
import ReflectiveCard from "./components/ReflectiveCard";
import "./AboutMe.css";

function AboutMe() {
  return (
    <div className="about-me-container">
      <div className="about-card-visual">
        <ReflectiveCard
          overlayColor="rgba(0, 0, 0, 0.32)"
          blurStrength={12}
          glassDistortion={28}
          metalness={1}
          roughness={0.5}
          displacementStrength={18}
          noiseScale={1}
          specularConstant={4.5}
          grayscale={0.18}
          color="#e8ffe8"
        />
      </div>

      <div className="about-me-card">
        <h1>SYED M WASIF</h1>
        <p className="role">Core Systems & Low-Latency Engineer</p>
        <p>
          Third-year CS undergrad at DSATM, Bengaluru. I build zero-dependency
          systems software at the boundary of kernel and userspace — lock-free
          runtimes, io_uring network paths, userspace TCP stacks, and
          deterministic consensus kernels.
        </p>
        <p>
          Recent work includes a thread-per-core LSM-tree storage engine hitting
          440K ops/sec end-to-end, an RFC 9293 compliant userspace TCP/IP stack
          over TAP devices, a pure Raft consensus kernel driven by declarative
          state-machine ticks, and a 37 ns tick-to-decision mempool engine.
        </p>
        <p>
          Stack centers on Rust, C, C++20, x86_64 assembly, Linux 6.x internals,
          and cache-aligned concurrency primitives. I care about deterministic
          latency, measurable throughput, and code that survives Loom and
          ThreadSanitizer.
        </p>
      </div>
    </div>
  );
}

export default AboutMe;