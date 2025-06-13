import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../../utils/axiosInstance"
import { API_PATHS } from "../../../utils/apiPaths"
import Input from "../../../components/inputs/Input"
import { LuLoaderCircle } from "react-icons/lu"

const GenerateBlogPostForm = ({
  contentParams,
  setPostContent,
  handleCloseForm,
}) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: contentParams?.title || "",
    tone: contentParams?.tone || "",
  })
  const [isloading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }))
  }

  const handleGenerateBlogPost = async (e) => {
    e.preventDefault()

    const { title, tone } = formData

    if (!title || !tone) {
      setError("Please fill all the required fields.")
      return
    }
    setError("")
    setIsLoading(true)

    try {
      // Call AI API to generate blog post
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_BLOG_POST,
        { title, tone }
      )

      const generatedPost = aiResponse.data
      setPostContent(title, generatedPost || "")
      handleCloseForm()
      //
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Generate a Blog Post</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-3">
        Provide a title and tone to generate your blog post.
      </p>

      <form onSubmit={handleGenerateBlogPost} className="flex flex-col gap-3">
        <Input
          value={formData.title}
          onChange={({ target }) => handleChange("title", target.value)}
          label="Blog Post Title"
          placeholder=""
          type="text"
        />
        <Input
          value={formData.tone}
          onChange={({ target }) => handleChange("tone", target.value)}
          label="Tone"
          placeholder="beginner friendly, technical, casual, etc."
          type="text"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button
          className="btn-primary w-full mt-2"
          type="submit"
          disabled={isloading}
        >
          {isloading && <LuLoaderCircle className="animate-spin text-[18px]" />}{" "}
          {isloading ? "Generating..." : "Generate Post"}
        </button>
      </form>
    </div>
  )
}

export default GenerateBlogPostForm
