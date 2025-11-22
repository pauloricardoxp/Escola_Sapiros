import { useState } from "react";
import FormAluno from "../components/FormAluno";
import FormResponsavel from "../components/FormResponsavel";

function Matricula() {
  const [etapa, setEtapa] = useState(1);

  const [dadosCompleto, setDadosCompleto] = useState({
    aluno: {},
    responsavel: {},
    documentos: {},
  });

  function handleNext(data: any) {
    if (etapa === 1) {
      setDadosCompleto((prev) => ({ ...prev, aluno: data }));
    }

    if (etapa === 2) {
      setDadosCompleto((prev) => ({ ...prev, responsavel: data }));
    }

    setEtapa((prev) => prev + 1);
  }

  function handleBack(dataFromForm: any) {
    if (etapa === 2) {
      setDadosCompleto((prev) => ({ ...prev, aluno: dataFromForm }));
      setEtapa(1);
    }

    if (etapa === 3) {
      setDadosCompleto((prev) => ({ ...prev, responsavel: dataFromForm }));
      setEtapa(2);
    }
  }

  return (
    <div className="w-full h-auto p-8 bg-white rounded-xl shadow-md flex flex-col gap-4">
      <h1 className="text-4xl text-[#3d7e8f]">Matrícula online</h1>

      <div className="flex flex-row gap-4">
        <button
          className={`w-42 h-9 px-5 py-3 rounded-lg shadow flex justify-center items-center 
          ${
            etapa === 1
              ? "bg-[#3d7e8f] text-white"
              : "bg-white text-[#3d7e8f] border-2 border-[#3d7e8f]"
          }`}
          onClick={() => setEtapa(1)}
        >
          <span className="text-sm font-bold">Dados do aluno</span>
        </button>

        <button
          className={`w-48 h-9 px-5 py-3 rounded-lg shadow flex justify-center items-center 
          ${
            etapa === 2
              ? "bg-[#3d7e8f] text-white"
              : "bg-white text-[#3d7e8f] border-2 border-[#3d7e8f]"
          }`}
          onClick={() => setEtapa(2)}
        >
          <span className="text-sm font-bold">Dados do responsável</span>
        </button>

        <button
          className={`w-36 h-9 px-5 py-3 rounded-lg shadow flex justify-center items-center 
          ${
            etapa === 3
              ? "bg-[#3d7e8f] text-white"
              : "bg-white text-[#3d7e8f] border-2 border-[#3d7e8f]"
          }`}
          onClick={() => setEtapa(3)}
        >
          <span className="text-sm font-bold">Documentos</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {etapa === 1 && (
          <FormAluno defaultValues={dadosCompleto.aluno} onNext={handleNext} />
        )}
        {etapa === 2 && (
          <FormResponsavel
            defaultValues={dadosCompleto.responsavel}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {etapa === 3 && <div>Formulário de documentos aqui</div>}
      </div>
    </div>
  );
}

export default Matricula;
