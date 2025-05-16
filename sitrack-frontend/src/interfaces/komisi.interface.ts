import type { Truck } from "./truck.interfaces";

export interface Komisi{
    komisiId: string;
    truckId : string;
    location : string;
    truckList?: Truck[];
    commissionFee: number;
    truckCommission: number;
    createdBy?: string;
    createdDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
}

export interface CreateKomisiRequest {
    location : string;
    commissionFee: number;
    truckCommission: number;
    truckId : string;
    createdBy?: string;
    createdDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
}

export interface CreateKomisiResponse {
    komisiId: string;
    location : string;
    commissionFee: number;
    truckCommission: number;
    createdBy?: string;
    createdDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
}