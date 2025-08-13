export interface Restaurant {
  name: string;
  rating: string;
  user_ratings_total: string;
  price_level: string;
  vicinity: string;
  formatted_address: string;
  place_id: string;
  types: string;
  business_status: string;
  formatted_phone_number: string;
  website: string;
  opening_hours: string;
  reviews_count: string;
  category: string;
  generated_review: string;
  _additional: AdditionalType;
}


export interface NearTextType {
  concepts: [string] | [];
  certainty?: number;
  moveAwayFrom?: object;
}

export interface AdditionalType {
  generate: GenerateType
}

export interface GenerateType {
  error: string;
  singleResult: string;
}