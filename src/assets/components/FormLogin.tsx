import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./Input";
import { FaLock, FaUser } from "react-icons/fa";
import ValidarCpf from "../utils/ValidarCpf";
import { Checkbox } from "./Checkbox";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { ToastContainer, toast } from "react-toastify";

function FormLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    //Teste de mensagem ja q ta sem back end//
    
    if (data.cpf === "15226564058" && data.senha === "teste123") {
      console.log("Dados Enviados", data);
      toast.success("Usuário encontrado!");
    } else {
      toast.error("Usuário não encontrado");
    }

    try {
      console.log("Dados enviados: ", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="CPF/Matrícula"
        placeholder="Digite seu CPF"
        icon={<FaUser />}
        {...register("cpf", {
          required: "CPF é obrigatório",
          validate: (value) => ValidarCpf(value) === true || "CPF inválido",
        })}
        error={errors?.cpf?.message as string}
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
          className="text-green-600 text-base font-normal hover:underline"
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
