import { PartialType } from '@nestjs/mapped-types';
import { CreateCoordenacaoDto } from './create-coordenacao.dto';

export class UpdateCoordenacaoDto extends PartialType(CreateCoordenacaoDto) {}
