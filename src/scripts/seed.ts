import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { ExercisesService } from '../modules/exercises/exercises.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const exercisesService = app.get(ExercisesService);

  try {
    console.log('Starting seed...');

    const hashedPasswordTrainer = await bcrypt.hash('trainer123', 10);
    const hashedPasswordAthlete = await bcrypt.hash('athlete123', 10);

    const trainer = await usersService.create({
      name: 'Coach Johnson',
      email: 'trainer@gmail.com',
      password: hashedPasswordTrainer,
      role: 'trainer',
      bio: 'Treinador certificado com 10 anos de experiência',
    });

    const athlete = await usersService.create({
      name: 'Alex Thompson',
      email: 'athlete@gmail.com',
      password: hashedPasswordAthlete,
      role: 'athlete',
      bio: 'Atleta dedicado focado em força e condicionamento',
      weight: 75,
      height: 180,
      age: 28,
    });

    console.log('Users created:', { trainer: trainer.email, athlete: athlete.email });

    const exercises = [
      {
        name: 'Supino Reto',
        description: 'Exercício composto para peitorais, tríceps e ombros',
        category: 'Força',
        difficulty: 'intermediate',
        muscleGroups: ['Peitoral', 'Tríceps', 'Ombros'],
        equipment: 'Barra',
        instructions: [
          'Deite-se no banco com os pés firmes no chão',
          'Segure a barra com pegada um pouco mais larga que os ombros',
          'Baixe a barra controladamente até o peito',
          'Empurre a barra de volta à posição inicial',
        ],
        tips: ['Mantenha os cotovelos a 45 graus', 'Não arqueie excessivamente as costas'],
        isCustom: false,
      },
      {
        name: 'Agachamento Livre',
        description: 'Exercício fundamental para desenvolvimento de pernas',
        category: 'Força',
        difficulty: 'advanced',
        muscleGroups: ['Quadríceps', 'Glúteos', 'Isquiotibiais'],
        equipment: 'Barra',
        instructions: [
          'Posicione a barra nas costas, trapézio superior',
          'Pés na largura dos ombros',
          'Desça controladamente até as coxas ficarem paralelas ao chão',
          'Retorne à posição inicial empurrando pelos calcanhares',
        ],
        tips: ['Mantenha o core contraído', 'Joelhos alinhados com os pés'],
        isCustom: false,
      },
      {
        name: 'Levantamento Terra',
        description: 'Exercício completo para posterior da cadeia',
        category: 'Força',
        difficulty: 'advanced',
        muscleGroups: ['Lombar', 'Glúteos', 'Isquiotibiais', 'Trapézio'],
        equipment: 'Barra',
        instructions: [
          'Fique em pé com a barra próxima às canelas',
          'Flexione os quadris e joelhos para segurar a barra',
          'Mantenha as costas retas e levante a barra estendendo quadris e joelhos',
          'Abaixe a barra controladamente',
        ],
        tips: ['Não arredonde as costas', 'Olhe para frente durante o movimento'],
        isCustom: false,
      },
      {
        name: 'Desenvolvimento com Halteres',
        description: 'Exercício para ombros e tríceps',
        category: 'Força',
        difficulty: 'intermediate',
        muscleGroups: ['Ombros', 'Tríceps'],
        equipment: 'Halteres',
        instructions: [
          'Sente-se com as costas apoiadas',
          'Segure os halteres na altura dos ombros',
          'Empurre os halteres acima da cabeça',
          'Retorne controladamente à posição inicial',
        ],
        tips: ['Não travar os cotovelos completamente', 'Controle o movimento na descida'],
        isCustom: false,
      },
      {
        name: 'Remada Curvada',
        description: 'Exercício para desenvolvimento das costas',
        category: 'Força',
        difficulty: 'intermediate',
        muscleGroups: ['Dorsais', 'Trapézio', 'Bíceps'],
        equipment: 'Barra',
        instructions: [
          'Incline o tronco para frente mantendo as costas retas',
          'Segure a barra com pegada pronada',
          'Puxe a barra em direção ao abdômen',
          'Controle a descida da barra',
        ],
        tips: ['Mantenha os cotovelos próximos ao corpo', 'Não use impulso'],
        isCustom: false,
      },
      {
        name: 'Corrida',
        description: 'Exercício cardiovascular completo',
        category: 'Cardio',
        difficulty: 'beginner',
        muscleGroups: ['Pernas', 'Core'],
        equipment: 'Nenhum',
        instructions: [
          'Aqueça com caminhada leve por 5 minutos',
          'Mantenha postura ereta durante a corrida',
          'Alterne entre ritmos moderado e intenso',
          'Finalize com caminhada para desacelerar',
        ],
        tips: ['Use tênis adequados', 'Hidrate-se antes e depois'],
        isCustom: false,
      },
      {
        name: 'Burpees',
        description: 'Exercício de corpo inteiro de alta intensidade',
        category: 'HIIT',
        difficulty: 'intermediate',
        muscleGroups: ['Corpo inteiro'],
        equipment: 'Nenhum',
        instructions: [
          'Comece em pé',
          'Agache e coloque as mãos no chão',
          'Jogue os pés para trás em posição de prancha',
          'Faça uma flexão',
          'Traga os pés de volta e salte',
        ],
        tips: ['Mantenha o core contraído', 'Controle o movimento'],
        isCustom: false,
      },
      {
        name: 'Prancha Abdominal',
        description: 'Exercício isométrico para core',
        category: 'Core',
        difficulty: 'beginner',
        muscleGroups: ['Abdômen', 'Lombar'],
        equipment: 'Nenhum',
        instructions: [
          'Apoie-se nos antebraços e pontas dos pés',
          'Mantenha o corpo em linha reta',
          'Contraia o abdômen',
          'Segure a posição pelo tempo determinado',
        ],
        tips: ['Não deixe os quadris caírem', 'Respire normalmente'],
        isCustom: false,
      },
    ];

    for (const exercise of exercises) {
      await exercisesService.create(exercise);
    }

    console.log(`${exercises.length} exercises created`);
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();