import React, { useContext, useState } from "react"
import Logo from "../../../assets/logo.png"
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi"
import { LuSearch } from "react-icons/lu"
import { Link } from "react-router-dom"
import { BLOG_NAVBAR_DATA } from "../../../utils/data"
import SideMenu from "../SideMenu"
import { UserContext } from "../../../context/userContext"
import ProfileInfoCard from "../../cards/ProfileInfoCard"
import Login from "../../auth/Login"
import SignUp from "../../auth/SignUp"
import Modal from "../../Modal"
import SearchBarPopup from "../../../pages/blog/components/SearchBarPopup"

const BlogNavbar = ({ activeMenu }) => {
  const { user, setOpenAuthForm } = useContext(UserContext)
  const [openSideMenu, setOpenSideMenu] = useState(false)
  const [openSearchBar, setOpenSearchBar] = useState(false)

  return (
    <>
      <div className="bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex gap-2">
            <button
              className="block lg:hidden text-black mr-3"
              onClick={() => {
                setOpenSideMenu(!openSideMenu)
              }}
            >
              {openSideMenu ? (
                <HiOutlineX className="text-2xl" />
              ) : (
                <HiOutlineMenu className="text-2xl" />
              )}
            </button>
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Logo" className="h-[24px] md:h-[26px]" />{" "}
              <span className="ml-2 font-semibold">SuperBlog</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            {BLOG_NAVBAR_DATA.map((item, index) => {
              if (item?.onlySideMenu) return

              return (
                <Link key={item.id} to={item.path}>
                  <li className="text-[15px] text-black font-medium list-none relative group cursor-pointer">
                    {item.label}
                    <span
                      className={`absolute inset-x-0 bottom-0 h-[2px] bg-sky-500 transition-all duration-300 origin-left ${
                        index == 0 ? "skale-x-100" : "scale-x-0"
                      } group-hover:scale-x-100`}
                    ></span>
                  </li>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-6">
            <button
              className="hover:text-sky-500 cursor-pointer"
              onClick={() => setOpenSearchBar(true)}
            >
              <LuSearch className="text-[22px]" />
            </button>

            {!user ? (
              <button
                className="flex items-center justify-center gap-3 bg-linear-to-r from-sky-500 to-cyan-400 text-xs md:text-sm font-semibold text-white px-5 md:px-7 py-2 rounded-full cursor-pointer hover:bg-black hover:text-white transition-colors hover:shadow-2xl hover:shadow-cyan-200"
                onClick={() => setOpenAuthForm(true)}
              >
                Login/SignUp
              </button>
            ) : (
              <div className="hidden md:block">
                <ProfileInfoCard />
              </div>
            )}
          </div>

          {openSideMenu && (
            <div className="fixed top-[61px] -ml-4 bg-white">
              <SideMenu
                activeMenu={activeMenu}
                isBlogMenu
                setOpenSideMenu={setOpenSideMenu}
              />
            </div>
          )}
        </div>
      </div>

      <AuthModel />
      <SearchBarPopup isOpen={openSearchBar} setIsOpen={setOpenSearchBar} />
    </>
  )
}

export default BlogNavbar

const AuthModel = () => {
  const { openAuthForm, setOpenAuthForm } = useContext(UserContext)
  const [currentPage, setCurrentPage] = useState("login")

  return (
    <>
      <Modal
        isOpen={openAuthForm}
        onClose={() => {
          setOpenAuthForm(false)
          setCurrentPage("login")
        }}
        hideHeader
      >
        <div className="">
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  )
}
