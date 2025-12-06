"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitUsers000 = void 0;
const typeorm_1 = require("typeorm");
class InitUsers000 {
    constructor() {
        this.name = 'InitUsers000';
    }
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
            columns: [
                { name: 'id', type: 'uuid', isPrimary: true },
                { name: 'email', type: 'varchar', isUnique: true },
                { name: 'password', type: 'varchar' },
                { name: 'createdAt', type: 'timestamp', default: 'now()' },
                { name: 'updatedAt', type: 'timestamp', default: 'now()' },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('users');
    }
}
exports.InitUsers000 = InitUsers000;
//# sourceMappingURL=000-init-users.js.map