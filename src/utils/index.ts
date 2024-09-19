import { faker } from '@faker-js/faker';

export function randomType(): string {
  const types = ['sedan', 'hatchback', 'gruzavik', 'moto', 'hecaniv'];
  return types[Math.floor(Math.random() * types.length)];
}

export function randomModel(): string {
  return faker.vehicle.model();
}

export function randomGeo(): { latitude: number; longitude: number } {
  return {
    latitude: faker.location.latitude() || 0,
    longitude: faker.location.longitude() || 0,
  };
}

export function randomColor(): string {
  return faker.vehicle.color();
}
