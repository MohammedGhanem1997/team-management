"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitUsers0001700000000001 = void 0;
const typeorm_1 = require("typeorm");
class InitUsers0001700000000001 {
    constructor() {
        this.name = "InitUsers0001700000000001";
    }
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "uuid",
                },
                { name: "email", type: "varchar", isUnique: true },
                { name: "password", type: "varchar" },
                { name: "createdAt", type: "timestamp", default: "now()" },
                { name: "updatedAt", type: "timestamp", default: "now()" },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("users");
    }
}
exports.InitUsers0001700000000001 = InitUsers0001700000000001;
//# sourceMappingURL=000-init-users.js.map