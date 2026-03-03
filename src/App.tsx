import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import GDPRBanner from "@/components/GDPRBanner";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { hasLearnerProfile } from "@/lib/onboardingEngine";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Assessment from "./pages/Assessment";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons";
import Lesson from "./pages/Lesson";
import Scenario from "./pages/Scenario";
import ImmersiveScenario from "./pages/ImmersiveScenario";
import StructuredScenario from "./pages/StructuredScenario";
import ImmergoMissions from "./pages/ImmergoMissions";
import ImmergoChat from "./pages/ImmergoChat";
import Admin from "./pages/Admin";
import Community from "./pages/Community";
import Messages from "./pages/Messages";
import Vocabulary from "./pages/Vocabulary";
import CompleteProfile from "./pages/CompleteProfile";
import EnvironmentChallenges from "./pages/EnvironmentChallenges";
import CommunityBuilder from "./pages/CommunityBuilder";
import Paths from "./pages/Paths";
import SituationPicker from "./pages/SituationPicker";
import ChatLesson from "./pages/ChatLesson";
import ModePage from "./pages/ModePage";
import SeeLessonPage from "./pages/SeeLessonPage";
import Assessor from "./pages/Assessor";
import VRSimulation from "./pages/VRSimulation";
import Resources from "./pages/Resources";
import Challenge from "./pages/Challenge";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Root redirect component
function RootRedirect() {
  if (hasLearnerProfile()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Landing />;
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <TooltipProvider>
            <GDPRBanner />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/lesson/:lessonId" element={<Lesson />} />
                <Route path="/see-lesson/:lessonId" element={<SeeLessonPage />} />
                <Route path="/mode/:id" element={<ModePage />} />
                <Route path="/assessor" element={<Assessor />} />
                <Route path="/scenario" element={<Scenario />} />
                <Route path="/immersive" element={<ImmersiveScenario />} />
                <Route path="/structured-scenario" element={<StructuredScenario />} />
                <Route path="/immergo" element={<ImmergoMissions />} />
                <Route path="/immergo-chat" element={<ImmergoChat />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/community" element={<Community />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/environment/:id" element={<EnvironmentChallenges />} />
                <Route path="/community-builder" element={<CommunityBuilder />} />
                <Route path="/paths" element={<Paths />} />
                <Route path="/situations" element={<SituationPicker />} />
                <Route path="/chat/:lessonId" element={<ChatLesson />} />
                <Route path="/vr-sim/:lessonId" element={<VRSimulation />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/challenge/:challengeId" element={<Challenge />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <PWAInstallPrompt />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
