import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class JobSnapshot extends Document {
  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  clientId: string;
}

export const JobSnapshotSchema = SchemaFactory.createForClass(JobSnapshot);
