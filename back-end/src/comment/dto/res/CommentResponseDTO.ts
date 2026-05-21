export class CommentResponseDTO {
  id!: string;

  content!: string;

  issueId!: string;

  createdBy!: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  mentions!: string[];

  createdAt!: Date;

  updatedAt!: Date;
}
