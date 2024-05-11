import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';

describe('MemberController', () => {
  let controller: MemberController;
  let service: MemberService;

  const statusResponseMock = {
    json: jest.fn((x) => x),
  };
  const responseMock = {
    status: jest.fn(() => statusResponseMock),
    json: jest.fn((x) => x),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [MemberService, PrismaService],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a status of 200', async () => {
      await controller.findAll(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(statusResponseMock.json).toHaveBeenCalledWith({
        message: 'Successfully retrieved members',
        data: await service.findAll(),
      });
    });

    it('should return the list of members', () => {
      const result = controller.findAll(responseMock);

      jest.spyOn(controller, 'findAll').mockImplementationOnce(() => result);
      expect(controller.findAll(responseMock)).toBe(result);
    });
  });
});
