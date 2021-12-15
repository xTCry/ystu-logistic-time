import React from 'react';
import { useSelector } from 'react-redux';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { experimentalStyled as styled } from '@mui/material/styles';

import { declOfNum } from '../utils';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const OperatorNumber = () => {
  const { workShifts, var_T } = useSelector((state) => state.work);

  const workShiftsData = React.useMemo(
    () =>
      workShifts
        .map((ws) => ({
          ...ws,
          operators: ws.operators.map((e) => ({
            ...e,
            avg: e.times.length === 0 ? null : Math.floor(e.times.reduce((a, b) => a + b, 0) / e.times.length),
          })),
        }))
        .map((ws) => ({
          ...ws,
          sum:
            ws.operators.length === 0
              ? null
              : Math.floor(ws.operators.reduce((a, b) => a + b.avg, 0) ),
        }))
        .flat(),
    [workShifts],
  );

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Сколько требуется операторов
      </Typography>
      <Grid container justifyContent="center" spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 12, md: 12 }}>
        {workShiftsData.map((ws) => {
          const avg = !ws.sum ? null : Math.max(1, Math.round(ws.sum / var_T));
          return (
            <Grid item xs={2} sm={4} md={3} key={ws.id}>
              <Item>
                <Typography component="h2" variant="h6" color="green">
                  <b>Смена №{ws.id}</b>
                </Typography>

                <pre style={{ margin: '3px' }}>{!ws.sum ? '-' : `${ws.sum} / ${var_T} ≈ ${avg}`}</pre>
                <Typography color="primary">
                  {!ws.sum ? '-' : `${avg} ${declOfNum(avg, ['оператор', 'оператора', 'операторов'])}`}
                </Typography>
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default OperatorNumber;
