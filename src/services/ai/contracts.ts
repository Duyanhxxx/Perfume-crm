export type AiCaptionInput = {
  platform: "TIKTOK" | "INSTAGRAM";
  idea?: string;
  tone?: "luxury" | "minimal" | "playful" | "direct";
};

export type AiRecommendationInput = {
  customerId: string;
  notes?: string;
  favoriteScent?: string;
};

export type AiSalesAssistantInput = {
  message: string;
  context?: {
    customerId?: string;
    orderId?: string;
    productIds?: string[];
  };
};

export interface AiProvider {
  generateCaption(input: AiCaptionInput): Promise<string>;
  recommendPerfumes(input: AiRecommendationInput): Promise<string[]>;
  draftSalesReply(input: AiSalesAssistantInput): Promise<string>;
}

