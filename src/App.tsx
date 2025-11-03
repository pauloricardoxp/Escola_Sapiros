import Login from "./assets/pages/Login"
import NovaSenha from "./assets/pages/NovaSenha";
import RedefinirSenha from "./assets/pages/RedefinirSenha"
import { Routes, Route } from "react-router-dom";
function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/redefinir-senha" element= {<RedefinirSenha/>}/>
      <Route path="/nova-senha" element={<NovaSenha/>}/>
    </Routes>
    </>
  )
}

export default App
