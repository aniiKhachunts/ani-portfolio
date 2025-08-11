import { create } from "zustand";

type World = "developer" | "violinist" | null;

type State = {
    world: World;
    loaderDone: boolean;
    menuOpen: boolean;
    setWorld: (w: World) => void;
    setLoaderDone: (b: boolean) => void;
    toggleMenu: () => void;
};

export const useApp = create<State>((set) => ({
    world: null,
    loaderDone: false,
    menuOpen: false,
    setWorld: (world) => set({ world }),
    setLoaderDone: (loaderDone) => set({ loaderDone }),
    toggleMenu: () => set(s => ({ menuOpen: !s.menuOpen })),
}));
