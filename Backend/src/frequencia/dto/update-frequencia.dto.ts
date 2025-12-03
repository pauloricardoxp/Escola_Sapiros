import { PartialType } from '@nestjs/mapped-types';
import { CreateFrequenciaDto } from './create-frequencia.dto';

export class UpdateFrequenciaDto extends PartialType(CreateFrequenciaDto) {}
