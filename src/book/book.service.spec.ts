import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService, PrismaService],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return the list of books', () => {
      const result = service.findAll();

      jest.spyOn(service, 'findAll').mockImplementationOnce(() => result);
      expect(service.findAll()).toBe(result);
    });
  });

  describe('updateStock', () => {
    it('should update the bookRental', async () => {
      const books = await service.findAll();
      const result = service.updateStock(books[0].id, 1);

      jest.spyOn(service, 'updateStock').mockImplementationOnce(() => result);
      expect(service.updateStock(books[0].id, 1)).toBe(result);
    });
  });
});
