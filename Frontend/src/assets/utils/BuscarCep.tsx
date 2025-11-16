export async function BuscarCep(cep: string) {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    const data = await response.json();

    if (data.erro) return null;

    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      complemento: data.complemento,
    };
  } catch (error) {
    return null;
  }
}
