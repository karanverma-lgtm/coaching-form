"use client";

import React, { useState, useEffect } from "react";
import {
  fetchSurveyResponses,
  exportResponsesToCSV,
  SurveySubmission,
} from "@/lib/firebase/survey-service";
import { QUESTIONS } from "@/lib/survey/schema";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  Sparkles,
  Download,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  FileSpreadsheet,
  Users,
  PieChart,
  Calendar,
  Tag,
  Mail,
  User,
  Lock,
  LogOut,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronDown,
  CheckSquare,
  Square,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, loading: authLoading, signInWithEmail, logOut } = useAuth();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [responses, setResponses] = useState<SurveySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [exposureFilter, setExposureFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<SurveySubmission | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showExportMenu, setShowExportMenu] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchSurveyResponses();
      setResponses(data);
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!emailInput.trim() || !passwordInput) {
      setAuthError("Please enter both admin email and password.");
      return;
    }

    setIsSubmittingAuth(true);
    try {
      await signInWithEmail(emailInput.trim(), passwordInput);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error?.code === "auth/invalid-credential" || error?.code === "auth/user-not-found" || error?.code === "auth/wrong-password") {
        setAuthError("Invalid admin email or password. Please try again.");
      } else if (error?.code === "auth/too-many-requests") {
        setAuthError("Too many failed attempts. Please wait a moment and try again.");
      } else {
        setAuthError(error?.message || "Failed to sign in. Please verify Firebase Authentication settings.");
      }
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await logOut();
      setResponses([]);
      setSelectedIds(new Set());
      setEmailInput("");
      setPasswordInput("");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const downloadCSVData = (subs: SurveySubmission[], filePrefix: string) => {
    if (subs.length === 0) return;
    const csvContent = exportResponsesToCSV(subs);
    if (!csvContent) return;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filePrefix}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // Export All Responses
  const handleExportAll = () => {
    downloadCSVData(responses, `coaching_survey_all_${responses.length}`);
  };

  // Export Filtered Responses
  const handleExportFiltered = () => {
    downloadCSVData(filteredResponses, `coaching_survey_filtered_${filteredResponses.length}`);
  };

  // Export Selected Responses
  const handleExportSelected = () => {
    const selectedSubs = responses.filter((r) => r.id && selectedIds.has(r.id));
    downloadCSVData(selectedSubs, `coaching_survey_selected_${selectedSubs.length}`);
  };

  // Export Individual Response
  const handleExportIndividual = (sub: SurveySubmission) => {
    const safeName = (sub.respondentName || sub.id || "response")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    downloadCSVData([sub], `coaching_survey_single_${safeName}`);
  };

  const filteredResponses = responses.filter((r) => {
    if (roleFilter !== "all" && r.roleKey !== roleFilter) return false;
    if (exposureFilter !== "all" && r.exposure !== exposureFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.respondentName?.toLowerCase().includes(q);
      const matchEmail = r.respondentEmail?.toLowerCase().includes(q);
      const matchOrg = (r.answers?.["Q01"] as string)?.toLowerCase().includes(q);
      const matchRole = r.role?.toLowerCase().includes(q);
      const matchId = r.id?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchOrg && !matchRole && !matchId) return false;
    }
    return true;
  });

  // Toggle selection for a single row
  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle select all currently filtered rows
  const toggleSelectAllFiltered = () => {
    const allFilteredSelected = filteredResponses.every((r) => r.id && selectedIds.has(r.id));
    if (allFilteredSelected) {
      // Deselect filtered
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredResponses.forEach((r) => {
          if (r.id) next.delete(r.id);
        });
        return next;
      });
    } else {
      // Select all filtered
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredResponses.forEach((r) => {
          if (r.id) next.add(r.id);
        });
        return next;
      });
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const totalCount = responses.length;
  const userRouteCount = responses.filter((r) => r.exposure === "user").length;
  const nonUserRouteCount = responses.filter((r) => r.exposure === "non_user").length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <p className="text-sm text-zinc-500 font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Not logged in: Show Admin Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-orange-500/20 selection:text-orange-900 dark:selection:bg-orange-500/30 dark:selection:text-orange-200">
        <div className="w-full max-w-md space-y-6">
          {/* Brand & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-orange-500/20 text-white mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Please enter your authorized email and password to access research data and analytics.
            </p>
          </div>

          {/* Login Form Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-xl space-y-5">
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-600/25 transition-all disabled:opacity-50"
              >
                {isSubmittingAuth ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Survey</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col selection:bg-orange-500/20 selection:text-orange-900 dark:selection:bg-orange-500/30 dark:selection:text-orange-200 transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-300 dark:border-zinc-800 transition-colors"
              title="Back to Survey"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-sm text-zinc-900 dark:text-white">
                  NHRD × xMonks Admin Explorer
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
                  The Coaching Ripple Effect Research Data
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Authenticated user pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
              <User className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-mono truncate max-w-[160px]">{user.email}</span>
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            {/* Export Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={responses.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white shadow-lg shadow-orange-600/20 transition-all disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      CSV Export Options
                    </div>

                    <button
                      type="button"
                      onClick={handleExportAll}
                      disabled={responses.length === 0}
                      className="w-full text-left px-3 py-2.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-zinc-800/80 hover:text-orange-950 dark:hover:text-white flex items-center justify-between transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">Export All Records</span>
                        <span className="text-[11px] text-zinc-500">Full database export</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-300 font-semibold">
                        {responses.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportFiltered}
                      disabled={filteredResponses.length === 0}
                      className="w-full text-left px-3 py-2.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-zinc-800/80 hover:text-orange-950 dark:hover:text-white flex items-center justify-between transition-colors border-t border-zinc-100 dark:border-zinc-800/50"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">Export Filtered Results</span>
                        <span className="text-[11px] text-zinc-500">Matches current search & role</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-300 font-semibold">
                        {filteredResponses.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportSelected}
                      disabled={selectedIds.size === 0}
                      className="w-full text-left px-3 py-2.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-zinc-800/80 hover:text-orange-950 dark:hover:text-white flex items-center justify-between transition-colors border-t border-zinc-100 dark:border-zinc-800/50 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">Export Selected Items</span>
                        <span className="text-[11px] text-zinc-500">Checked table rows</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${selectedIds.size > 0 ? "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}>
                        {selectedIds.size}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleAdminLogout}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 border border-zinc-300 dark:border-zinc-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Total Submissions
              </span>
              <Users className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            </div>
            <p className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-2">{totalCount}</p>
            <p className="text-[11px] text-zinc-500 mt-1">Live from Cloud Firestore</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Active Coaching Users
              </span>
              <PieChart className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{userRouteCount}</p>
            <p className="text-[11px] text-zinc-500 mt-1">Structured / Selective user route</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Prospective & Non-Users
              </span>
              <Calendar className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">{nonUserRouteCount}</p>
            <p className="text-[11px] text-zinc-500 mt-1">Prospective / Non-user route</p>
          </div>
        </div>

        {/* Dynamic Multiple Selection Batch Action Bar */}
        {selectedIds.size > 0 && (
          <div className="p-3.5 px-5 rounded-2xl bg-orange-50/90 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-orange-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                {selectedIds.size}
              </div>
              <span className="text-xs font-medium text-orange-950 dark:text-orange-200">
                <strong>{selectedIds.size}</strong> response{selectedIds.size > 1 ? "s" : ""} selected for batch export
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleExportSelected}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV ({selectedIds.size})</span>
              </button>

              <button
                type="button"
                onClick={clearSelection}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-orange-200 dark:border-orange-900/60 hover:bg-orange-100/50 dark:hover:bg-zinc-800 text-orange-900 dark:text-orange-300 text-xs font-medium transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, role or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="chro">CHRO / CPO / HR Head</option>
                <option value="clo">CLO / Talent Head</option>
                <option value="ld">Head L&D / OD</option>
                <option value="cxo">Business / CXO</option>
                <option value="other">Other Senior Leader</option>
              </select>

              <select
                value={exposureFilter}
                onChange={(e) => setExposureFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
              >
                <option value="all">All Routes</option>
                <option value="user">User Route</option>
                <option value="non_user">Non-User Route</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Showing <strong className="text-zinc-900 dark:text-white">{filteredResponses.length}</strong> records
          </div>
        </div>

        {/* Table of Submissions */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-zinc-500 text-sm">
              <RefreshCw className="w-5 h-5 animate-spin text-orange-500" />
              <span>Fetching responses from Firestore...</span>
            </div>
          ) : filteredResponses.length === 0 ? (
            <div className="py-20 text-center text-zinc-500 text-sm">
              <FileSpreadsheet className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-2" />
              <p>No survey responses match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[1020px]">
                <thead className="bg-zinc-100/90 border-b border-zinc-200 text-zinc-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="w-12 px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={filteredResponses.length > 0 && filteredResponses.every((r) => r.id && selectedIds.has(r.id))}
                        onChange={toggleSelectAllFiltered}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-zinc-300 cursor-pointer accent-orange-600"
                        title="Select or deselect all filtered"
                      />
                    </th>
                    <th className="px-4 py-3.5 min-w-[150px]">Participant</th>
                    <th className="px-4 py-3.5 min-w-[180px]">Work Email</th>
                    <th className="px-4 py-3.5 min-w-[180px]">Designation Role</th>
                    <th className="px-4 py-3.5 min-w-[210px] whitespace-nowrap">Coaching Exposure</th>
                    <th className="px-4 py-3.5 min-w-[140px]">Industry</th>
                    <th className="px-4 py-3.5 min-w-[140px] whitespace-nowrap">Submitted</th>
                    <th className="px-4 py-3.5 text-right whitespace-nowrap min-w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80 text-zinc-700">
                  {filteredResponses.map((res) => {
                    const isSelected = res.id ? selectedIds.has(res.id) : false;

                    return (
                      <tr
                        key={res.id}
                        className={`transition-colors ${isSelected ? "bg-orange-50/60" : "hover:bg-zinc-50/80"}`}
                      >
                        <td className="w-12 px-4 py-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => res.id && toggleSelectRow(res.id)}
                            className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-zinc-300 cursor-pointer accent-orange-600"
                          />
                        </td>
                        <td className="px-4 py-3.5 font-medium text-zinc-900 max-w-[160px] truncate" title={res.respondentName}>
                          {res.respondentName || "—"}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-zinc-600 max-w-[180px] truncate" title={res.respondentEmail}>
                          {res.respondentEmail || "—"}
                        </td>
                        <td className="px-4 py-3.5 text-zinc-800 max-w-[180px] truncate" title={res.role}>
                          {res.role}
                        </td>
                        <td className="px-4 py-3.5 min-w-[210px]">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                                res.exposure === "user"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${res.exposure === "user" ? "bg-emerald-500" : "bg-amber-500"}`} />
                              <span>{res.exposure === "user" ? "Active Coaching User" : "Prospective / Non-User"}</span>
                            </span>
                            {res.coachExposureRaw && (
                              <span className="text-[11px] text-zinc-500 max-w-[200px] truncate" title={res.coachExposureRaw}>
                                {res.coachExposureRaw}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-zinc-600 max-w-[150px] truncate" title={res.industry}>
                          {res.industry || "—"}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-zinc-500 whitespace-nowrap">
                          {res.submittedAt || "—"}
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {/* Individual Export Button */}
                          <button
                            type="button"
                            onClick={() => handleExportIndividual(res)}
                            title="Export single response to CSV"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-orange-50 text-zinc-700 hover:text-orange-700 border border-zinc-200 hover:border-orange-300 transition-colors text-[11px] font-medium"
                          >
                            <Download className="w-3 h-3" />
                            <span>CSV</span>
                          </button>

                          {/* View Detail Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedResponse(res)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-orange-600 text-zinc-700 hover:text-white transition-colors text-[11px] font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Survey Submission Details</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">ID: {selectedResponse.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExportIndividual(selectedResponse)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedResponse(null)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs">
                <div>
                  <span className="text-zinc-500 flex items-center gap-1">
                    <User className="w-3 h-3 text-orange-500" /> Full Name:
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                    {selectedResponse.respondentName || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-amber-500" /> Work Email:
                  </span>
                  <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    {selectedResponse.respondentEmail || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Designation:</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{selectedResponse.role}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Exposure:</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{selectedResponse.coachExposureRaw}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Industry:</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{selectedResponse.industry}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Submission Date:</span>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 font-mono">
                    {selectedResponse.submittedAt || "—"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Question Responses
                </h4>
                {QUESTIONS.map((q) => {
                  const answerVal = selectedResponse.answers?.[q.id];
                  if (answerVal === undefined || answerVal === null || answerVal === "") {
                    return null;
                  }

                  let display = "";
                  if (Array.isArray(answerVal)) {
                    display = answerVal.join(" • ");
                  } else {
                    display = String(answerVal);
                  }

                  return (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 space-y-1 text-xs"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{q.id}</span>
                        {q.tag && (
                          <span className="font-semibold text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" />
                            {q.tag}
                          </span>
                        )}
                        <span className="text-zinc-600 dark:text-zinc-400 font-medium">{q.title}</span>
                      </div>
                      <p className="text-amber-700 dark:text-amber-300 pl-6 font-medium whitespace-pre-wrap">{display}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
