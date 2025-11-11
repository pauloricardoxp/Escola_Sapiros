import React from "react";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaRegEdit, FaRegUserCircle } from "react-icons/fa";
import {
  HiOutlineCalendarDateRange,
  HiOutlineAcademicCap,
  HiOutlineCog8Tooth,
  HiOutlineArrowLeftStartOnRectangle,
} from "react-icons/hi2";
import { IoMdTv } from "react-icons/io";
import LogoDasboard from "../imagens/logodasboard.png";

interface SideBarMenuProps {
  navigateTo: (viewName: string) => void;
}
function SideBarMenu({navigateTo}: SideBarMenuProps) {
  const menuItems = [
    { icon: HiOutlineClipboardDocumentList, label: "Documentos",viewName: "documentos" },
    { icon: FaRegEdit, label: "Matrícula\nTransferências",viewName: "matriculas" },
    { icon: HiOutlineCalendarDateRange, label: "Calendário",viewName: "calendario" },
    { icon: HiOutlineAcademicCap, label: "Portal do Aluno",viewName: "portaldoAluno" },
    { icon: IoMdTv, label: "Mural",viewName: "mural" },
  ];

  const bottomMenuItems = [
    { icon: FaRegUserCircle, label: "Perfil",viewName: "perfil" },
    { icon: HiOutlineCog8Tooth, label: "Configurações", viewName: "configuracoes" },
    { icon: HiOutlineArrowLeftStartOnRectangle, label: "Logout",viewName: "logout" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-52 bg-[#3d7e8f] flex flex-col p-4">
      
      <div className="flex justify-center items-center mb-3 mt-2">
        <img
          src={LogoDasboard}
          alt="Logo Sapiros"
          onClick={() => navigateTo("dashboard/secretaria")}
          className="w-28 md:w-36 lg:w-40 h-auto object-contain"
        />
      </div>

      
      <nav className="flex flex-col gap-3 mt-20">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const labelLines = item.label.split("\n");
          return (
            <button
              key={index}
              className="flex items-center gap-3 text-[#e6eef8] hover:opacity-80 transition-opacity"
              onClick={() => {navigateTo(item.viewName)}}
            >
              <IconComponent className="w-6 h-6 md:w-7 md:h-7" />
              <span className="text-[13px] md:text-[14px] leading-tight text-left">
                {labelLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < labelLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </button>
          );
        })}
      </nav>

      
      <nav className="flex flex-col gap-4 mt-auto mb-2">
        {bottomMenuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              className="flex items-center gap-3 text-[#e6eef8] hover:opacity-80 transition-opacity"
              onClick={() => {navigateTo(item.viewName)}}
            >
              <IconComponent className="w-6 h-6 md:w-7 md:h-7" />
              <span className="text-[13px] md:text-[14px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default SideBarMenu;
