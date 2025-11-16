import { useEffect, useState } from "react";
import { useFormContext,  } from "react-hook-form";
import SelectField from "./ReactSelect";

export default function NaturalidadeSelect() {
  const { control, watch } = useFormContext();
  const estadoSelecionado = watch("estado");
  const [cidades, setCidades] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (!estadoSelecionado) return setCidades([]);

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
      .then((res) => res.json())
      .then((data) => setCidades(data.map((c: any) => ({ value: c.nome, label: c.nome }))));
  }, [estadoSelecionado]);

  return <SelectField name="naturalidade" control={control} options={cidades} placeholder="Selecione a cidade" isDisabled={!estadoSelecionado} />;
}
