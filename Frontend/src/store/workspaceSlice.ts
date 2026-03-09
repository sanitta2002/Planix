import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Workspace {
  id: string;
  name: string;
  ownerId?: {
    id: string;
  };
  role: "owner" | "member"; 
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload;
    },
    setCurrentWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.currentWorkspace = action.payload;
    },
  },
});

export const { setWorkspaces, setCurrentWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
