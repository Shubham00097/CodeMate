"use client";

import { Bell, Search, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Topbar({ user }) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const firstName = user?.name?.split(" ")[0] || "Developer";
  const [searchFocused, setSearchFocused] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "CM";

  return (
    <header
      style={{
        height: "52px",
        borderBottom: "1px solid var(--cm-border)",
        background: "rgba(8, 9, 9, 0.7)", /* var(--cm-bg) but translucent */
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: "12px",
        position: "sticky",
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* ── Left: breadcrumb ─────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: "0 0 auto" }}>
        <span
          style={{
            fontSize: "0.78rem",
            color: "var(--cm-text-3)",
            fontWeight: 500,
            letterSpacing: "-0.005em",
          }}
        >
          codeMate
        </span>
        <ChevronRight size={12} color="var(--cm-text-4)" strokeWidth={2} />
        <span
          style={{
            fontSize: "0.78rem",
            color: "var(--cm-text-2)",
            fontWeight: 600,
            letterSpacing: "-0.005em",
          }}
        >
          Dashboard
        </span>
        <span
          style={{
            marginLeft: "4px",
            fontSize: "0.72rem",
            color: "var(--cm-text-4)",
            fontWeight: 400,
          }}
        >
          — Good {timeOfDay}, {firstName}
        </span>
      </div>

      {/* ── Center: search ───────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: searchFocused ? "var(--cm-surface-2)" : "var(--cm-surface)",
            border: `1px solid ${searchFocused ? "var(--cm-border-3)" : "var(--cm-border)"}`,
            borderRadius: "var(--cm-radius-sm)",
            padding: "5px 11px",
            width: "100%",
            maxWidth: "400px",
            cursor: "text",
            transition: "border-color var(--cm-t), background var(--cm-t), box-shadow var(--cm-t)",
            boxShadow: searchFocused ? "0 0 0 3px var(--cm-accent-ring)" : "none",
          }}
          onClick={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          tabIndex={0}
        >
          <Search size={13} color="var(--cm-text-3)" strokeWidth={2} />
          <span
            style={{
              fontSize: "0.79rem",
              color: "var(--cm-text-3)",
              flex: 1,
              letterSpacing: "-0.005em",
            }}
          >
            Search problems, matches, history…
          </span>
          <kbd
            style={{
              fontSize: "0.62rem",
              color: "var(--cm-text-4)",
              background: "var(--cm-surface-3)",
              border: "1px solid var(--cm-border)",
              borderRadius: "3px",
              padding: "2px 6px",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* ── Right: bell + avatar ────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "0 0 auto" }}>
        {/* Notification bell */}
        <NotifButton />

        {/* Avatar */}
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "var(--cm-surface-3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.68rem",
            fontWeight: 600,
            color: "var(--cm-text-1)",
            cursor: "pointer",
            userSelect: "none",
          }}
          title={user?.name || "Profile"}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}

/* Notification button isolated to avoid inline handler complexity */
function NotifButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        background: hovered ? "var(--cm-surface-3)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        color: hovered ? "var(--cm-text-2)" : "var(--cm-text-3)",
        border: "none",
        transition: "background var(--cm-t), color var(--cm-t)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Notifications"
    >
      <Bell size={15} strokeWidth={1.8} />
      {/* Unread dot — monochrome white */}
      <span
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "var(--cm-text-1)",
        }}
      />
    </button>
  );
}
