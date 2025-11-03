import { useForm } from "react-hook-form";
import { Input } from "./Input";
import { Button } from "./Button";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

function FormRedefinirSenha() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Dados enviados" , data);
    if(data.email == "teste@gmail.com"){
      toast.info(<Link to={"/nova-senha"} className="underline">Abrir página de redefinição</Link>, { autoClose: 5000 });
    }
    else{
      toast.error("Email não encontrado!")
    }
  };

  const hasErros = !!errors.email;
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <Input
        label={"Email"}
        placeholder="seuemail@gmail.com"
        {...register("email", {
          required: "Email é obrigatório",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Digite um email válido",
          },
        })}
        error={errors?.email?.message as string}
      />
      <Button type="submit" disabled={hasErros}>
        <p>Enviar link de redefinição</p>
      </Button>
      <ToastContainer position="bottom-center" autoClose={3000} theme="dark"/>
    </form>
  );
}

export default FormRedefinirSenha;
