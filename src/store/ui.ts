import { atom } from "jotai";

export type WorkspaceMode = "capture" | "shape" | "review";

export const workspaceModeAtom = atom<WorkspaceMode>("capture");
