import { afterEach, beforeEach, describe, it } from "bun:test";

import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@server/db";
import request from "supertest";

import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(PrismaService)
			.useValue({
				$connect: async () => {},
				$disconnect: async () => {},
				$queryRaw: async () => [{ "?column?": 1 }],
			})
			.compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it("/ (GET)", () => {
		return request(app.getHttpServer())
			.get("/")
			.expect(200)
			.expect("Hello World!");
	});

	it("/health (GET)", () => {
		return request(app.getHttpServer())
			.get("/health")
			.expect(200)
			.expect({ status: "ok", database: "connected" });
	});
});
