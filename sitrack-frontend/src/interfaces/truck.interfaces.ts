export interface Truck {
    vehicleId: string;
    vehicleBrand: string;
    vehicleYear: string;
    vehiclePlateNo: string;
    vehicleSTNKDate: Date;
    vehicleKIRNo: string;
    vehicleKIRDate: Date;
    vehicleCylinder?: string;
    vehicleChassisNo?: string;
    vehicleEngineNo?: string;
    vehicleBizLicenseNo?: string;
    vehicleBizLicenseDate?: Date;
    vehicleDispensationNo?: string;
    vehicleDispensationDate?: Date;
    vehicleRemarks?: string;
    siteId?: string;
    vehicleType?: string;
    division: string; // Division, wajib ada
    dept: string; // Departemen, default "TR"
    rowStatus: string; // Status row, default "A"
    insertedBy?: string; // User yang memasukkan data (opsional)
    insertedDate?: Date; // Tanggal data dimasukkan (opsional)
    updatedBy?: string; // User yang mengupdate data (opsional)
    updatedDate?: Date; // Tanggal data diupdate (opsional)
}

export interface CreateTruckRequest {
    vehicleBrand: string;
    vehicleYear: string;
    vehiclePlateNo: string;
    vehicleSTNKDate: Date;
    vehicleKIRNo: string;
    vehicleKIRDate: Date;
    vehicleCylinder?: string;
    vehicleChassisNo?: string;
    vehicleEngineNo?: string;
    vehicleBizLicenseNo?: string;
    vehicleBizLicenseDate?: Date;
    vehicleDispensationNo?: string;
    vehicleDispensationDate?: Date;
    vehicleRemarks?: string;
    siteId?: string;
    vehicleType?: string;
    division: string; // Division, wajib ada
    dept: string; // Departemen, default "TR"
    rowStatus: string; // Status row, default "A"
    insertedBy?: string;
    insertedDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;

}


export interface CreateTruckResponse {
    vehicleId: string;
    message: string;
}

export interface UpdateTruckRequest {
    vehicleId: string;
    vehicleBrand: string;
    vehicleYear: string;
    vehiclePlateNo: string;
    vehicleSTNKDate: Date;
    vehicleKIRNo: string;
    vehicleKIRDate: Date;
    vehicleCylinder?: string;
    vehicleChassisNo?: string;
    vehicleEngineNo?: string;
    vehicleBizLicenseNo?: string;
    vehicleBizLicenseDate?: Date;
    vehicleDispensationNo?: string;
    vehicleDispensationDate?: Date;
    vehicleRemarks?: string;
    siteId?: string;
    vehicleType?: string;
    division: string; // Division, wajib ada
    dept: string; // Departemen, default "TR"
    rowStatus: string; // Status row, default "A"
    insertedBy?: string;
    insertedDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;

}

export interface UpdateTruckResponse {
    vehicleId: string;
    message: string;
}
