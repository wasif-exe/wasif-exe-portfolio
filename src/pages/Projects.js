import React, { useEffect, useState, Suspense } from "react";
import { playClick, playHover } from "../utils/sounds";
import "./Projects.css";

const InfiniteMenu = React.lazy(() => import("./components/InfiniteMenu"));

const FEATURED_PROJECTS = [
  {
    name: "lsm-engine",
    title: "LSM Storage Engine",
    metric: "440K ops/sec",
    blurb: "Thread-per-core · io_uring · lock-free MemTable · NVMe path",
    link: "https://github.com/wasif-exe/lsm-engine",
    tag: "STORAGE",
  },
  {
    name: "wire",
    title: "Wire TCP/IP Stack",
    metric: "RFC 9293",
    blurb: "Userspace TCP · Reno · TAP · deterministic chaos harness",
    link: "https://github.com/wasif-exe/wire",
    tag: "NET",
  },
  {
    name: "raft-rupee",
    title: "Raft Consensus Kernel",
    metric: "397K ticks/sec",
    blurb: "Pure state-machine · no async runtime · safety invariants",
    link: "https://github.com/wasif-exe/raft-rupee",
    tag: "DIST",
  },
  {
    name: "mark-v",
    title: "Mark V Decision Engine",
    metric: "37 ns / tick",
    blurb: "Zero-alloc mempool · ~185 cycles @ 5GHz · LTO path",
    link: "https://lnkd.in/p/dMd3sjWw",
    tag: "HOTPATH",
  },
];

const FEATURED_KEYS = ["lsm", "wire", "raft", "ringfree", "mark", "io_uring", "kernel", "tcp"];

function Projects() {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.github.com/users/wasif-exe/repos?per_page=100&sort=updated")
      .then((r) => {
        if (!r.ok) throw new Error("github");
        return r.json();
      })
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        const sorted = [...data].sort((a, b) => {
          const aF = FEATURED_KEYS.some((k) => a.name.toLowerCase().includes(k));
          const bF = FEATURED_KEYS.some((k) => b.name.toLowerCase().includes(k));
          if (aF && !bF) return -1;
          if (!aF && bF) return 1;
          return new Date(b.pushed_at) - new Date(a.pushed_at);
        });
        setRepos(
          sorted.slice(0, 24).map((repo) => ({
            image: `https://raw.githubusercontent.com/wasif-exe/${repo.name}/${repo.default_branch}/logo.png`,
            link: repo.html_url,
            title: repo.name,
            description: repo.description || "Systems / low-latency project.",
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="projects-page">
      <div className="featured-strip">
        {FEATURED_PROJECTS.map((p) => (
          <a
            key={p.name}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-card"
            onMouseEnter={playHover}
            onClick={playClick}
          >
            <div className="featured-top">
              <span className="featured-tag">{p.tag}</span>
              <span className="featured-metric">{p.metric}</span>
            </div>
            <h3 className="featured-title">{p.title}</h3>
            <p className="featured-blurb">{p.blurb}</p>
            <span className="featured-link">
              {p.link.includes("lnkd.in") || p.link.includes("linkedin")
                ? "view post ↗"
                : "open repo ↗"}
            </span>
          </a>
        ))}
      </div>

      <div className="projects-sphere">
        <Suspense fallback={<div className="projects-fallback">Loading 3D Menu...</div>}>
          {repos.length > 0 ? (
            <InfiniteMenu items={repos} />
          ) : (
            <div className="projects-fallback">
              {error ? "Could not load repos." : "Loading Projects..."}
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default Projects;