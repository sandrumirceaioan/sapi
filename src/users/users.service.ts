import { UnauthorizedException, Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.interface';
import * as CryptoJS from 'crypto-js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageCodeError } from '../../common/errors/error.module';

const ObjectId = Types.ObjectId;

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('user') private readonly userModel: Model<User>,
        private configService: ConfigService,
        private readonly jwtService: JwtService
    ) { }

    async login(params): Promise<any> {
        let encriptedPassword = this.encryptPassword(params.password);

        const user = await this.userModel.findOne({ username: params.username, password: encriptedPassword });
        if (!user) {
            throw new MessageCodeError('user:login:unauthorized');
        }
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        const token = this.jwtService.sign(payload);
        return { token, user };

    }

    async register(user: User): Promise<User> {
        user.password = this.encryptPassword(user.password);
        let newUser = new this.userModel(user);
        let response = newUser.save();
        return response;
    }

    private encryptPassword(password) {
        return CryptoJS.SHA256(password, this.configService.get('CRYPTOKEY')).toString();
    }

    async getAll(): Promise<User[]> {
        return await this.userModel.find();
    }

    async findOne(query: object): Promise<User> {
        return await this.userModel.findOne(query);
    }

}
