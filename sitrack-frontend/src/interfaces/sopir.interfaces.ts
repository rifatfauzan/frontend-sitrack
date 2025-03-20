import type { CommonResponseInterface } from '@/interfaces/common.interfaces';

export interface Sopir{
    driverId: string;
    driverName: string;
    driver_KTP_No: string;
    driver_KTP_Date: Date;
    driver_SIM_No: string;
    driver_SIM_Date: Date;
    driverCo : string;
    driverCoContact: string;
    siteId: string;
    driverContact: string;
    driverNumber: string;
    driverRemarks: string;
    recordStatus: string;
    driverType: string;
    driverJoinDate: Date;
    rowStatus : string;
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
}

export interface SopirRequestInterface {
    driverName: string;
    driver_KTP_No: string;
    driver_KTP_Date: Date;
    driver_SIM_No: string;
    driver_SIM_Date: Date;
    driverCo : string;
    driverCoContact: string;
    driverContact: string;
    siteId: string;
    driverNumber: string;
    driverRemarks: string;
    recordStatus: string;
    driverType: string;
    driverJoinDate: Date;
    rowStatus : string;
}

export interface SopirResponseInterface{
    driverId: string;
    driverName: string;
    driver_KTP_No: string;
    driver_KTP_Date: Date;
    driver_SIM_No: string;
    driver_SIM_Date: Date;
    driverCo : string;
    driverCoContact: string;
    driverContact: string;
    siteId: string;
    driverNumber: string;
    driverRemarks: string;
    recordStatus: string;
    driverType: string;
    driverJoinDate: Date;
    rowStatus : string;
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
}

export type SopirResponse = CommonResponseInterface<Sopir>;
export type SopirResponses = CommonResponseInterface<Sopir[]>;