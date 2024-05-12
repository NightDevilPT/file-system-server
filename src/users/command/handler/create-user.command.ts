import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider, User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

export class CreateUserCommand {
  constructor(public readonly payload: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute({ payload }: CreateUserCommand) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (existingUser) {
      throw new ConflictException('User already exists with that email');
    }

    const newUser = new User();
    newUser.username = payload.username;
    newUser.email = payload.email;
    newUser.password = payload.password;
    if (payload.provider) {
      newUser.provider = (payload.provider as unknown) as Provider || Provider.Local;
    }

    return this.userRepository.save(newUser);
  }
}
