export interface Chassis {
    chassisId: string; // ID chassis maksimal 8 karakter
    chassisSize?: '20' | '40'; // Ukuran chassis harus 20 atau 40 (opsional)
    chassisYear?: string; // Tahun chassis harus 4 digit angka
    chassisNumber?: string; // Nomor chassis maksimal 6 karakter
    chassisAxle?: string; // Jumlah axle sebagai string (sesuai backend)
    chassisKIRNo?: string; // Nomor KIR maksimal 20 karakter
    chassisKIRDate?: Date; // Tanggal KIR (opsional)
    chassisType?: 'F' | 'T'; // Tipe chassis harus F (Flatbed) atau T (Trailer)
    chassisRemarks?: string; // Keterangan tambahan (opsional, max 300 karakter)
    insertedBy?: string; // User yang memasukkan data (opsional)
    insertedDate?: Date; // Tanggal data dimasukkan (opsional)
    updatedBy?: string; // User yang mengupdate data (opsional)
    updatedDate?: Date; // Tanggal data diupdate (opsional)
    division: string; // Division, wajib ada
    dept: string; // Departemen, default "TR"
    rowStatus: string; // Status row, default "A"
    siteId: string; // Site ID maksimal 3 karakter (default: "JKT")
}

export interface CreateChassisRequest {
    chassisId: string;
    chassisSize: '20' | '40';
    chassisYear: string;
    chassisNumber: string;
    chassisAxle: string;
    chassisKIRNo: string;
    chassisKIRDate: Date;
    chassisType: 'F' | 'T';
    chassisRemarks?: string;
    insertedBy?: string;
    insertedDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
    division: string;
    dept: string;
    rowStatus: string;
    siteId: string;
}

export interface CreateChassisResponse {
    message: string;
    chassisId: string;
}

  