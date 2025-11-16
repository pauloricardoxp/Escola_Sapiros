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
import NaturalidadeSelect from "./NaturalidadeSelect";
import EstadoSelect from "./EstadosSelect";
import CidadeSelect from "./CidadeSelect";
import NacionalidadeSelect from "./NacionalidadeSelect";
import FormSelect from "./FormSelect";

function FormAluno({ onNext, defaultValues }: { onNext: (data: any) => void; defaultValues?: any; }) {
  const methods = useForm({
    defaultValues: {
      nome: "", data_nascimento: "", sexo: "", rg: "", data_emissao: "", orgao_emissor: "", cpf: "", celular: "", email: "", logradouro: "", numero: "", cep: "", complemento: "", bairro: "", estado: "", cidade: "", nacionalidade: "", naturalidade: "", serie: "", turno: "", escola_origem: "", necessidades_especiais: "", tem_alergia: "", quais_alergias: "", saida_sozinho: "", uso_imagem: "", ...defaultValues,
    },
  });

  const { register, handleSubmit, setValue, formState: { errors }, control } = methods;

  const onSubmit = (data: any) => onNext(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <CardTituloMatricula>Dados pessoais do(a) aluno(a)</CardTituloMatricula>
        <div className="flex flex-col gap-4">
          <FormRowMatricula>
            <FormTextoMatricula title="Nome completo:" className="w-full">
              <Input
                placeholder="" label="" type="text"
                {...register("nome", {
                  required: "Nome completo é obrigatório",
                  minLength: { value: 3, message: "O nome deve ter pelo menos 3 caracteres" },
                  pattern: { value: /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/, message: "O nome não pode conter números ou caracteres inválidos" },
                })}
                error={errors?.nome?.message as string}
              />
            </FormTextoMatricula>
            <FormTextoMatricula title="Data de nascimento:" className="w-1/2">
              <Input
                label={""} type="date"
                {...register("data_nascimento", {
                  required: "A data de nascimento é obrigatória",
                  validate: {
                    dataValida: (value) => isNaN(new Date(value).getTime()) ? "Data inválida" : true,
                    naoFutura: (value) => new Date(value) > new Date() ? "A data de nascimento não pode ser no futuro" : true,
                    idadePermitida: (value) => {
                      const hoje = new Date();
                      const data = new Date(value);
                      let idade = hoje.getFullYear() - data.getFullYear();
                      const mes = hoje.getMonth() - data.getMonth();
                      if (mes < 0 || (mes === 0 && hoje.getDate() < data.getDate())) idade--;
                      if (idade < 14) return "O aluno deve ter pelo menos 14 anos";
                      if (idade > 19) return "O aluno deve ter no máximo 20 anos";
                      return true;
                    },
                  },
                })}
                error={errors?.data_nascimento?.message as string}
              />
            </FormTextoMatricula>
          </FormRowMatricula>

          <FormRowMatricula>
            <FormTextoMatricula title="Sexo:" className="w-1/2">
              <FormSelect name="sexo" options={[{ value: "masculino", label: "Masculino" }, { value: "feminino", label: "Feminino" }, { value: "outros", label: "Outros" }]} />
            </FormTextoMatricula>
            <FormTextoMatricula title="RG:" className="w-1/2">
              <Input
                label={""} type="text"
                {...register("rg", {
                  required: "O RG é obrigatório",
                  minLength: { value: 7, message: "O RG deve ter pelo menos 8 caracteres" },
                  // Ajuste: Mensagem agora condiz com o valor máximo de caracteres
                  maxLength: { value: 14, message: "O RG deve ter no máximo 14 caracteres com pontuação" }, 
                  pattern: { value: /^[0-9.\-]+$/, message: "O RG deve conter apenas números, pontos e hífen" },
                  onChange: (e) => setValue("rg", MaskRG(e.target.value)),
                })}
                error={errors?.rg?.message as string}
              />
            </FormTextoMatricula>
          </FormRowMatricula>

          <FormRowMatricula>
            {/* Ajuste de Layout: Para caber 3 campos por linha, alteramos para w-1/3 (33.33%) */}
            <FormTextoMatricula title="Data de emissão:" className="w-1/3">
              <Input
                label={""} type="date"
                {...register("data_emissao", {
                  required: "A data de emissão é obrigatória",
                  validate: (value) => {
                    const data = new Date(value);
                    if (data > new Date()) return "A data de emissão não pode ser no futuro";
                    if (data < new Date("2000-01-01")) return "A data de emissão é inválida";
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
                  required: "Órgão emissor é obrigatório",
                  minLength: { value: 2, message: "Mínimo de 2 caracteres" },
                  maxLength: { value: 10, message: "Máximo de 10 caracteres" },
                  pattern: { value: /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/, message: "Use apenas letras e hífen" },
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
                    cpfValido: (value) => ValidarCpf(value) || "CPF inválido",
                    tamanhoValido: (value) => value.replace(/\D/g, "").length === 11 || "CPF deve ter 11 dígitos",
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
                  required: "O celular é obrigatório",
                  validate: (value) => ValidarTelefone(value),
                  onChange: (e) => (e.target.value = MaskTelefone(e.target.value)),
                })}
                error={errors?.celular?.message as string}
              />
            </FormTextoMatricula>

            <FormTextoMatricula title="E-mail:" className="w-full">
              <Input
                label={""}
                {...register("email", {
                  required: "E-mail é obrigatório",
                  validate: (value) => ValidarEmail(value) || "E-mail inválido",
                })}
                error={errors?.email?.message as string}
              />
            </FormTextoMatricula>
          </FormRowMatricula>
        </div>

        <CardTituloMatricula>Endereço do(a) aluno(a)</CardTituloMatricula>

        <FormRowMatricula>
          {/* Ajuste: Adicionado 'required' para Logradouro e Número */}
          <FormTextoMatricula title="Logradouro:" className="w-1/2">
            <Input label={""} {...register("logradouro", { required: "Logradouro é obrigatório" })} error={errors?.logradouro?.message as string} />
          </FormTextoMatricula>
          <FormTextoMatricula title="Número:" className="w-1/2">
            <Input label={""} {...register("numero", { required: "Número é obrigatório" })} error={errors?.numero?.message as string} />
          </FormTextoMatricula>
          <FormTextoMatricula title="CEP:" className="w-1/2">
            <Input
              label={""}
              type="text"
              {...register("cep", {
                required: "CEP é obrigatório",
                onChange: async (e) => {
                  const value = maskCep(e.target.value);
                  e.target.value = value;
                  if (value.replace(/\D/g, "").length === 8) {
                    const data = await BuscarCep(value);
                    if (data) {
                      setValue("logradouro", data.logradouro || "");
                      setValue("bairro", data.bairro || "");
                      setValue("cidade", data.cidade || "");
                      setValue("estado", data.estado || "");
                      if (data.complemento) setValue("complemento", data.complemento);
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
                required: "O bairro é obrigatório",
                minLength: { value: 3, message: "Mínimo de 3 caracteres" },
                pattern: {
                  value: /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/,
                  message: "Use apenas letras",
                },
              })}
              error={errors?.bairro?.message as string}
            />
          </FormTextoMatricula>

          <FormTextoMatricula title="Estado:" className="w-1/2">
            <EstadoSelect control={control} />
          </FormTextoMatricula>
        </FormRowMatricula>
        <FormRowMatricula>
          <FormTextoMatricula title="Cidade:" className="w-1/2">
            <CidadeSelect />
          </FormTextoMatricula>
          <FormTextoMatricula title="Nacionalidade:" className="w-1/2">
            <NacionalidadeSelect />
          </FormTextoMatricula>
          <FormTextoMatricula title="Naturalidade:" className="w-1/2">
            <NaturalidadeSelect />
          </FormTextoMatricula>
        </FormRowMatricula>
        <CardTituloMatricula>Informações acadêmicas</CardTituloMatricula>
        <FormRowMatricula>
          <FormTextoMatricula title="Série/Ano:" className="w-1/2">
            <FormSelect
              name="serie"
              options={[
                { value: "1ano", label: "1 ano do ensino médio" },
                { value: "2ano", label: "2 ano do ensino médio" },
                { value: "3ano", label: "3 ano do ensino médio" },
              ]}
            />
          </FormTextoMatricula>
          <FormTextoMatricula title="Turno:" className="w-1/2">
            <FormSelect
              name="turno"
              options={[
                { value: "manha", label: "Manhã" },
                { value: "tarde", label: "Tarde" },
              ]}
            />
          </FormTextoMatricula>
          <FormTextoMatricula title="Escola de Origem:" className="w-1/2">
            <Input label={""} {...register("escola_origem")} />
          </FormTextoMatricula>
        </FormRowMatricula>

        <CardTituloMatricula>Informações complementares</CardTituloMatricula>
        <FormRowMatricula>
          <FormTextoMatricula
            title="Possui necessidades especiais?"
            className="w-1/2"
          >
            <Input
              label={""}
              {...register("necessidades_especiais", {
                maxLength: { value: 100, message: "Máximo de 100 caracteres" },
                pattern: {
                  value: /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ,.-]*$/,
                  message: "Use apenas letras, números e pontuação",
                },
              })}
            />
          </FormTextoMatricula>
          <FormTextoMatricula title="Possui alergias?" className="w-1/2">
            <FormSelect
              name="tem_alergia"
              options={[
                { value: "sim", label: "Sim" },
                { value: "não", label: "Não" },
              ]}
            />
          </FormTextoMatricula>
          <FormTextoMatricula title="Se sim, quais?" className="w-1/2">
            <Input
              label={""}
              {...register("quais_alergias", {
                maxLength: { value: 150, message: "Máximo de 150 caracteres" },
                pattern: {
                  value: /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ,.-]*$/,
                  message: "Use apenas letras, números e pontuação",
                },
              })}
            />
          </FormTextoMatricula>
        </FormRowMatricula>

        <FormRowMatricula>
          <FormTextoMatricula
            title="Autorização para saída sozinho:"
            className="w-1/2"
          >
            <FormSelect
              name="saida_sozinho"
              options={[
                { value: "sim", label: "Sim" },
                { value: "não", label: "Não" },
              ]}
            />
          </FormTextoMatricula>
          <FormTextoMatricula
            title="Autorização para uso de imagem:"
            className="w-1/2"
          >
            <FormSelect
              name="uso_imagem"
              options={[
                { value: "sim", label: "Sim" },
                { value: "não", label: "Não" },
              ]}
            />
          </FormTextoMatricula>
        </FormRowMatricula>

        <div className="w-full flex justify-center mt-10">
          <div className="w-40">
            <button
              type="submit"
              className="w-full bg-[#3d7e8f] h-12 sm:h-14 text-white text-lg sm:text-xl font-normal rounded-lg transition duration-200 focus:outline-none focus:ring-4"
            >
              Avançar
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default FormAluno;