import { IsString } from 'class-validator';

export class objCreateDto {

    @IsString()
    key:string;

    @IsString()
    value:string;
}