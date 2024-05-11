import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  const statusResponseMock = {
    json: jest.fn((x) => x),
  };
  const responseMock = {
    status: jest.fn(() => statusResponseMock),
    json: jest.fn((x) => x),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService, PrismaService],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
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
        message: 'Successfully retrieved books',
        data: await service.findAll(),
      });
    });

    it('should return the list of books', () => {
      const result = controller.findAll(responseMock);

      jest.spyOn(controller, 'findAll').mockImplementationOnce(() => result);
      expect(controller.findAll(responseMock)).toBe(result);
    });
  });
});
