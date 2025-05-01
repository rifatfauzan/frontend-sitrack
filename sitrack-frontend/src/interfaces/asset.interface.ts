export interface Asset {
    assetId: string;
    jenisAsset: string;
    jumlahStok: number;
    brand: string;
    assetRemark?: string;
    requestedStok: number;
    createdBy?: string;
    createdDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
    assetPrice: number;
}

export interface CreateAssetRequest {
    assetId: string;
    jenisAsset: string;
    jumlahStok: number;
    brand: string;
    assetRemark?: string;
    requestedStok: number; 
    createdBy?: string;
    createdDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
    assetPrice: number;
}