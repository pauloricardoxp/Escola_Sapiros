import FormLogin from "../components/FormLogin";
import { Card } from "../components/Card";
import { GradienteLayout } from "../layouts/GradienteLayout";
import { ImagenLogin } from "../layouts/ImagenLogin";
import DivisorVertical from "../layouts/DivisorVertical";
import LogoCentralizada from "../layouts/LogoCentralizada";

function Login() {
  return (
    <GradienteLayout>
      <Card>
        <ImagenLogin />
        <DivisorVertical />
        <div className="flex flex-col justify-center p-0 lg:p-6 lg:w-[48%]">
          <LogoCentralizada />
          <h2 className="text-3xl sm:text-4xl font-semibold text-blue-900 mb-2">
            Login
          </h2>
          <div className="w-12 h-1 bg-[#063149] rounded-full mb-8 sm:mb-10"></div>
          <FormLogin />
        </div>
      </Card>
    </GradienteLayout>
  );
}

export default Login;
