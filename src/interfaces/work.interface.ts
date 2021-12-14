export interface IWork {
  workShiftCount: number;
  workShiftStep: number;
  totalOperatorsCount: number;
  workShifts: IWorkShift[];
}

export interface IWorkShift {
  id: number;
  operatorsCount: number;
  operators: IOperator[];
}

export interface IOperator {
  id: number;
  parentIds: number[];
  times: number[];
}
