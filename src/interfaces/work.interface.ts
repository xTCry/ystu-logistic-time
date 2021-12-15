export interface IWork {
  var_T: number;
  workShiftStep: number;
  workShiftCount: number;
  totalOperatorsCount: number;
  workShifts: IWorkShift[];
}

export interface IWorkShift {
  id: number;
  operators: IOperator[];
}

export interface IOperator {
  id: number;
  parentIds: number[];
  times: number[];
}
