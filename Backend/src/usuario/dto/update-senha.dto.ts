import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UpdateSenhaDto {
  @IsNotEmpty()
  @IsString()
  senhaAtual: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  @Matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]).{8,}$/,
    {
      message:
        'A nova senha deve conter ao menos 1 letra maiúscula, 1 número e 1 caractere especial.',
    },
  )
  novaSenha: string;
}
