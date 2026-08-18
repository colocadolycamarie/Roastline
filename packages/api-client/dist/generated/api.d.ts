import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AvailabilityInput, Dashboard, HealthStatus, InventoryCountInput, InventoryItem, LoginInput, LoyaltySnapshot, MenuItem, MenuItemInput, MenuResponse, Order, OrderInput, OrderStatusInput, RegisterInput, SalesReport, Shift, ShiftInput, StaffAccount, StaffMember } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRegisterUrl: () => string;
/**
 * @summary Create the first (owner) account. Fails once any staff account exists.
 */
export declare const register: (registerInput: RegisterInput, options?: Parameters<typeof customFetch>[1]) => Promise<StaffAccount>;
export declare const getRegisterMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>;
export type RegisterMutationBody = BodyType<RegisterInput>;
export type RegisterMutationError = ErrorType<unknown>;
/**
* @summary Create the first (owner) account. Fails once any staff account exists.
*/
export declare const useRegister: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
export declare const getLoginUrl: () => string;
/**
 * @summary Sign in with email and password
 */
export declare const login: (loginInput: LoginInput, options?: Parameters<typeof customFetch>[1]) => Promise<StaffAccount>;
export declare const getLoginMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginInput>;
export type LoginMutationError = ErrorType<unknown>;
/**
* @summary Sign in with email and password
*/
export declare const useLogin: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export declare const getLogoutUrl: () => string;
/**
 * @summary End the current session
 */
export declare const logout: (options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
export type LogoutMutationError = ErrorType<unknown>;
/**
* @summary End the current session
*/
export declare const useLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export declare const getGetCurrentStaffUrl: () => string;
/**
 * @summary Get the signed-in staff account
 */
export declare const getCurrentStaff: (options?: Parameters<typeof customFetch>[1]) => Promise<StaffAccount>;
export declare const getGetCurrentStaffQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetCurrentStaffQueryOptions: <TData = Awaited<ReturnType<typeof getCurrentStaff>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentStaff>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCurrentStaff>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCurrentStaffQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentStaff>>>;
export type GetCurrentStaffQueryError = ErrorType<unknown>;
/**
 * @summary Get the signed-in staff account
 */
export declare function useGetCurrentStaff<TData = Awaited<ReturnType<typeof getCurrentStaff>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentStaff>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDashboardUrl: () => string;
/**
 * @summary Get the current operating snapshot
 */
export declare const getDashboard: (options?: Parameters<typeof customFetch>[1]) => Promise<Dashboard>;
export declare const getGetDashboardQueryKey: () => readonly ["/api/dashboard"];
export declare const getGetDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboard>>>;
export type GetDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get the current operating snapshot
 */
export declare function useGetDashboard<TData = Awaited<ReturnType<typeof getDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetMenuUrl: () => string;
/**
 * @summary Get menu categories and items
 */
export declare const getMenu: (options?: Parameters<typeof customFetch>[1]) => Promise<MenuResponse>;
export declare const getGetMenuQueryKey: () => readonly ["/api/menu"];
export declare const getGetMenuQueryOptions: <TData = Awaited<ReturnType<typeof getMenu>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMenu>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMenu>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMenuQueryResult = NonNullable<Awaited<ReturnType<typeof getMenu>>>;
export type GetMenuQueryError = ErrorType<unknown>;
/**
 * @summary Get menu categories and items
 */
export declare function useGetMenu<TData = Awaited<ReturnType<typeof getMenu>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMenu>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateMenuItemUrl: () => string;
/**
 * @summary Create a menu item
 */
export declare const createMenuItem: (menuItemInput: MenuItemInput, options?: Parameters<typeof customFetch>[1]) => Promise<MenuItem>;
export declare const getCreateMenuItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMenuItem>>, TError, {
        data: BodyType<MenuItemInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createMenuItem>>, TError, {
    data: BodyType<MenuItemInput>;
}, TContext>;
export type CreateMenuItemMutationResult = NonNullable<Awaited<ReturnType<typeof createMenuItem>>>;
export type CreateMenuItemMutationBody = BodyType<MenuItemInput>;
export type CreateMenuItemMutationError = ErrorType<unknown>;
/**
* @summary Create a menu item
*/
export declare const useCreateMenuItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMenuItem>>, TError, {
        data: BodyType<MenuItemInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createMenuItem>>, TError, {
    data: BodyType<MenuItemInput>;
}, TContext>;
export declare const getUpdateMenuItemAvailabilityUrl: (id: string) => string;
/**
 * @summary Toggle an item availability state
 */
export declare const updateMenuItemAvailability: (id: string, availabilityInput: AvailabilityInput, options?: Parameters<typeof customFetch>[1]) => Promise<MenuItem>;
export declare const getUpdateMenuItemAvailabilityMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMenuItemAvailability>>, TError, {
        id: string;
        data: BodyType<AvailabilityInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMenuItemAvailability>>, TError, {
    id: string;
    data: BodyType<AvailabilityInput>;
}, TContext>;
export type UpdateMenuItemAvailabilityMutationResult = NonNullable<Awaited<ReturnType<typeof updateMenuItemAvailability>>>;
export type UpdateMenuItemAvailabilityMutationBody = BodyType<AvailabilityInput>;
export type UpdateMenuItemAvailabilityMutationError = ErrorType<unknown>;
/**
* @summary Toggle an item availability state
*/
export declare const useUpdateMenuItemAvailability: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMenuItemAvailability>>, TError, {
        id: string;
        data: BodyType<AvailabilityInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMenuItemAvailability>>, TError, {
    id: string;
    data: BodyType<AvailabilityInput>;
}, TContext>;
export declare const getGetInventoryUrl: () => string;
/**
 * @summary Get ingredient stock levels
 */
export declare const getInventory: (options?: Parameters<typeof customFetch>[1]) => Promise<InventoryItem[]>;
export declare const getGetInventoryQueryKey: () => readonly ["/api/inventory"];
export declare const getGetInventoryQueryOptions: <TData = Awaited<ReturnType<typeof getInventory>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInventory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getInventory>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetInventoryQueryResult = NonNullable<Awaited<ReturnType<typeof getInventory>>>;
export type GetInventoryQueryError = ErrorType<unknown>;
/**
 * @summary Get ingredient stock levels
 */
export declare function useGetInventory<TData = Awaited<ReturnType<typeof getInventory>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getInventory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRecordInventoryCountUrl: (id: string) => string;
/**
 * @summary Record a physical count
 */
export declare const recordInventoryCount: (id: string, inventoryCountInput: InventoryCountInput, options?: Parameters<typeof customFetch>[1]) => Promise<InventoryItem>;
export declare const getRecordInventoryCountMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recordInventoryCount>>, TError, {
        id: string;
        data: BodyType<InventoryCountInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof recordInventoryCount>>, TError, {
    id: string;
    data: BodyType<InventoryCountInput>;
}, TContext>;
export type RecordInventoryCountMutationResult = NonNullable<Awaited<ReturnType<typeof recordInventoryCount>>>;
export type RecordInventoryCountMutationBody = BodyType<InventoryCountInput>;
export type RecordInventoryCountMutationError = ErrorType<unknown>;
/**
* @summary Record a physical count
*/
export declare const useRecordInventoryCount: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recordInventoryCount>>, TError, {
        id: string;
        data: BodyType<InventoryCountInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof recordInventoryCount>>, TError, {
    id: string;
    data: BodyType<InventoryCountInput>;
}, TContext>;
export declare const getGetOrdersUrl: () => string;
/**
 * @summary Get recent orders
 */
export declare const getOrders: (options?: Parameters<typeof customFetch>[1]) => Promise<Order[]>;
export declare const getGetOrdersQueryKey: () => readonly ["/api/orders"];
export declare const getGetOrdersQueryOptions: <TData = Awaited<ReturnType<typeof getOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof getOrders>>>;
export type GetOrdersQueryError = ErrorType<unknown>;
/**
 * @summary Get recent orders
 */
export declare function useGetOrders<TData = Awaited<ReturnType<typeof getOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateOrderUrl: () => string;
/**
 * @summary Create and complete a POS order
 */
export declare const createOrder: (orderInput: OrderInput, options?: Parameters<typeof customFetch>[1]) => Promise<Order>;
export declare const getCreateOrderMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<OrderInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<OrderInput>;
}, TContext>;
export type CreateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof createOrder>>>;
export type CreateOrderMutationBody = BodyType<OrderInput>;
export type CreateOrderMutationError = ErrorType<unknown>;
/**
* @summary Create and complete a POS order
*/
export declare const useCreateOrder: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<OrderInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<OrderInput>;
}, TContext>;
export declare const getUpdateOrderStatusUrl: (id: string) => string;
/**
 * @summary Move a prep ticket through its workflow
 */
export declare const updateOrderStatus: (id: string, orderStatusInput: OrderStatusInput, options?: Parameters<typeof customFetch>[1]) => Promise<Order>;
export declare const getUpdateOrderStatusMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
        id: string;
        data: BodyType<OrderStatusInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
    id: string;
    data: BodyType<OrderStatusInput>;
}, TContext>;
export type UpdateOrderStatusMutationResult = NonNullable<Awaited<ReturnType<typeof updateOrderStatus>>>;
export type UpdateOrderStatusMutationBody = BodyType<OrderStatusInput>;
export type UpdateOrderStatusMutationError = ErrorType<unknown>;
/**
* @summary Move a prep ticket through its workflow
*/
export declare const useUpdateOrderStatus: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
        id: string;
        data: BodyType<OrderStatusInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateOrderStatus>>, TError, {
    id: string;
    data: BodyType<OrderStatusInput>;
}, TContext>;
export declare const getGetStaffUrl: () => string;
/**
 * @summary Get staff and schedule summary
 */
export declare const getStaff: (options?: Parameters<typeof customFetch>[1]) => Promise<StaffMember[]>;
export declare const getGetStaffQueryKey: () => readonly ["/api/staff"];
export declare const getGetStaffQueryOptions: <TData = Awaited<ReturnType<typeof getStaff>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStaff>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStaff>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStaffQueryResult = NonNullable<Awaited<ReturnType<typeof getStaff>>>;
export type GetStaffQueryError = ErrorType<unknown>;
/**
 * @summary Get staff and schedule summary
 */
export declare function useGetStaff<TData = Awaited<ReturnType<typeof getStaff>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStaff>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetShiftsUrl: () => string;
/**
 * @summary Get published shifts
 */
export declare const getShifts: (options?: Parameters<typeof customFetch>[1]) => Promise<Shift[]>;
export declare const getGetShiftsQueryKey: () => readonly ["/api/shifts"];
export declare const getGetShiftsQueryOptions: <TData = Awaited<ReturnType<typeof getShifts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getShifts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getShifts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetShiftsQueryResult = NonNullable<Awaited<ReturnType<typeof getShifts>>>;
export type GetShiftsQueryError = ErrorType<unknown>;
/**
 * @summary Get published shifts
 */
export declare function useGetShifts<TData = Awaited<ReturnType<typeof getShifts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getShifts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateShiftUrl: () => string;
/**
 * @summary Add a shift
 */
export declare const createShift: (shiftInput: ShiftInput, options?: Parameters<typeof customFetch>[1]) => Promise<Shift>;
export declare const getCreateShiftMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createShift>>, TError, {
        data: BodyType<ShiftInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createShift>>, TError, {
    data: BodyType<ShiftInput>;
}, TContext>;
export type CreateShiftMutationResult = NonNullable<Awaited<ReturnType<typeof createShift>>>;
export type CreateShiftMutationBody = BodyType<ShiftInput>;
export type CreateShiftMutationError = ErrorType<unknown>;
/**
* @summary Add a shift
*/
export declare const useCreateShift: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createShift>>, TError, {
        data: BodyType<ShiftInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createShift>>, TError, {
    data: BodyType<ShiftInput>;
}, TContext>;
export declare const getGetLoyaltyUrl: () => string;
/**
 * @summary Get loyalty program snapshot
 */
export declare const getLoyalty: (options?: Parameters<typeof customFetch>[1]) => Promise<LoyaltySnapshot>;
export declare const getGetLoyaltyQueryKey: () => readonly ["/api/loyalty"];
export declare const getGetLoyaltyQueryOptions: <TData = Awaited<ReturnType<typeof getLoyalty>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLoyalty>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLoyalty>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLoyaltyQueryResult = NonNullable<Awaited<ReturnType<typeof getLoyalty>>>;
export type GetLoyaltyQueryError = ErrorType<unknown>;
/**
 * @summary Get loyalty program snapshot
 */
export declare function useGetLoyalty<TData = Awaited<ReturnType<typeof getLoyalty>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLoyalty>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetSalesReportUrl: () => string;
/**
 * @summary Get sales report
 */
export declare const getSalesReport: (options?: Parameters<typeof customFetch>[1]) => Promise<SalesReport>;
export declare const getGetSalesReportQueryKey: () => readonly ["/api/reports/sales"];
export declare const getGetSalesReportQueryOptions: <TData = Awaited<ReturnType<typeof getSalesReport>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSalesReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSalesReport>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSalesReportQueryResult = NonNullable<Awaited<ReturnType<typeof getSalesReport>>>;
export type GetSalesReportQueryError = ErrorType<unknown>;
/**
 * @summary Get sales report
 */
export declare function useGetSalesReport<TData = Awaited<ReturnType<typeof getSalesReport>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSalesReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map