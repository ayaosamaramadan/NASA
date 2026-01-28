import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface mapState {
    MapUrl: string
}

const initialState: mapState = { MapUrl: 'moon' }

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setMapUrl(state, action: PayloadAction<string>) {
            state.MapUrl = action.payload
        },
    },
})

export const { setMapUrl } = mapSlice.actions
export default mapSlice.reducer
