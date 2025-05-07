import { Types, Schema, model, Model } from 'mongoose';

/**
 * Enum for spirit categories
 */
export enum SpiritCategory {
  WHISKEY = 'Whiskey',
  BOURBON = 'Bourbon',
  SCOTCH = 'Scotch',
  VODKA = 'Vodka',
  GIN = 'Gin',
  RUM = 'Rum',
  TEQUILA = 'Tequila',
  BRANDY = 'Brandy',
  LIQUEUR = 'Liqueur',
  OTHER = 'Other'
}

/**
 * Interface for Spirit data
 */
export interface ISpirit {
  _id: Types.ObjectId;
  name: string;
  brand: string;
  countryOfOrigin: string;
  category: SpiritCategory;
  photoUrl: string;
  abv: number;
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema definition for Spirit model
 */
const SpiritSchema = new Schema<ISpirit>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  countryOfOrigin: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: Object.values(SpiritCategory),
    required: true
  },
  photoUrl: {
    type: String,
    default: ''
  },
  abv: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Spirit model for MongoDB
 */
export const Spirit = model<ISpirit>('Spirit', SpiritSchema); 