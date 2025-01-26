import { GameContextProvider } from '../context/GameContext';
import { AlertContextProvider } from '../context/alertContext';
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps: {session, ...pageProps}, }) {
  return (
    <SessionProvider session={session}>
      <GameContextProvider>
        <AlertContextProvider>
          <Component {...pageProps} />
        </AlertContextProvider>
      </GameContextProvider>
    </SessionProvider>
  );
}

export default MyApp;