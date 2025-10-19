import { VacancyType, VacancyStatus, WorkModel } from "../dto/create-job.dto";

export class Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  salary?: number | null;
  location?: string | null;
  type: VacancyType;
  status: VacancyStatus;
  workModel: WorkModel;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date | null;
}
