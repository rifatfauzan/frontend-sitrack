// order.interface.ts

export interface Order {
    orderId: string;
    orderDate: Date;
    customerId: string;
  
    qtyChassis20?: number;
    qtyChassis40?: number;
  
    siteId?: string;
    remarksOperasional?: string;
    remarksSupervisor?: string;
    moveType?: string;
    downPayment?: number;
    orderStatus: number;
  
    qty120mtfl?: number;
    qty120mt?: number;
    qty220mtfl?: number;
    qty220mt?: number;
    qty140mtfl?: number;
    qty140mt?: number;
    qty120mt120fl?: number;
    qty120mt220fl?: number;
    qty220mt120fl?: number;
    qty220mt220fl?: number;
    qtyCh120fl?: number;
    qtyCh220fl?: number;
    qtyCh140fl?: number;
  
    createdBy?: string;
    createdDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
    approvedBy?: string;
    approvedDate?: Date;
  }
  
  export interface CreateOrderRequest {
    orderDate: Date;
    customerId: string;
  
    qtyChassis20?: number;
    qtyChassis40?: number;
  
    siteId?: string;
    remarksOperasional?: string;
    moveType?: string;
    downPayment?: number;
  
    qty120mtfl?: number;
    qty120mt?: number;
    qty220mtfl?: number;
    qty220mt?: number;
    qty140mtfl?: number;
    qty140mt?: number;
    qty120mt120fl?: number;
    qty120mt220fl?: number;
    qty220mt120fl?: number;
    qty220mt220fl?: number;
    qtyCh120fl?: number;
    qtyCh220fl?: number;
    qtyCh140fl?: number;
  }
  
  export interface CreateOrderResponse {
    message: string;
    orderId: string;
  }
  
  export interface OrderDetailResponse extends Order {}
  