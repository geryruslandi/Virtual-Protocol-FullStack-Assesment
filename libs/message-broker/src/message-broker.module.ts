import { DynamicModule, Module } from '@nestjs/common';
import { MessageBrokerService } from './message-broker.service';
import { AppConfigModule, AppConfigService } from '@libs/app-config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [AppConfigModule],
  providers: [MessageBrokerService],
  exports: [MessageBrokerService],
})
export class MessageBrokerModule {
  static register(service: string, queue: string): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (configService: AppConfigService) => {
          const USER = configService.get('RABBITMQ_USER');
          const PASSWORD = configService.get('RABBITMQ_PASS');
          const HOST = configService.get('RABBITMQ_HOST');

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              queue,
              queueOptions: {
                durable: true, // queue survives broker restart
              },
            },
          });
        },
        inject: [AppConfigService],
      },
    ];

    return {
      module: MessageBrokerModule,
      providers,
      exports: providers,
    };
  }
}
