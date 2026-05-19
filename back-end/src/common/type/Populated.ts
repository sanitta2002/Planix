import { Types } from 'mongoose';
import { ProjectMemberDocument } from '@/project/Model/ProjectMember/projectMember.schema';

export type PopulatedUser = {
  _id: string;
  firstName: string;
  email: string;
};

export type PopulatedPlan = {
  _id: string;
  name: string;
  price: number;
  durationDays: number;
  maxMembers?: number;
  maxProjects?: number;
};

export type PopulatedRole = {
  _id: Types.ObjectId;
  name: string;
};

export type PopulatedProjectMember = Omit<
  ProjectMemberDocument,
  'userId' | 'roleId'
> & {
  userId: PopulatedUser;
  roleId: PopulatedRole;
};
