import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Workout } from '../modules/workouts/entities/workout.entity';
import { Exercise } from '../modules/exercises/entities/exercise.entity';
import { Goal } from '../modules/goals/entities/goal.entity';

async function resetDatabase() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, Workout, Exercise, Goal],
    synchronize: false,
    ssl: false,
  });

  try {
    await dataSource.initialize();
    console.log('Connected to database');

    const queryRunner = dataSource.createQueryRunner();

    // Only drop sports-specific tables. Never drop "users" — it is shared with the wallet backend.
    await queryRunner.query('DROP TABLE IF EXISTS "workout_assigned_users" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "goals" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "workouts" CASCADE');
    await queryRunner.query('DROP TABLE IF EXISTS "exercises" CASCADE');

    console.log('All tables dropped. Run the application to recreate them.');

    await queryRunner.release();
    await dataSource.destroy();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

resetDatabase();
