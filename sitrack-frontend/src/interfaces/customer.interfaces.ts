import { Tariff, TariffRequest, TariffResponse } from './tariff.interfaces';
import { CommonResponseInterface } from '@/interfaces/common.interfaces';

export interface Customer {
    id: string;
    siteId: string;
    name: string;
    address?: string;
    contractNo?: string;
    cityOrigin?: string;
    cityDestination?: string;
    commodity?: string;
    moveType?: string;
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
    moveType?: string;
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {
    id: string;
    tariffs: TariffRequest[];
}

export interface CustomerResponse extends CommonResponseInterface<Customer> {}
export interface CustomersResponse extends CommonResponseInterface<Customer[]> {}
