import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Workout } from '../modules/workouts/entities/workout.entity';
import { Exercise } from '../modules/exercises/entities/exercise.entity';
import { Goal } from '../modules/goals/entities/goal.entity';

async function resetDatabase() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || '151.243.218.59',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'r2d2pyx4*',
    database: process.env.DATABASE_NAME || 'zeni_wallet',
    entities: [User, Workout, Exercise, Goal],
    synchronize: false,
    ssl: false,
  });

  try {
    await dataSource.initialize();
    console.log('Connected to database');

    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.query('DROP TABLE IF EXISTS "workout_assigned_users" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "goals" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "workouts" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "exercises" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "users" CASCADE');

    console.log('All tables dropped. Run the application to recreate them.');

    await queryRunner.release();
    await dataSource.destroy();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

resetDatabase();
