import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Ideas from './pages/Ideas'
import Recommend from './pages/Recommend'
import IdeaDetail from './pages/IdeaDetail'
import IdeaCreate from './pages/IdeaCreate'
import UserProfile from './pages/UserProfile'
import UserEdit from './pages/UserEdit'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import FAQ from './pages/FAQ'
import Feedback from './pages/Feedback'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/idea/create" element={<IdeaCreate />} />
        <Route path="/ideas/:ideaId" element={<IdeaDetail />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/user/edit" element={<UserEdit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Footer 页面 */}
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
