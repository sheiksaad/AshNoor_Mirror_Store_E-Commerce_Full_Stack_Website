import type { Request, Response } from "express";
import { getDashboardStats, listCustomers as getCustomersService, getAnalytics as getAnalyticsService } from "./admin.service.js";
import { sendResponse } from "../../utils/apiResponse.js";

export async function getStats(_req: Request, res: Response): Promise<void> {
    const stats = await getDashboardStats();
    sendResponse(res, 200, "Dashboard stats fetched", stats);
}
export async function getCustomers(_req: Request, res: Response): Promise<void> {
    const customers = await getCustomersService();
    sendResponse(res, 200, "Customers fetched", customers);
}

export async function getAnalyticsData(_req: Request, res: Response): Promise<void> {
    const analytics = await getAnalyticsService();
    sendResponse(res, 200, "Analytics fetched", analytics);
}