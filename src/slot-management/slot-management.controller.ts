import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SlotManagementService } from './slot-management.service';
import { DailySlotsDto } from './dto/dailySlots.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { Slot } from './entities/slot.entity';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interface/active-user-data.interface';
import { WeeklySlotsDto } from './dto/weeklySlots.dto';

@ApiBearerAuth()
@Roles(Role.Business, Role.Employee, Role.Admin)
@ApiTags('Slots Management')
@Controller('slots')
export class SlotManagementController {
  constructor(private readonly slotManagementService: SlotManagementService) {}

  @ApiBody({ type: DailySlotsDto })
  @Post('daily')
  setDailySlots(
    @Body() dailySlotsDto: DailySlotsDto,
    @ActiveUser() user: ActiveUserData,
  ): Promise<Slot[]> {
    return this.slotManagementService.setDailySlots(dailySlotsDto, user);
  }

  @Post('weekly')
  async setWeeklySlots(
    @Body() dailySlotsDto: DailySlotsDto,
    @Body() weeklySlotsDto: WeeklySlotsDto,
    @ActiveUser() currentUser: ActiveUserData,
  ): Promise<Slot[]> {
    return await this.slotManagementService.setWeeklySlots(
      weeklySlotsDto,
      currentUser,
    );
  }

  @Get()
  findAll(@ActiveUser() user: ActiveUserData): Promise<Slot[]> {
    return this.slotManagementService.findAllSlots(user);
  }

  @ApiOperation({ summary: 'Date must be formatted by YYYY-MM-DD' })
  @Get(':date')
  async GetOpenedSlotByDay(
    @Param('date') date: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.slotManagementService.getOpenedSlotByDay(date, user);
  }
}
