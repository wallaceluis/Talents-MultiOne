export class Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  maxApplicationsPerJob: number;
  maxJobs: number;
  durationDays: number;
  createdAt: Date;
  updatedAt: Date;
}
