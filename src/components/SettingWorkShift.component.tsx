import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, Theme } from '@mui/material/styles';

import workSlice from '../store/reducers/work/work.slice';

const getMenuItemStyle = (el: number, parent: readonly number[], theme: Theme) => ({
  fontWeight: parent.includes(el) ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
});

const SettingWorkShift = (props: { isOpen: boolean; handleClose: () => void }) => {
  const { isOpen, handleClose } = props;

  const dispatch = useDispatch();
  const workState = useSelector((state) => state.work);
  const { workShifts, workShiftStep } = workState;
  const operators = workShifts[workShiftStep]?.operators || [];

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const scroll: DialogProps['scroll'] = fullScreen ? 'paper' : 'body';

  const handleSave = React.useCallback(() => {
    // ? update operators (init)
    // dispatch(workSlice.actions.nextStep());
    handleClose();
  }, [handleClose]);

  const handleAddParent = React.useCallback(
    (id: number) => (event: SelectChangeEvent<number[]>) => {
      const { value } = event.target;
      const parentIds = typeof value === 'string' ? value.split(',').map(Number).filter(Boolean) : value;
      dispatch(workSlice.actions.updateParentOperators({ id, parentIds }));
    },
    [dispatch],
  );

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (isOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isOpen]);

  return (
    <Dialog scroll={scroll} fullScreen={fullScreen} open={isOpen} onClose={handleSave}>
      <DialogTitle>Настройка смены</DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        <DialogContentText>Выберите операторов для объединеиня</DialogContentText>
        <Box
          noValidate
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
            width: 'fit-content',
          }}
        >
          {operators.map((operator) => {
            const { id, parentIds } = operator;
            const blockedIds = Object.keys(
              operators
                .filter((e) => e.id !== id)
                .map((e) => e.parentIds)
                .flat()
                .reduce((prev, cur) => ({ ...prev, [cur]: 1 }), {}),
            ).map(Number);
            const isChild = blockedIds.includes(id);

            return (
              <FormControl key={id} sx={{ mt: 2, width: 260 }}>
                <InputLabel htmlFor={`s-op-${id}`}>Оператор {id}</InputLabel>
                <Select
                  disabled={isChild}
                  multiple
                  value={parentIds}
                  onChange={handleAddParent(id)}
                  label={`Оператор ${id}`}
                  id={`s-op-${id}`}
                  data-id={id}
                  input={<OutlinedInput label={`Оператор ${id}`} />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {operators
                    // .filter((e) => e.id !== id && !blockedIds.includes(e.id))
                    .map((e) => (
                      <MenuItem
                        key={e.id}
                        value={e.id}
                        style={getMenuItemStyle(e.id, parentIds, theme)}
                        disabled={e.id === id || blockedIds.includes(e.id)}
                      >
                        {e.id}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};
export default SettingWorkShift;
