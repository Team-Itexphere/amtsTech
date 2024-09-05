// Define the User interface (as given in the previous response)
interface User {
  com_name: string | null;
  com_to_inv: string | null;
  cp_name: string | null;
  cp_phone: string | null;
  created_at: string;
  email: string;
  email_list: string | null;
  email_verified_at: string | null;
  fac_id: number | null;
  fleet: string | null;
  id: number;
  name: string;
  own_email: string | null;
  own_name: string | null;
  phone: string;
  role: number;
  str_addr: string | null;
  str_phone: string | null;
  updated_at: string;
}

// Extend the Auth interface to include the user information
export interface Auth {
  token: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null; // Add the user property
}

// Set the initial state with an empty token, not authenticated, etc.
const initialState: Auth = {
  token: '',
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null, // No user data at initial state
};

// Auth reducer to manage authentication state changes
function authReducer(state = initialState, action: any): Auth {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload.token, // Assume the action payload contains a token
        user: action.payload.user, // Assume the action payload contains user data
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        error: action.payload,
        user: null, // Reset user data on failure
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        token: '',
        user: null, // Clear user data on logout
      };

    default:
      return state;
  }
}

export default authReducer;
