import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AuthenticationResponse, UserDto } from './user.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { InvalidRequestException, NotFoundException } from 'src/utilities/dtos/global-exception.filter';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService
    ) { }

    async loginUser(data: UserDto): Promise<AuthenticationResponse> {
        let userDto = plainToClass(UserDto, data);
        const errors = await validate(userDto);

        if (errors.length > 0)
            throw new InvalidRequestException(`invalid request`, errors);

        var user = await this.userModel.findOne({ email: data.email }).lean().exec();

        if (!user) throw new NotFoundException("user not found");
        
        if (!(await bcrypt.compare(data.password, user.password))) throw new NotFoundException(`user not found`);

        return await this.generateToken(data);

    }

    async registerUser(createUserDto: UserDto): Promise<AuthenticationResponse> {
        let userDto = plainToClass(UserDto, createUserDto);
        const errors = await validate(userDto);

        if (errors.length > 0)
            throw new InvalidRequestException(`invalid request`, errors);

        userDto.password = await this.hashPass(userDto.password);
        const userDoc = await this.userModel.create(userDto);

        if (!userDoc)
            throw new Error(`invalid request`);

        return await this.generateToken(userDto);
    }

    private async generateToken(user: UserDto): Promise<AuthenticationResponse> {
        delete user.password;
        const accessToken = this.jwtService.sign({ email: user.email });

        let response = plainToClass(AuthenticationResponse, user);
        response.accessToken = accessToken;
        response.expiresIn = 60;

        return response;
    }

    private async hashPass(password: string): Promise<string> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        return hashedPassword;
    }

}
