import { Test, TestingModule } from '@nestjs/testing';
import { WeatherRecordResolver } from './weather-record.resolver';

describe('WeatherRecordResolver', () => {
  let resolver: WeatherRecordResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherRecordResolver],
    }).compile();

    resolver = module.get<WeatherRecordResolver>(WeatherRecordResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
