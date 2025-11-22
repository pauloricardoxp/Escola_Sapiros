import { useForm, FormProvider } from "react-hook-form";
import FormTextoMatricula from "./FormTextoMatricula";
import { Input } from "./Input";
import CardTituloMatricula from "./CardTituloMatricula";
import { FormRowMatricula } from "./FormRowMatricula";
import { MaskRG } from "../utils/MaskRg";
import ValidarCpf from "../utils/ValidarCpf";
import { MaskCPF } from "../utils/MaskCPF";
import { ValidarTelefone } from "../utils/ValidarTelefone";
import { MaskTelefone } from "../utils/MaskTelefone";
import ValidarEmail from "../utils/ValidarEmail";
import { BuscarCep } from "../utils/BuscarCep";
import { maskCep } from "../utils/MaskCep";
import EstadoSelect from "./EstadosSelect";
import CidadeSelect from "./CidadeSelect";
import FormSelect from "./FormSelect";
import NaturalidadeSelect from "./NaturalidadeSelect";
import NacionalidadeSelect from "./NacionalidadeSelect";

function FormResponsavel({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: any) => void;
  onBack: (data: any) => void;
  defaultValues?: any;
}) {
  const methods = useForm({
    defaultValues: {
      nome: "",
      data_nascimento: "",
      sexo: "",
      rg: "",
      data_emissao: "",
      orgao_emissor: "",
      cpf: "",
      celular: "",
      email: "",
      logradouro: "",
      numero: "",
      cep: "",
      complemento: "",
      bairro: "",
      estado: "",
      cidade: "",
      nacionalidade: "",
      naturalidade: "",
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: any) => onNext(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <CardTituloMatricula>Dados pessoais do responsável</CardTituloMatricula>

        <FormRowMatricula>
          <FormTextoMatricula title="Nome completo:" className="w-full">
            <Input
              label={""}
              type="text"
              {...register("nome", {
                required: "Nome completo é obrigatório",
                minLength: {
                  value: 3,
                  message: "Digite pelo menos 3 caracteres",
                },
                pattern: {
                  value: /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/,
                  message: "O nome deve conter apenas letras e espaços",
                },
              })}
              error={errors?.nome?.message as string}
            />
          </FormTextoMatricula>

          <FormTextoMatricula title="Data de nascimento:" className="w-1/2">
            <Input
              label={""}
              type="date"
              {...register("data_nascimento", {
                required: "A data de nascimento é obrigatória",
                validate: {
                  dataValida: (value) =>
                    !isNaN(new Date(value).getTime()) || "Data inválida",
                  naoFutura: (value) =>
                    new Date(value) <= new Date() ||
                    "A data não pode ser futura",
                },
              })}
              error={errors?.data_nascimento?.message as string}
            />
          </FormTextoMatricula>
        </FormRowMatricula>

        <FormRowMatricula>
          <FormTextoMatricula title="Sexo:" className="w-1/2">
            <FormSelect
              name="sexo"
              options={[
                { value: "masculino", label: "Masculino" },
                { value: "feminino", label: "Feminino" },
              ]}
            />
          </FormTextoMatricula>

          <FormTextoMatricula title="RG:" className="w-1/2">
            <Input
              label={""}
              type="text"
              {...register("rg", {
                required: "RG é obrigatório",
                minLength: {
                  value: 7,
                  message: "Digite pelo menos 7 caracteres",
                },
                pattern: {
                  value: /^[0-9.-]+$/,
                  message: "Use apenas números, ponto e hífen",
                },
                onChange: (e) => setValue("rg", MaskRG(e.target.value)),
              })}
              error={errors?.rg?.message as string}
            />
          </FormTextoMatricula>
        </FormRowMatricula>

        <FormRowMatricula>
          <FormTextoMatricula title="Data de emissão:" className="w-1/3">
            <Input
              label={""}
              type="date"
              {...register("data_emissao", {
                required: "Obrigatório",
                validate: (value) => {
                  const d = new Date(value);
                  if (d > new Date()) return "Não pode ser futura";
                  return true;
                },
              })}
              error={errors?.data_emissao?.message as string}
            />
          </FormTextoMatricula>

          <FormTextoMatricula title="Órgão emissor:" className="w-1/3">
            <Input
              label={""}
              {...register("orgao_emissor", {
                required: "Obrigatório",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                pattern: {
                  value: /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/,
                  message: "Apenas letras e hífen",
                },
              })}
              error={errors?.orgao_emissor?.message as string}
            />
          </FormTextoMatricula>

          <FormTextoMatricula title="CPF:" className="w-1/3">
            <Input
              label={""}
              {...register("cpf", {
                required: "CPF é obrigatório",
                validate: {
                  cpfValido: (v) => ValidarCpf(v) || "CPF inválido",
                },
                onChange: (e) => (e.target.value = MaskCPF(e.target.value)),
              })}
              error={errors?.cpf?.message as string}
            />
          </FormTextoMatricula>
        </FormRowMatricula>

        <FormRowMatricula>
          <FormTextoMatricula title="Celular:" className="w-1/2">
            <Input
              label={""}
              {...register("celular", {
                required: "Celular é obrigatório",
                validate: (v) => ValidarTelefone(v) || "Telefone inválido",
                onChange: (e) =>
                  (e.target.value = MaskTelefone(e.target.value)),
              })}
              error={errors?.celular?.message as string}
            />
          </FormTextoMatricula>

          <FormTextoMatricula title="E-mail:" className="w-full">
            <Input
              label={""}
              {...register("email", {
                required: "E-mail obrigatório",
                validate: (v) => ValidarEmail(v) || "E-mail inválido",
              })}
              error={errors?.email?.message as string}
            />
          </FormTextoMatricula>
        </FormRowMatricula>

        <CardTituloMatricula>Endereço do responsável</CardTituloMatricula>

        <FormRowMatricula>
          <FormTextoMatricula title="Logradouro:" className="w-1/2">
            <Input
              label={""}
              {...register("logradouro", { required: "Obrigatório" })}
              error={errors?.logradouro?.message as string}
            />
          </FormTextoMatricula>

          <FormTextoMatricula title="Número:" className="w-1/2">
            <Input
              label={""}
              {...register("numero", { required: "Obrigatório" })}
              error={errors?.numero?.message as string}
            />
          </FormTextoMatricula>

          <FormTextoMatricula title="CEP:" className="w-1/2">
            <Input
              label={""}
              type="text"
              {...register("cep", {
                required: "CEP obrigatório",
                onChange: async (e) => {
                  const masked = maskCep(e.target.value);
                  e.target.value = masked;

                  if (masked.replace(/\D/g, "").length === 8) {
                    const data = await BuscarCep(masked);
                    if (data) {
                      setValue("logradouro", data.logradouro || "");
                      setValue("bairro", data.bairro || "");
                      setValue("cidade", data.cidade || "");
                      setValue("estado", data.estado || "");
                      if (data.complemento)
                        setValue("complemento", data.complemento);
                    }
                  }
                },
              })}
              error={errors?.cep?.message as string}
            />
          </FormTextoMatricula>
        </FormRowMatricula>

        <FormRowMatricula>
          <FormTextoMatricula title="Complemento:" className="w-1/2">
            <Input label={""} {...register("complemento")} />
          </FormTextoMatricula>

          <FormTextoMatricula title="Bairro:" className="w-1/2">
            <Input
              label={""}
              {...register("bairro", {
                required: "Obrigatório",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                pattern: {
                  value: /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/,
                  message: "Digite apenas letras",
                },
              })}
              error={errors?.bairro?.message as string}
            />
          </FormTextoMatricula>

          <FormTextoMatricula title="Estado:" className="w-1/2">
            <EstadoSelect control={control} />
          </FormTextoMatricula>
          <FormTextoMatricula title="Cidade:" className="w-1/2">
            <CidadeSelect />
          </FormTextoMatricula>
        </FormRowMatricula>
        <FormRowMatricula>
          <FormTextoMatricula title="Naturalidade" className="w-1/2">
            <NaturalidadeSelect />
          </FormTextoMatricula>
          <FormTextoMatricula title="Nacionalidade" className="w-1/2">
            <NacionalidadeSelect />
          </FormTextoMatricula>
        </FormRowMatricula>

        <div className="w-full flex justify-center gap-6 mt-10">
          <button
            type="button"
            onClick={() => onBack(methods.getValues())}
            className="w-40 h-12 sm:h-14 bg-[#3d7e8f] text-white text-lg sm:text-xl rounded-lg transition duration-200"
          >
            Voltar
          </button>

          <button
            type="submit"
            className="w-40 h-12 sm:h-14 bg-[#3d7e8f] text-white text-lg sm:text-xl rounded-lg transition duration-200"
          >
            Avançar
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default FormResponsavel;
