import { ClientProxy } from "@nestjs/microservices";
export declare class TeamController {
    private readonly teamServiceClient;
    constructor(teamServiceClient: ClientProxy);
    getMyTeam(req: any): Promise<any>;
}
