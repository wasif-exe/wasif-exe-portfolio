import React, { lazy, Suspense, useState, useEffect } from "react";
import { playClick, playHover } from "../utils/sounds";
import "./Skills.css";

const CircularGallery = lazy(() => import("./components/CircularGallery"));

const SI = "https://cdn.simpleicons.org";

const skillItems = [
  { image: `${SI}/rust/39ff14`, text: "Rust" },
  { image: `${SI}/c/white`, text: "C Language" },
  { image: `${SI}/cplusplus/white`, text: "C++20" },
  { image: `${SI}/linux/white`, text: "Linux 6.x / Kernel" },
  { image: `${SI}/gnubash/white`, text: "Bash / POSIX" },
  { image: `${SI}/python/white`, text: "Python" },
  { image: `${SI}/webassembly/white`, text: "x86_64 Assembly" },
  { image: `${SI}/cmake/white`, text: "GDB / perf / TSan" },
  { image: `${SI}/rocksdb/white`, text: "LSM-Trees / WAL" },
  { image: `${SI}/wireshark/white`, text: "TCP/IP & Sockets" },
  { image: `${SI}/docker/white`, text: "Raft / Distributed" },
  { image: `${SI}/git/white`, text: "Git / Tooling" },
];

const HTOP_ROWS = [
  { pid: 101, user: "wasif", pr: -20, name: "rust_runtime", cpu: 96, mem: 18, state: "R" },
  { pid: 102, user: "wasif", pr: -15, name: "io_uring_sqpoll", cpu: 88, mem: 12, state: "R" },
  { pid: 103, user: "wasif", pr: -10, name: "lsm_flush_worker", cpu: 74, mem: 22, state: "R" },
  { pid: 104, user: "wasif", pr: -5, name: "tcp_input_path", cpu: 69, mem: 9, state: "S" },
  { pid: 105, user: "root", pr: 0, name: "raft_tick_kernel", cpu: 61, mem: 7, state: "R" },
  { pid: 106, user: "wasif", pr: 5, name: "ebr_reclaimer", cpu: 44, mem: 6, state: "S" },
  { pid: 107, user: "wasif", pr: 10, name: "skip_list_mt", cpu: 38, mem: 14, state: "R" },
  { pid: 108, user: "wasif", pr: 10, name: "bloom_avx2", cpu: 33, mem: 5, state: "S" },
  { pid: 109, user: "wasif", pr: 15, name: "chaos_simulator", cpu: 21, mem: 4, state: "S" },
  { pid: 110, user: "wasif", pr: 20, name: "loom_model_check", cpu: 12, mem: 8, state: "S" },
];

function HtopView() {
  const [rows, setRows] = useState(HTOP_ROWS);

  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => ({
          ...r,
          cpu: Math.max(5, Math.min(99, r.cpu + (Math.random() * 10 - 5))),
          mem: Math.max(2, Math.min(40, r.mem + (Math.random() * 2 - 1))),
        }))
      );
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const loadAvg = (rows.reduce((s, r) => s + r.cpu, 0) / rows.length / 25).toFixed(2);

  return (
    <div className="htop-shell">
      <div className="htop-header">
        <div>htop — wasif@systems</div>
        <div>
          Tasks: {rows.length} total · Load avg: {loadAvg} {loadAvg} {loadAvg}
        </div>
        <div>Mem: 18.4G/64.0G · Uptime: infinite</div>
      </div>
      <div className="htop-table-head">
        <span>PID</span>
        <span>USER</span>
        <span>PR</span>
        <span>S</span>
        <span>CPU%</span>
        <span>MEM%</span>
        <span>Command</span>
      </div>
      {rows.map((r) => (
        <div className="htop-row" key={r.pid}>
          <span>{r.pid}</span>
          <span>{r.user}</span>
          <span>{r.pr}</span>
          <span className={r.state === "R" ? "state-r" : "state-s"}>{r.state}</span>
          <span className="cpu-cell">
            <span className="cpu-bar" style={{ width: `${r.cpu}%` }} />
            <span className="cpu-label">{r.cpu.toFixed(1)}</span>
          </span>
          <span>{r.mem.toFixed(1)}</span>
          <span className="cmd-cell">{r.name}</span>
        </div>
      ))}
      <div className="htop-footer">
        F1Help  F2Setup  F3Search  F10Quit  ·  toggle: carousel
      </div>
    </div>
  );
}

function Skills() {
  const [mode, setMode] = useState("carousel");

  return (
    <div className="skills-page">
      <div className="skills-toggle">
        <button
          className={mode === "carousel" ? "active" : ""}
          onMouseEnter={playHover}
          onClick={() => {
            playClick();
            setMode("carousel");
          }}
        >
          carousel
        </button>
        <button
          className={mode === "htop" ? "active" : ""}
          onMouseEnter={playHover}
          onClick={() => {
            playClick();
            setMode("htop");
          }}
        >
          htop
        </button>
      </div>

      <div
        className="skills-panel"
        style={{ display: mode === "carousel" ? "block" : "none" }}
      >
        <Suspense
          fallback={<div className="skills-fallback">Loading Systems Stack...</div>}
        >
          <CircularGallery
            items={skillItems}
            bend={2}
            textColor="#ffffff"
            borderRadius={0.08}
          />
        </Suspense>
      </div>

      <div
        className="skills-panel skills-panel-htop"
        style={{ display: mode === "htop" ? "block" : "none" }}
      >
        <HtopView />
      </div>
    </div>
  );
}

export default Skills;