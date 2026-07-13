export class Task {
  id!: number;
  title!: string;
  completed!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  description?: string;
}
