"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import mermaid from "mermaid";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChevronUpIcon, LoaderCircleIcon, SendIcon, XIcon } from "lucide-react";
import { postComment } from "@/actions/post.actions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Separator } from "./ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { Session } from "next-auth";
import CommentItem from "./CommentItem";
import { ExtendedPost, Comment, CommentWithChildren } from "@/utils/types";

// Type definitions

export default function PostCommentSection({ post }: { post: ExtendedPost }) {
  const { data: session } = useSession();
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [postingComment, setPostingComment] = useState<boolean>(false);
  const [showMermaidTree, setShowMermaidTree] = useState<boolean>(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const treeRef = useRef<HTMLDivElement>(null);

  // Set initial comments
  useEffect(() => {
    setAllComments(post.comments || []);
  }, [post.comments]);

  // Memoized comments tree
  const comments = useMemo(() => {
    if (!allComments || allComments.length === 0) return [];

    const rootComments: CommentWithChildren[] = [];

    function makeCommentTree(comment: Comment): CommentWithChildren {
      const commentTree: CommentWithChildren = {
        ...comment,
        children: [],
      };

      const replies = allComments.filter((c) => c.parentId === comment.id);
      replies.forEach((reply) => {
        const replyTree = makeCommentTree(reply);
        commentTree.children.push(replyTree);
      });

      return commentTree;
    }

    allComments.forEach((comment) => {
      if (!comment.parentId) {
        const commentTree = makeCommentTree(comment);
        rootComments.push(commentTree);
      }
    });

    return rootComments;
  }, [allComments]);

  // Generate Mermaid chart from comments
  const generateMermaidChart = useMemo(() => {
    if (!allComments || allComments.length === 0) {
      return `flowchart TD
        A["No comments yet"]
        classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px`;
    }

    // Build the tree structure here instead of using comments
    const rootComments: CommentWithChildren[] = [];

    function makeCommentTree(comment: Comment): CommentWithChildren {
      const commentTree: CommentWithChildren = {
        ...comment,
        children: [],
      };
      const replies = allComments.filter((c) => c.parentId === comment.id);
      replies.forEach((reply) => {
        const replyTree = makeCommentTree(reply);
        commentTree.children.push(replyTree);
      });
      return commentTree;
    }

    allComments.forEach((comment) => {
      if (!comment.parentId) {
        const commentTree = makeCommentTree(comment);
        rootComments.push(commentTree);
      }
    });

    let chartCode = "flowchart TD\n";
    chartCode +=
      `    POST["Post by **${post.author.name}**<br/><hr/>${post.title}"]` +
      "\n";
    const processedNodes = new Set<string>();

    const processNode = (comment: CommentWithChildren, parentId?: string) => {
      if (processedNodes.has(comment.id)) return;
      processedNodes.add(comment.id);

      // Truncate content for display
      const truncatedContent =
        comment.content.length > 40
          ? comment.content.substring(0, 40) + "..."
          : comment.content;

      // Clean content for Mermaid (remove special characters)
      const cleanContent = truncatedContent
        .replace(/["\[\]]/g, "")
        .replace(/\n/g, " ")
        .replace(/\r/g, " ");

      // Add connection if has parent
      if (parentId) {
        chartCode += `    ${parentId} --> ${comment.id}["**${comment.author.name}**<br/><hr/>${cleanContent}"]\n`;
      } else {
        chartCode += `    POST --> ${comment.id}["**${comment.author.name}**<br/><hr/>${cleanContent}"]\n`;
      }

      // Process children
      if (comment.children && comment.children.length > 0) {
        comment.children.forEach((child) => {
          processNode(child, comment.id);
        });
      }
    };

    // Process all root comments
    rootComments.forEach((comment) => {
      processNode(comment);
    });

    // Add styling
    chartCode += `
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px,color:#000
    classDef root fill:#e1f5fe,stroke:#0277bd,stroke-width:2px,color:#000
    classDef reply fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000
    classDef post fill:#4caf50,stroke:#2e7d32,stroke-width:3px,color:#fff
    class POST post
`;

    // Apply styles to nodes
    rootComments.forEach((comment) => {
      chartCode += `    class ${comment.id} root\n`;
      const applyReplyStyle = (c: CommentWithChildren) => {
        if (c.children) {
          c.children.forEach((child) => {
            chartCode += `    class ${child.id} reply\n`;
            applyReplyStyle(child);
          });
        }
      };
      applyReplyStyle(comment);
    });

    return chartCode;
  }, [allComments, post.author.name, post.title]);

  // Initialize Mermaid and render chart
  useEffect(() => {
    if (!showMermaidTree || !treeRef.current) return;

    const renderMermaid = async () => {
      try {
        // Initialize Mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "Arial, sans-serif",
          fontSize: 12,
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis",
          },
        });

        // Clear previous content
        if (treeRef.current) {
          treeRef.current.innerHTML = "";
        }

        // Generate unique ID for this render
        const elementId = `mermaid-${Date.now()}`;

        // Render the diagram
        const { svg } = await mermaid.render(elementId, generateMermaidChart);

        // Insert the SVG into the DOM
        if (treeRef.current) {
          treeRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Error rendering Mermaid diagram:", error);
        if (treeRef.current) {
          treeRef.current.innerHTML = `<div class="text-red-500 p-4">Error rendering diagram: ${error}</div>`;
        }
      }
    };

    renderMermaid();
  }, [generateMermaidChart, showMermaidTree]);

  // Memoized handlers
  const handlePostComment = useCallback(async () => {
    try {
      if (!newComment.trim()) {
        toast.error("No content to post.");
        return;
      }
      setPostingComment(true);
      await postComment({ postId: post.id, content: newComment });
      setNewComment("");
      setPostingComment(false);
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
      setPostingComment(false);
    }
  }, [newComment, post.id]);

  const collapseAll = useCallback(() => {
    setExpandedComments(new Set());
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold px-2">
          Comments ({allComments.length})
        </span>
        <div className="flex gap-2">
          <Button
            variant={showMermaidTree ? "default" : "outline"}
            onClick={() => setShowMermaidTree(!showMermaidTree)}
          >
            Show Comment Tree
          </Button>
          <Button
            variant={"outline"}
            onClick={collapseAll}
            disabled={!expandedComments.size}
          >
            <ChevronUpIcon />
            Collapse all
          </Button>
        </div>
      </div>

      <div className="">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          disabled={!newComment.trim() || postingComment}
          className="mt-2 ml-auto flex"
          onClick={handlePostComment}
        >
          {postingComment ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <SendIcon />
          )}
          {postingComment ? "Posting..." : "Post Comment"}
        </Button>
      </div>

      {/* Mermaid Tree Diagram */}
      <AnimatePresence>
        {showMermaidTree && (
          <motion.div
            key={"modal"}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-100 bg-black/30 bg-opacity-50 flex items-center justify-center p-4"
          >
            <div className="bg-background rounded-lg p-4 border border-border w-full h-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">Comment Tree Diagram</span>
                <Button
                  variant={"destructive"}
                  className="ml-auto"
                  onClick={() => setShowMermaidTree(false)}
                >
                  Close
                  <XIcon />
                </Button>
              </div>
              <Separator />
              <div
                ref={treeRef}
                className="mermaid-container overflow-x-auto flex flex-col items-center justify-center w-full h-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {comments.map((comment: CommentWithChildren) => {
            const hasChildren = comment.children && comment.children.length > 0;

            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                hasChildren={hasChildren}
                session={session as Session}
                post={post}
                expandedComments={expandedComments}
                setExpandedComments={setExpandedComments}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
