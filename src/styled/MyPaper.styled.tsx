import Paper from '@mui/material/Paper';
import { experimentalStyled as styled } from '@mui/material/styles';

export const MyPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(2),
  margin: theme.spacing?.(1),
}));
