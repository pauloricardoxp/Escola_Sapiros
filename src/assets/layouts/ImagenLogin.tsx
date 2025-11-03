import LogoIlustracao from "../imagens/logo.ilustracao.login.png";
export function ImagenLogin() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center p-6 lg:w-[48%]">
      <img
        className="w-full max-w-sm mb-4 h-auto"
        src={LogoIlustracao}
        alt="Ilustração de Login"
      />
      <div className="w-40 h-1 bg-green-500 rounded-full"></div>
    </div>
  );
}
