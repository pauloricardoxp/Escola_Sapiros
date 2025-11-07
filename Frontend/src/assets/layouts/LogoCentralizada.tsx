import LogoSapiros from "../imagens/logo.sapiros.png";

function LogoCentralizada() {
  return (
    <div className="flex justify-center mb-8">
      <img
        className="w-28 md:w-32 lg:w-40 h-auto"
        src={LogoSapiros}
        alt="Logo Sapiros"
      />
    </div>
  );
}
export default LogoCentralizada;
