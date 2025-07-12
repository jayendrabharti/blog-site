"use client";

import { useEffect, useMemo, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LoaderCircleIcon,
  ReplyIcon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import { getComments, postComment } from "@/actions/post.actions";
import { toast } from "sonner";

export default function PostCommentSection({ postId }: { postId: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [allComments, setAllComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [postingComment, setPostingComment] = useState<boolean>(false);
  const [postingReply, setPostingReply] = useState<boolean>(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );

  const comments = useMemo(() => {
    if (!allComments || allComments.length === 0) return [];

    const commentMap = new Map();

    allComments.forEach((comment) => {
      commentMap.set(comment.id, {
        ...comment,
        children: [],
      });
    });

    const rootComments: any = [];

    allComments.forEach((comment) => {
      const currentComment = commentMap.get(comment.id);

      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.children.push(currentComment);
        } else {
          rootComments.push(currentComment);
        }
      } else {
        rootComments.push(currentComment);
      }
    });

    return rootComments;
  }, [allComments]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const allComments = await getComments(postId);
    setAllComments(allComments || []);
    setLoading(false);
  };

  const handlePostComment = async () => {
    try {
      if (!newComment.trim()) {
        toast.error("No content to post.");
        return;
      }
      setPostingComment(true);
      await postComment({ postId, content: newComment });
      await fetchComments();
      setPostingComment(false);
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
      setPostingComment(false);
    }
  };

  const handleSubmitReply = async () => {
    try {
      if (!replyContent.trim()) {
        toast.error("No content to reply.");
        return;
      }
      setPostingReply(true);
      await postComment({
        postId,
        content: replyContent,
        parentId: replyingTo,
      });
      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
    setReplyingTo(null);
    setPostingReply(false);
    setReplyContent("");
  };

  const toggleCollapse = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const Comment = ({
    comment,
    depth = 0,
    isExpanded,
    hasChildren = false,
  }: {
    comment: any;
    depth?: number;
    isExpanded?: boolean;
    hasChildren?: boolean;
  }) => {
    return (
      <div className={`${depth > 0 ? "ml-8 border-l border-border pl-4" : ""}`}>
        <div className="bg-background rounded-lg p-4 shadow-sm border border-border mb-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {comment.author.image ? (
                <img
                  src={comment.author.image}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-foreground">
                  {comment.author.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {comment.createdAt.toLocaleString()}
                </span>
              </div>

              <p className="mt-2 text-muted-foreground">{comment.content}</p>

              <div className="mt-3 flex items-center space-x-4">
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ReplyIcon className="w-4 h-4" />
                  <span>Reply</span>
                </button>

                {hasChildren && (
                  <button
                    onClick={() => toggleCollapse(comment.id)}
                    className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronUpIcon className="w-4 h-4" />
                    )}
                    <span>
                      {isExpanded ? "Hide" : "Show"} {comment.children.length}{" "}
                      replies
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="ml-8 mb-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <textarea
                    disabled={postingReply}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${comment.author.name}...`}
                    className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                  />
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={handleSubmitReply}
                      className="flex items-center space-x-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {postingReply ? (
                        <>
                          <LoaderCircleIcon className="animate-spin" />
                          <span>Replying ...</span>
                        </>
                      ) : (
                        <>
                          <SendIcon className="w-4 h-4" />
                          <span>Reply</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                      className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nested Comments */}
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {comment.children.map((child: any) => (
              <Comment key={child.id} comment={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderCircleIcon className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="text-2xl font-bold px-2">
        Comments ({allComments.length})
      </span>
      <div className="">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button className="mt-2 ml-auto flex" onClick={handlePostComment}>
          {postingComment ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <SendIcon />
          )}
          {postingComment ? "Posting..." : "Post Comment"}
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {comments.map((comment: any) => {
          const isExpanded = expandedComments.has(comment.id);
          const hasChildren = comment.children && comment.children.length > 0;

          return (
            <Comment
              key={comment.id}
              comment={comment}
              isExpanded={isExpanded}
              hasChildren={hasChildren}
            />
          );
        })}
      </div>
    </div>
  );
}
