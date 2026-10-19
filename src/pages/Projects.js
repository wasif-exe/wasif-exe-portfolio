import React, { useEffect, useState, useMemo, Suspense } from "react";
import { playClick, playHover } from "../utils/sounds";
import "./Projects.css";

const InfiniteMenu = React.lazy(() => import("./components/InfiniteMenu"));

const EXCLUDED_REPOS = [
  "wasif-exe",
  "AdaptiControl",
  "wasif-exe.github.io",
  "First-Portfolio",
  "exif-remover",
  "arp-lanscan",
  "ImageObfuscatorPro",
];

const MARK_V_CARD = {
  name: "mark-v",
  title: "Mark V Decision Engine",
  metric: "37 ns / tick",
  blurb: "Zero-alloc mempool · ~185 cycles @ 5GHz · LTO path",
  link: "https://lnkd.in/p/dMd3sjWw",
  tag: "HOTPATH",
};

const REPO_META = {
  wire: {
    title: "Wire TCP/IP Stack",
    metric: "RFC 9293",
    blurb: "Userspace TCP · Reno · TAP · deterministic chaos harness",
    tag: "NET",
  },
  "lsm-engine": {
    title: "LSM Storage Engine",
    metric: "440K ops/sec",
    blurb: "Thread-per-core · io_uring · lock-free MemTable · NVMe path",
    tag: "STORAGE",
  },
  "raft-rupee": {
    title: "Raft Consensus Kernel",
    metric: "397K ticks/sec",
    blurb: "Pure state-machine · no async runtime · safety invariants",
    tag: "DIST",
  },
  "ringfree-kv": {
    title: "Ringfree KV",
    metric: "Lock-free",
    blurb: "Lock-free memory KV path · systems core",
    tag: "KV",
  },
};

const FALLBACK_API = [
  {
    name: "wire",
    description: "Userspace TCP/IP Stack & Zero-I/O Protocol Engine in Rust",
    html_url: "https://github.com/wasif-exe/wire",
    stargazers_count: 19,
    language: "Rust",
    pushed_at: "2025-02-18T12:00:00Z",
    fork: false,
    default_branch: "main",
  },
  {
    name: "lsm-engine",
    description: "Thread-Per-Core io_uring LSM-Tree Storage Engine in Rust",
    html_url: "https://github.com/wasif-exe/lsm-engine",
    stargazers_count: 14,
    language: "Rust",
    pushed_at: "2025-02-15T10:00:00Z",
    fork: false,
    default_branch: "main",
  },
  {
    name: "raft-rupee",
    description: "Pure Consensus Kernel & Deterministic Chaos Simulator",
    html_url: "https://github.com/wasif-exe/raft-rupee",
    stargazers_count: 11,
    language: "Rust",
    pushed_at: "2025-02-10T08:00:00Z",
    fork: false,
    default_branch: "main",
  },
  {
    name: "ringfree-kv",
    description: "Lock-Free Lockless Memory KV Store Engine",
    html_url: "https://github.com/wasif-exe/ringfree-kv",
    stargazers_count: 5,
    language: "Rust",
    pushed_at: "2025-01-20T08:00:00Z",
    fork: false,
    default_branch: "main",
  },
];

const FALLBACK_SPHERE = [
  {
    preferredImage: "https://raw.githubusercontent.com/wasif-exe/wire/main/logo.png",
    image: "https://opengraph.githubassets.com/1/wasif-exe/wire",
    link: "https://github.com/wasif-exe/wire",
    title: "wire",
    description: "Userspace TCP/IP Stack & Zero-I/O Protocol Engine in Rust",
  },
  {
    preferredImage: "https://raw.githubusercontent.com/wasif-exe/lsm-engine/main/logo.png",
    image: "https://opengraph.githubassets.com/1/wasif-exe/lsm-engine",
    link: "https://github.com/wasif-exe/lsm-engine",
    title: "lsm-engine",
    description: "Thread-Per-Core io_uring LSM-Tree Storage Engine in Rust",
  },
  {
    preferredImage: "https://raw.githubusercontent.com/wasif-exe/raft-rupee/main/logo.png",
    image: "https://opengraph.githubassets.com/1/wasif-exe/raft-rupee",
    link: "https://github.com/wasif-exe/raft-rupee",
    title: "raft-rupee",
    description: "Pure Consensus Kernel & Deterministic Chaos Simulator",
  },
  {
    preferredImage: "https://raw.githubusercontent.com/wasif-exe/ringfree-kv/main/logo.png",
    image: "https://opengraph.githubassets.com/1/wasif-exe/ringfree-kv",
    link: "https://github.com/wasif-exe/ringfree-kv",
    title: "ringfree-kv",
    description: "Lock-Free Lockless Memory KV Store Engine",
  },
];

function repoImage(owner, name, branch = "main") {
  return {
    preferred: `https://raw.githubusercontent.com/${owner}/${name}/${branch}/logo.png`,
    fallback: `https://opengraph.githubassets.com/1/${owner}/${name}`,
  };
}

function isExcluded(name) {
  const n = (name || "").toLowerCase();
  return EXCLUDED_REPOS.some((ex) => n.includes(ex.toLowerCase()));
}

function toCard(repo) {
  const key = (repo.name || "").toLowerCase();
  const meta =
    REPO_META[repo.name] ||
    REPO_META[key] ||
    Object.entries(REPO_META).find(([k]) => k.toLowerCase() === key)?.[1] ||
    {};

  const stars = repo.stargazers_count || 0;
  const metric =
    meta.metric || (stars > 0 ? `⭐ ${stars}` : repo.language || "SYS");

  return {
    name: repo.name,
    title: meta.title || repo.name,
    metric,
    blurb: meta.blurb || repo.description || "Systems / low-latency project.",
    link: repo.html_url,
    tag: meta.tag || (repo.language || "REPO").toUpperCase().slice(0, 8),
  };
}

function buildFeaturedCards(apiRepos, livePinnedNames) {
  const byName = new Map();
  (apiRepos || []).forEach((repo) => {
    if (!repo || repo.fork) return;
    if (isExcluded(repo.name)) return;
    if ((repo.name || "").toLowerCase() === "mark-v") return;
    byName.set(repo.name.toLowerCase(), repo);
  });

  const picked = [];
  const used = new Set();

  if (Array.isArray(livePinnedNames) && livePinnedNames.length > 0) {
    livePinnedNames.forEach((pinName) => {
      if (picked.length >= 3) return;
      const repo = byName.get(pinName.toLowerCase());
      if (!repo) return;
      picked.push(toCard(repo));
      used.add(repo.name.toLowerCase());
    });
  }

  if (picked.length < 3) {
    const rest = [...byName.values()]
      .filter((r) => !used.has(r.name.toLowerCase()))
      .sort((a, b) => {
        const starsA = a.stargazers_count || 0;
        const starsB = b.stargazers_count || 0;
        if (starsB !== starsA) return starsB - starsA;
        return (
          new Date(b.pushed_at || b.updated_at || 0).getTime() -
          new Date(a.pushed_at || a.updated_at || 0).getTime()
        );
      });

    for (const repo of rest) {
      if (picked.length >= 3) break;
      picked.push(toCard(repo));
      used.add(repo.name.toLowerCase());
    }
  }

  return [MARK_V_CARD, ...picked];
}

function mapSphereRepos(apiRepos) {
  const filtered = (apiRepos || []).filter((repo) => {
    if (!repo || repo.fork) return false;
    return !isExcluded(repo.name);
  });

  const sorted = [...filtered].sort((a, b) => {
    const starsA = a.stargazers_count || 0;
    const starsB = b.stargazers_count || 0;
    if (starsB !== starsA) return starsB - starsA;
    return (
      new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime()
    );
  });

  return sorted.slice(0, 24).map((repo) => {
    const imgs = repoImage(
      "wasif-exe",
      repo.name,
      repo.default_branch || "main"
    );
    return {
      image: imgs.fallback,
      preferredImage: imgs.preferred,
      link: repo.html_url,
      title: repo.name,
      description: repo.description || "Systems / low-latency project.",
    };
  });
}

function Projects() {
  const [apiRepos, setApiRepos] = useState([]);
  const [livePinned, setLivePinned] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("https://gh-pinned-repos.onesec.dev/api/user/wasif-exe")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        const names = data.map((item) => item.repo || item.name).filter(Boolean);
        setLivePinned(names);
      })
      .catch(() => {});

    fetch("https://api.github.com/users/wasif-exe/repos?per_page=100&sort=updated")
      .then((r) => {
        if (!r.ok) throw new Error("API Limit");
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data)) setApiRepos(data);
        else setApiRepos(FALLBACK_API);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) {
          setApiRepos(FALLBACK_API);
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const source = apiRepos.length > 0 ? apiRepos : FALLBACK_API;

  const featured = useMemo(
    () => buildFeaturedCards(source, livePinned),
    [source, livePinned]
  );

  const sphereItems = useMemo(() => {
    if (!loaded && apiRepos.length === 0) return [];
    const mapped = mapSphereRepos(source);
    return mapped.length > 0 ? mapped : FALLBACK_SPHERE;
  }, [source, loaded, apiRepos.length]);

  return (
    <div className="projects-page">
      <div className="featured-strip">
        {featured.map((p) => (
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
        <Suspense
          fallback={<div className="projects-fallback">Loading 3D Menu...</div>}
        >
          {sphereItems.length > 0 ? (
            <InfiniteMenu items={sphereItems} />
          ) : (
            <div className="projects-fallback">Loading Projects...</div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default Projects;
