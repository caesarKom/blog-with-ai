import React, { useContext } from "react"
import { UserContext } from "../../context/userContext"
import Navbar from "./Navbar"
import SideMenu from "./SideMenu"

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext)

  return (
    <div className="h-screen flex flex-col">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex flex-1 min-h-0">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} setOpenSideMenu={() => {}} />
          </div>

          <div className="grow mx-5 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout
