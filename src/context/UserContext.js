import { inject } from "vue";

export const UserContext = Symbol("UserContext");

export function useUserContext() {
  const context = inject(UserContext);
  if (!context) {
    throw new Error("User context is not available.");
  }
  return context;
}

export default UserContext;
