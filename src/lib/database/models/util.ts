import { Schema } from 'mongoose';
import type { z } from 'zod';
import type { MessageOptions } from '../zod/util';

export const guildId = {
  required: true,
  unique: true,
  type: Schema.Types.String,
};

export const messageOptionSchema = new Schema<z.infer<typeof MessageOptions>>({
  content: Schema.Types.String,
  embeds: [
    {
      title: Schema.Types.String,
      description: Schema.Types.String,
      url: Schema.Types.String,
      timestamp: Schema.Types.String,
      color: Schema.Types.Number,
      footer: {
        text: Schema.Types.String,
        icon_url: Schema.Types.String,
      },
      image: {
        url: Schema.Types.String,
      },
      thumbnail: {
        url: Schema.Types.String,
      },
      author: {
        name: Schema.Types.String,
        url: Schema.Types.String,
        icon_url: Schema.Types.String,
      },
      fields: [
        {
          name: Schema.Types.String,
          value: Schema.Types.String,
          inline: Schema.Types.Boolean,
        },
      ],
    },
  ],
});
