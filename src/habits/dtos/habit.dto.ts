import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

// Calendar days travel as plain 'YYYY-MM-DD' strings end to end (DATEONLY
// columns), so no Date parsing/timezone shifting ever touches them.
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_ONLY_MESSAGE = 'must be a calendar date in YYYY-MM-DD format';

export class CreateHabitDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Matches(DATE_ONLY_REGEX, { message: `startDate ${DATE_ONLY_MESSAGE}` })
  startDate!: string;

  @Matches(DATE_ONLY_REGEX, { message: `endDate ${DATE_ONLY_MESSAGE}` })
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class UpsertHabitEntryDto {
  @Matches(DATE_ONLY_REGEX, { message: `date ${DATE_ONLY_MESSAGE}` })
  date!: string;

  @IsBoolean()
  done!: boolean;

  // Left undefined the existing note is preserved; sent as null it is cleared.
  @IsString()
  @IsOptional()
  note?: string | null;
}

export class FindEntriesQueryDto {
  @Matches(DATE_ONLY_REGEX, { message: `dateFrom ${DATE_ONLY_MESSAGE}` })
  @IsOptional()
  dateFrom?: string;

  @Matches(DATE_ONLY_REGEX, { message: `dateTo ${DATE_ONLY_MESSAGE}` })
  @IsOptional()
  dateTo?: string;
}
