import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from './member.model';
import { Response } from 'express';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOkResponse({ description: 'Retrieve all members' })
  @Get()
  async findAll(@Res() response: Response): Promise<Response<Member[]>> {
    return response.status(HttpStatus.OK).json({
      message: 'Successfully retrieved members',
      data: await this.memberService.findAll(),
    });
  }
}
