import { useForm } from "react-hook-form";
import { Input } from "./Input";
import { FaLock } from "react-icons/fa";
import { Button } from "./Button";
import { ToastContainer, toast } from "react-toastify/unstyled";

function FormNovaSenha() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
//Simulado o alert
  const onSubmit = (data: any) => {
    console.log("Senha redefinida com sucesso", data);
    toast.success("Senha Alterada!");
  };

  const watchSenha = watch("senha");

  const hasErros = !!errors.senha;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <Input
        label="Nova senha"
        type="password"
        placeholder="Nova senha"
        icon={<FaLock />}
        {...register("senha", {
          required: "Senha é obrigatória",
          minLength: { value: 8, message: "Mínimo 8 caracteres" },
        })}
        error={errors?.senha?.message as string}
      />

      <Input
        label="Confirmar senha"
        type="password"
        placeholder="Confirmar senha"
        icon={<FaLock />}
        {...register("confirmarSenha", {
          required: "Confirmação obrigatória",
          validate: (value) =>
            value === watchSenha || "As senhas não coincidem",
        })}
        error={errors?.confirmarSenha?.message as string}
      />

      <Button type="submit" disabled={hasErros}>
        <p>Redefinir senha</p>
      </Button>

      <ToastContainer position="top-center" autoClose={3000} theme="dark"/>
    </form>
  );
}

export default FormNovaSenha;
