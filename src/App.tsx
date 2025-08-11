import { Outlet, useNavigation } from "react-router-dom";
import Loader from "./components/Loader";
import TopBar from "./components/TopBar";
import CommandMenu from "./components/CommandMenu";
import { useApp } from "./app/store";
import { MotionConfig, useReducedMotion } from "framer-motion";
import Footer from "./components/Footer.tsx";
import PointerSpotlight from "./components/PointerSpotlight.tsx";

export default function App() {
  const nav = useNavigation();
  const loaderDone = useApp(s => s.loaderDone);
    const prefersReducedMotion = useReducedMotion();

  return (
      <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
          <div className="min-h-dvh font-sans overflow-clip">
              {!loaderDone && <Loader />}
              <PointerSpotlight />
              <TopBar />
              <main className="relative">
                  {nav.state !== "idle" && <div className="fixed top-0 left-0 h-[2px] w-full animate-pulse bg-accent z-50" />}
                  <Outlet />
              </main>
              <CommandMenu />
              <Footer />
          </div>
      </MotionConfig>
  );
}
