"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("prisma/config");
try {
	process.loadEnvFile();
} catch {}
exports.default = (0, config_1.defineConfig)({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: process.env.DATABASE_URL ?? "",
	},
});
//# sourceMappingURL=prisma.config.js.map
