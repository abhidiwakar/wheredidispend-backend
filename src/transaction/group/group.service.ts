import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Model } from 'mongoose';
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

  findAll(uid: string) {
    return this.groupModel.find({
      uid,
    });
  }

  findOne(id: string, uid: string) {
    return this.groupModel.findOne({
      uid,
      _id: id,
    });
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
