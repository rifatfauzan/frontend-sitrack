export interface RequestAssetItem {
    assetId: string;
    requestedQuantity: number;
}
  
export interface RequestAsset {
    requestAssetId: string;
    requestRemark?: string;
    status?: number;
    createdBy?: string;
    createdDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
    approvalBy?: String;
    approvalDate?: Date;
    assets: RequestAssetItem[];
}
  