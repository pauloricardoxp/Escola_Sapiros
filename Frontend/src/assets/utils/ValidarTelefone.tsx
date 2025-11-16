export function ValidarTelefone(value: string) {
  const clean = value.replace(/\D/g, "");

  if (clean.length < 10 || clean.length > 11) {
    return "Número de telefone inválido";
  }

  return true;
}
