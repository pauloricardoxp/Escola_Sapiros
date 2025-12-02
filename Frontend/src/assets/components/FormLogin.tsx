import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./Input";
import { FaLock, FaUser } from "react-icons/fa";
import ValidarCpf from "../utils/ValidarCpf";
import ValidarEmail from "../utils/ValidarEmail";
import { Checkbox } from "./Checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { ToastContainer, toast } from "react-toastify";
import { MaskCPF } from "../utils/MaskCPF";

function FormLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identificador: data.identificador,
          senha: data.senha,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.message === "Credenciais inválidas") {
          toast.error("Usuário não encontrado");
        } else {
          toast.error(result.message || "Usuário não encontrado");
        }
        setLoading(false);
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.usuario.role);

      const role = result.usuario.role?.toLowerCase().trim();

      switch (role) {
        case "coordenacao":
          navigate("dashboard/coordenacao");
          break;
        case "aluno":
          navigate("");
          break;
        case "professor":
          navigate("");
          break;
        default:
          toast.error("Role desconhecido");
      }
    } catch (error) {
      console.error("Erro ao conectar:", error);
      toast.error(
        "Não foi possível conectar ao servidor. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const validarIdentificador = (valor: string) => {
    if (ValidarCpf(valor) || ValidarEmail(valor)) {
      return true;
    }
    return "Digite um CPF ou e-mail válido";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="CPF/E-mail"
        placeholder="Digite seu CPF ou e-mail"
        icon={<FaUser />}
        {...register("identificador", {
          required: "CPF ou e-mail é obrigatório",
          validate: {
            validarIdentificador,
          },
          onChange: (e) => {
            let value = e.target.value;
            if (/[a-zA-Z@]/.test(value)) return;

            const masked = MaskCPF(value);

            setValue("identificador", masked);
          },
        })}
        error={errors?.identificador?.message as string}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        icon={<FaLock />}
        {...register("senha", {
          required: "Senha é obrigatória",
          minLength: { value: 8, message: "Mínimo 8 caracteres" },
        })}
        error={errors?.senha?.message as string}
      />

      <div className="flex justify-between items-center pt-2">
        <Checkbox
          label="Lembrar"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />

        <Link
          to={"/redefinir-senha"}
          className="text-[#1D5D7F] text-base font-normal hover:underline"
        >
          Esqueceu a senha?
        </Link>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
      <ToastContainer position="bottom-center" autoClose={3000} theme="dark" />
    </form>
  );
}
export default FormLogin;
