const ValidarCpf = (cpf: string): true | string => {
  if (!cpf) return "CPF é obrigatório";

  // Remove tudo que não for número
  const cpfLimpo = cpf.replace(/[^\d]+/g, '');

  // Verifica se tem 11 dígitos e se não é sequência repetida
  if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
    return "CPF inválido";
  }

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) {
    return "CPF inválido";
  }

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) {
    return "CPF inválido";
  }

  return true;
};
export default ValidarCpf;
