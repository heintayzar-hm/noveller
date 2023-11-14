'use client';
import React, { createContext } from 'react';

// import useHashCookies from '@/hooks/useHashCookies/useHashCookies';

export const initialState = {
    token: null,
    user: null,
    loading: false,
    error: null,
    isLoggedIn: false,
}

export const providerValue = [initialState];
export const SessionContext = createContext(providerValue);

export const SessionContextProvider = (props : any) => {
    const state = {
        ...initialState,
        ...props.session,
    };
  return (
    <>
      <SessionContext.Provider value={[ state ]}>
        {props.children}
      </SessionContext.Provider>
    </>
  );
};
