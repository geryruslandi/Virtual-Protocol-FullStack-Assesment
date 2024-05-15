import { User } from '@src/models/user.model';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({ underscored: true })
export class MatchCandidate extends Model {
  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @ForeignKey(() => User)
  @Column
  candidate_id!: number;

  @Column
  date!: string;

  @Column
  score!: number;

  @Column
  status!: string;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => User)
  candidate!: User;
}
