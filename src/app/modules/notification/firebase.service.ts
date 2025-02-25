import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  MultipleDeviceNotificationDto,
  NotificationDto,
  TopicNotificationDto,
} from './dto/dto';
import { AllConfigType } from 'src/app/config/types/config.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get('app.firebaseProjectId', {
          infer: true,
        }),
        clientEmail: this.configService.get('app.firebaseClientEmail', {
          infer: true,
        }),
        privateKey: this.configService.get('app.firebasePrivateKey', {
          infer: true,
        }),
      }),
    });
  }

  async subscribeToTopic({ token, topic }: { token: string; topic: string }) {
    try {
      await admin.messaging().subscribeToTopic(token, topic);
      return { success: true };
    } catch (error) {
      console.log('Error subscribing to topic:', error);
      return { success: false };
    }
  }

  async unsubscribeFromTopic({
    token,
    topic,
  }: {
    token: string;
    topic: string;
  }) {
    try {
      await admin.messaging().unsubscribeFromTopic(token, topic);
      return { success: true };
    } catch (error) {
      console.log('Error unsubscribing from topic:', error);
      return { success: false };
    }
  }

  async sendNotification({ token, title, body, icon }: NotificationDto) {
    try {
      const response = await admin.messaging().send({
        token,
        webpush: {
          notification: {
            title,
            body,
            icon,
          },
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async sendNotificationToMultipleTokens({
    tokens,
    title,
    body,
    icon,
  }: MultipleDeviceNotificationDto) {
    const message = {
      notification: {
        title,
        body,
        icon,
      },
      tokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log('Successfully sent messages:', response);
      return {
        success: true,
      };
    } catch (error) {
      console.log('Error sending messages:', error);
      return { success: false };
    }
  }

  async sendTopicNotification({
    topic,
    title,
    body,
    icon,
  }: TopicNotificationDto) {
    try {
      const response = await admin.messaging().send({
        notification: {
          title,
          body,
        },
        data: {
          title,
          body,
        },
        android: {
          priority: 'high',
          notification: {
            title,
            body,
            icon,
          },
        },
        webpush: {
          notification: {
            title,
            body,
            icon,
          },
        },
        apns: {
          payload: {
            aps: {
              contentAvailable: true,
            },
          },
        },
        topic,
      });
      console.log('🚀 ~ FirebaseService ~ response:', response);
      return { success: true };
    } catch (error) {
      console.log('Error sending message:', error);
      return { success: false };
    }
  }
}
