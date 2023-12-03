import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/common/enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const userExists = await this.userRepository.findOneBy({ email });

    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    const user = new User();
    Object.assign(user, createUserDto);
    user.roles = UserRoles.Admin;
    this.userRepository.create(user);
    return await this.userRepository.save(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email: loginUserDto.email })
      .getOne();

    if (
      user &&
      (await this.verifyPassword(loginUserDto.password, user.password))
    ) {
      const token = this.jwtService.sign({ id: user.id, email: user.email });
      delete user.password;
      return { user, token };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    return await this.userRepository.update(id, updateAuthDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
