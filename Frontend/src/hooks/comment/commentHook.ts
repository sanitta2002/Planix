import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  getComments,
  deleteComment,
  updateComment,
  type CreateCommentProps,
  type CommentResponse,
} from "../../Service/comment/comment";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentProps) => createComment(data),
    onSuccess: (res: CommentResponse, variables) => {
      queryClient.setQueryData<CommentResponse[]>(
        ["comments", variables.issueId],
        (oldComments) => {
          if (!oldComments) return [res];
          return [...oldComments, res];
        }
      );
    },
  });
};

export const useGetComments = (issueId: string) => {
  return useQuery({
    queryKey: ["comments", issueId],
    queryFn: () => getComments(issueId),
    enabled: !!issueId,
  });
};

export const useDeleteComment = (issueId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: (_, commentId) => {
      queryClient.setQueryData<CommentResponse[]>(
        ["comments", issueId],
        (oldComments) => {
          if (!oldComments) return [];
          return oldComments.filter((c) => c.id !== commentId);
        }
      );
    },
  });
};

export const useUpdateComment = (issueId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      updateComment(commentId, content),
    onSuccess: (res: CommentResponse) => {
      queryClient.setQueryData<CommentResponse[]>(
        ["comments", issueId],
        (oldComments) => {
          if (!oldComments) return [];
          return oldComments.map((c) => (c.id === res.id ? res : c));
        }
      );
    },
  });
};
