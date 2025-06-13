import React, { useContext, useState } from "react"
import { UserContext } from "../../context/userContext"
import { LuChevronDown, LuDot, LuReply, LuTrash2 } from "react-icons/lu"
import moment from "moment"
import CommentReplyInput from "../inputs/CommentReplyInput"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import toast from "react-hot-toast"

const CommentInfoCard = ({
  commentId,
  authorName,
  authorPhoto,
  content,
  updatedOn,
  post,
  replies,
  getAllComments,
  onDelete,
  isSubReply,
}) => {
  const { user } = useContext(UserContext)
  const [replyText, setReplyText] = useState("")
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showSubRepies, setShowSubReplies] = useState(false)

  // Handle canceling a reply
  const handleCancelReply = () => {
    setReplyText("")
    setShowReplyForm(false)
  }

  // Add Reply
  const handleAddReply = async () => {
    try {
      await axiosInstance.post(API_PATHS.COMMENTS.ADD(post.id), {
        content: replyText,
        parentComment: commentId,
      })

      toast.success("Reply added successfully")

      setReplyText("")
      setShowReplyForm(false)
      getAllComments()
      //
    } catch (error) {
      console.error("Error adding reply: ", error)
    }
  }

  return (
    <div
      className={`bg-white p-3 rounded-lg cursor-pointer group ${
        isSubReply ? "mb-1" : "mb-4"
      }`}
    >
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-8 order-2 md:order-1">
          <div className="flex items-start gap-3">
            <img
              src={authorPhoto}
              alt={authorName}
              className="size-10 rounded-full"
            />

            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h3 className="text-[12px] text-gray-500 font-medium">
                  @{authorName}
                </h3>
                <LuDot className="text-gray-500" />
                <span className="text-[12px] text-gray-500 font-medium">
                  {updatedOn}
                </span>
              </div>

              <p className="text-sm text-black font-medium">{content}</p>

              <div className="flex items-center gap-3 mt-1.5">
                {!isSubReply && (
                  <>
                    <button
                      className="flex items-center gap-2 text-[13px] font-medium text-sky-950 bg-sky-50 px-4 py-0.5 rounded-full hover:bg-sky-500 hover:text-white cursor-pointer"
                      onClick={() =>
                        setShowReplyForm((prevState) => !prevState)
                      }
                    >
                      <LuReply /> Reply
                    </button>
                    <button
                      className="flex items-center gap-1.5 text-[13px] font-medium text-sky-950 bg-sky-50 px-4 py-0.5 rounded-full hover:bg-sky-500 hover:text-white cursor-pointer"
                      onClick={() =>
                        setShowSubReplies((prevState) => !prevState)
                      }
                    >
                      {replies?.length || 0}{" "}
                      {replies?.length == 1 ? "reply" : "replies"}{" "}
                      <LuChevronDown
                        className={`${showSubRepies ? "rotate-180" : ""}`}
                      />
                    </button>{" "}
                  </>
                )}

                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-sky-950 bg-sky-50 px-4 py-0.5 rounded-full hover:bg-rose-500 hover:text-white cursor-pointer"
                  onClick={() => onDelete()}
                >
                  <LuTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {!isSubReply && (
          <div className="col-span-12 md:col-span-4 order-1 md:order-2 flex items-center gap-4">
            <img
              src={post?.coverImageUrl}
              alt="Post cover"
              className="w-18 h-12 rounded-lg object-cover"
            />

            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h4 className="text-xs text-gray-800 font-medium">
                  {post?.title}
                </h4>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isSubReply && showReplyForm && (
        <CommentReplyInput
          user={user}
          authorName={authorName}
          content={content}
          replyText={replyText}
          setReplyText={setReplyText}
          handleAddReply={handleAddReply}
          handleCancelReply={handleCancelReply}
        />
      )}

      {showSubRepies &&
        replies?.length > 0 &&
        replies.map((comment, index) => (
          <div key={comment.id} className={`ml-5 ${index == 0 ? "mt-5" : ""}`}>
            <CommentInfoCard
              authorName={comment.author.name}
              authorPhoto={comment.author.profileImageUrl}
              content={comment.content}
              post={comment.post}
              replies={comment.replies || []}
              isSubReply
              updatedOn={
                comment.updatedAt
                  ? moment(comment.updatedAt).format("Do MMM YYYY")
                  : "-"
              }
              onDelete={() => onDelete(comment.id)}
            />
          </div>
        ))}
    </div>
  )
}

export default CommentInfoCard
