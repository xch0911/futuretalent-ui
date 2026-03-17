import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Ideas from './pages/Ideas'
import IdeaDetail from './pages/IdeaDetail'
import IdeaCreate from './pages/IdeaCreate'
import UserProfile from './pages/UserProfile'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/idea/create" element={<IdeaCreate />} />
        <Route path="/idea/:ideaId" element={<IdeaDetail />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
