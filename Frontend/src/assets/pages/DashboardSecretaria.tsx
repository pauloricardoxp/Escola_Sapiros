import HeaderBar from "../components/HeaderBar";
import SideBarMenu from "../components/SideBarMenu";
import CardMenuBackground from "../components/CardMenuBackground";
import CardMenu from "../components/CardMenu";
import { HiOutlineAcademicCap, HiOutlineClipboardDocumentList, HiOutlineCog8Tooth } from "react-icons/hi2";
import { FaRegEdit, FaRegUserCircle } from "react-icons/fa";
import { IoMdTv } from "react-icons/io";
import CardMural from "../components/CardMural";
import { useState } from "react";


const DocumentosPage = () => (
  <div className="w-full h-full p-8 bg-white rounded-xl shadow-md flex items-center justify-center">
    <h1 className="text-4xl text-[#3d7e8f]">Página de Documentos Teste</h1>
  </div>
);

function DashboardSecretaria() {
  const [currentView, setCurrentView] = useState("dashboard/secretaria");

  const navigateTo = (viewName: string) => {
    setCurrentView(viewName);
  };

  const renderContent = () => {
    switch (currentView) {
      case "documentos":
        return <DocumentosPage />;
      case "matriculas":
        return <h2 className="text-3xl">Página de Matrículas</h2>;
      case "perfil":
        return <h2 className="text-3xl">Página de Perfil</h2>;
      default:
        return null;
    }
  };

  
  const DocumentosIcon =<HiOutlineClipboardDocumentList size={40} className="text-black-500" />;
  const MatriculasIcon = <FaRegEdit size={40} className="text-black-500" />;
  const PortalIcon = <HiOutlineAcademicCap size={40} className="text-black-500" />;
  const MuralIcon = <IoMdTv size={40} className="text-black-500" />;
  const PerfilIcon = <FaRegUserCircle size={40} className="text-black-500" />;
  const ConfigIcon = <HiOutlineCog8Tooth size={40} className="text-black-500" />;

  return (
    <div className="flex h-screen">
      <SideBarMenu navigateTo={navigateTo} />

      <div className="flex-1 flex flex-col ml-52 bg-[#3d7e8f] overflow-hidden">
        <div className="h-16">
          <HeaderBar />
        </div>

        <div className="flex-1 bg-[#E6EEF8] relative overflow-y-auto p-8 rounded-tl-[30px]">
          {currentView === "dashboard/secretaria" ? (
            <div className="grid grid-cols-5 gap-8 h-full">
              <div className="col-span-3 flex flex-col gap-8">
                <CardMenuBackground>
                  <CardMenu
                    title="Documentos"
                    icon={DocumentosIcon}
                    onClick={() => navigateTo("documentos")}
                  />
                  <CardMenu title="Matrículas Transferências" icon={MatriculasIcon} onClick={() => navigateTo("matriculas")} />
                  <CardMenu title="Portal do Aluno" icon={PortalIcon} />
                  <CardMenu title="Mural" icon={MuralIcon} />
                  <CardMenu title="Perfil" icon={PerfilIcon} />
                  <CardMenu title="Configurações" icon={ConfigIcon} />
                </CardMenuBackground>

                <div className="flex-1">
                  <CardMural type="mini" />
                </div>
              </div>

              <div className="col-span-2">
                <CardMural type="full" />
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardSecretaria;
