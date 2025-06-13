import React, { useState } from "react"
import LOGO from "../../../assets/logo.png"
import Login from "../../../components/auth/Login"
import SignUp from "../../../components/auth/SignUp"

const AdminLogin = () => {
  const [currentPage, setCurrentPage] = useState("login")

  return (
    <>
      <div className="bg-white py-5 border-b border-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="Logo" className="h-[26px]" />{" "}
            <span className="font-semibold">Admin Blog</span>
          </div>
        </div>
      </div>

      <div className="min-h-[calc(100vh-67px)] flex items-center justify-center">
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/60">
          {currentPage === "login" ? (
            <Login setCurrentPage={setCurrentPage} />
          ) : (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </div>
    </>
  )
}

export default AdminLogin
