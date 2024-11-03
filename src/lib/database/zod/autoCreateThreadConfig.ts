import { z } from 'zod';
import { Snowflake } from './util';

const AutoCreateThreadConfig = z.object({
  enabled: z.boolean(),
  channels: z.array(Snowflake),
});

export default AutoCreateThreadConfig;
