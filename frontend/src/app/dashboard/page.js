"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { clearAuthData, getUser } from "@/lib/auth";

import Sidebar         from "@/components/dashboard/Sidebar";
import Topbar          from "@/components/dashboard/Topbar";
import WelcomeCard     from "@/components/dashboard/WelcomeCard";
import QuickActions    from "@/components/dashboard/QuickActions";
import MatchmakingCard from "@/components/dashboard/MatchmakingCard";
import StatsGrid       from "@/components/dashboard/StatsGrid";
import ActivityGraph   from "@/components/dashboard/ActivityGraph";
import FindMatchModal  from "@/components/ui/FindMatchModal";

export default function DashboardPage() {
  const router = useRouter();

  const [user,        setUser]        = useState(getUser());
  const [pageLoading, setPageLoading] = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);

  /* Verify auth on mount */
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const data = await authApi.me();
        setUser(data.user);
      } catch {
        clearAuthData();
        router.replace("/login");
      } finally {
        setPageLoading(false);
      }
    };
    bootstrap();
  }, [router]);

  /* Loading state */
  if (pageLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--cm-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <svg
          style={{ animation: "cm-spin 1s linear infinite", width: 20, height: 20 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--cm-text-3)"
          strokeWidth="2.5"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p style={{ fontSize: "0.78rem", color: "var(--cm-text-4)", letterSpacing: "-0.01em" }}>
          Loading dashboard…
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--cm-bg)" }}>

        {/* Sidebar */}
        <Sidebar user={user} />

        {/* Main area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Topbar */}
          <Topbar user={user} />

          {/* Scrollable content */}
          <main
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <div
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "40px 32px 80px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* Row 1: Welcome + Quick Actions */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 280px",
                  gap: "24px",
                  alignItems: "stretch",
                }}
              >
                <div style={{ display: "flex", flex: 1, height: "100%" }}>
                  <WelcomeCard user={user} style={{ flex: 1 }} />
                </div>
                <div style={{ height: "100%" }}>
                  <QuickActions onFindMatch={() => setModalOpen(true)} />
                </div>
              </div>

              {/* Row 2: Live Lobby */}
              <MatchmakingCard />

              {/* Row 3: Stats */}
              <StatsGrid />

              {/* Row 4: Activity Heatmap */}
              <ActivityGraph />
            </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      <FindMatchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
