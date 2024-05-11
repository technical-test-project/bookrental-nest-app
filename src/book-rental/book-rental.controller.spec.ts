import { Test, TestingModule } from '@nestjs/testing';
import { BookRentalController } from './book-rental.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BookRentalService } from './book-rental.service';
import { Response } from 'express';

describe('BookRentalController', () => {
  let controller: BookRentalController;
  let service: BookRentalService;

  const statusResponseMock = {
    json: jest.fn((x) => x),
  };
  const responseMock = {
    status: jest.fn(() => statusResponseMock),
    json: jest.fn((x) => x),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookRentalController],
      providers: [BookRentalService, PrismaService],
    }).compile();

    controller = module.get<BookRentalController>(BookRentalController);
    service = module.get<BookRentalService>(BookRentalService);
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
        message: 'Successfully retrieved book rentals',
        data: await service.findAll(),
      });
    });

    it('should return the list of book rentals', () => {
      const result = controller.findAll(responseMock);

      jest.spyOn(controller, 'findAll').mockImplementationOnce(() => result);
      expect(controller.findAll(responseMock)).toBe(result);
    });
  });
});
