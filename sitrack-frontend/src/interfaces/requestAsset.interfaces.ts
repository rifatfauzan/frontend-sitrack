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
    approvalBy?: string;
    approvalDate?: Date;
    assets: RequestAssetItem[];
}
  