import { z } from "zod/v4";
export declare const staffRoleValues: readonly ["owner", "manager", "shift_lead", "barista"];
export type StaffRole = (typeof staffRoleValues)[number];
export declare const staffTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "staff";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "staff";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        name: import("drizzle-orm/pg-core").PgColumn<{
            name: "name";
            tableName: "staff";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        email: import("drizzle-orm/pg-core").PgColumn<{
            name: "email";
            tableName: "staff";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        passwordHash: import("drizzle-orm/pg-core").PgColumn<{
            name: "password_hash";
            tableName: "staff";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        role: import("drizzle-orm/pg-core").PgColumn<{
            name: "role";
            tableName: "staff";
            dataType: "string";
            columnType: "PgText";
            data: "owner" | "manager" | "shift_lead" | "barista";
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: ["owner", "manager", "shift_lead", "barista"];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        color: import("drizzle-orm/pg-core").PgColumn<{
            name: "color";
            tableName: "staff";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "staff";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const insertStaffSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<{
        owner: "owner";
        manager: "manager";
        shift_lead: "shift_lead";
        barista: "barista";
    }>>;
    color: z.ZodOptional<z.ZodString>;
}, {
    out: {};
    in: {};
}>;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export declare const staffSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        owner: "owner";
        manager: "manager";
        shift_lead: "shift_lead";
        barista: "barista";
    }>;
    color: z.ZodString;
    createdAt: z.ZodDate;
}, {
    out: {};
    in: {};
}>;
export type Staff = typeof staffTable.$inferSelect;
export type PublicStaff = Omit<Staff, "passwordHash">;
//# sourceMappingURL=staff.d.ts.map