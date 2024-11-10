// External Dependencies
import { useDispatch, useSelector } from 'react-redux'
// Internal Dependencies
import type { AppDispatch, RootState } from './store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

