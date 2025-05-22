
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

// Pages
import Home from "./pages/Home";
import FindFriends from "./pages/FindFriends";
import MyFriends from "./pages/MyFriends";
import SuggestedFriends from "./pages/SuggestedFriends";
import GraphPage from "./pages/GraphPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/Navbar";

// Set title
document.title = "SocialBFS - Social Network Friend Finder";

// Add pulse animation CSS
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  .pulse {
    animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;
document.head.appendChild(pulseStyle);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col dark">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/find-friends" element={<FindFriends />} />
                <Route path="/my-friends" element={<MyFriends />} />
                <Route path="/suggested-friends" element={<SuggestedFriends />} />
                <Route path="/graph" element={<GraphPage />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
