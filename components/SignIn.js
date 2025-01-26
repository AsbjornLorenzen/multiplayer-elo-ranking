import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInBox() {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <>
          <h1>You are not signed in</h1>
          <button onClick={() => signIn("auth0")}>Sign in</button>
        </>
      ) : (
        <>
          <h1>Welcome, {session.user.name}</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}
