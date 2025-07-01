import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "@/lib/axios";

interface UserProfile {
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "DEVELOPER";
  profile: {
    birthDate: string | null;
    gender: string | null;
    education: string | null;
    address: string | null;
    photoUrl: string | null;
    resumeUrl: string | null;
    skills: string[];
  } | null;
  certificates: {
    id: string;
    certificateUrl: string;
    verificationCode: string;
    issuedAt: string;
    expiresAt: string;
  }[];
  subscription?: {
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    type: "STANDARD" | "PROFESSIONAL";
    startDate: string;
    endDate: string;
  } | null;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

export const fetchUser = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>("auth/fetchUser", async (_, thunkAPI) => {
  try {
    const res = await API.get("/profile", {
      withCredentials: true,
    });
    return res.data.data as UserProfile;
  } catch (err) {
    return thunkAPI.rejectWithValue("Not authenticated");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await API.post("/auth/logout");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.user = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch user";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
