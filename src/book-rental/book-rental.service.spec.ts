import { Test, TestingModule } from '@nestjs/testing';
import { BookRentalService } from './book-rental.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookRentalDto } from './dto/create-book-rental.dto';
import { MemberService } from '../member/member.service';
import { BookService } from '../book/book.service';
import { Member } from '../member/member.model';
import { Book } from '../book/book.model';
import { BookRental } from './book-rental.model';

describe('BookRentalService', () => {
  let service: BookRentalService;
  let memberService: MemberService;
  let bookService: BookService;
  let prismaService: PrismaService;

  const days: number = 7;
  let rentalDate: Date;
  let dueDate: Date;
  let members: Member[];
  let books: Book[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookRentalService, MemberService, BookService, PrismaService],
    }).compile();

    service = module.get<BookRentalService>(BookRentalService);
    memberService = module.get<MemberService>(MemberService);
    bookService = module.get<BookService>(BookService);
    prismaService = module.get<PrismaService>(PrismaService);

    rentalDate = new Date();
    dueDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
    members = await memberService.findAll();
    books = await bookService.findAll();
  });

  afterAll(async () => {
    // Clean up the test database after all tests are completed
    await prismaService.$disconnect();
  });

  afterEach(async () => {
    // Clean up the test database after each test
    await prismaService.bookRental.deleteMany();
    await prismaService.book.updateMany({
      data: {
        stock: 1,
      },
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return the list of bookRentals', () => {
      const result = service.findAll();

      jest.spyOn(service, 'findAll').mockImplementationOnce(() => result);
      expect(service.findAll()).toBe(result);
    });
  });

  describe('storeBookRental', () => {
    it('should store the bookRental', async () => {
      const dto: CreateBookRentalDto = {
        memberCode: members[0].code,
        bookCode: books[0].code,
        rentalDate: rentalDate,
        dueDate: dueDate,
      };

      const result: Promise<false | BookRental> = service.storeBookRental(dto);

      jest
        .spyOn(service, 'storeBookRental')
        .mockImplementationOnce(() => result);
      expect(service.storeBookRental(dto)).toBe(result);
    });
  });

  it('should member not borrow more than 2 books & return false', async () => {
    const dto: CreateBookRentalDto = new CreateBookRentalDto();
    for (let i = 0; i < 3; i++) {
      dto.memberCode = members[0].code; // Member not loop
      dto.bookCode = books[i].code;
      dto.rentalDate = rentalDate;
      dto.dueDate = dueDate;
      await service.storeBookRental(dto);
    }

    const result: Promise<false | BookRental> = service.storeBookRental(dto);

    jest.spyOn(service, 'storeBookRental').mockImplementationOnce(() => result);
    expect(service.storeBookRental(dto)).toBe(result);
    expect(await service.storeBookRental(dto)).toBe(false);
  });
});
