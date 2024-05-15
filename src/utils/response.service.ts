import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class ResponseService {
  response(
    res: Response,
    message: string,
    data: any = {},
    status: number = 200,
  ) {
    return res.status(status).json({
      message,
      data,
    });
  }

  ok(res: Response, data: any = {}, message: string = 'Success') {
    return this.response(res, message, data, 200);
  }

  unathorized(res: Response, message: string) {
    return this.response(res, message, {}, 401);
  }

  simpleRes(data: any = {}, message: string = 'Success') {
    return {
      data,
      message,
    };
  }
}
