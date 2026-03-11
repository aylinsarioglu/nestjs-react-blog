import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CommentService from "../services/comment";
import { toast } from "react-toastify";

const useComments = (blogId: string) => {
  return useQuery({
    queryKey: ["comments", blogId],
    queryFn: () => CommentService.getAll(blogId),
    enabled: !!blogId,  //  blogId varsa sorgu çalıştır yoksa sorguyu çalıştırma.booleana çevirme yöntemidir.boolean(blogId)
  });
};
const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogId, content }: { blogId: string; content: string }) => CommentService.create(blogId, content),
    // istek başarılı olunca comments sorgusunu tekrar çalıştır
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments"] }),
    onError: () => toast.error("Yorum oluşturulamadı"),
  });
};
const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogId, commentId }: { blogId: string; commentId: string }) =>
      CommentService.delete(blogId, commentId),
    // istek başarılı olunca comments sorgusunu tekrar çalıştır
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments"] }),
    onError: () => toast.error("Yorum silinemedi"),
  });
};

export { useComments, useDeleteComment, useCreateComment };
