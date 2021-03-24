import { IsString } from 'class-validator';

export class objUpdateDto {

    @IsString()
    value:string;
}