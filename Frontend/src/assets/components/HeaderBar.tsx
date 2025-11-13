import { FaSearch } from "react-icons/fa";
import { LuBellRing } from "react-icons/lu";

function HeaderBar() {
  return (
    <header className="flex items-center justify-end p-4 bg-[#3d7e8f]">
      <label
        className="
          flex items-center gap-3 p-2 bg-[#e6eef880] rounded-2xl 
          border-2 border-solid border-[#e6eef8] mr-4 "
      >
        <FaSearch className="w-5 h-5 text-[#e6eef8]" />
        <input
          type="search"
          placeholder="Pesquisar"
          className="
            w-full bg-transparent outline-none text-[#e6eef8] 
            text-sm placeholder:text-[#e6eef8] placeholder:opacity-50"
        />
      </label>

      <button
        className="p-2 rounded-full hover:bg-[#ffffff33] transition-colors"
        aria-label="Notificações"
      >
        <LuBellRing className="w-6 h-6 text-[#e6eef8]" />
      </button>
    </header>
  );
}

export default HeaderBar;
