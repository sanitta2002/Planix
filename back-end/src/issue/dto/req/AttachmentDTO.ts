import { Transform } from 'class-transformer';
import { IsOptional, IsArray, IsUrl } from 'class-validator';

export class AddAttachmentDTO {
  @IsOptional()
  @Transform(({ value }) => {
    console.log(' AddAttachmentDTO value:', value);
    if (value == null) return undefined;
    if (Array.isArray(value)) {
      return value as string[];
    }
    if (typeof value === 'string') {
      return [value];
    }

    return [];
  })
  @IsArray()
  @IsUrl({}, { each: true })
  link?: string[];
}
