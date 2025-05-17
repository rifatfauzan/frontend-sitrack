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
    division: string; 
    dept: string; 
    rowStatus: string; 
    recordStatus: string; 
    vehicleNumber?: string;
    vehicleFuelConsumption: number;
    vehicleCommission?: number;
    insertedBy?: string; 
    insertedDate?: Date; 
    updatedBy?: string; 
    updatedDate?: Date; 
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
    division: string; 
    dept: string; 
    rowStatus: string; 
    recordStatus: string;   
    vehicleNumber?: string;
    vehicleFuelConsumption: number;
    vehicleCommission?: number;
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
    division: string; 
    dept: string; 
    rowStatus: string; 
    recordStatus: string;   
    vehicleNumber?: string;
    vehicleFuelConsumption: number;
    vehicleCommission?: number;
    insertedBy?: string;
    insertedDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;

}

export interface UpdateTruckResponse {
    vehicleId: string;
    message: string;
}
