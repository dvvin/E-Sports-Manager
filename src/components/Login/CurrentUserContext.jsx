import { createContext } from "react";

// this is the context that will be used to store the current user
export const UserContextTest = createContext({
    currentUser: 'null',
    setCurrentUser: () => {}
  });
