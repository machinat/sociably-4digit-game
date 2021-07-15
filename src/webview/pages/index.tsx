import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import WebviewClient, { useEventReducer } from '@machinat/webview/client';
import { MessengerClientAuthorizer } from '@machinat/messenger/webview';
import { TelegramClientAuthorizer } from '@machinat/telegram/webview';
import { LineClientAuthorizer } from '@machinat/line/webview';

const { publicRuntimeConfig } = getConfig();

const client = new WebviewClient(
  typeof window === 'undefined'
    ? { mockupMode: true, authorizers: [] }
    : {
        authorizers: [
          new MessengerClientAuthorizer({
            appId: publicRuntimeConfig.messengerAppId,
          }),
          new TelegramClientAuthorizer(),
          new LineClientAuthorizer({
            liffId: publicRuntimeConfig.lineLiffId,
          }),
        ],
      }
);

const WebAppHome = () => {
  const data = useEventReducer(
    client,
    (currentData: { hello?: string }, { event }): { hello?: string } => {
      if (event.type === 'hello') {
        return { hello: event.payload };
      }
      return currentData;
    },
    { hello: undefined }
  );

  const [isButtonTapped, setButtonTapped] = React.useState(false);

  const Button = ({ payload }) => (
    <button
      disabled={!client.isConnected}
      onClick={() => {
        client.send({ category: 'greeting', type: 'hello', payload });
        setButtonTapped(true);
      }}
    >
      {payload}
    </button>
  );

  return (
    <div>
      <Head>
        <title>Machinat Webview</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
        />
      </Head>

      <main>
        <h1>Hello In-Chat Webview!</h1>
        <p>
          Get started by editing <code>src/webview/pages/index.js</code>
        </p>

        <h3>{data.hello || 'connecting... '}</h3>
        <p>
          {isButtonTapped
            ? 'Great! Check the chatroom 👍'
            : client.isConnected
            ? 'Tap a button 👇'
            : ''}
        </p>
        <div>
          <Button payload="Foo" />
          <Button payload="Bar" />
        </div>
      </main>
    </div>
  );
};

// to activate publicRuntimeConfig
export const getServerSideProps = () => ({ props: {} });
export default WebAppHome;