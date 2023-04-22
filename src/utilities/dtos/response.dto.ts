import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
export class ResponseBase {
    @Expose()
    @ApiProperty()
    succeeded: boolean;

    // using @Expose decorator with options to exclude null values when writing JSON
    @Expose({ toPlainOnly: true })
    @ApiProperty()
    message?: string;

    // using @Expose decorator with options to exclude default values when writing JSON
    @Expose({ toPlainOnly: true })
    @ApiProperty()
    errors?: string[];

    static failed(...errors: string[]): ResponseBase {
        return new ResponseGeneric({
            succeeded: false,
            message: errors?.[0],
            errors,
        });
    }

    static succeed(message: string): ResponseBase {
        return new ResponseGeneric({
            succeeded: true,
            message,
        });
    }

    constructor(data?: Partial<ResponseBase>) {
        Object.assign(this, data);
    }
}

export class ResponseGeneric<T> extends ResponseBase {
    // using @Expose decorator with options to exclude default values when writing JSON
    @Expose({ toPlainOnly: true })
    @ApiProperty()
    data?: T;

    constructor(data: T, message?: string) {
        super();
        this.succeeded = true;
        this.message = message;
        this.data = data;
    }
}
