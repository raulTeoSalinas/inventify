import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  expiresAt: string | null;
  refreshTokenExpiresAt: string | null;
}

interface SetTokensPayload {
  access_token: string;
  refresh_token: string;
  expires: string;
}

const initialState: AuthState = {
  access_token: null,
  refresh_token: null,
  expiresAt: null,
  refreshTokenExpiresAt: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<SetTokensPayload>) => {
      const { access_token, refresh_token, expires } = action.payload;

      // Para el access token (15 minutos)
      const expirationMs = parseInt(expires);
      const expiresAt = new Date(Date.now() + expirationMs).toISOString();

      // Para el refresh token (7 días)
      const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
      const refreshTokenExpiresAt = new Date(Date.now() + SEVEN_DAYS_IN_MS).toISOString();

      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.expiresAt = expiresAt;
      state.refreshTokenExpiresAt = refreshTokenExpiresAt;
    },
    clearTokens: (state) => {
      state.access_token = null;
      state.refresh_token = null;
      state.expiresAt = null;
      state.refreshTokenExpiresAt = null;
    }
  }
});

export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;