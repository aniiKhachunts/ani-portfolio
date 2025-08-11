import { Outlet, useNavigation } from "react-router-dom";
import Loader from "./components/Loader";
import TopBar from "./components/TopBar";
import CommandMenu from "./components/CommandMenu";
import { useApp } from "./app/store";

export default function App() {
  const nav = useNavigation();
  const loaderDone = useApp(s => s.loaderDone);

  return (
      <div className="min-h-dvh font-sans">
        {!loaderDone && <Loader />}
        <TopBar />
        <main className="relative">
          {/* shows tiny progress line during route changes */}
          {nav.state !== "idle" && <div className="fixed top-0 left-0 h-[2px] w-full animate-pulse bg-accent z-50" />}
          <Outlet />
        </main>
        <CommandMenu />
      </div>
  );
}
