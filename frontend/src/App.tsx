import { BrowserRouter, Outlet, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import SessionGuard from "./components/SessionGuard";
import { ToastProvider } from "./lib/toast";
import ErrorBoundary from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import AllPage from "./pages/AllPage";
import LoginPage from "./pages/LoginPage";
import MePage from "./pages/MePage";
import ResultPage from "./pages/ResultPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import TimerPage from "./pages/TimerPage";
import CalendarPage from "./pages/CalendarPage";
import ReportPage from "./pages/ReportPage";

export default function App() {
  return (
    <ToastProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* 타이머 — 헤더/네비 없는 풀스크린. SessionGuard만 적용 */}
        <Route element={<SessionGuard><Outlet /></SessionGuard>}>
          <Route path="/timer/:stepId" element={<TimerPage />} />
        </Route>
        <Route
          element={
            <SessionGuard>
              <AppShell />
            </SessionGuard>
          }
        >
          <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
          <Route path="/result" element={<ErrorBoundary><ResultPage /></ErrorBoundary>} />
          <Route path="/calendar" element={<ErrorBoundary><CalendarPage /></ErrorBoundary>} />
          <Route path="/all" element={<ErrorBoundary><AllPage /></ErrorBoundary>} />
          <Route path="/all/:id" element={<ErrorBoundary><ProjectDetailPage /></ErrorBoundary>} />
          <Route path="/report" element={<ErrorBoundary><ReportPage /></ErrorBoundary>} />
          <Route path="/me" element={<ErrorBoundary><MePage /></ErrorBoundary>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  );
}
