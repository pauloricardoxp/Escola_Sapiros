import HeaderBar from "../components/HeaderBar";
import SideBarMenu from "../components/SideBarMenu";
import CardMenuBackground from "../components/CardMenuBackground";
import CardMenu from "../components/CardMenu";
import CardMural from "../components/CardMural";
import { useState } from "react";
import ImagenDocumentos from "../imagens/imagendocumento.png";
import ImagenMatricula from "../imagens/imagenmatricula.png";
import ImagenPortal from "../imagens/imagenPortal.png";
import ImagenMural from "../imagens/imagenmural.png";
import ImagenPerfil from "../imagens/imagenperfil.png";
import ImagenConfig from "../imagens/imagenconfig.png";
import CardCalendario from "../components/CardCalendario";
import Matricula from "./Matricula";

const DocumentosPage = () => (
  <div className="w-full h-full p-8 bg-white rounded-xl shadow-md flex items-center justify-center">
    <h1 className="text-4xl text-[#3d7e8f]">Página de Documentos Teste</h1>
  </div>
);

function DashboardCoordenacao() {
  const [currentView, setCurrentView] = useState("dashboard/coordenacao");

  const navigateTo = (viewName: string) => {
    setCurrentView(viewName);
  };

  const renderContent = () => {
    switch (currentView) {
      case "documentos":
        return <DocumentosPage />;
      case "matriculas":
        return <Matricula/>
      case "perfil":
        return <h2 className="text-3xl">Página de Perfil</h2>;
      default:
        return null;
    }
  };

  const DocumentosIcon = (
    <img
      src={ImagenDocumentos}
      alt="Documentos"
      className="w-20 h-20 object-contain"
    />
  );
  const MatriculaIcon = (
    <img
      src={ImagenMatricula}
      alt="Matrículas"
      className="w-20 h-20 object-contain"
    />
  );
  const PortalIcon = (
    <img
      src={ImagenPortal}
      alt="Portal do Aluno"
      className="w-20 h-20 object-contain"
    />
  );
  const MuralIcon = (
    <img src={ImagenMural} alt="Mural" className="w-20 h-20 object-contain" />
  );
  const PerfilIcon = (
    <img src={ImagenPerfil} alt="Perfil" className="w-20 h-20 object-contain" />
  );
  const ConfigIcon = (
    <img
      src={ImagenConfig}
      alt="Configurações"
      className="w-20 h-20 object-contain"
    />
  );

  return (
    <div className="flex h-screen">
      <SideBarMenu navigateTo={navigateTo} />
      <div className="flex-1 flex flex-col ml-52 bg-[#3d7e8f] overflow-hidden">
        <div className="h-16">
          <HeaderBar />
        </div>

        <div className="flex-1 bg-[#E6EEF8] relative overflow-y-auto p-8 rounded-tl-[30px]">
          {currentView === "dashboard/coordenacao" ? (
            <div className="grid grid-cols-5 gap-8 h-full">
              <div className="col-span-3 flex flex-col">
                <CardMenuBackground>
                  <CardMenu
                    title="Documentos"
                    icon={DocumentosIcon}
                    onClick={() => navigateTo("documentos")}
                  />
                  <CardMenu
                    title="Matrículas Transferências"
                    icon={MatriculaIcon}
                    onClick={() => navigateTo("matriculas")}
                  />
                  <CardMenu title="Portal do Aluno" icon={PortalIcon} />
                  <CardMenu title="Mural" icon={MuralIcon} />
                  <CardMenu title="Perfil" icon={PerfilIcon} />
                  <CardMenu title="Configurações" icon={ConfigIcon} />
                </CardMenuBackground>

                <h2 className="font-poppins font-normal text-[24px] leading-9 text-[#3D7E8F] mb-4">
                  Gráfico de desempenho
                </h2>

                <div className="flex-1">
                  <CardMural type="mini" />
                </div>
              </div>
              <div className="col-span-2 flex flex-col space-y-6">
                <CardMural type="full" />
                <CardCalendario />
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

export default DashboardCoordenacao;
