import { MatchCandidate } from '@libs/database/models/match-candidate';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true })
export class User extends Model {
  @Column
  name: string;

  @Column
  gender: string;

  @Column
  username: string;

  @Column
  password: string;

  @Column
  location: string;

  @Column
  university: string;

  @Column(DataType.ARRAY(DataType.STRING))
  interests: string[]

  getOppositeGender() {
    return this.gender === 'male' ? 'female' : 'male';
  }

  @HasMany(() => MatchCandidate, 'user_id')
  matchCandidates!: MatchCandidate[];

  @HasMany(() => MatchCandidate, 'candidate_id')
  pickedAsCandidates!: MatchCandidate[];

  toJSON() {
    return {
      name: this.name,
      gender: this.gender,
      username: this.username,
      location: this.location,
      university: this.university,
      interests: this.interests,
    };
  }
}
