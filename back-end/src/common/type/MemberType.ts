import { Types } from 'mongoose';

export type PopulatedWorkspaceMember = {
  user: {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    avatarKey?: string;
  };
  role: 'owner' | 'member';
  joinedAt: Date;
};
