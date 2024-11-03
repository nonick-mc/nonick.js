import { z } from 'zod';
import { Snowflake } from './util';

const AutoPublicConfig = z.object({
  enabled: z.boolean(),
  channels: z.array(Snowflake),
});

export default AutoPublicConfig;
