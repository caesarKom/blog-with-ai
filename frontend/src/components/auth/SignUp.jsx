import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { UserContext } from "../../context/userContext"
import LOGIN_IMG from "../../assets/nature.jpg"
import Input from "../inputs/Input"
import { validateEmail } from "../../utils/helper"
import ProfilePhotoSelector from "../inputs/ProfilePhotoSelector"
import uploadImage from "../../utils/uploadImage"

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminAccessToken, setAdminAccessToken] = useState("")

  const [error, setError] = useState(null)

  const { updateUser, setOpenAuthForm } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()

    let profileImageUrl = ""
    if (!fullName) {
      setError("Please enter full name")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!password) {
      setError("Please enter the password.")
      return
    }
    setError("")

    // SignUp Api call
    try {
      // Upload image if present
      if (profilePic) {
        const imageUploadRes = await uploadImage(profilePic)
        profileImageUrl = imageUploadRes.imageUrl || ""
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminAccessToken,
      })

      const { token, role } = response.data

      if (token) {
        localStorage.setItem("token", token)
        updateUser(response.data)

        // Redirect base on role
        if (role === "ADMIN") {
          setOpenAuthForm(false)
          navigate("/admin/dashboard")
        }

        navigate("/")

        setOpenAuthForm(false)
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className="flex items-center h-auto md:h-[520px]">
      <div className="w-[90vw] md:w-[43vw] p-7 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[2px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="John Doe"
            type="text"
          />

          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          <Input
            value={adminAccessToken}
            onChange={({ target }) => setAdminAccessToken(target.value)}
            label="Admin Invite Token"
            placeholder="6 Digit Code"
            type="number"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already an account?{" "}
            <button
              className="text-primary underline cursor-pointer"
              onClick={() => {
                setCurrentPage("login")
              }}
            >
              Login
            </button>
          </p>
        </form>
      </div>
      {/* image */}
      <div className="hidden md:block">
        <img src={LOGIN_IMG} alt="Login pic" className="h-[520px] w-[33vw]" />
      </div>
    </div>
  )
}

export default SignUp
