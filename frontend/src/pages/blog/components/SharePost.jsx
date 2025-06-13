import React, { useState } from "react"
import { LuCheck, LuCopy } from "react-icons/lu"
import {
  FacebookShareButton,
  TwitterShareButton,
  LineShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share"

const SharePost = ({ title }) => {
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch((err) => console.error("Failed to copy: ", err))
  }

  return (
    <div className="my-6">
      <p className="text-gray-600 font-medium mb-3">Share Post</p>

      <div className="flex items-center gap-4">
        <FacebookShareButton url={shareUrl} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} quote={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <LineShareButton url={shareUrl} quote={title}>
          <LinkedinIcon size={32} round />
        </LineShareButton>

        <button
          className="bg-white hover:bg-sky-50 text-sky-800 font-medium px-2 py-2 rounded-full"
          onClick={handleCopyClick}
        >
          {isCopied ? (
            <LuCheck className="text-[20px]" />
          ) : (
            <LuCopy className="text-[20px]" />
          )}
        </button>
      </div>
    </div>
  )
}

export default SharePost
