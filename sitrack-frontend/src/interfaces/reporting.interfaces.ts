// Interface untuk masing-masing tipe report
export interface CustomerReport {
  id: string
  name: string
  siteId: string
  address: string
  cityDestination: string
}

export interface VehicleReport {
  vehicleId: string
  vehicleBrand: string
  vehicleYear: string
  vehicleType: string
  vehiclePlateNo: string
  vehicleKIRNo: string
  vehicleSTNKDate: string
  vehicleKIRDate: string
}

export interface ChassisReport {
  chassisId: string
  chassisYear: string
  chassisSize: string
  chassisType: string
  chassisNumber: string
  chassisKIRNo: string
  chassisKIRDate: string
}

export interface DriverReport {
  driverId: string
  driverName: string
  driver_KTP_No: string
  driver_SIM_No: string
  driverJoinDate: string
}

export interface OrderReport {
  orderId: string
  customer: {
    id: string
    name: string
  }
  orderDate: string
  moveType: string
  downPayment: number
  qtyChassis20: number
  qtyChassis40: number
}

export interface SpjReport {
  id: string
  order: {
    orderId: string
  }
  customer: {
    id: string
    name: string
  }
  driver: {
    driverName: string
  }
  vehicle: {
    vehicleId: string
  }
  chassis: {
    chassisId: string
    chassisType: string
  }
  chassisSize: string
  containerQty: number
  containerType: string
  commission: number
  othersCommission: number
  dateOut: string
  dateIn: string
}

export type ReportType =
  | 'ALL_CUSTOMERS'
  | 'ALL_VEHICLES'
  | 'ALL_CHASSIS'
  | 'ALL_DRIVERS'
  | 'ALL_ORDERS'
  | 'ALL_SPJ'

export type ReportData =
  | CustomerReport
  | VehicleReport
  | ChassisReport
  | DriverReport
  | OrderReport
  | SpjReport
