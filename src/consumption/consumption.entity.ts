import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MeasureType } from "../common/data-types";

@Entity()
export default class ConsumptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public measure_datetime: Date;

  @Column({ type: "enum", enum: MeasureType })
  public measure_type: MeasureType;

  @Column({ type: "int" })
  public measure_value: number;

  @Column({ type: "uuid" })
  public customer_code: string;

  @Column({ type: "varchar" })
  public attachment: string;

  @Column({ type: "timestamp", nullable: true })
  public confirmed_at?: Date;
}
