import type { Tariff, TariffRequest} from './tariff.interfaces';

export interface Customer {
    id: string;
    siteId: string;
    name: string;
    address?: string;
    contractNo?: string;
    cityOrigin?: string;
    cityDestination?: string;
    commodity?: string;
    tariffs: Tariff[];
    insertedBy: string;
    updatedBy: string;
    insertedDate: Date;
    updatedDate: Date;
}

export interface CreateCustomerRequest {
    siteId: string;
    name: string;
    address?: string;
    contractNo?: string;
    cityOrigin?: string;
    cityDestination?: string;
    commodity?: string;
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {
    id: string;
    tariffs: TariffRequest[];
}
