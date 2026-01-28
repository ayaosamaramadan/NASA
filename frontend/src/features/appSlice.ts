import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  sunclicked: boolean
  NASAsunImageUrl: string | null
  selectedPlanet: boolean | string

  clickedPlanet: boolean
  NASAplanetImages: Record<string, string>
  isLoading: boolean
}

const initialState: AppState = {
  sunclicked: false,
  NASAsunImageUrl: null,
  selectedPlanet: false || '',
  clickedPlanet: false,
  NASAplanetImages: {}, 
  isLoading: true,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSunClicked(state, action: PayloadAction<boolean>) {
      state.sunclicked = action.payload
    },
    setNASASunImageUrl(state, action: PayloadAction<string | null>) {
      state.NASAsunImageUrl = action.payload
    },
    setSelectedPlanet(state, action: PayloadAction<boolean | string>) {
      state.selectedPlanet = action.payload
    },
    setClickedPlanet(state, action: PayloadAction<boolean>) {
      state.clickedPlanet = action.payload
    },
    setNASAPlanetImages(state, action: PayloadAction<Record<string, string>>) {
      state.NASAplanetImages = action.payload
    },
    updateNASAPlanetImage(state, action: PayloadAction<{ name: string; url: string }>) {
      state.NASAplanetImages = { ...state.NASAplanetImages, [action.payload.name]: action.payload.url }
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
  },
})

export const {
  setSunClicked,
  setNASASunImageUrl,
  setSelectedPlanet,
  setClickedPlanet,
  setNASAPlanetImages,
  updateNASAPlanetImage,
  setIsLoading,
} = appSlice.actions

export default appSlice.reducer
