import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  // user modelini inject et
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Kullanıcıyı oluştur
  async create(dto: CreateUserDto) {
    const newUser = new this.userModel(dto);

    const user = await newUser.save();

    return user.toObject();
  }

  //  bütün kullanıcıları getir
  async findAll() {
    const users = await this.userModel.find();

    return users.map((user) => user.toObject());
  }

  // belirli bir kullanıcıyı getir
  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user.toObject();
  }
  // belirli bir kullanıcıyı getir
  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user.toObject();
  }
  //  bir kullanıcıyı güncelle
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, dto, { new: true });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user.toObject();
  }

  //    bir kullanıcıyı sil
  async delete(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user.toObject();
  }
}
