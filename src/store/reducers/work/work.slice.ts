import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWork, IOperator } from '../../../interfaces/work.interface';

const initialState: IWork = {
  totalOperatorsCount: 10,
  workShiftCount: 3,
  workShiftStep: 0,
  workShifts: [],
};

export const workSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {
    setWorkShiftCount: (state, action: PayloadAction<IWork['workShiftCount']>) => {
      state.workShiftCount = action.payload;
    },
    setTotalOperatorsCount: (state, action: PayloadAction<IWork['totalOperatorsCount']>) => {
      state.totalOperatorsCount = action.payload;
    },
    setOperatorsCount: (state, action: PayloadAction<{ count: number; step?: number }>) => {
      state.workShifts[action.payload.step ?? state.workShiftStep].operatorsCount = action.payload.count;
    },
    initOperators: (state, action: PayloadAction<{ operators: IOperator[]; step?: number }>) => {
      const workShift = state.workShifts[action.payload.step ?? state.workShiftStep];
      workShift.operatorsCount = action.payload.operators.length;
      workShift.operators = [...action.payload.operators];
    },
    updateParentOperators: (state, action: PayloadAction<{ id: number; parentIds: number[]; step?: number }>) => {
      const { operators } = state.workShifts[state.workShiftStep];
      let operatorIndex = operators.findIndex((e) => e.id === action.payload.id);

      if (operatorIndex === -1) {
        operatorIndex = operators.push({ id: action.payload.id, parentIds: [], times: [] });
        --operatorIndex;
      }

      operators[operatorIndex].parentIds = action.payload.parentIds;
    },
    nextStep: (state) => {
      if (state.workShiftStep < state.workShifts.length - 1) ++state.workShiftStep;
    },
    prevStep: (state) => {
      if (state.workShiftStep > 0) --state.workShiftStep;
    },
    onSaveTimer: (state, action: PayloadAction<{ id: number; timer: number }>) => {
      const { operators } = state.workShifts[state.workShiftStep];
      let operatorIndex = operators.findIndex((e) => e.id === action.payload.id);
      if (operatorIndex === -1) {
        operatorIndex = operators.push({ id: action.payload.id, parentIds: [], times: [] });
        --operatorIndex;
      }

      operators[operatorIndex].times.push(action.payload.timer);
    },
    handleResetTimes: (state) => {
      // state.workShifts[state.workShiftStep].operators = [];
      for (const op of state.workShifts[state.workShiftStep].operators) {
        op.times = [];
      }
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
            operatorsCount: 0,
          })),
        ];
      }
    },
    updateWorkShiftOperators: (state) => {
      const { operators, operatorsCount } = state.workShifts[state.workShiftStep];

      if (operators.length > operatorsCount) {
        operators.splice(operatorsCount - operators.length);
      }
      // only first step
      else if (operators.length < operatorsCount && state.workShiftStep === 0) {
        state.workShifts[state.workShiftStep].operators = [
          ...operators,
          ...Array.from(Array(operatorsCount - operators.length)).map((_, index) => ({
            id: operators.length + index + 1,
            parentIds: [],
            times: [],
          })),
        ];
      }
    },
  },
});

export default workSlice;
