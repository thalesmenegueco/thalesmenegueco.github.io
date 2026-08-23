import { Injectable } from '@angular/core';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { from } from 'arquero';
import type { ColumnProfile, Dataset, Field } from '../models/types';
import { profileColumn } from './type-sniffing';

export interface IngestedData {
  rows: Record<string, unknown>[];
  headers: string[];
  profiles: ColumnProfile[];
}

/**
 * Turns an uploaded CSV/XLSX file (or a CSV string from a lesson's example
 * dataset) into plain rows + per-column profiles. Everything runs client-side;
 * no data leaves the browser.
 */
@Injectable({ providedIn: 'root' })
export class IngestionService {
  async parseFile(file: File): Promise<IngestedData> {
    const lower = file.name.toLowerCase();
    const rows = lower.endsWith('.csv') || lower.endsWith('.txt')
      ? await this.parseCsv(file)
      : await this.parseExcel(file);

    return this.toIngestedData(rows);
  }

  /** Parse an inline CSV string (used by lesson example datasets). */
  async parseCsvText(text: string): Promise<Record<string, unknown>[]> {
    return this.parseCsv(text);
  }

  /** Build the confirmed Dataset from raw rows and user-confirmed fields. */
  buildDataset(rows: Record<string, unknown>[], fields: Field[]): Dataset {
    return { fields, table: from(rows) };
  }

  private toIngestedData(rows: Record<string, unknown>[]): IngestedData {
    if (rows.length === 0) {
      throw new Error('Nenhuma linha de dados encontrada no arquivo.');
    }
    const headers = this.extractHeaders(rows);
    const profiles = headers.map((h) => profileColumn(h, rows.map((r) => r[h])));
    return { rows, headers, profiles };
  }

  private extractHeaders(rows: Record<string, unknown>[]): string[] {
    const seen = new Set<string>();
    const headers: string[] = [];
    for (const row of rows) {
      for (const key of Object.keys(row)) {
        if (!seen.has(key)) {
          seen.add(key);
          headers.push(key);
        }
      }
    }
    return headers;
  }

  private parseCsv(input: File | string): Promise<Record<string, unknown>[]> {
    return new Promise((resolve, reject) => {
      Papa.parse<Record<string, unknown>>(input, {
        header: true,
        skipEmptyLines: true,
        // Keep values as strings; the declared field type drives coercion later.
        dynamicTyping: false,
        complete: (result) => resolve(result.data),
        error: (err) => reject(err),
      });
    });
  }

  private async parseExcel(file: File): Promise<Record<string, unknown>[]> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.SheetNames[0];
    if (!firstSheet) {
      return [];
    }
    const sheet = workbook.Sheets[firstSheet];
    return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null });
  }
}
