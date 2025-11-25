import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as ExcelJS from "exceljs";

export type ExportFormat = "csv" | "excel";

export interface CandidateExportFilters {
  companyId?: string;
  name?: string;
  email?: string;
  status?: string; // ACTIVE | INACTIVE | IN_PROCESS | HIRED ...
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async exportCandidates(
    filters: CandidateExportFilters,
    format: ExportFormat,
  ) {
    const where: any = {};

    if (filters.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters.name) {
      where.name = { contains: filters.name, mode: "insensitive" };
    }

    if (filters.email) {
      where.email = { contains: filters.email, mode: "insensitive" };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const candidates = await this.prisma.candidate.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const exportData = candidates.map((c) => ({
      ID: c.id,
      Nome: c.name ?? "",
      Email: c.email ?? "",
      Telefone: c.phone ?? "",
      Status: c.status ?? "",
      "Criado em": c.createdAt?.toISOString() ?? "",
      "Atualizado em": c.updatedAt?.toISOString() ?? "",
    }));

    if (format === "csv") {
      const buffer = this.generateCsv(exportData);
      return {
        buffer,
        contentType: "text/csv; charset=utf-8",
        fileName: "candidatos.csv",
        total: candidates.length,
      };
    }

    const buffer = await this.generateExcel(exportData);
    return {
      buffer,
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      fileName: "candidatos.xlsx",
      total: candidates.length,
    };
  }

  private generateCsv(rows: Array<Record<string, any>>): Buffer {
    if (!rows.length) {
      return Buffer.from("\uFEFF", "utf8");
    }

    const headers = Object.keys(rows[0] || {});
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = (row[header] ?? "").toString();
            const escaped = value.replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(","),
      ),
    ].join("\n");

    return Buffer.from("\uFEFF" + csvContent, "utf8");
  }

  private async generateExcel(
    rows: Array<Record<string, any>>,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Candidatos");

    const columns =
      rows.length > 0
        ? Object.keys(rows[0]).map((key) => ({
            header: key,
            key,
            width: 25,
          }))
        : [];

    worksheet.columns = columns as any;

    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    const buffer = (await workbook.xlsx.writeBuffer()) as Buffer;
    return buffer;
  }
}
