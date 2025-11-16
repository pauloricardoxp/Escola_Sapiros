import { useEffect, useState } from "react";
import ReactSelect from "../components/ReactSelect";

export default function EstadoSelect({ control }: { control: any }) {
  const [ufs, setUfs] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((res) => res.json())
      .then((data) => {
        const options = data.map((uf: any) => ({ value: uf.sigla, label: uf.nome }));
        setUfs(options);
      });
  }, []);

  return <ReactSelect name="estado" control={control} options={ufs} placeholder="Selecione o estado" />;
}