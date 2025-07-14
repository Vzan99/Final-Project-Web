import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "@/lib/axios";
import { Experience } from "@/types/userprofile";

interface Company {
  id: string;
  description: string;
  location: string;
  logo?: string | null;
  bannerUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  foundedYear?: number | null;
  adminId?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN" | "DEVELOPER";
  isVerified: boolean;
  profile?: {
    birthDate: string | null;
    gender: string | null;
    education: string | null;
    address: string | null;
    photoUrl: string | null;
    bannerUrl?: string | null;
    resumeUrl: string | null;
    skills: string[];
    about: string | null;
    experiences?: Experience[] | null;
  } | null;
  company?: Company | null;
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
  };
  assessments?: {
    id: string;
    badge: string;
    assessment: {
      name: string;
    };
  }[];
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  isHydrated: false,
};

export const fetchUser = createAsyncThunk<
  UserProfile | null,
  void,
  { rejectValue: string }
>("auth/fetchUser", async (_, thunkAPI) => {
  try {
    const res = await API.get("/profile", { withCredentials: true });
    return res.data.data as UserProfile;
  } catch (err: any) {
    if (err.response?.status === 401) {
      return null;
    }
    return thunkAPI.rejectWithValue("Failed to fetch user");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await API.post("/auth/logout", {}, { withCredentials: true });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.isHydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isHydrated = false;
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<UserProfile | null>) => {
          state.user = action.payload ?? null;
          state.loading = false;
          state.error = null;
          state.isHydrated = true;
        }
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
        state.isHydrated = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
        state.isHydrated = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
