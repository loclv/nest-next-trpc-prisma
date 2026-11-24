import { Injectable } from "@nestjs/common";
import { TrpcContext } from "@server/trpc/trpc.context";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

@Injectable()
export class TrpcService {
	trpc = initTRPC.context<TrpcContext>().create({
		transformer: superjson,
	});
	procedure = this.trpc.procedure;
	router = this.trpc.router;
	mergeRouters = this.trpc.mergeRouters;
}
