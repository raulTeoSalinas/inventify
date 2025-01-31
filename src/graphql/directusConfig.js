import { ApolloClient, InMemoryCache, createHttpLink, from, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ENDPOINT } from "../constants/endpoints";
import { store } from "../store/store";
import { setTokens, clearTokens } from "../store/slices/authSlice";

// Sistema de auto-refresh
let refreshTimeout;

// Función para configurar el auto-refresh del token
const setupTokenRefresh = () => {
  // Limpiamos timeout existente si hay
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  const state = store.getState();
  const { expiresAt, refreshTokenExpiresAt } = state.auth;

  if (!expiresAt) return;

  const expirationTime = new Date(expiresAt).getTime();
  const currentTime = new Date().getTime();

  // 2 minutos antes de expirar
  const timeUntilRefresh = expirationTime - currentTime - (2 * 60 * 1000);

  if (timeUntilRefresh <= 0) {
    // Si ya estamos en la ventana de 2 minutos, refrescar inmediatamente
    refreshToken();
  } else {
    // Programar el próximo refresh
    refreshTimeout = setTimeout(() => {
      refreshToken();
    }, timeUntilRefresh);
  }
};

// Función para refrescar el token
const refreshToken = async () => {
  // Obtenemos el estado actual
  const state = store.getState();
  const { refresh_token, refreshTokenExpiresAt } = state.auth;

  // Verificamos si el refresh_token ha expirado
  if (!refresh_token || new Date(refreshTokenExpiresAt) <= new Date()) {
    store.dispatch(clearTokens());
    return null;
  }
  try {

    // Intentamos refrescar el token
    const response = await fetch(`${ENDPOINT.root}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refresh_token,
        mode: 'json'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    // Actualizamos los tokens en Redux
    store.dispatch(setTokens({
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token,
      expires: data.data.expires
    }));

    return data.data.access_token;
  } catch (error) {
    console.log(error.message)
    if (error.message === "Invalid user credentials.") {
      console.log("refresh_token", refresh_token)
      console.log("refreshTokenExpiresAt", refreshTokenExpiresAt)
      store.dispatch(clearTokens());

    }
    console.error('Error refreshing token:', error);
    return null;
  }
};


// HTTP Link
const httpLink = createHttpLink({
  uri: ENDPOINT.data,
});

const authLink = setContext((_, { headers }) => {
  // Simplemente tomamos el token actual del store
  const state = store.getState();
  const { access_token } = state.auth;

  return {
    headers: {
      ...headers,
      authorization: access_token ? `Bearer ${access_token}` : "",
    }
  };
});

// Error Link
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions?.code === 'TOKEN_EXPIRED') {
        // Retornamos un nuevo Observable
        return new Observable(observer => {
          // Intentamos refrescar el token
          refreshToken()
            .then(token => {
              if (!token) {
                observer.error(new Error('No token after refresh'));
                return;
              }

              // Actualizamos el contexto de la operación con el nuevo token
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${token}`,
                },
              });

              // Reintentamos la operación
              forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            })
            .catch(error => {
              observer.error(error);
            });
        });
      }
    }
  }
  return forward(operation);
});

// Combinar HTTP Links
const httpWithAuth = from([errorLink, authLink, httpLink]);

// Cliente Apollo principal
export const client = new ApolloClient({
  link: httpWithAuth,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

// Inicializar el sistema de auto-refresh
setupTokenRefresh();

// Suscribirse a cambios en el store para actualizar el auto-refresh
let lastExpiresAt = null;
store.subscribe(() => {
  const state = store.getState();
  if (state.auth.expiresAt && state.auth.expiresAt !== lastExpiresAt) {
    lastExpiresAt = state.auth.expiresAt;
    setupTokenRefresh();
  }
});