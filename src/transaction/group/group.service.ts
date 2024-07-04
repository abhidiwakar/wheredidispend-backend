import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Model, Types } from 'mongoose';
import { Group } from './schema/group.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)
    private groupModel: Model<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto, uid: string) {
    let groupName = createGroupDto.name;
    let checkCount = 0;
    let existingGroup = await this.groupModel.findOne({
      name: groupName,
      uid,
    });

    while (existingGroup) {
      checkCount++;
      groupName = `${createGroupDto.name} ${checkCount}`;
      existingGroup = await this.groupModel.findOne({
        name: groupName,
        uid,
      });
      console.log(groupName, existingGroup?.name, checkCount);
    }

    return this.groupModel.create({
      name: groupName,
      uid,
    });
  }

  findAll(uid: string, id?: string) {
    const match: Record<string, unknown> = {
      uid,
    };

    if (id) {
      match['_id'] = new Types.ObjectId(id);
    }

    return this.groupModel.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'group',
          as: 'transactions',
        },
      },
      {
        $addFields: {
          transactionCount: {
            $size: '$transactions',
          },
        },
      },
      {
        $project: {
          name: 1,
          createdAt: 1,
          updatedAt: 1,
          transactionCount: 1,
        },
      },
    ]);
  }

  async findOne(id: string, uid: string) {
    const result = await this.findAll(uid, id);

    return result?.[0];
  }

  update(id: string, updateGroupDto: UpdateGroupDto, uid: string) {
    return this.groupModel.findOneAndUpdate(
      {
        uid,
        _id: id,
      },
      updateGroupDto,
      {
        new: true,
      },
    );
  }

  async remove(id: string, uid: string) {
    return this.groupModel.findOneAndDelete({
      uid,
      _id: id,
    });
  }
}
