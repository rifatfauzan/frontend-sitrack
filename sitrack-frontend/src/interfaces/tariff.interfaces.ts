export interface Tariff {
    tariffId: string;
    customerId: string;
    type: string;
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
    type: string;
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
    type: string;
    stdTariff: number;
    insurance: number;
    tips: number;
    police: number;
    lolo: number;
    others: number;
    totalTariff: number;
}
