export interface ReportTruckAsset {
  assetId: string;
  quantity: number;
}

export interface ReportTruck {
  reportTruckId: string;
  date?: Date;
  startRepair?: Date;
  finishRepair?: Date;
  vehicleId: string;
  vehiclePlateNo?: string;
  vehicleType?: string;
  vehicleBrand?: string;
  description: string;
  createdBy?: string;
  assets: ReportTruckAsset[];
}