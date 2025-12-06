import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Team } from "./entities/team.entity";
import { Player } from "./entities/player.entity";
import { PlayerSkillImprovement } from "./entities/player-skill-improvement.entity";
import { CreateTeamMessageDto } from "./dto/create-team-message.dto";
import { v4 as uuidv4 } from "uuid";
import { ConfigService } from "@nestjs/config";

export const POSITION_COUNTS = {} as const;

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService
  ) {}

  async createTeam(createTeamMessage: CreateTeamMessageDto): Promise<void> {
    const { userId, teamName } = createTeamMessage;

    try {
      const team = this.teamRepository.create({
        userId,
        name: teamName,
        budget: this.configService.get<number>("initialBudget") || 5000000,
        status: "creating",
      });

      const savedTeam = await this.teamRepository.save(team);

      await this.generatePlayersForTeam(savedTeam.id);

      savedTeam.status = "ready";
      await this.teamRepository.save(savedTeam);

      console.log(`Team created successfully for user ${userId}`);
    } catch (error) {
      console.error("Error creating team:", error);

      const team = await this.teamRepository.findOne({ where: { userId } });
      if (team) {
        team.status = "error";
        await this.teamRepository.save(team);
      }
    }
  }

  private async generatePlayersForTeam(teamId: string): Promise<void> {
    const counts = this.configService.get<Record<string, number>>(
      "positionCounts"
    ) || { GK: 3, DEF: 6, MID: 6, ATT: 5 };
    const players: Player[] = [];
    for (const [position, count] of Object.entries(counts)) {
      for (let i = 0; i < (count as number); i++) {
        const age = this.randInt(16, 40);
        const pace = this.randInt(40, 100);
        const shooting = this.randInt(40, 100);
        const passing = this.randInt(40, 100);
        const dribbling = this.randInt(40, 100);
        const defending = this.randInt(40, 100);
        const physical = this.randInt(40, 100);
        const overall = this.computeOverall({
          pace,
          shooting,
          passing,
          dribbling,
          defending,
          physical,
        });
        const marketValue = this.computeMarketValue(overall, age);

        const p = this.playerRepository.create({
          first_name: this.randomFirstName(),
          last_name: this.randomLastName(),
          position: position as any,
          age,
          pace,
          shooting,
          passing,
          dribbling,
          defending,
          physical,
          overall_rating: overall,
          market_value: marketValue.toFixed(2),
          teamId,
          isOnTransferList: false,
          askingPrice: undefined,
        });
        players.push(p);
      }
    }
    await this.playerRepository.save(players);
  }

  private randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private computeOverall(skills: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  }): number {
    const weights = {
      pace: 0.15,
      shooting: 0.2,
      passing: 0.2,
      dribbling: 0.2,
      defending: 0.15,
      physical: 0.1,
    };
    const sum = Math.round(
      skills.pace * weights.pace +
        skills.shooting * weights.shooting +
        skills.passing * weights.passing +
        skills.dribbling * weights.dribbling +
        skills.defending * weights.defending +
        skills.physical * weights.physical
    );
    return Math.max(1, Math.min(100, sum));
  }

  private computeMarketValue(overall: number, age: number): number {
    const base = overall * 100000; // overall 80 => 8,000,000
    const peakAge = 27;
    const ageFactor = 1 - Math.abs(age - peakAge) / 20; // between ~0 and 1
    const factor = 0.6 + Math.max(0, ageFactor); // keep in [0.6, 1.6]
    return Math.round(base * factor);
  }

  private randomFirstName(): string {
    const names = [
      "Alex",
      "Sam",
      "Leo",
      "Max",
      "Kai",
      "Ben",
      "Liam",
      "Noah",
      "Aiden",
      "Evan",
    ];
    return names[this.randInt(0, names.length - 1)];
  }

  private randomLastName(): string {
    const names = [
      "Smith",
      "Johnson",
      "Brown",
      "Davis",
      "Miller",
      "Wilson",
      "Taylor",
      "Anderson",
      "Thomas",
      "Jackson",
    ];
    return names[this.randInt(0, names.length - 1)];
  }

  async improvePlayerSkill(
    userId: string,
    playerId: string,
    skill:
      | "pace"
      | "shooting"
      | "passing"
      | "dribbling"
      | "defending"
      | "physical",
    amount: number
  ): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ["team"],
    });
    if (!player) throw new NotFoundException("Player not found");
    if (player.team.userId !== userId)
      throw new ConflictException(
        "You can only improve skills of your own players"
      );

    const today = new Date();
    const yyyyMmDd = today.toISOString().slice(0, 10);
    const improvementRepo = this.dataSource.getRepository(
      PlayerSkillImprovement
    );
    const existing = await improvementRepo.findOne({
      where: { playerId, skill, improvementDate: yyyyMmDd },
    });
    if (existing)
      throw new ConflictException(
        "Daily skill improvement already used for this skill"
      );

    const current = player[skill] as number;
    const next = current + amount;
    if (amount <= 0)
      throw new ConflictException("Improvement amount must be positive");
    if (next < 1 || next > 100)
      throw new ConflictException("Resulting skill value must be within 1-100");

    player[skill] = next as any;
    player.overall_rating = this.computeOverall({
      pace: player.pace,
      shooting: player.shooting,
      passing: player.passing,
      dribbling: player.dribbling,
      defending: player.defending,
      physical: player.physical,
    });
    const mv = this.computeMarketValue(player.overall_rating, player.age);
    player.market_value = mv.toFixed(2);

    await this.playerRepository.save(player);
    await improvementRepo.save(
      improvementRepo.create({
        playerId,
        skill,
        improvementDate: yyyyMmDd,
      })
    );

    return player;
  }

  async getTeamByUserId(userId: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { userId },
      relations: ["players"],
    });

    if (!team) {
      throw new NotFoundException("Team not found");
    }

    return team;
  }

  async updateTeamBudget(teamId: string, amount: number): Promise<void> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException("Team not found");
    }

    team.budget += amount;
    await this.teamRepository.save(team);
  }

  async validateTeamSize(teamId: string): Promise<boolean> {
    const playerCount = await this.playerRepository.count({
      where: { teamId },
    });
    return playerCount >= 15 && playerCount <= 25;
  }

  async getTeamBudget(teamId: string): Promise<number> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException("Team not found");
    }
    return team.budget;
  }
}
