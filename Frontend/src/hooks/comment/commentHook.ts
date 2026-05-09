import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getComments, deleteComment, updateComment, type CreateCommentProps } from "../../Service/comment/comment";

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCommentProps) => createComment(data),
    onSuccess: (_, variables) => {
      // Invalidate the issue to refresh any nested data if needed
      // If there's a specific "comments" query, invalidate it here
      queryClient.invalidateQueries({ queryKey: ["comments", variables.issueId] });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
        }
    });
};

export const useUpdateComment = (issueId: string) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ commentId, content }: { commentId: string; content: string }) => updateComment(commentId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", issueId] });
        }
    });
};
