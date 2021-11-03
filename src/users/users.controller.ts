import { Controller, Post, Get, Put, Body, Query, Param, UseFilters, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) { }

  @Post('/login')
  async login(@Body() params) {
    let { username, password } = params;

    // check for tradingPartnerId
    if (!username || !password) {
      throw new HttpException('Username and password are required', HttpStatus.BAD_REQUEST);
    }

    return this.usersService.login({ username, password });
  }

  @Post('/register')
  async register(@Body() params) {
    let { username, email, password } = params;

    // check for tradingPartnerId
    if (!username || !email || !password) {
      throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
    }

    return this.usersService.register({ username, email, password });
  }

}