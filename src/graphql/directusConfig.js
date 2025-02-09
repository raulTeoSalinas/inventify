import { ApolloClient, InMemoryCache, createHttpLink, from, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ENDPOINT } from "../constants/endpoints";
import { store } from "../store/store";
import { setTokens, clearTokens } from "../store/slices/authSlice";

// Sistema de auto-refresh
let refreshTimeout;


export const setupTokenRefresh = () => {
  // Verificar si el store está hidratado
  if (!store.getState()._persist?.rehydrated) {
    console.log('Esperando hidratación del estado...');

    // Escuchar el evento de hidratación
    const unsubscribe = store.subscribe(() => {
      if (store.getState()._persist?.rehydrated) {
        console.log('Estado hidratado, configurando refresh...');
        unsubscribe();
        configureRefresh();
      }
    });
    return;
  }

  // Si ya está hidratado, configurar directamente
  configureRefresh();
};

// Función para configurar el auto-refresh del token
const configureRefresh = () => {
  // Limpiar timeout existente
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  const state = store.getState();
  const { expiresAt } = state.auth;

  if (!expiresAt) return;

  const expirationTime = new Date(expiresAt).getTime();
  const currentTime = new Date().getTime();
  const timeToExpiration = expirationTime - currentTime;

  // Refrescar token 30 segundos antes de que expire
  const REFRESH_BEFORE_EXPIRATION = 30 * 1000; // 30 segundos

  if (timeToExpiration > REFRESH_BEFORE_EXPIRATION) {
    const refreshAt = timeToExpiration - REFRESH_BEFORE_EXPIRATION;

    refreshTimeout = setTimeout(() => {
      console.log('Ejecutando refresh programado');
      refreshToken();
    }, refreshAt);

    console.log(`Token refresh programado para ${new Date(currentTime + refreshAt).toISOString()}`);
  } else {
    refreshToken()
    console.log("Token refresh inmediato")
  }
};

// Función para refrescar el token
const refreshToken = async (retryCount = 0) => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 1000;

  const state = store.getState();
  const { refresh_token, refreshTokenExpiresAt } = state.auth;
  // Verificamos si el refresh_token ha expirado
  if (!refresh_token || new Date(refreshTokenExpiresAt) <= new Date()) {
    store.dispatch(clearTokens());
    return null;
  }


  try {
    const response = await fetch(`${ENDPOINT.root}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token,
        mode: 'json'
      })
    });

    // Log completo de la respuesta
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.errors?.[0]?.message;

      // Si es error de credenciales, no reintentamos
      if (errorMessage === "Invalid user credentials.") {
        store.dispatch(clearTokens());
        throw new Error(errorMessage);
      }

      // Solo reintentamos si no es error de credenciales
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return refreshToken(retryCount + 1);
      }

      throw new Error('Failed to refresh token after maximum retries');
    }

    store.dispatch(setTokens({
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token,
      expires: data.data.expires
    }));

    // Programar siguiente refresh
    setupTokenRefresh();

    return data.data.access_token;
  } catch (error) {
    console.error('Refresh Error:', {
      message: error.message,
      retryCount,
      refresh_token: refresh_token ? 'present' : 'missing',
      refreshTokenExpiresAt
    });

    throw error;
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
  // if (graphQLErrors) {
  //   for (let err of graphQLErrors) {
  //     if (err.extensions?.code === 'TOKEN_EXPIRED') {
  //       // Retornamos un nuevo Observable
  //       return new Observable(observer => {
  //         // Intentamos refrescar el token
  //         // refreshToken()
  //         //   .then(token => {
  //         //     if (!token) {
  //         //       observer.error(new Error('No token after refresh'));
  //         //       return;
  //         //     }

  //         //     // Actualizamos el contexto de la operación con el nuevo token
  //         //     const oldHeaders = operation.getContext().headers;
  //         //     operation.setContext({
  //         //       headers: {
  //         //         ...oldHeaders,
  //         //         authorization: `Bearer ${token}`,
  //         //       },
  //         //     });

  //         //     // Reintentamos la operación
  //         //     forward(operation).subscribe({
  //         //       next: observer.next.bind(observer),
  //         //       error: observer.error.bind(observer),
  //         //       complete: observer.complete.bind(observer),
  //         //     });
  //         //   })
  //         //   .catch(error => {
  //         //     observer.error(error);
  //         //   });
  //       });
  //     }
  //   }
  // }
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