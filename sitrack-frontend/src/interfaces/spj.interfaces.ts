export interface Spj{
    id: string;
    orderId: string;
    customerId: string;
    vehicleId: string;
    chassisId: string;
    driverId: string;

    chassisSize: number;
    containerType: string;
    containerQty: number;
    dateOut?: Date;
    dateIn?: Date;
    actualDateIn?: Date;
    commission: number;
    otherCommission?: number;
    remarksOperasional?: string;
    remarksSupervisor?: string;
    status: number;

    insertedBy: string;
    insertedDate: Date;
    updatedBy?: string;
    updatedDate?: Date;
    approvedBy?: string;
    approvedDate?: Date;
}

export interface CreateSpjRequest {
    orderId: string;
    customerId: string;
    vehicleId: string;
    chassisId: string;
    driverId: string;

    chassisSize: number;
    containerType: string;
    containerQty: number;
    dateOut?: Date;
    dateIn?: Date;
    actualDateIn?: Date;

    otherCommission?: number;
    remarksOperasional?: string;
    remarksSupervisor?: string;
}