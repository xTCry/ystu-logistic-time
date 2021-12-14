import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';

import workSlice from './reducers/work/work.slice';

export const reducer = combineReducers({
  work: workSlice.reducer,
});

export type RootState = ReturnType<typeof reducer>;

declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
}

export const history = createBrowserHistory();

export default configureStore({ reducer });
