import { GetHistoryHandler } from "./handler/get-history.query.handler";
import { GetResourceByTokenHandler } from "./handler/get-resouce-by-token.handler";
import { GetResourcesTypeCountHandler } from "./handler/get-resources-by-type-count.handler";
import { GetResourcesHandler } from "./handler/get-resources.handler";

export const BffQueries = [
	GetResourcesHandler,
	GetResourceByTokenHandler,
	GetResourcesTypeCountHandler,
	GetHistoryHandler
]