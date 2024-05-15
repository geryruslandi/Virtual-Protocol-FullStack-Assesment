import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
  interests: string[];

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
