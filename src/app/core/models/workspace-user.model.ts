export interface WorkspaceUser {
  _id?: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  workspaces?: { workspaceId: string; role: 'Editor' | 'Viewer' }[];
  createdAt?: string;
  updatedAt?: string;

  /** Flattened role for the active workspace (frontend only) */
  role?: 'Editor' | 'Viewer' | string;
}
