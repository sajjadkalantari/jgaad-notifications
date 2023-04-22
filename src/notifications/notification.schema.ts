import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, validate: [validateNotifications, 'Invalid notifications'] })
  notifications: string[];
}

function validateNotifications(value: string[]) {
  // Add your validation logic here
  return Array.isArray(value) && value.length > 0;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
