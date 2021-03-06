import Sociably from '@sociably/core';
import GameLoop from '../scenes/GameLoop';
import { ChatEventContext } from '../types';

const handlePostback = async ({
  event,
  reply,
}: ChatEventContext & {
  event: { type: 'postback' | 'callback_query' };
}) => {
  const action = JSON.parse(event.data!);
  if (!event.channel) {
    return;
  }

  if (action.type === 'start') {
    return reply(<GameLoop.Start />);
  }
};

export default handlePostback;
