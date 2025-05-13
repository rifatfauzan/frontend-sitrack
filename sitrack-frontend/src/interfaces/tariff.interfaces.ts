export interface Tariff {
    tariffId: string;
    customerId: string;
    chassisSize: number;
    moveType: string;
    stdTariff: number;
    insurance: number;
    tips: number;
    police: number;
    lolo: number;
    others: number;
    totalTariff: number;
}

export interface TariffRequest {
    tariffId?: string;
    chassisSize: number;
    moveType: string;
    stdTariff: number;
    insurance: number;
    tips: number;
    police: number;
    lolo: number;
    others: number;
}

export interface TariffResponse {
    tariffId: string;
    customerId: string;
    chassisSize: number;
    moveType: string;
    stdTariff: number;
    insurance: number;
    tips: number;
    police: number;
    lolo: number;
    others: number;
    totalTariff: number;
}
