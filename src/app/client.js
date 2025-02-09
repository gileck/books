'use client'
import { useEffect } from 'react';

export function Client() {

  useEffect(() => {
    const tryToLogin = async () => {
      const user = await fetch(`/api/user`).then(res => res.json());
      console.log({ user });
      if (!user.username) {
        window.location.href = '/login';
      } else {
        window.location.href = '/home';
      }
    }
    tryToLogin();
  }, [])

  return <div></div>
}