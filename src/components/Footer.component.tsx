import preval from 'preval.macro';
import { FormattedDate } from 'react-intl';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import { version as appVersion } from '../../package.json';

const buildTimestamp: number = preval`module.exports = Date.now();`;

const VersionComponent = () => (
  <>
    {appVersion}
    {'-T'}
    {String(buildTimestamp).slice(-10)} {'('}
    <FormattedDate day="2-digit" hour="2-digit" minute="2-digit" value={new Date(buildTimestamp)} />
    {')'}
  </>
);

const Footer = () => (
  <Typography variant="body2" color="textSecondary" align="center" marginY={3}>
    Copyright ©{' '}
    <Link color="inherit" href="https://github.com/xTCry/ystu-logistic-time" target="_blank">
      LogisticTimer (GIT)
    </Link>{' '}
    <br />
    <VersionComponent />
  </Typography>
);

export default Footer;
