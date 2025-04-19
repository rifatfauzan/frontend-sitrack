import type { Tariff, TariffRequest, TariffResponse } from './tariff.interfaces';
import type { CommonResponseInterface } from '@/interfaces/common.interfaces';

export interface Customer {
    id: string;
    siteId: string;
    name: string;
    address?: string;
    contractNo?: string;
    cityOrigin?: string;
    cityDestination?: string;
    commodity?: string;
    commission?: number;
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
    commission?: number;
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {
    id: string;
    tariffs: TariffRequest[];
}

export interface CustomerResponse extends CommonResponseInterface<Customer> {}
export interface CustomersResponse extends CommonResponseInterface<Customer[]> {}
