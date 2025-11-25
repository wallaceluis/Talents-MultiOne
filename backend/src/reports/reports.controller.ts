import { Body, Controller, Post, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { ReportsService, ExportFormat } from "./reports.service";

class ExportCandidatesDto {
  companyId?: string;
  name?: string;
  email?: string;
  status?: string;
}

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post("candidates/export")
  async exportCandidates(
    @Body() body: ExportCandidatesDto,
    @Query("format") format: ExportFormat = "csv",
    @Res() res: Response,
  ) {
    const { buffer, contentType, fileName, total } =
      await this.reportsService.exportCandidates(body, format);

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("X-Total-Candidates", total.toString());

    return res.send(buffer);
  }
}
