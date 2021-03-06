import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import store2 from 'store2';
import { IWork, IOperator } from '../../../interfaces/work.interface';

const STORE2_KEY = 'STATE_work';
const save2 = (state) => store2.set(STORE2_KEY, state);

const initialState: IWork = {
  var_T: 120,
  totalOperatorsCount: 10,
  workShiftCount: 3,
  workShiftStep: 0,
  workShifts: [],
};

export const workSlice = createSlice({
  name: 'work',
  initialState: (store2.get(STORE2_KEY) || initialState) as IWork,
  reducers: {
    resetAll: (state) => {
      for (let key of Object.keys(initialState)) {
        state[key] = initialState[key];
      }
      save2(state);
    },
    setVar_T: (state, action: PayloadAction<number>) => {
      state.var_T = action.payload;
      save2(state);
    },
    setWorkShiftCount: (state, action: PayloadAction<IWork['workShiftCount']>) => {
      state.workShiftCount = action.payload;
      save2(state);
    },
    setTotalOperatorsCount: (state, action: PayloadAction<IWork['totalOperatorsCount']>) => {
      state.totalOperatorsCount = action.payload;
      save2(state);
    },
    initOperators: (state, action: PayloadAction<{ operators: IOperator[]; step?: number }>) => {
      const workShift = state.workShifts[action.payload.step ?? state.workShiftStep];
      workShift.operators = [...action.payload.operators];
      save2(state);
    },
    updateParentOperators: (state, action: PayloadAction<{ id: number; parentIds: number[]; step?: number }>) => {
      const { operators } = state.workShifts[state.workShiftStep];
      let operatorIndex = operators.findIndex((e) => e.id === action.payload.id);

      if (operatorIndex === -1) {
        operatorIndex = operators.push({ id: action.payload.id, parentIds: [], times: [] });
        --operatorIndex;
      }

      operators[operatorIndex].parentIds = action.payload.parentIds;
      save2(state);
    },
    nextStep: (state) => {
      if (state.workShiftStep < state.workShifts.length - 1) ++state.workShiftStep;
      save2(state);
    },
    prevStep: (state) => {
      if (state.workShiftStep > 0) --state.workShiftStep;
      save2(state);
    },
    onSaveTimer: (state, action: PayloadAction<{ id: number; timer: number }>) => {
      const { operators } = state.workShifts[state.workShiftStep];
      let operatorIndex = operators.findIndex((e) => e.id === action.payload.id);
      if (operatorIndex === -1) {
        operatorIndex = operators.push({ id: action.payload.id, parentIds: [], times: [] });
        --operatorIndex;
      }

      operators[operatorIndex].times.push(action.payload.timer);
      save2(state);
    },
    handleResetTimes: (state) => {
      for (const op of state.workShifts[state.workShiftStep].operators) {
        op.times = [];
      }
      save2(state);
    },
    handleResetTimesById: (state, action: PayloadAction<{ id: number }>) => {
      const { operators } = state.workShifts[state.workShiftStep];
      let operatorIndex = operators.findIndex((e) => e.id === action.payload.id);
      if (operatorIndex !== -1) {
        operators[operatorIndex].times.splice(-1, 1);
      }
      save2(state);
    },
    updateWorkShifts: (state) => {
      if (state.workShifts.length > state.workShiftCount) {
        state.workShifts.splice(state.workShiftCount - state.workShifts.length);
      } else if (state.workShifts.length < state.workShiftCount) {
        state.workShifts = [
          ...state.workShifts,
          ...Array.from(Array(state.workShiftCount - state.workShifts.length)).map((_, index) => ({
            id: state.workShifts.length + index + 1,
            operators: [],
          })),
        ];
      }
      save2(state);
    },
    updateWorkShiftOperators: (state) => {
      const { totalOperatorsCount } = state;

      for (const ws of state.workShifts) {
        const { operators } = ws;
        if (!operators) return;

        if (operators.length > totalOperatorsCount) {
          operators.splice(totalOperatorsCount - operators.length);
          for (const op of operators) {
            op.parentIds = op.parentIds.filter((e) => e <= totalOperatorsCount);
          }
        }
        // // only first step
        else if (operators.length < totalOperatorsCount /*&& state.workShiftStep === 0 */) {
          ws.operators = [
            ...operators,
            ...Array.from(Array(totalOperatorsCount - operators.length)).map((_, index) => ({
              id: operators.length + index + 1,
              parentIds: [],
              times: [],
            })),
          ];
        }
      }

      save2(state);
    },
  },
});

export default workSlice;
