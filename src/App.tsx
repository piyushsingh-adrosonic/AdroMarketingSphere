import { useState, useEffect } from "react";
import { SidebarNavigation } from "@/components/common/SidebarNavigation";
import { ContentHubPage } from "@/pages/DashboardPage";
import { GenerateContentPage } from "@/pages/GenerateContentPage";
import { ContentEditorPage } from "@/pages/ContentEditorPage";
import { ProofPointsPage } from "@/pages/ProofPointsPage";
import { NewProofPointPage } from "@/pages/NewProofPointPage";
import { PlannerPage } from "@/pages/PlannerPage";
import { LeadsProspectsPage } from "@/pages/LeadsProspectsPage";
import { EventHubPage } from "@/pages/EventHubPage";
import { AssetsManagementPage } from "@/pages/AssetsManagementPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { LoginPage } from "@/pages/LoginPage";
import { LandingPage } from "@/pages/LandingPage";
import { AMSInfoPage } from "@/pages/AMSInfoPage";

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    rememberMe: boolean;
    role: string;
    name: string;
  } | null>(null);

  const [userRole, setUserRole] = useState("marketing-head");
  const [preAuthPage, setPreAuthPage] = useState<"landing" | "login">("landing");

  // UI / app states
  const [currentPage, setCurrentPage] = useState("ams-info");
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [selectedProofPointId, setSelectedProofPointId] = useState<number | null>(
    null
  );
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [isProofPointDialogOpen, setIsProofPointDialogOpen] = useState(false);
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("my-content");
  const [proofPointsView, setProofPointsView] = useState("pending");
  const [leadsView, setLeadsView] = useState("all");
  const [assetsView, setAssetsView] = useState("all");
  const [assetViewMode, setAssetViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  // 🔑 Login handler
  const handleLogin = (userData: {
    email: string;
    rememberMe: boolean;
    role: string;
    name: string;
  }) => {
    setCurrentUser(userData);
    setUserRole(userData.role);
    setIsAuthenticated(true);
    setCurrentPage('ams-info');
    if (userData.rememberMe) {
      localStorage.setItem("ams_user", JSON.stringify(userData));
    }
  };

  // 🔑 Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("ams_user");
    setCurrentPage("ams-info"); // reset
    setUserRole("marketing-head");
  };

  // 🔑 Auto-login from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("ams_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setUserRole(userData.role || "marketing-head");
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("ams_user");
      }
    }
  }, []);

  // ==========================
  // 🧭 Simple path-based routing (no external router)
  // Uses History API so URLs look like /landing instead of #/landing
  // ==========================
  const preAuthRoutes = new Set(["landing", "login"]);
  const appRoutes = new Set([
    "content-hub",
    "generate",
    "editor",
    "proof-points",
    "new-proof-point",
    "planner",
    "leads-prospects",
    "event-hub",
    "assets-management",
    "analytics",
    "ams-info"
  ]);

  const readPath = (): string => {
    const slug = (window.location.pathname || "/").replace(/^\//, "");
    return slug;
  };

  // On load and when auth state changes, read path and navigate if valid
  useEffect(() => {
    const slug = readPath();
    if (!isAuthenticated) {
      if (preAuthRoutes.has(slug as any)) {
        setPreAuthPage((slug as "landing" | "login") || "landing");
      } else {
        window.history.replaceState(null, "", "/landing");
        setPreAuthPage("landing");
      }
    } else {
      if (appRoutes.has(slug as any)) {
        setCurrentPage(slug);
      } else {
        window.history.replaceState(null, "", "/ams-info");
        setCurrentPage("ams-info");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Keep path in sync when page changes
  useEffect(() => {
    if (!isAuthenticated) {
      window.history.pushState(null, "", `/${preAuthPage}`);
    }
  }, [preAuthPage, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      window.history.pushState(null, "", `/${currentPage}`);
    }
  }, [currentPage, isAuthenticated]);

  // Respond to browser back/forward and deep links (e.g., /planner?task=ID)
  useEffect(() => {
    const onPopState = () => {
      const slug = readPath();
      if (!isAuthenticated) {
        if (preAuthRoutes.has(slug as any)) setPreAuthPage(slug as any);
      } else {
        if (appRoutes.has(slug as any)) setCurrentPage(slug);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Open planner task when query parameter is present
  useEffect(() => {
    if (!isAuthenticated) return;
    const search = window.location.search || '';
    const params = new URLSearchParams(search);
    const taskIdParam = params.get('task');
    const taskId = taskIdParam ? Number(taskIdParam) : (window as any).openTaskFromQuery;
    if (currentPage === 'planner' && taskId) {
      // open the task dialog via global event
      const evt = new CustomEvent('open-planner-task', { detail: { taskId } });
      window.dispatchEvent(evt);
      // cleanup stored id
      (window as any).openTaskFromQuery = undefined;
    }
  }, [currentPage, isAuthenticated]);

  // -------------------------
  // 🔒 Show Landing / Login if not authenticated
  // -------------------------
  if (!isAuthenticated) {
    return preAuthPage === "landing" ? (
      <LandingPage onSwitchToLogin={() => setPreAuthPage("login")} />
    ) : (
      <LoginPage
        onLogin={handleLogin}
        onBack={() => setPreAuthPage("landing")}
      />
    );
  }

  // -------------------------
  // ✅ Authenticated app (dashboard + pages)
  // -------------------------
  const handleContentClick = (contentId: number) => {
    setSelectedContentId(contentId);
    setCurrentPage("editor");
  };

  const handleProofPointClick = (proofPointId: number) => {
    setSelectedProofPointId(proofPointId);
    setIsProofPointDialogOpen(true);
  };

  const handleLeadClick = (leadId: number) => {
    setSelectedLeadId(leadId);
    setIsLeadDialogOpen(true);
  };

  const handleAssetClick = (assetId: number) => {
    setSelectedAssetId(assetId);
    setIsAssetDialogOpen(true);
  };

  return (
    <div className="bg-white flex h-screen overflow-hidden">
      <SidebarNavigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto">
        {currentPage === "content-hub" && (
          <ContentHubPage
            setIsSidebarOpen={setIsSidebarOpen}
            setCurrentPage={setCurrentPage}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            handleContentClick={handleContentClick}
            currentUserName={currentUser?.name}
          />
        )}

        {currentPage === "generate" && (
          <GenerateContentPage
            setIsSidebarOpen={setIsSidebarOpen}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === "editor" && (
          <ContentEditorPage
            setIsSidebarOpen={setIsSidebarOpen}
            setCurrentPage={setCurrentPage}
            selectedContentId={selectedContentId}
          />
        )}

        {currentPage === "proof-points" && (
          <ProofPointsPage
            setIsSidebarOpen={setIsSidebarOpen}
            setCurrentPage={setCurrentPage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            userRole={userRole}
            proofPointsView={proofPointsView}
            setProofPointsView={setProofPointsView}
            selectedProofPointId={selectedProofPointId}
            setSelectedProofPointId={setSelectedProofPointId}
            isProofPointDialogOpen={isProofPointDialogOpen}
            setIsProofPointDialogOpen={setIsProofPointDialogOpen}
            handleProofPointClick={handleProofPointClick}
          />
        )}

        {currentPage === "new-proof-point" && (
          <NewProofPointPage
            setIsSidebarOpen={setIsSidebarOpen}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === "planner" && (
          <PlannerPage
            setIsSidebarOpen={setIsSidebarOpen}
            isTaskDialogOpen={isTaskDialogOpen}
            setIsTaskDialogOpen={setIsTaskDialogOpen}
          />
        )}

        {currentPage === "leads-prospects" && (
          <LeadsProspectsPage
            setIsSidebarOpen={setIsSidebarOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            leadsView={leadsView}
            setLeadsView={setLeadsView}
            selectedLeadId={selectedLeadId}
            setSelectedLeadId={setSelectedLeadId}
            isLeadDialogOpen={isLeadDialogOpen}
            setIsLeadDialogOpen={setIsLeadDialogOpen}
            handleLeadClick={handleLeadClick}
          />
        )}

        {currentPage === "event-hub" && (
          <EventHubPage
            setIsSidebarOpen={setIsSidebarOpen}
            isEventDialogOpen={isEventDialogOpen}
            setIsEventDialogOpen={setIsEventDialogOpen}
          />
        )}

        {currentPage === "assets-management" && (
          <AssetsManagementPage
            setIsSidebarOpen={setIsSidebarOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            assetsView={assetsView}
            setAssetsView={setAssetsView}
            assetViewMode={assetViewMode}
            setAssetViewMode={setAssetViewMode}
            selectedAssetId={selectedAssetId}
            setSelectedAssetId={setSelectedAssetId}
            isAssetDialogOpen={isAssetDialogOpen}
            setIsAssetDialogOpen={setIsAssetDialogOpen}
            isUploadDialogOpen={isUploadDialogOpen}
            setIsUploadDialogOpen={setIsUploadDialogOpen}
            handleAssetClick={handleAssetClick}
          />
        )}

        {currentPage === "analytics" && (
          <AnalyticsPage setIsSidebarOpen={setIsSidebarOpen} />
        )}

        {currentPage === "ams-info" && (
          <AMSInfoPage setIsSidebarOpen={setIsSidebarOpen} />
        )}
      </div>
    </div>
  );
}
