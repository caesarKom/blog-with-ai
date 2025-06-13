import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import BlogLandingPage from "./pages/blog/components/BlogLandingPage"
import BlogPostView from "./pages/blog/components/BlogPostView"
import PostByTags from "./pages/blog/components/PostByTags"
import SearchPosts from "./pages/blog/components/SearchPosts"
import AdminLogin from "./pages/Admin/components/AdminLogin"
import PrivateRoute from "./routes/PrivateRoute"
import Dashboard from "./pages/Admin/components/Dashboard"
import BlogPosts from "./pages/Admin/components/BlogPosts"
import BlogPostEditor from "./pages/Admin/components/BlogPostEditor"
import Comments from "./pages/Admin/components/Comments"
import UserProvider from "./context/userContext"

function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<BlogLandingPage />} />
            <Route path="/:slug" element={<BlogPostView />} />
            <Route path="/tag/:tagName" element={<PostByTags />} />
            <Route path="/search" element={<SearchPosts />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/posts" element={<BlogPosts />} />
              <Route path="/admin/create" element={<BlogPostEditor />} />
              <Route
                path="/admin/edit/:postSlug"
                element={<BlogPostEditor isEdit={true} />}
              />
              <Route path="/admin/comments" element={<Comments />} />
            </Route>

            <Route path="/admin-login" element={<AdminLogin />} />
          </Routes>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  )
}

export default App
