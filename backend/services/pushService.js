const admin = require('firebase-admin');
const apn = require('apn');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

let apnProvider = null;
if (process.env.APNS_KEY_ID && process.env.APNS_TEAM_ID && process.env.APNS_KEY_PATH && process.env.APNS_BUNDLE_ID) {
  try {
    apnProvider = new apn.Provider({
      token: {
        key: fs.readFileSync(path.resolve(process.env.APNS_KEY_PATH)),
        keyId: process.env.APNS_KEY_ID,
        teamId: process.env.APNS_TEAM_ID,
      },
      production: process.env.NODE_ENV === 'production',
    });
  } catch (err) {
    console.error('Failed to initialize APNs provider', err);
  }
}

class PushService {
  async sendMessageNotification(toUserId, fromUserId, messageContent, unreadTotal, conversationId) {
    try {
      const toUser = await User.findById(toUserId);
      const fromUser = await User.findById(fromUserId);
      if (!toUser || !fromUser || !toUser.pushTokens || toUser.pushTokens.length === 0) {
        return;
      }
      const senderName = `${fromUser.firstName || ''} ${fromUser.lastName || ''}`.trim() || 'Someone';
      const truncated = messageContent.length > 100 ? messageContent.substring(0, 100) + '...' : messageContent;

      for (const tokenInfo of toUser.pushTokens) {
        if (tokenInfo.platform === 'android') {
          const payload = {
            token: tokenInfo.token,
            data: {
              title: senderName,
              body: truncated,
              senderId: fromUserId.toString(),
              senderName,
              type: 'message',
              conversation_id: conversationId.toString(),
              unread_total: unreadTotal.toString(),
            },
            android: {
              notification: {
                title: senderName,
                body: truncated,
              },
            },
          };
          try {
            await admin.messaging().send(payload);
          } catch (err) {
            console.error('Error sending FCM message', err);
          }
        } else if (tokenInfo.platform === 'ios' && apnProvider) {
          const note = new apn.Notification({
            alert: { title: senderName, body: truncated },
            badge: unreadTotal,
            sound: 'default',
            payload: {
              senderId: fromUserId.toString(),
              senderName,
              type: 'message',
              conversation_id: conversationId.toString(),
              unread_total: unreadTotal,
            },
          });
          note.topic = process.env.APNS_BUNDLE_ID;
          try {
            await apnProvider.send(note, tokenInfo.token);
          } catch (err) {
            console.error('Error sending APNs message', err);
          }
        }
      }
    } catch (err) {

    }
  }
}

module.exports = new PushService();
