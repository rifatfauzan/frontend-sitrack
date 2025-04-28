export interface Notification {
    id: number;
    title: string;
    message: string;
    category: string;
    referenceId: string;
    referenceType: string;
    expiryDate: string;
    isRead: boolean;
    isActive: boolean;
    daysRemaining: number;
    redirectEndpoint: string;
    createdDate: string;
}
