export interface ExperimentDto {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  metric: string;
}

export interface ExperimentWithIdDto extends ExperimentDto {
  id: string;
}

export interface VariantDto {
  name: string;
  experimentName: string;
  probability: number;
}

export interface UserAssignmentDto {
  userId: string;
  experimentName: string;
  variantName: string;
}

export interface UserAssignmentWithResultDto extends UserAssignmentDto {
  result: number;
}

export interface VariantWithFullDataDto extends VariantDto {
  results: number;
}
