import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/login';
import Dashboard from "./pages/dashboard";
import Messages from "./pages/messages";
import Users from "./pages/users";
import AddUser from "./pages/addUser";
import WorkSpace from "./pages/workSpace";
import { ProtectedLayout } from "./components/protectPage";
import PrivateMessages from "./pages/privateMessage";
import { ChatProvider } from "./contexts/contextChat";
import EditUser from "./pages/editUser";
import EditProfile from "./pages/editProfile";
import GroupMessages from "./pages/groupMessage";
import ForgotPassword from "./pages/forgotPassword";

function App() {

  return (
    <BrowserRouter>
     <ChatProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/EsqueceuSenha" element={<ForgotPassword />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/Dashboard" element={<Dashboard/>} />
          <Route path="/Mensagens" element={<Messages/>} />
          <Route path="/Usuarios" element={<Users/>} />
          <Route path="/CriarUsuario" element={<AddUser/>} />
          <Route path="/EditarUsuarios/:id" element={<EditUser/>} />
          <Route path="/EditarPerfil/" element={<EditProfile/>} />
          <Route path="/AreaDeTrabalho/:id" element={<WorkSpace/>} />
          <Route path="/MensagemAoUsuario/:id" element={<PrivateMessages/>} />
          <Route path="/MensagemAoGrupo/:id" element={<GroupMessages/>} />
        </Route>
      </Routes>
      </ChatProvider>
    </BrowserRouter>
  )
}

export default App
