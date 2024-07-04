import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { getModelToken } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schema/group.schema';

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getModelToken(Group.name),
          useValue: GroupSchema,
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
