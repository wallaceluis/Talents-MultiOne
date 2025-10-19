import { Plan } from "src/plans/entities/plan.entity";
import { Job } from "src/jobs/entities/job.entity";

export class Company {
  id: string;
  name: string;
  domain: string;
  createdAt: Date;
  updatedAt: Date;

  plans?: Plan[];
  jobs?: Job[];
}
