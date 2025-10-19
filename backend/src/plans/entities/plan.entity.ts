import { PlanType } from "../dto/create-plan.dto";
import { Company } from "src/companies/entities/company.entity";
export class Plan {
  id: string;
  name: string;
  type: PlanType;
  maxUsers: number;
  maxCandidates: number;
  maxVacancies: number;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  companies?: Company[];
}
